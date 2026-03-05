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
    const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
    const [hasSubtitles, setHasSubtitles] = useState(false);
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
            setHasSubtitles(false);
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
                                .replace(/@/gi, '')
                                .replace(/¿/g, '?')
                                .replace(/¡/g, '!')
                                // Remove odd formatting characters often randomly found in VTT errors
                                .replace(/[|~_^*]/g, '')
                                // Remove emojis and unknown specific icons
                                .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');

                            textAcc += lineText + ' ';
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

                {/* --- CC TOGGLE BUTTON --- */}
                {hasSubtitles && (
                    <button
                        onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                        className={`absolute top-3 right-3 z-[2147483648] p-1.5 rounded-lg backdrop-blur-md transition-all shadow-md border ${subtitlesEnabled
                            ? 'bg-white/90 text-slate-800 border-white/50'
                            : 'bg-black/60 text-white/90 border-white/20'
                            }`}
                        aria-label="Toggle Subtitles"
                        style={{ pointerEvents: 'auto' }}
                    >
                        {subtitlesEnabled ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="14" x="3" y="5" rx="2" ry="2" /><path d="M7 15h4M15 15h2M7 11h2M13 11h4" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="14" x="3" y="5" rx="2" ry="2" /><path d="M7 15h4M15 15h2M7 11h2M13 11h4" /><line x1="3" x2="21" y1="3" y2="21" /></svg>
                        )}
                    </button>
                )}

                {/* --- CUSTOM SUBTITLE OVERLAY --- */}
                {subtitlesEnabled && activeSubtitle && (
                    <div
                        className="absolute bottom-[10%] left-0 right-0 flex justify-center items-end"
                        style={{ zIndex: 2147483647, transform: 'translate3d(0, 0, 100px)', pointerEvents: 'none' }}
                    >
                        <div
                            className="bg-white/90 backdrop-blur-md text-slate-800 px-3 py-1.5 sm:px-4 sm:py-2 mx-4 max-w-[85%] md:max-w-2xl text-center rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.2)] border border-slate-200/50 whitespace-pre-wrap break-words"
                            style={{
                                fontSize: 'clamp(0.9rem, 2vw, 1.25rem)',
                                letterSpacing: '0.01em',
                                lineHeight: '1.3',
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
