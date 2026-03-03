import React, { useRef, useEffect } from 'react';
import { Stream } from '@cloudflare/stream-react';

interface CustomVideoPlayerProps {
    youtubeId?: string;
    cloudflareId?: string;
    speed?: number;
    className?: string;
    // Cloudflare Stream gère magnifiquement le callback de fin de vidéo !
    onEnded?: () => void;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
    youtubeId,
    cloudflareId,
    speed = 1,
    className = '',
    onEnded
}) => {
    const streamRef = useRef<any>(null);

    // Appliquer la vitesse en direct si elle change
    useEffect(() => {
        if (streamRef.current && streamRef.current.playbackRate !== undefined) {
            streamRef.current.playbackRate = speed;
        }
    }, [speed]);

    // 1. PRIORITÉ ABSOLUE : Lecteur Premium Cloudflare
    if (cloudflareId && cloudflareId !== "") {
        return (
            <div className={`w-full aspect-video bg-black overflow-hidden rounded-xl shadow-2xl ${className}`}>
                <Stream
                    streamRef={streamRef}
                    className="w-full h-full"
                    controls
                    src={cloudflareId}
                    onEnded={onEnded}
                    responsive={true}
                    preload="auto"
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
