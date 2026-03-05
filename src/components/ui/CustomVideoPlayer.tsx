import React, { useRef, useState, useEffect } from 'react';
import { Stream } from '@cloudflare/stream-react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, Maximize, Minimize } from 'lucide-react';

// Mapping local language names to Cloudflare language codes if needed
const getCloudflareLangCode = (appLang: string) => {
    if (appLang === 'en') return 'en';
    if (appLang === 'es') return 'es';
    return 'fr'; // default to French if not listed
};

// Helper for formatting time (e.g. 65 -> "1:05")
const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null);
    const { i18n } = useTranslation();

    // State
    const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
    const [hasSubtitles, setHasSubtitles] = useState(false);
    const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);
    const cuesRef = useRef<{ start: number, end: number, text: string }[]>([]);

    // Custom Controls State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // --- Media Controls Logic ---
    const togglePlay = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pause();
                setIsPlaying(false);
            } else {
                playerRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const toggleFullscreen = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setIsFullscreen(!isFullscreen);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setCurrentTime(val);
        if (playerRef.current) {
            playerRef.current.currentTime = val;
        }
        triggerControls();
    };

    const triggerControls = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 3000);
    };

    useEffect(() => {
        triggerControls();
        return () => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying]);

    useEffect(() => {
        if (isFullscreen) {
            // Lock body scroll when in our "fake" fullscreen
            document.body.style.overflow = 'hidden';
            window.scrollTo(0, 0); // Reset scroll position to top
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isFullscreen]);

    // --- VTT Logic ---
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
        if (!cloudflareId) return;

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

                if (!vttText) return;

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
                            // Strip HTML tags and replace common HTML entities
                            lineText = lineText
                                .replace(/<[^>]+>/g, '')
                                .replace(/&nbsp;/g, ' ')
                                .replace(/&amp;/g, '&')
                                .replace(/&lt;/g, '<')
                                .replace(/&gt;/g, '>')
                                .replace(/&quot;/g, '"')
                                .replace(/&#39;/g, "'")
                                // Mojibake/Encoding glitch fixes
                                .replace(/Ã©/g, 'é').replace(/Ã¨/g, 'è').replace(/Ã /g, 'à')
                                .replace(/Ã¢/g, 'â').replace(/Ãª/g, 'ê').replace(/Ã®/g, 'î')
                                .replace(/Ã´/g, 'ô').replace(/Ã»/g, 'û').replace(/Ã§/g, 'ç')
                                .replace(/Ãe/g, 'ée').replace(/Ãd/g, 'éd').replace(/cÃdule/g, 'cellule')
                                .replace(/Ã/g, 'à')
                                // Remove odd formatting characters
                                .replace(/[|~_^*@¿¡]/g, '')
                                .replace(/^-?\s*\d+\s*-?\s*/, '')
                                .replace(/\s+'\s+/g, "'").replace(/\s+'/g, "'").replace(/'\s+/g, "'")
                                .replace(/(\w)\s+-\s+(\w)/g, "$1-$2")
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

    // 1. PRIORITÉ ABSOLUE : Lecteur Stream Officiel customisé
    if (cloudflareId && cloudflareId !== "") {
        return (
            <div
                className={`relative flex justify-center items-center bg-black transition-all duration-300 select-none group ${isFullscreen
                    ? 'fixed inset-0 z-[1000] w-screen h-[100dvh]'
                    : `w-full aspect-video rounded-xl shadow-2xl overflow-hidden ${className}`
                    }`}
                onMouseMove={triggerControls}
                onClick={triggerControls}
                onTouchStart={triggerControls}
            >
                {/* 1. LAYER 0: The native stream player without controls */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                    <Stream
                        streamRef={playerRef}
                        className="w-full h-full object-contain"
                        src={cloudflareId}
                        controls={false} // Disable native UI to avoid iOS taking over fullscreen
                        width="100%"
                        height="100%"
                        playbackRate={speed}
                        responsive={false}
                        onEnded={() => {
                            setIsPlaying(false);
                            if (onEnded) onEnded();
                        }}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onTimeUpdate={() => {
                            const player = playerRef.current;
                            if (!player) return;
                            const time = player.currentTime || 0;
                            setCurrentTime(time);

                            // Initialize duration cleanly
                            if (player.duration && player.duration > 0 && duration === 0) {
                                setDuration(player.duration);
                            }

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
                            setActiveSubtitle(active ? active.text : null);
                        }}
                    />
                </div>

                {/* 2. LAYER 1: Interactive Play/Pause zone */}
                <div
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={togglePlay}
                />

                {/* 3. LAYER 2: Subtitle Overlay */}
                {activeSubtitle && subtitlesEnabled && (
                    <div
                        className={`absolute left-0 right-0 flex justify-center items-end pointer-events-none transition-all duration-300 ${showControls ? 'bottom-20 md:bottom-24' : 'bottom-6 md:bottom-8'
                            }`}
                        style={{ zIndex: 20 }}
                    >
                        <div
                            className="bg-black/60 backdrop-blur-sm text-white px-4 py-1 mx-4 max-w-[90%] md:max-w-2xl text-center rounded-lg whitespace-pre-wrap break-words drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                            style={{
                                fontSize: isFullscreen ? 'clamp(1.1rem, 2.5vw, 2rem)' : 'clamp(0.85rem, 2vw, 1.15rem)',
                                letterSpacing: '0.01em',
                                lineHeight: '1.25',
                                fontWeight: '500'
                            }}
                            dangerouslySetInnerHTML={{ __html: activeSubtitle }}
                        />
                    </div>
                )}

                {/* 4. LAYER 3: Bottom Custom Controls Bar */}
                <div
                    className={`absolute bottom-0 left-0 right-0 px-4 pb-4 pt-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-30 transition-opacity duration-300 flex flex-col gap-2 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    onClick={(e) => e.stopPropagation()} // Prevent bubble to play/pause wrapper
                >
                    {/* Scrubber */}
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-white/90 text-xs font-medium tabular-nums min-w-[36px] text-left">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className="flex-1 h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full hover:accent-blue-400 touch-manipulation"
                        />
                        <span className="text-white/90 text-xs font-medium tabular-nums min-w-[36px] text-right">{formatTime(duration)}</span>
                    </div>

                    {/* Bottom Bar Tools */}
                    <div className="flex items-center justify-between mt-1 px-1">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={togglePlay}
                                className="text-white hover:text-blue-400 transition-colors p-1 cursor-pointer touch-manipulation active:scale-90"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                            </button>
                        </div>

                        <div className="flex items-center gap-5">
                            {/* CC Toggle */}
                            {hasSubtitles && (
                                <button
                                    onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                                    className={`relative flex items-center justify-center p-1 rounded transition-colors cursor-pointer touch-manipulation active:scale-90 ${subtitlesEnabled ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                                    title={subtitlesEnabled ? "Désactiver les sous-titres" : "Activer les sous-titres"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
                                        <path d="M10 14.5a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3"></path>
                                        <path d="M17 14.5a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3"></path>
                                        {!subtitlesEnabled && <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2.5" stroke="currentColor" />}
                                    </svg>
                                    {subtitlesEnabled && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />}
                                </button>
                            )}

                            {/* Fullscreen Toggle */}
                            <button
                                onClick={toggleFullscreen}
                                className="text-white hover:text-blue-400 transition-colors p-1 cursor-pointer touch-manipulation active:scale-90"
                                aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
                            >
                                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
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
