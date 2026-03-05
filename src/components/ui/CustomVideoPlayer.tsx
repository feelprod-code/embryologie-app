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
    const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
    const [hasSubtitles, setHasSubtitles] = useState(false);
    const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);
    const cuesRef = useRef<{ start: number, end: number, text: string }[]>([]);

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
            return;
        }

        cuesRef.current = [];

        const fetchVtt = async () => {
            setActiveSubtitle(null);
            try {
                const langCode = getCloudflareLangCode(i18n.language);
                let vttText = '';

                // Try fetching directly from Cloudflare downloads first
                const vttUrl = `https://customer-6i2z59dst7q6iswv.cloudflarestream.com/${cloudflareId}/downloads/default.vtt?lang=${langCode}`;

                try {
                    const response = await fetch(vttUrl);
                    if (response.ok) {
                        vttText = await response.text();
                    } else {
                        // Fallback
                        const localVttRes = await fetch(`/vtt/${cloudflareId}_${langCode}.vtt`);
                        if (localVttRes.ok) {
                            vttText = await localVttRes.text();
                        } else {
                            return;
                        }
                    }
                } catch {
                    // Fallback on exception
                    try {
                        const localVttRes = await fetch(`/vtt/${cloudflareId}_${langCode}.vtt`);
                        if (localVttRes.ok) {
                            vttText = await localVttRes.text();
                        } else {
                            return;
                        }
                    } catch {
                        return;
                    }
                }

                if (!vttText) {
                    return;
                }

                const lines = vttText.split('\n');
                const parsedCues = [];
                let i = 0;

                while (i < lines.length) {
                    if (lines[i].includes('-->')) {
                        const [startStr, endStr] = lines[i].split(' --> ');
                        const start = parseVttTime(startStr.trim());
                        // Clean endStr which might contain "00:10.000 align:center position:50%"
                        const cleanEndStr = endStr.trim().split(/[\s]/)[0];
                        const end = parseVttTime(cleanEndStr);
                        i++;
                        let textAcc = '';
                        while (i < lines.length && lines[i].trim() !== '') {
                            let lineText = lines[i];
                            // Strip VTT positioning like <v Speaker> or <c.color> tags
                            lineText = lineText.replace(/<[^>]+>/g, '');
                            // Replace common HTML entities that appear in auto-generated captions
                            lineText = lineText
                                .replace(/&nbsp;/g, ' ')
                                .replace(/&amp;/g, '&')
                                .replace(/&lt;/g, '<')
                                .replace(/&gt;/g, '>')
                                .replace(/&quot;/g, '"')
                                .replace(/&#39;/g, "'")
                                // Mojibake/Encoding glitch fixes
                                .replace(/Ã©/g, 'é')
                                .replace(/Ã¨/g, 'è')
                                .replace(/Ã /g, 'à')
                                .replace(/Ã¢/g, 'â')
                                .replace(/Ãª/g, 'ê')
                                .replace(/Ã®/g, 'î')
                                .replace(/Ã´/g, 'ô')
                                .replace(/Ã»/g, 'û')
                                .replace(/Ã§/g, 'ç')
                                .replace(/Ãe/g, 'ée')
                                .replace(/Ãd/g, 'éd')
                                .replace(/cÃdule/g, 'cellule')
                                .replace(/Ã/g, 'à')
                                // Remove odd formatting characters often randomly found in VTT errors
                                .replace(/[|~_^*@¿¡]/g, '')
                                .replace(/^-?\s*\d+\s*-?\s*/, '') // Remove "- 1 -" or "-1-" line prefixes
                                // Fix weird spaces around apostrophes and dashes
                                .replace(/\s+'\s+/g, "'")
                                .replace(/\s+'/g, "'")
                                .replace(/'\s+/g, "'")
                                .replace(/(\w)\s+-\s+(\w)/g, "$1-$2") // "auto -crime" -> "auto-crime"
                                // Remove emojis and unknown specific icons
                                .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');

                            textAcc += lineText.trim() + ' ';
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
                if (parsedCues.length > 0) {
                    setHasSubtitles(true);
                }
            } catch (error: unknown) {
                console.error('[VTT] Parsing Error:', error);
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
                    className="absolute top-0 left-0 w-full h-full"
                    src={cloudflareId}
                    controls={true}
                    width="100%"
                    height="100%"
                    playbackRate={speed}
                    responsive={false} // Since we control width/height with container constraints
                    onEnded={onEnded}
                    onTimeUpdate={() => {
                        const time = playerRef.current?.currentTime || 0;
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
                        // playback ready
                    }}
                />

                {/* --- CUSTOM SUBTITLE TOGGLE --- */}
                {hasSubtitles && (
                    <div className="absolute top-[8px] right-[8px] sm:top-4 sm:right-4 z-50 pointer-events-auto">
                        <button
                            onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                            className={`flex items-center justify-center p-1.5 sm:p-2 rounded-lg sm:rounded-full backdrop-blur-md transition-all border shadow-lg touch-manipulation cursor-pointer active:scale-95 ${subtitlesEnabled
                                    ? "bg-white/90 text-slate-800 border-white/50"
                                    : "bg-black/40 text-white/80 border-white/10 hover:bg-black/60"
                                }`}
                            title={subtitlesEnabled ? "Désactiver les sous-titres" : "Activer les sous-titres"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
                                <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
                                <path d="M10 14.5a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3"></path>
                                <path d="M17 14.5a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3"></path>
                                {!subtitlesEnabled && <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2.5" stroke="currentColor" />}
                            </svg>
                        </button>
                    </div>
                )}

                {/* --- CUSTOM SUBTITLE OVERLAY --- */}
                {activeSubtitle && subtitlesEnabled && (
                    <div
                        className="absolute bottom-1 left-0 right-0 flex justify-center items-end"
                        style={{ zIndex: 2147483647, transform: 'translate3d(0, 0, 100px)', pointerEvents: 'none' }}
                    >
                        <div
                            className="bg-white/90 backdrop-blur-md text-slate-800 px-3 py-1 mx-4 max-w-[85%] md:max-w-2xl text-center rounded-lg shadow-md border border-slate-200/50 whitespace-pre-wrap break-words"
                            style={{
                                fontSize: 'clamp(0.85rem, 2vw, 1.15rem)',
                                letterSpacing: '0.01em',
                                lineHeight: '1.25',
                                fontWeight: '600'
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
