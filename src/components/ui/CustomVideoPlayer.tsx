import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';
import { Stream } from '@cloudflare/stream-react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, Maximize, Minimize, X, RotateCcw, RotateCw } from 'lucide-react';
import { cn } from '../../utils';

// Supported subtitle languages
const SUBTITLE_LANGS = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'pt', label: 'Português' },
    { code: 'it', label: 'Italiano' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ja', label: '日本語' },
    { code: 'zh', label: '中文' },
];

const getCloudflareLangCode = (appLang: string) => {
    // Return matching language code, or default to fr
    if (SUBTITLE_LANGS.some(lang => lang.code === appLang)) return appLang;
    return 'fr';
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
    localVideoUrl?: string | null;
    speed?: number;
    className?: string;
    categoryId?: string;
    onEnded?: () => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    onFullscreenChange?: (isFullscreen: boolean) => void;
    onPlayStateChange?: (isPlaying: boolean) => void;
}

export interface CustomVideoPlayerRef {
    togglePlay: () => void;
    seekTo: (time: number) => void;
    isPlaying: boolean;
}

export const CustomVideoPlayer = React.forwardRef<CustomVideoPlayerRef, CustomVideoPlayerProps>(({
    youtubeId,
    cloudflareId,
    localVideoUrl,
    categoryId,
    speed = 1,
    className = '',
    onEnded,
    onTimeUpdate,
    onFullscreenChange,
    onPlayStateChange,
}, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null);
    const { i18n } = useTranslation();

    // State
    const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
    const [hasSubtitles, setHasSubtitles] = useState(false);
    const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);
    const cuesRef = useRef<{ start: number, end: number, text: string }[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Custom Controls State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [localScrubTime, setLocalScrubTime] = useState<number | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useImperativeHandle(ref, () => ({
        togglePlay,
        isPlaying,
        seekTo: (time: number) => {
            setCurrentTime(time);
            if (playerRef.current) {
                playerRef.current.currentTime = time;
            }
        },
    }));

    // --- Media Controls Logic ---
    const togglePlay = (e?: React.MouseEvent | React.TouchEvent) => {
        if (e) e.stopPropagation();
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pause();
                setIsPlaying(false);
                onPlayStateChange?.(false);
            } else {
                playerRef.current.play();
                setIsPlaying(true);
                onPlayStateChange?.(true);
            }
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setCurrentTime(val);
        if (playerRef.current) {
            playerRef.current.currentTime = val;
        }
        triggerControls();
    };

    const skipTime = (e: React.MouseEvent | React.TouchEvent, secondsOffset: number) => {
        e.stopPropagation();
        if (playerRef.current) {
            const newTime = Math.max(0, Math.min(currentTime + secondsOffset, duration));
            playerRef.current.currentTime = newTime;
            setCurrentTime(newTime);
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
        }, 3500); // slightly longer to be sure users have time to see them
    };

    useEffect(() => {
        triggerControls();
        return () => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying]);

    // Force strict fullscreen behaviors to escape iOS DOM traps (For CSS fallback)
    useEffect(() => {
        const rootElement = document.getElementById('root');

        // Listen to native fullscreen changes to sync our state if they exit via ESC or native controls
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && isFullscreen) {
                setIsFullscreen(false);
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('video-fullscreen-active');
            if (rootElement) {
                // Ensure no transform constraint clips the fixed child
                rootElement.style.setProperty('transform', 'none', 'important');
            }
            window.scrollTo(0, 0);
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('video-fullscreen-active');
            if (rootElement) {
                rootElement.style.removeProperty('transform');
            }
        }

        if (onFullscreenChange) {
            onFullscreenChange(isFullscreen);
        }

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.body.style.overflow = '';
            document.body.classList.remove('video-fullscreen-active');
            if (rootElement) {
                rootElement.style.removeProperty('transform');
            }
        };
    }, [isFullscreen, onFullscreenChange]);

    const toggleFullscreen = async (e?: React.MouseEvent | React.TouchEvent) => {
        if (e) e.stopPropagation();

        const playerContainer = containerRef.current;
        const isAppleMobile = /iPhone|iPod|iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        if (!isFullscreen) {
            // Entering Fullscreen
            if (playerContainer && document.fullscreenEnabled && !isAppleMobile) {
                try {
                    await playerContainer.requestFullscreen();
                    setIsFullscreen(true);
                } catch (err) {
                    console.error("Error attempting to enable fullscreen:", err);
                    setIsFullscreen(true); // fallback to CSS
                }
            } else {
                // Apple Mobile or Fullscreen not enabled
                setIsFullscreen(true);
            }

            // Try to force Landscape orientation using API
            try {
                if (window.screen && window.screen.orientation && (window.screen.orientation as any).lock) {
                    await (window.screen.orientation as any).lock('landscape');
                } else if (window.screen && (window.screen as any).mozLockOrientation) {
                    (window.screen as any).mozLockOrientation('landscape');
                } else if (window.screen && (window.screen as any).msLockOrientation) {
                    (window.screen as any).msLockOrientation('landscape');
                }
            } catch (err) {
                console.warn("Screen orientation lock failed or not supported:", err);
            }
        } else {
            // Exiting Fullscreen
            if (document.fullscreenElement) {
                try {
                    await document.exitFullscreen();
                } catch (err) {
                    console.error("Error attempting to exit fullscreen:", err);
                }
            }
            setIsFullscreen(false);

            // Unlock orientation
            try {
                if (window.screen && window.screen.orientation && window.screen.orientation.unlock) {
                    window.screen.orientation.unlock();
                } else if (window.screen && (window.screen as any).mozUnlockOrientation) {
                    (window.screen as any).mozUnlockOrientation();
                } else if (window.screen && (window.screen as any).msUnlockOrientation) {
                    (window.screen as any).msUnlockOrientation();
                }
            } catch (err) {
                console.warn("Screen orientation unlock failed:", err);
            }
        }
    };

    // Allow standard browser rotation
    useEffect(() => {
        const handleOrientationChange = () => {
            // Give browser time to finish physical rotation before forcing layout updates
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);
        };

        window.addEventListener("orientationchange", handleOrientationChange);

        return () => {
            window.removeEventListener("orientationchange", handleOrientationChange);
        };
    }, []);


    // Dynamically allow zoom and handle status bar in fullscreen
    useEffect(() => {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');

        if (isFullscreen) {
            if (viewportMeta) viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');
            if (themeColorMeta) themeColorMeta.setAttribute('content', '#000000');
            document.body.classList.add('fullscreen-locked');
            document.documentElement.classList.add('fullscreen-locked');
            // Force scroll to top to hide Safari address bar in landscape
            window.scrollTo(0, 0);
        } else {
            if (viewportMeta) viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover');
            if (themeColorMeta) themeColorMeta.setAttribute('content', '#FAF6ED');
            document.body.classList.remove('fullscreen-locked');
            document.documentElement.classList.remove('fullscreen-locked');
        }

        return () => {
            document.body.classList.remove('fullscreen-locked');
            document.documentElement.classList.remove('fullscreen-locked');
        }
    }, [isFullscreen]);

    const getCategoryColor = () => {
        if (!categoryId) return '#3b82f6';
        if (categoryId.includes('ectoderme')) return '#5A9C51';
        if (categoryId.includes('endoderme')) return '#4171B5';
        if (categoryId.includes('mesoderme')) return '#F27D33';
        if (categoryId.includes('oeil')) return '#F2B729';
        return '#3b82f6';
    };
    const progressColor = getCategoryColor();

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
                const langCode = getCloudflareLangCode(i18n.language || 'fr');
                let vttText = '';

                // Try fetching directly from Cloudflare downloads first via local proxy
                const vttUrl = `/cf-stream/${cloudflareId}/downloads/default.vtt?lang=${langCode}`;

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
                            throw new Error('Not found locally either');
                        }
                    }
                } catch {
                    // Try to fetch FR as a last resort just to see if we have ANY subtitles
                    try {
                        const localVttRes = await fetch(`/cf-stream/${cloudflareId}/downloads/default.vtt?lang=fr`);
                        if (localVttRes.ok) {
                            vttText = await localVttRes.text();
                        }
                    } catch {
                        // ignore
                    }
                }

                setHasSubtitles(!!vttText); // Always activate CC button if ANY text exists
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
                    setHasSubtitles(cuesRef.current.length > 0); // Keep tracking it properly based on cues
                }
            } catch (err) {
                console.error("VTT Parse err", err);
            }
        };

        fetchVtt();
    }, [cloudflareId, i18n.language]);

    // 1. PRIORITÉ ABSOLUE : Lecteur Stream Officiel customisé OU Fichier local
    if ((cloudflareId && cloudflareId !== "") || localVideoUrl) {
        return (
            <div
                ref={containerRef}
                className={cn(
                    "relative w-full bg-transparent overflow-hidden group",
                    isFullscreen ? 'video-player-fullscreen-active' : className || 'aspect-video rounded-xl shadow-2xl'
                )}
                onMouseMove={() => {
                    // Only trigger mouse move if we are inside the window!
                    triggerControls();
                }}
                onMouseLeave={() => {
                    if (isPlaying) {
                        setShowControls(false); // Instantly hide controls on mouse leave
                        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
                    }
                }}
                onTouchStart={triggerControls}
            >
                {/* 1. LAYER 0: The native stream player without controls */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                    {localVideoUrl ? (
                        <video
                            ref={playerRef as any}
                            className="w-full h-full object-cover"
                            src={localVideoUrl}
                            playsInline
                            controls={false}
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

                                if (player.duration && player.duration > 0 && duration === 0) {
                                    setDuration(player.duration);
                                }

                                if (onTimeUpdate) onTimeUpdate(time, player.duration || 0);

                                let active = null;
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
                    ) : (
                        <Stream
                            streamRef={playerRef}
                            className="w-full h-full object-cover"
                            src={cloudflareId!}
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

                                // Trigger controls on unpause or active scrubbing not required here continuously

                                if (onTimeUpdate) onTimeUpdate(time, player.duration || 0);

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
                    )}
                </div>

                {/* 2. LAYER 1: Interactive Screen Tap Zone */}
                <div
                    className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center touch-manipulation"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (showControls) {
                            if (isPlaying) {
                                setShowControls(false); // Hide immediately if playing and controls are tapped
                            }
                            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
                        } else {
                            triggerControls();
                        }
                    }}
                >
                    {/* The big center play button has been removed by request. Playback is managed by the bottom bar. */}
                </div>

                {/* EXTRA LAYER: iOS specific exit fullscreen button at top right */}
                {isFullscreen && (
                    <div
                        className={`absolute top-0 right-0 z-[60] transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        style={{ padding: 'max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right))' }}
                    >
                        <button
                            onClick={toggleFullscreen}
                            className="bg-black/50 text-white p-2.5 sm:p-3 rounded-full backdrop-blur-md border border-white/20 shadow-lg active:scale-90 touch-manipulation cursor-pointer"
                            aria-label="Quitter le plein écran"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* 3. LAYER 2: Subtitle Overlay */}
                {activeSubtitle && subtitlesEnabled && (
                    <div
                        className="absolute left-0 right-0 flex justify-center items-end pointer-events-none transition-all duration-300"
                        style={{
                            zIndex: 20,
                            bottom: showControls ? (isFullscreen ? '80px' : '60px') : '0px',
                            paddingBottom: isFullscreen ? 'env(safe-area-inset-bottom)' : '6px'
                        }}
                    >
                        <span
                            className="text-slate-700 bg-[#FAF6ED]/95 px-3 py-1.5 rounded-xl mx-2 max-w-[95%] sm:max-w-[85%] md:max-w-3xl text-center whitespace-pre-wrap break-words font-sans shadow-md"
                            style={{
                                display: 'inline-block',
                                fontSize: isFullscreen ? 'clamp(0.95rem, 2vw, 1.4rem)' : 'clamp(0.85rem, 2vw, 1.25rem)',
                                letterSpacing: '0.01em',
                                lineHeight: '1.4',
                                fontWeight: '500',
                            }}
                            dangerouslySetInnerHTML={{ __html: activeSubtitle }}
                        />
                    </div>
                )}

                {/* 4. LAYER 3: Bottom Custom Controls Bar */}
                <div
                    className={`absolute bottom-0 left-0 right-0 pt-10 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-40 transition-opacity duration-300 flex flex-col justify-end gap-1 ${showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                    style={{
                        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
                        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
                        paddingRight: 'max(1rem, env(safe-area-inset-right))',
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent bubble to play/pause wrapper
                >
                    {/* Scrubber */}
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-white/90 text-xs font-medium tabular-nums min-w-[36px] text-left">{formatTime(localScrubTime !== null ? localScrubTime : currentTime)}</span>
                        <div className="relative flex-1 h-3 flex items-center group cursor-pointer touch-manipulation">
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={localScrubTime !== null ? localScrubTime : currentTime}
                                onPointerDown={() => setLocalScrubTime(currentTime)}
                                onChange={(e) => {
                                    setLocalScrubTime(parseFloat(e.target.value));
                                }}
                                onPointerUp={(e) => {
                                    const val = parseFloat((e.currentTarget as HTMLInputElement).value);
                                    handleSeek({ target: { value: val.toString() } } as any);
                                    setLocalScrubTime(null);
                                }}
                                onTouchEnd={(e) => {
                                    const val = parseFloat((e.currentTarget as HTMLInputElement).value);
                                    handleSeek({ target: { value: val.toString() } } as any);
                                    setLocalScrubTime(null);
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 touch-manipulation"
                            />
                            {/* Visual Progress Track */}
                            <div className="w-full h-1.5 bg-[#FAF6ED]/30 rounded-full overflow-hidden pointer-events-none">
                                <div
                                    className="h-full transition-all duration-75"
                                    style={{ width: `${((localScrubTime !== null ? localScrubTime : currentTime) / (duration || 100)) * 100}%`, backgroundColor: progressColor }}
                                />
                            </div>
                            {/* Custom Thumb */}
                            <div
                                className="absolute h-3.5 w-3.5 bg-[#FAF6ED] rounded-full shadow border-2 border-transparent pointer-events-none transform -translate-x-1/2 transition-all duration-75"
                                style={{ left: `${((localScrubTime !== null ? localScrubTime : currentTime) / (duration || 100)) * 100}%`, borderColor: progressColor }}
                            />
                        </div>
                        <span className="text-white/90 text-xs font-medium tabular-nums min-w-[36px] text-right">{formatTime(duration)}</span>
                    </div>

                    {/* Bottom Bar Tools */}
                    <div className="flex items-center justify-between mt-1 px-1">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={(e) => skipTime(e, -15)}
                                onTouchEnd={(e) => { e.preventDefault(); skipTime(e, -15); }}
                                className="text-white hover:text-white/80 transition-colors p-2 cursor-pointer touch-manipulation active:scale-90"
                                aria-label="Reculer de 15 secondes"
                            >
                                <RotateCcw size={20} />
                            </button>

                            <button
                                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); togglePlay(e); }}
                                className="text-white hover:text-white/80 transition-colors p-2 -ml-2 cursor-pointer touch-manipulation active:scale-90"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                            </button>

                            <button
                                onClick={(e) => skipTime(e, 15)}
                                onTouchEnd={(e) => { e.preventDefault(); skipTime(e, 15); }}
                                className="text-white hover:text-white/80 transition-colors p-2 cursor-pointer touch-manipulation active:scale-90"
                                aria-label="Avancer de 15 secondes"
                            >
                                <RotateCw size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-5">
                            {/* CC Toggle */}
                            {hasSubtitles && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSubtitlesEnabled(!subtitlesEnabled); }}
                                    onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setSubtitlesEnabled(!subtitlesEnabled); }}
                                    className={`relative flex items-center justify-center p-2 rounded transition-colors cursor-pointer touch-manipulation active:scale-90 ${subtitlesEnabled ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                                    title={"Sous-titres"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
                                        <path d="M10 14.5a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3"></path>
                                        <path d="M17 14.5a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3"></path>
                                        {!subtitlesEnabled && <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2.5" stroke="currentColor" />}
                                    </svg>
                                    {subtitlesEnabled && <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ bottom: '2px', backgroundColor: progressColor }} />}
                                </button>
                            )}

                            {/* Fullscreen Toggle */}
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleFullscreen(e); }}
                                onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); toggleFullscreen(e); }}
                                className="text-white hover:text-white/80 transition-colors p-2 -mr-2 cursor-pointer touch-manipulation active:scale-90"
                                aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
                            >
                                {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
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
            <div className={`w-full aspect-video bg-transparent overflow-hidden rounded-xl shadow-2xl ${className}`}>
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
});

