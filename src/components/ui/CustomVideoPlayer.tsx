import React from 'react';
import ReactPlayer from 'react-player';

interface CustomVideoPlayerProps {
    youtubeId?: string;
    cloudflareId?: string;
    speed?: number;
    className?: string;
    categoryId?: string; // Appliqué pour coloriser les sous-titres (::cue)
    onEnded?: () => void;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
    youtubeId,
    cloudflareId,
    speed = 1,
    className = '',
    categoryId,
    onEnded
}) => {
    const vttThemeClass = categoryId ? `vtt-theme-${categoryId}` : '';

    // 1. PRIORITÉ ABSOLUE : Lecteur ReactPlayer avec M3U8 Cloudflare (HLS)
    if (cloudflareId && cloudflareId !== "") {
        const streamUrl = `https://customer-6i2z59dst7q6iswv.cloudflarestream.com/${cloudflareId}/manifest/video.m3u8`;
        return (
            <div className={`w-full aspect-video bg-black overflow-hidden rounded-xl shadow-2xl relative ${vttThemeClass} ${className}`}>
                <ReactPlayer
                    src={streamUrl}
                    controls={true}
                    width="100%"
                    height="100%"
                    crossOrigin="anonymous"
                    playbackRate={speed}
                    onEnded={onEnded}
                    style={{ position: 'absolute', top: 0, left: 0 }}
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
