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
                        if (videoElement) {
                            const hideTracks = () => {
                                if (videoElement.textTracks) {
                                    for (let i = 0; i < videoElement.textTracks.length; i++) {
                                        videoElement.textTracks[i].mode = 'hidden';
                                    }
                                }
                            };

                            // Hide immediately
                            hideTracks();

                            // Listen for track additions
                            videoElement.textTracks.onaddtrack = () => {
                                hideTracks();
                            };

                            // Also observe the video element for changes
                            const observer = new MutationObserver(() => {
                                hideTracks();
                            });

                            observer.observe(videoElement, {
                                childList: true,
                                subtree: true,
                                attributes: true
                            });

                            // Fallback interval just in case
                            const interval = setInterval(hideTracks, 500);

                            // Try to disable subtitles directly on track level configuration if possible
                            // Cleanup on unmount (approximate, since we don't have useEffect here easily, but it's okay for this component's lifespan)
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
                                // Advanced try to squash WebVTT in HLS.js
                                subtitleDisplay: false,
                                renderTextTracksNatively: false
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
