import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';
import { Stream } from '@cloudflare/stream-react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, Maximize, X, RotateCcw, RotateCw, PictureInPicture2 } from 'lucide-react';
import { cn } from '../../utils';
import { useFullscreen } from '../../contexts/FullscreenContext';

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
    // Return matching language code (matching first 2 letters), or default to fr
    const shortCode = appLang.split('-')[0].toLowerCase();
    if (SUBTITLE_LANGS.some(lang => lang.code === shortCode)) return shortCode;
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
    onCuesLoaded?: (cues: {start: number, end: number, text: string}[]) => void;
    onActiveCueChange?: (cueIndex: number) => void;
    onControlsChange?: (visible: boolean) => void;
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
    onCuesLoaded,
    onActiveCueChange,
    onControlsChange,
}, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null);
    const { i18n } = useTranslation();

    // State
    const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
    const [hasSubtitles, setHasSubtitles] = useState(false);
    const [isPipSupported, setIsPipSupported] = useState(false);
    const [resolvedVttUrl, setResolvedVttUrl] = useState<string>('');

    useEffect(() => {
        const standardPip = 'pictureInPictureEnabled' in document;
        const safariPip = typeof HTMLVideoElement !== 'undefined' && 'webkitSetPresentationMode' in HTMLVideoElement.prototype;
        setIsPipSupported(standardPip || safariPip);
    }, []);

    const isDesktop = React.useMemo(() => {
        return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && 
               !(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }, []);
    const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);
    const cuesRef = useRef<{ start: number, end: number, text: string }[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);

    // Measure container width for responsive subtitles
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.contentRect.width > 0) {
                    setContainerWidth(entry.contentRect.width);
                }
            }
        });
        observer.observe(containerRef.current);
        // Initial setup
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
        return () => observer.disconnect();
    }, []);

    // Custom Controls State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [localScrubTime, setLocalScrubTime] = useState<number | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const nativeFullscreenActive = useRef(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSetShowControls = React.useCallback((visible: boolean) => {
        setShowControls(visible);
        if (onControlsChange) onControlsChange(visible);
    }, [onControlsChange]);

    // Zoom/Pan State for Fullscreen
    const [zoomScale, setZoomScale] = useState(1);
    const [panPos, setPanPos] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const initialPinchDist = useRef<number | null>(null);
    const lastZoomScale = useRef<number>(1);
    const touchStartPos = useRef({ x: 0, y: 0 });

    // Sync local fullscreen state with global context
    const { setIsVideoFullscreen } = useFullscreen();
    useEffect(() => {
        setIsVideoFullscreen(isFullscreen);
        return () => {
            // Ensure global lock is released if video component unmounts unexpectedly
            setIsVideoFullscreen(false);
        };
    }, [isFullscreen, setIsVideoFullscreen]);

    // Smooth time update using requestAnimationFrame
    const requestRef = useRef<number>(0);

    const updateTimeSmoothly = React.useCallback(() => {
        if (playerRef.current && isPlaying && localScrubTime === null) {
            const time = playerRef.current.currentTime || 0;
            setCurrentTime(time);
            if (onTimeUpdate) onTimeUpdate(time, duration || 0);

            let activeText = null;
            let activeIndex = -1;
            for (let i = 0; i < cuesRef.current.length; i++) {
                const c = cuesRef.current[i];
                if (time >= c.start && time <= c.end) {
                    activeText = c.text;
                    activeIndex = i;
                    break;
                }
            }
            setActiveSubtitle(activeText);
            if (onActiveCueChange && activeIndex !== -1) {
                onActiveCueChange(activeIndex);
            }

            requestRef.current = requestAnimationFrame(updateTimeSmoothly);
        }
    }, [isPlaying, localScrubTime, duration, onTimeUpdate, onActiveCueChange]);

    useEffect(() => {
        if (isPlaying && localScrubTime === null) {
            requestRef.current = requestAnimationFrame(updateTimeSmoothly);
        } else if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isPlaying, localScrubTime, updateTimeSmoothly]);

    useImperativeHandle(ref, () => ({
        togglePlay,
        isPlaying,
        seekTo: (time: number) => {
            setCurrentTime(time);
            if (playerRef.current) {
                playerRef.current.currentTime = time;
            }
            if (onTimeUpdate) onTimeUpdate(time, duration || 0);
            let activeText = null;
            let activeIndex = -1;
            for (let i = 0; i < cuesRef.current.length; i++) {
                const c = cuesRef.current[i];
                if (time >= c.start && time <= c.end) {
                    activeText = c.text;
                    activeIndex = i;
                    break;
                }
            }
            setActiveSubtitle(activeText);
            if (onActiveCueChange && activeIndex !== -1) {
                onActiveCueChange(activeIndex);
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
        if (onTimeUpdate) onTimeUpdate(val, duration || 0);
        let activeText = null;
        let activeIndex = -1;
        for (let i = 0; i < cuesRef.current.length; i++) {
            const c = cuesRef.current[i];
            if (val >= c.start && val <= c.end) {
                activeText = c.text;
                activeIndex = i;
                break;
            }
        }
        setActiveSubtitle(activeText);
        if (onActiveCueChange && activeIndex !== -1) {
            onActiveCueChange(activeIndex);
        }
        triggerControls();
    };

    const skipTime = (e: React.MouseEvent | React.TouchEvent, secondsOffset: number) => {
        e.stopPropagation();
        if (playerRef.current) {
            const newTime = Math.max(0, Math.min(currentTime + secondsOffset, duration));
            playerRef.current.currentTime = newTime;
            setCurrentTime(newTime);
            if (onTimeUpdate) onTimeUpdate(newTime, duration || 0);
            let activeText = null;
            let activeIndex = -1;
            for (let i = 0; i < cuesRef.current.length; i++) {
                const c = cuesRef.current[i];
                if (newTime >= c.start && newTime <= c.end) {
                    activeText = c.text;
                    activeIndex = i;
                    break;
                }
            }
            setActiveSubtitle(activeText);
            if (onActiveCueChange && activeIndex !== -1) {
                onActiveCueChange(activeIndex);
            }
        }
        triggerControls();
    };

    const triggerControls = () => {
        handleSetShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
                handleSetShowControls(false);
            }
        }, 1500); // further reduced delay for controls to hide quickly
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
            const isNative = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);

            // Si on pensait être en plein écran natif, mais qu'on n'y est plus (ex: touche ESC)
            if (nativeFullscreenActive.current && !isNative) {
                nativeFullscreenActive.current = false;
                setIsFullscreen(false);
            }
            // IMPORTANT: Si on est en pseudo-fullscreen (nativeFullscreenActive == false), 
            // on IGNORE les événements fullscreenchange intempestifs d'iOS Safari (lors des rotations par exemple).
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

        if (isFullscreen) {
            document.documentElement.classList.add('video-fullscreen-active');
            document.body.style.overflow = 'hidden';
            document.body.classList.add('video-fullscreen-active');
            if (rootElement) {
                // Ensure no transform constraint clips the fixed child
                rootElement.style.setProperty('transform', 'none', 'important');
            }
            window.scrollTo(0, 0);
        } else {
            document.documentElement.classList.remove('video-fullscreen-active');
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
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.documentElement.classList.remove('video-fullscreen-active');
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
                    nativeFullscreenActive.current = true;
                    setIsFullscreen(true);
                } catch (err) {
                    console.error("Error attempting to enable fullscreen:", err);
                    nativeFullscreenActive.current = false;
                    setIsFullscreen(true); // fallback to CSS
                }
            } else if (isAppleMobile && playerRef.current && (playerRef.current as any).webkitEnterFullscreen) {
                // Use native iOS fullscreen for iPhone if available
                (playerRef.current as any).webkitEnterFullscreen();
                // We keep nativeFullscreenActive false because webkitEnterFullscreen handles its own state
            } else {
                // Apple Mobile without native fullscreen or Fullscreen not enabled
                setIsFullscreen(true);
                document.body.classList.add('video-fullscreen-active');
            
                // Try native fullscreen
                try {
                    const elem = containerRef.current;
                    if (elem) {
                        if (elem.requestFullscreen) {
                            await elem.requestFullscreen();
                        } else if ((elem as any).webkitRequestFullscreen) {
                            await (elem as any).webkitRequestFullscreen();
                        }
                    }
                } catch (err) {
                    console.warn("Fullscreen API failed", err);
                }

                // iOS Fallback Fullscreen lock
                nativeFullscreenActive.current = true;
                
                // Screen orientation API logic
                if (window.screen && window.screen.orientation && (window.screen.orientation as any).lock) {
                    try {
                        await (window.screen.orientation as any).lock('landscape');
                    } catch (err) {
                        console.warn("Screen orientation lock failed or not supported:", err);
                    }
                }
            }
        } else {
            if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
                try {
                    if (document.exitFullscreen) {
                        await document.exitFullscreen();
                    } else if ((document as any).webkitExitFullscreen) {
                        await (document as any).webkitExitFullscreen();
                    }
                } catch (err) {
                    console.error("Error attempting to exit fullscreen:", err);
                }
            }
            nativeFullscreenActive.current = false;
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
            
            // Reset zoom when exiting fullscreen
            setZoomScale(1);
            setPanPos({ x: 0, y: 0 });
            initialPinchDist.current = null;
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

    const togglePiP = (e?: React.MouseEvent | React.TouchEvent) => {
        if (e) {
            e.stopPropagation();
        }
        try {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
                return;
            }
            
            let videoElement = playerRef.current;
            
            // Fallbacks if playerRef itself is not the video element
            if (videoElement && typeof (videoElement as any).requestPictureInPicture !== 'function' && typeof (videoElement as any).webkitSetPresentationMode !== 'function') {
                if ((videoElement as any).video && (typeof (videoElement as any).video.requestPictureInPicture === 'function' || typeof (videoElement as any).video.webkitSetPresentationMode === 'function')) {
                    videoElement = (videoElement as any).video;
                } else if (containerRef.current) {
                    let v = containerRef.current.querySelector('video');
                    if (!v) {
                        // En Shadow DOM (Component Cloudflare)
                        const streamRoot = containerRef.current.querySelector('stream');
                        if (streamRoot && streamRoot.shadowRoot) {
                            v = streamRoot.shadowRoot.querySelector('video');
                        }
                    }
                    if (v) videoElement = v as any;
                }
            }
            
            if (videoElement && typeof (videoElement as any).webkitSetPresentationMode === 'function') {
                // Apple/Safari fallback: must be synchronous!
                (videoElement as any).webkitSetPresentationMode('picture-in-picture');
            } else if (videoElement && typeof (videoElement as any).requestPictureInPicture === 'function') {
                (videoElement as any).requestPictureInPicture().catch((err: any) => console.error("PiP err:", err));
            } else {
                console.warn("Picture-in-Picture API is not supported on this video element.");
            }
        } catch (err) {
            console.error("Picture-in-Picture error:", err);
        }
    };

    const setupNativeSubtitles = React.useCallback((vttUrl: string) => {
        if (!isDesktop) return;
        try {
            let videoElement = playerRef.current;
            
            // Resolve native video element from ref / container
            if (videoElement && typeof (videoElement as any).querySelector !== 'function') {
                if ((videoElement as any).video) {
                    videoElement = (videoElement as any).video;
                } else if (containerRef.current) {
                    let v = containerRef.current.querySelector('video');
                    if (!v) {
                        const streamRoot = containerRef.current.querySelector('stream');
                        if (streamRoot && streamRoot.shadowRoot) {
                            v = streamRoot.shadowRoot.querySelector('video');
                        }
                    }
                    if (v) videoElement = v as any;
                }
            }

            if (!videoElement) {
                console.warn("setupNativeSubtitles: No video element found.");
                return;
            }

            // Remove any existing track element we added to avoid duplicates
            const existingTracks = videoElement.querySelectorAll('track');
            existingTracks.forEach((t: any) => t.remove());

            // Create new track element
            const track = document.createElement('track');
            track.kind = 'subtitles';
            track.srclang = getCloudflareLangCode(i18n.language || 'fr');
            track.label = 'Français';
            track.src = vttUrl;
            track.default = true;

            videoElement.appendChild(track);

            // Force visibility mode
            if (videoElement.textTracks && videoElement.textTracks[0]) {
                videoElement.textTracks[0].mode = subtitlesEnabled ? 'showing' : 'hidden';
            }
            console.log("setupNativeSubtitles: successfully attached track", vttUrl);
        } catch (e) {
            console.error("Error setting up native subtitles:", e);
        }
    }, [isDesktop, i18n.language, subtitlesEnabled]);

    // Sync subtitles visibility when toggled by the user
    useEffect(() => {
        if (!isDesktop) return;
        try {
            let videoElement = playerRef.current;
            if (videoElement && typeof (videoElement as any).querySelector !== 'function') {
                if ((videoElement as any).video) {
                    videoElement = (videoElement as any).video;
                } else if (containerRef.current) {
                    let v = containerRef.current.querySelector('video');
                    if (!v) {
                        const streamRoot = containerRef.current.querySelector('stream');
                        if (streamRoot && streamRoot.shadowRoot) {
                            v = streamRoot.shadowRoot.querySelector('video');
                        }
                    }
                    if (v) videoElement = v as any;
                }
            }
            if (videoElement && videoElement.textTracks) {
                for (let i = 0; i < videoElement.textTracks.length; i++) {
                    videoElement.textTracks[i].mode = subtitlesEnabled ? 'showing' : 'hidden';
                }
            }
        } catch (e) {
            console.error("Error toggling native subtitles:", e);
        }
    }, [subtitlesEnabled, isDesktop]);


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
            // Restore original values when unmounting
            if (themeColorMeta) themeColorMeta.setAttribute('content', '#FAF6ED');
            if (viewportMeta) viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover');
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
        let s = timeStr.replace(',', '.');
        if ((s.match(/:/g) || []).length === 2 && !s.includes('.')) {
            const lastIndex = s.lastIndexOf(':');
            s = s.substring(0, lastIndex) + '.' + s.substring(lastIndex + 1);
        }
        const parts = s.split(':');
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
                let resolvedUrl = '';

                // Try fetching directly from Cloudflare downloads first via local proxy
                const vttUrl = `/cf-stream/${cloudflareId}/downloads/default.vtt?lang=${langCode}`;

                try {
                    const response = await fetch(vttUrl);
                    if (response.ok) {
                        const buffer = await response.arrayBuffer();
                        vttText = new TextDecoder('utf-8').decode(buffer);
                        resolvedUrl = vttUrl;
                    }
                    
                    // Si l'API renvoie index.html (fallback SPA en local), vttText ne commence pas par WEBVTT
                    if (!response.ok || !vttText.trim().startsWith('WEBVTT')) {
                        const localVttUrl = `/vtt/${cloudflareId}_${langCode}.vtt`;
                        const localVttRes = await fetch(localVttUrl);
                        if (localVttRes.ok) {
                            const buffer = await localVttRes.arrayBuffer();
                            vttText = new TextDecoder('utf-8').decode(buffer);
                            resolvedUrl = localVttUrl;
                        } else {
                            throw new Error('Not found locally either');
                        }
                    }
                    
                    if (!vttText.trim().startsWith('WEBVTT')) {
                        throw new Error('Invalid VTT format');
                    }
                } catch {
                    // Try to fetch FR as a last resort just to see if we have ANY subtitles
                    try {
                        const fallbackUrl = `/vtt/${cloudflareId}_fr.vtt`;
                        const localVttRes = await fetch(fallbackUrl);
                        if (localVttRes.ok) {
                            const buffer = await localVttRes.arrayBuffer();
                            vttText = new TextDecoder('utf-8').decode(buffer);
                            resolvedUrl = fallbackUrl;
                        }
                    } catch {
                        // ignore
                    }
                }

                setHasSubtitles(!!vttText); // Always activate CC button if ANY text exists
                setResolvedVttUrl(vttText ? resolvedUrl : '');
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
                                // Transcription error fixes
                                .replace(/auto\s*-?\s*crime/gi, 'autocrine')
                                .replace(/\bc(é|e)dule(s)?\b/gi, 'cellule$2')
                                .replace(/(?:à|a|ah)\s+a\s+veut\s+dire/gi, 'ça veut dire')
                                .replace(/^à\s+a\b/gi, 'ça')
                                // Remove odd formatting characters
                                .replace(/[|~_^*@¿¡]/g, '')
                                .replace(/^-?\s*\d+\s*-?\s*/, '')
                                .replace(/\s+'\s+/g, "'").replace(/\s+'/g, "'").replace(/'\s+/g, "'")
                                .replace(/(\w)\s+-\s+(\w)/g, "$1-$2")
                                .replace(/\s+,/g, ',')
                                .replace(/\s+\./g, '.')
                                .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
                                // Normalize all weird spaces to standard space
                                .replace(/\s+/g, ' ');

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
                    if (onCuesLoaded) onCuesLoaded(parsedCues);
                    if (resolvedUrl) {
                        setupNativeSubtitles(resolvedUrl);
                    }
                }
            } catch (err) {
                console.error("VTT Parse err", err);
            }
        };

        fetchVtt();
    }, [cloudflareId, i18n.language]);

    // Zoom and Pan Handlers
    const handleZoomTouchStart = (e: React.TouchEvent) => {
        if (!isFullscreen) return;
        setIsPanning(true);
        if (e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            initialPinchDist.current = dist;
            lastZoomScale.current = zoomScale;
        } else if (e.touches.length === 1 && zoomScale > 1) {
            touchStartPos.current = {
                x: e.touches[0].clientX - panPos.x,
                y: e.touches[0].clientY - panPos.y
            };
        }
    };

    const handleZoomTouchMove = (e: React.TouchEvent) => {
        if (!isFullscreen) return;
        if (e.touches.length === 2 && initialPinchDist.current) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            // Limit zoom between 1x and 1.20x
            const newScale = Math.max(1, Math.min(lastZoomScale.current * (dist / initialPinchDist.current), 1.2));
            setZoomScale(newScale);
            
            // Re-clamp panning based on new scale to avoid black borders (keep X locked to 0)
            if (newScale === 1) {
                setPanPos({ x: 0, y: 0 });
            } else {
                const maxPanY = (window.innerHeight * (newScale - 1)) / 2;
                setPanPos(prev => ({
                    x: 0,
                    y: Math.max(-maxPanY, Math.min(prev.y, maxPanY))
                }));
            }
        } else if (e.touches.length === 1 && zoomScale > 1) {
            const newY = e.touches[0].clientY - touchStartPos.current.y;
            
            // Limit pan position based on current zoom scale (keep X locked to 0)
            const maxPanY = (window.innerHeight * (zoomScale - 1)) / 2;
            
            setPanPos({
                x: 0,
                y: Math.max(-maxPanY, Math.min(newY, maxPanY))
            });
        }
    };

    const handleZoomTouchEnd = (e: React.TouchEvent) => {
        if (!isFullscreen) return;
        setIsPanning(false);
        if (e.touches.length < 2) {
            initialPinchDist.current = null;
        }
        if (zoomScale <= 1) {
            setPanPos({ x: 0, y: 0 });
            setZoomScale(1);
        }
    };

    // 1. PRIORITÉ ABSOLUE : Lecteur Stream Officiel customisé OU Fichier local
    if ((cloudflareId && cloudflareId !== "") || localVideoUrl) {
        return (
            <div
                ref={containerRef}
                className={cn(
                    "relative w-full bg-transparent overflow-hidden group",
                    isFullscreen ? 'video-player-fullscreen-active' : className || 'aspect-video rounded-xl shadow-2xl',
                    !isDesktop && "video-player-mobile"
                )}
                onMouseMove={() => {
                    // Only trigger mouse move if we are inside the window!
                    triggerControls();
                }}
                onMouseLeave={() => {
                    if (isPlaying) {
                        handleSetShowControls(false); // Instantly hide controls on mouse leave
                        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
                    }
                }}
                onTouchStart={triggerControls}
            >
                {/* 1. LAYER 0: The native stream player without controls */}
                <div 
                    className={cn(
                        "absolute inset-0 w-full h-full pointer-events-none",
                        !isPanning && "transition-transform duration-300 ease-out"
                    )}
                    style={{
                        transform: isFullscreen ? `translate(${panPos.x}px, ${panPos.y}px) scale(${zoomScale})` : 'none',
                        transformOrigin: 'center center'
                    }}
                >
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
                            onPlay={() => {
                                setIsPlaying(true);
                                if (isDesktop && resolvedVttUrl) {
                                    setupNativeSubtitles(resolvedVttUrl);
                                }
                            }}
                            onPause={() => setIsPlaying(false)}
                            onTimeUpdate={() => {
                                const player = playerRef.current;
                                if (!player) return;
                                const time = player.currentTime || 0;

                                if (player.duration && player.duration > 0 && duration === 0) {
                                    setDuration(player.duration);
                                }

                                // Protect current time if user is scrubbing
                                if (localScrubTime === null) {
                                    setCurrentTime(time);
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
                                }
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
                            onPlay={() => {
                                setIsPlaying(true);
                                if (isDesktop && resolvedVttUrl) {
                                    setupNativeSubtitles(resolvedVttUrl);
                                }
                            }}
                            onPause={() => setIsPlaying(false)}
                            onTimeUpdate={() => {
                                const player = playerRef.current;
                                if (!player) return;
                                const time = player.currentTime || 0;
                                
                                // Initialize duration cleanly
                                if (player.duration && player.duration > 0 && duration === 0) {
                                    setDuration(player.duration);
                                }

                                // Protect current time if user is scrubbing
                                if (localScrubTime === null && !isPlaying) { // Only update statically if paused (rAF handles playing state)
                                    setCurrentTime(time);
                                    if (onTimeUpdate) onTimeUpdate(time, player.duration || 0);

                                    let activeText = null;
                                    let activeIndex = -1;
                                    for (let i = 0; i < cuesRef.current.length; i++) {
                                        const c = cuesRef.current[i];
                                        if (time >= c.start && time <= c.end) {
                                            activeText = c.text;
                                            activeIndex = i;
                                            break;
                                        }
                                    }
                                    setActiveSubtitle(activeText);
                                    if (onActiveCueChange && activeIndex !== -1) {
                                        onActiveCueChange(activeIndex);
                                    }
                                }
                            }}
                        />
                    )}
                </div>

                {/* 2. LAYER 1: Interactive Screen Tap Zone */}
                <div
                    className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center touch-manipulation"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Just use nativeEvent.pointerType or matchMedia to detect touch/mobile vs desktop
                        const isTouch = (e.nativeEvent as any).pointerType === 'touch' || window.matchMedia("(pointer: coarse)").matches;
                        if (isTouch) {
                            // On mobile/touch devices, tapping the video toggles ONLY the controls
                            if (showControls) {
                                handleSetShowControls(false);
                                if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
                            } else {
                                triggerControls();
                            }
                        } else {
                            // On desktop, clicking video plays/pauses
                            togglePlay(e);
                            triggerControls();
                        }
                    }}
                    onTouchStart={handleZoomTouchStart}
                    onTouchMove={handleZoomTouchMove}
                    onTouchEnd={handleZoomTouchEnd}
                    onTouchCancel={handleZoomTouchEnd}
                >
                    {/* The big center play button has been removed by request. Playback is managed by the bottom bar. */}
                </div>

                {isFullscreen && (
                    <div
                        className={`absolute top-0 left-0 z-[60] transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'} p-4`}
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
                {activeSubtitle && subtitlesEnabled && !isDesktop && (
                    <div
                        className="absolute left-0 right-0 flex justify-center items-end pointer-events-none transition-all duration-300"
                        style={{
                            zIndex: 20,
                            bottom: showControls ? (isFullscreen ? '60px' : '60px') : '0px',
                            paddingBottom: isFullscreen ? '12px' : '6px'
                        }}
                    >
                        <span
                            className="text-slate-700 bg-[#FAF6ED]/95 px-3 py-1 rounded-lg mx-2 max-w-[95%] sm:max-w-[85%] md:max-w-3xl text-center whitespace-pre-wrap break-words font-sans shadow-md"
                            style={{
                                display: 'inline-block',
                                fontSize: `${isFullscreen ? Math.max(12, Math.min(24, containerWidth * 0.022)) : Math.max(10, Math.min(18, containerWidth * 0.022))}px`,
                                letterSpacing: '0.01em',
                                lineHeight: '1.3',
                                fontWeight: '500',
                            }}
                            dangerouslySetInnerHTML={{ __html: activeSubtitle }}
                        />
                    </div>
                )}

                <div
                    className={`absolute bottom-0 left-0 right-0 p-4 pt-10 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-40 transition-opacity duration-300 flex flex-col justify-end gap-1 ${showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
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
                                    const val = parseFloat(e.target.value);
                                    setLocalScrubTime(val);
                                    if (onTimeUpdate) onTimeUpdate(val, duration || 0);
                                    let activeText = null;
                                    let activeIndex = -1;
                                    for (let i = 0; i < cuesRef.current.length; i++) {
                                        const c = cuesRef.current[i];
                                        if (val >= c.start && val <= c.end) {
                                            activeText = c.text;
                                            activeIndex = i;
                                            break;
                                        }
                                    }
                                    setActiveSubtitle(activeText);
                                    if (onActiveCueChange && activeIndex !== -1) {
                                        onActiveCueChange(activeIndex);
                                    }
                                }}
                                onPointerUp={() => {
                                    if (localScrubTime !== null) {
                                        handleSeek({ target: { value: localScrubTime.toString() } } as any);
                                        setLocalScrubTime(null);
                                    }
                                }}
                                onPointerCancel={() => setLocalScrubTime(null)}
                                onTouchCancel={() => setLocalScrubTime(null)}
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



                            {/* Picture-in-Picture Toggle */}
                            {isPipSupported && isDesktop && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); togglePiP(e); }}
                                    className="text-white hover:text-white/80 transition-colors p-2 cursor-pointer touch-manipulation active:scale-90"
                                    title="Mini-lecteur (PiP)"
                                    aria-label="Mode incrustation d'image"
                                >
                                    <PictureInPicture2 size={22} />
                                </button>
                            )}

                            {/* Fullscreen Toggle */}
                            {!isFullscreen && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleFullscreen(e); }}
                                    onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); toggleFullscreen(e); }}
                                    className="text-white hover:text-white/80 transition-colors p-2 -mr-2 cursor-pointer touch-manipulation active:scale-90"
                                    aria-label="Plein écran"
                                >
                                    <Maximize size={22} />
                                </button>
                            )}
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

