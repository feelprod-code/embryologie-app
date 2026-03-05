import React, { useRef } from 'react';
import ReactPlayer from 'react-player';

interface CustomVideoPlayerProps {
    youtubeId?: string;
    cloudflareId?: string;
    speed?: number;
    className?: string;
    categoryId?: string;
    onEnded?: () => void;
    onTimeUpdate?: (currentTime: number) => void;
    activeSubtitle?: string | null;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
    youtubeId,
    cloudflareId,
    speed = 1,
    className = '',
    onEnded,
    onTimeUpdate,
    activeSubtitle
}) => {
    // any is used here due to ReactPlayer's complex internal typings making generic refs difficult
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null);

    // 1. PRIORITÉ ABSOLUE : Lecteur ReactPlayer avec M3U8 Cloudflare (HLS)
    if (cloudflareId && cloudflareId !== "") {
        const streamUrl = `https://customer-6i2z59dst7q6iswv.cloudflarestream.com/${cloudflareId}/manifest/video.m3u8`;

        return (
            <div className={`w-full aspect-video bg-black overflow-hidden rounded-xl shadow-2xl relative ${className}`}>
                <ReactPlayer
                    ref={playerRef}
                    src={streamUrl}
                    controls={true}
                    width="100%"
                    height="100%"
                    crossOrigin="anonymous"
                    playbackRate={speed}
                    onProgress={(state: any) => {
                        if (onTimeUpdate && state.playedSeconds !== undefined) {
                            onTimeUpdate(state.playedSeconds);
                        }
                    }}
                    onEnded={onEnded}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    onReady={() => {
                        const videoElement = playerRef.current?.getInternalPlayer() as HTMLVideoElement;
                        const hls = playerRef.current?.getInternalPlayer('hls');
                        if (hls) {
                            try {
                                hls.subtitleDisplay = false;
                                hls.subtitleTrack = -1;
                            } catch (e) {
                                // ignore
                            }
                        }

                        if (videoElement) {
                            const killTracks = () => {
                                // 1. JS API level (hls.js or native)
                                if (videoElement.textTracks) {
                                    for (let i = 0; i < videoElement.textTracks.length; i++) {
                                        if (videoElement.textTracks[i].mode !== 'disabled' && videoElement.textTracks[i].mode !== 'hidden') {
                                            videoElement.textTracks[i].mode = 'disabled';
                                            // Some browsers require hidden instead of disabled to avoid re-triggering
                                            setTimeout(() => {
                                                if (videoElement.textTracks[i]) {
                                                    videoElement.textTracks[i].mode = 'hidden';
                                                }
                                            }, 10);
                                        }
                                    }
                                }

                                // 2. DOM level: Find any <track> elements appended to <video> and destroy them
                                const trackTags = videoElement.querySelectorAll('track');
                                trackTags.forEach(t => t.remove());

                                requestAnimationFrame(killTracks);
                            };

                            // Start immediately
                            killTracks();

                            // Cleanup not strictly necessary since video unmounts, but to be clean
                            // We can't return a cleanup easily here, but that's fine for this context.

                            // Listen for track additions defensively
                            videoElement.textTracks.onaddtrack = (e) => {
                                if (e.track) {
                                    e.track.mode = 'disabled';
                                    e.track.mode = 'hidden';
                                }
                            };
                        }
                    }}
                    config={{
                        file: {
                            attributes: {
                                disablePictureInPicture: true,
                                controlsList: "nodownload noremoteplayback"
                            },
                            hlsOptions: {
                                autoStartLoad: true,
                                startPosition: -1,
                                capLevelToPlayerSize: true,
                                enableWorker: true,
                                // EXTREME TextTrack Prevention for Hls.js
                                subtitleDisplay: false,
                                renderTextTracksNatively: false,
                                enableWebVTT: false,
                            },
                            tracks: []
                        }
                    } as any}
                />

                {/* 
                  OVERLAY PERSONNALISÉ POUR LES SOUS-TITRES (NATIVE OVERRIDE).
                  Rendu par-dessus la vidéo, totalement contrôlé par notre propre parser VTT.
                */}
                {activeSubtitle && (
                    <div
                        className="absolute bottom-16 sm:bottom-20 left-0 w-full flex justify-center pointer-events-none z-50 px-4"
                    >
                        <div
                            className="bg-black/70 backdrop-blur-md text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl max-w-3xl text-center shadow-lg border border-white/10"
                        >
                            <p
                                className="font-medium text-[16px] sm:text-[18px] md:text-xl leading-snug sm:leading-relaxed m-0"
                                dangerouslySetInnerHTML={{ __html: activeSubtitle }}
                            />
                        </div>
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
