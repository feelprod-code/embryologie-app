import React, { useRef } from 'react';
import ReactPlayer from 'react-player';
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

    // 1. PRIORITÉ ABSOLUE : Lecteur ReactPlayer avec M3U8 Cloudflare (HLS)
    if (cloudflareId && cloudflareId !== "") {
        const streamUrl = `https://customer-6i2z59dst7q6iswv.cloudflarestream.com/${cloudflareId}/manifest/video.m3u8`;

        // Dynamically compute the VTT URL depending on language
        const cfLangCode = getCloudflareLangCode(i18n.language);
        const dynamicSubtitlesUrl = `https://customer-6i2z59dst7q6iswv.cloudflarestream.com/${cloudflareId}/downloads/default.vtt?lang=${cfLangCode}`;

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
                    playsInline={true}
                    onProgress={(state: any) => {
                        if (onTimeUpdate && state.playedSeconds !== undefined) {
                            onTimeUpdate(state.playedSeconds);
                        }
                    }}
                    onEnded={onEnded}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    onReady={() => {
                        // iOS/Safari strict inline enforcement directly on the deeply nested <video> tag
                        const videoElement = playerRef.current?.getInternalPlayer() as HTMLVideoElement;
                        if (videoElement) {
                            videoElement.setAttribute('playsinline', 'true');
                            videoElement.setAttribute('webkit-playsinline', 'true');
                            videoElement.disablePictureInPicture = true;
                        }
                    }}
                    config={{
                        file: {
                            attributes: {
                                playsInline: true,
                                crossOrigin: "anonymous",
                                controlsList: "nodownload noremoteplayback"
                            },
                            tracks: dynamicSubtitlesUrl ? [
                                {
                                    kind: 'subtitles',
                                    src: dynamicSubtitlesUrl,
                                    srcLang: i18n.language === 'en' ? 'en'
                                        : i18n.language === 'es' ? 'es'
                                            : 'fr',
                                    label: i18n.language === 'en' ? 'English'
                                        : i18n.language === 'es' ? 'Español'
                                            : 'Français',
                                    default: true
                                }
                            ] : []
                        }
                    } as any}
                />
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
