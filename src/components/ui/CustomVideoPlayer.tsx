import React, { useRef, useState, useEffect } from 'react';
import { Stream } from '@cloudflare/stream-react';
import { useTranslation } from 'react-i18next';

// Mapping local language names to Cloudflare language codes if needed
const getCloudflareLangCode = (appLang: string) => {
    if (appLang === 'en') return 'en';
    if (appLang === 'es') return 'es';
    return 'fr'; // default to French if not listed
};

interface CustomVideoPlayerProps {
    youtubeId?: string;
    cloudflareId?: string;
    speed?: number;
    className?: string;
    categoryId?: string;
    onEnded?: () => void;
    onTimeUpdate?: (currentTime: number) => void;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
    youtubeId,
    cloudflareId,
    speed = 1,
    className = '',
    onEnded,
    onTimeUpdate,
}) => {
    // any is used here due to ReactPlayer's complex internal typings making generic refs difficult
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null);
    const { i18n } = useTranslation();

    // Isolated Subtitle State to prevent parent re-renders
    const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);
    const cuesRef = useRef<any[]>([]);

    // Detailed debug state
    const [debugLog, setDebugLog] = useState<string>("Init...");
    const [debugTime, setDebugTime] = useState<number>(0);

    const parseVttTime = (timeStr: string) => {
        const parts = timeStr.replace(',', '.').split(':');
        if (parts.length === 3) {
            const [hours, minutes, seconds] = parts;
            return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
        } else if (parts.length === 2) {
            const [minutes, seconds] = parts;
            return parseInt(minutes) * 60 + parseFloat(seconds);
        }
        return 0;
    };

    useEffect(() => {
        if (!cloudflareId) {
            setDebugLog("No CF ID");
            return;
        }

        cuesRef.current = [];
        setActiveSubtitle(null);
        setDebugLog("Starting fetch...");

        const fetchVtt = async () => {
            try {
                const langCode = getCloudflareLangCode(i18n.language);
                let vttText = '';

                // Try fetching directly from Cloudflare downloads first
                const vttUrl = `https://customer-6i2z59dst7q6iswv.cloudflarestream.com/${cloudflareId}/downloads/default.vtt?lang=${langCode}`;
                setDebugLog(`Fetching CF in ${langCode}`);

                try {
                    const response = await fetch(vttUrl);
                    if (response.ok) {
                        vttText = await response.text();
                        setDebugLog(`Fetched CF ok. len:${vttText.length}`);
                    } else {
                        setDebugLog(`CF HTTP Err: ${response.status}`);
                        // Fallback
                        const localVttRes = await fetch(`/vtt/${cloudflareId}_${langCode}.vtt`);
                        if (localVttRes.ok) {
                            vttText = await localVttRes.text();
                            setDebugLog(`Fetched Local ok. len:${vttText.length}`);
                        } else {
                            setDebugLog(`Local HTTP Err: ${localVttRes.status}`);
                            return;
                        }
                    }
                } catch (fetchErr: any) {
                    setDebugLog(`Fetch Exc: ${fetchErr.message || fetchErr}`);
                    // Fallback on exception
                    try {
                        const localVttRes = await fetch(`/vtt/${cloudflareId}_${langCode}.vtt`);
                        if (localVttRes.ok) {
                            vttText = await localVttRes.text();
                            setDebugLog(`Fetched Local after exc ok.`);
                        } else {
                            setDebugLog(`Local exc HTTP: ${localVttRes.status}`);
                            return;
                        }
                    } catch (e: any) {
                        setDebugLog(`Local exc: ${e.message}`);
                        return;
                    }
                }

                if (!vttText) {
                    setDebugLog("vttText is empty");
                    return;
                }

                const lines = vttText.split('\n');
                const parsedCues = [];
                let i = 0;

                while (i < lines.length) {
                    if (lines[i].includes('-->')) {
                        const [startStr, endStr] = lines[i].split(' --> ');
                        const start = parseVttTime(startStr.trim());
                        const end = parseVttTime(endStr.trim());
                        i++;
                        let textAcc = '';
                        while (i < lines.length && lines[i].trim() !== '') {
                            textAcc += lines[i].replace(/<[^>]+>/g, '') + ' ';
                            i++;
                        }
                        if (textAcc.trim() && !textAcc.includes('WEBVTT')) {
                            // Heuristic split for gigantic blocks > 10s
                            if ((end - start) > 10 && /[.!?]/.test(textAcc)) {
                                const sentences = textAcc.match(/[^.!?]+[.!?]+/g) || [textAcc];
                                const totalLength = textAcc.length;
                                let currentStart = start;

                                sentences.forEach(sentence => {
                                    const s = sentence.trim();
                                    if (!s) return;
                                    const sentenceDuration = (s.length / totalLength) * (end - start);
                                    parsedCues.push({ start: currentStart, end: currentStart + sentenceDuration, text: s });
                                    currentStart += sentenceDuration;
                                });
                            } else {
                                parsedCues.push({ start, end, text: textAcc.trim() });
                            }
                        }
                    } else {
                        i++;
                    }
                }
                cuesRef.current = parsedCues;
                setDebugLog(`Parsed ok! cues: ${parsedCues.length}`);
            } catch (error: any) {
                console.error('[VTT] Parsing Error:', error);
                setDebugLog(`Total Catch: ${error.message}`);
            }
        };

        fetchVtt();
    }, [cloudflareId, i18n.language]);

    // 1. PRIORITÉ ABSOLUE : Lecteur Stream Officiel (Cloudflare Stream)
    if (cloudflareId && cloudflareId !== "") {
        return (
            <div className={`w-full aspect-video bg-black overflow-hidden rounded-xl shadow-2xl relative ${className}`}>
                <Stream
                    streamRef={playerRef}
                    src={cloudflareId}
                    controls={true}
                    width="100%"
                    height="100%"
                    playbackRate={speed}
                    responsive={false} // Since we control width/height with container constraints
                    onEnded={onEnded}
                    onTimeUpdate={(e: any) => {
                        const time = e.currentTarget.currentTime || 0;
                        setDebugTime(time);
                        if (onTimeUpdate) onTimeUpdate(time);

                        let active = null;
                        // Use cuesRef mapping
                        for (let i = 0; i < cuesRef.current.length; i++) {
                            const c = cuesRef.current[i];
                            if (time >= c.start && time <= c.end) {
                                active = c;
                                break;
                            }
                        }

                        if (active) {
                            setActiveSubtitle(active.text);
                        } else {
                            setActiveSubtitle(null);
                        }
                    }}
                    onCanPlay={() => {
                        setDebugLog("CF Stream canplay fired!");
                    }}
                />

                {/* --- DEBUG TELEMETRY (Temporary) --- */}
                <div
                    className="absolute top-2 left-2 bg-black/80 text-green-400 text-[10px] p-2 rounded pointer-events-none max-w-[90%] break-all"
                    style={{ zIndex: 2147483647, transform: 'translate3d(0, 0, 100px)' }}
                >
                    Log: {debugLog} <br />
                    VTT: {cuesRef.current.length} cues <br />
                    Time: {debugTime.toFixed(1)}s <br />
                    Sub: {activeSubtitle ? activeSubtitle.substring(0, 40) : 'none'}
                </div>

                {/* --- CUSTOM SUBTITLE OVERLAY --- */}
                {activeSubtitle && (
                    <div
                        className="absolute bottom-[10%] left-0 right-0 flex justify-center items-end pointer-events-none px-4"
                        style={{ zIndex: 2147483647, transform: 'translate3d(0, 0, 100px)' }}
                    >
                        <div
                            className="bg-black/70 backdrop-blur-sm text-white px-5 py-2 max-w-2xl text-center rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/20 whitespace-pre-wrap break-words"
                            style={{
                                textShadow: '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)',
                                fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                                letterSpacing: '0.01em',
                                lineHeight: '1.4'
                            }}
                            dangerouslySetInnerHTML={{ __html: activeSubtitle }}
                        />
                    </div>
                )}
            </div>
        );
    }

    // 2. FALLBACK : Ancien lecteur YouTube
    if (youtubeId && youtubeId !== "") {
        return (
            <div className={`w-full aspect-video bg-black overflow-hidden rounded-xl shadow-2xl ${className}`}>
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                    title="Lecteur vidéo YouTube"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>
        );
    }

    // 3. SECU : Aucun ID
    return (
        <div className={`w-full flex items-center justify-center font-bold text-gray-500 aspect-video bg-slate-900 border border-slate-700/50 rounded-xl ${className}`}>
            Vidéo non disponible
        </div>
    );
};
