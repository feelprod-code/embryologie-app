import React, { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface CustomAudioPlayerProps {
    src: string;
    className?: string;
}

export const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({
    src,
    className = "",
}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current
                    .play()
                    .catch((err) => console.error("Playback error", err));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            setCurrentTime(current);
            if (!isNaN(total)) {
                setDuration(total);
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            const total = audioRef.current.duration;
            if (!isNaN(total)) {
                setDuration(total);
            }
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        if (audioRef.current) {
            const newTime = parseFloat(e.target.value);
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    useEffect(() => {
        const currentAudio = audioRef.current;
        if (currentAudio) {
            currentAudio.addEventListener("timeupdate", handleTimeUpdate);
            currentAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
            currentAudio.addEventListener("ended", () => setIsPlaying(false));
            return () => {
                currentAudio.removeEventListener("timeupdate", handleTimeUpdate);
                currentAudio.removeEventListener("loadedmetadata", handleLoadedMetadata);
                currentAudio.removeEventListener("ended", () => setIsPlaying(false));
            };
        }
    }, [src]);

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds)) return "0:00";
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div
            className={`flex flex-col gap-1 w-full mx-auto max-w-sm ${className}`}
            onClick={(e) => e.stopPropagation()}
        >
            <audio ref={audioRef} src={src} preload="metadata" />
            <div className="flex items-center gap-2 group w-full">
                <button
                    onClick={togglePlay}
                    className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#F27D33] hover:scale-105 active:scale-95 transition-all outline-none shadow-sm focus-visible:ring-1 focus-visible:ring-[#F27D33]"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <Pause size={12} className="fill-current" /> : <Play size={12} className="ml-0.5 fill-current" />}
                </button>

                <div className="flex-1 flex items-center h-8 group-hover:opacity-100 transition-opacity">
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 touch-none bg-slate-200 appearance-none rounded-full cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#F27D33] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md focus-visible:ring-1 focus-visible:ring-[#F27D33]"
                    />
                </div>

                <div className="text-[10px] tabular-nums text-[#F27D33] font-bold tracking-wide shrink-0 min-w-[36px] text-right">
                    {formatTime(currentTime)}
                </div>
            </div>

        </div>
    );
};
