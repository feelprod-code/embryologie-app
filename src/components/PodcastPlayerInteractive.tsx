import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, BookOpen } from 'lucide-react';
import { cn } from '../utils';
import { useTranslation } from 'react-i18next';
import { type PodcastItem } from '../data/podcasts';
import { parseTranscript, type TranscriptCue } from '../utils/transcriptParser';

interface PodcastPlayerInteractiveProps {
    podcast: PodcastItem;
    onTranscriptToggle?: (visible: boolean) => void;
}

export const PodcastPlayerInteractive: React.FC<PodcastPlayerInteractiveProps> = ({ podcast, onTranscriptToggle }) => {
    const { t } = useTranslation();
    const audioRef = useRef<HTMLAudioElement>(null);
    const transcriptContainerRef = useRef<HTMLDivElement>(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [localScrubTime, setLocalScrubTime] = useState<number | null>(null);
    const [cues, setCues] = useState<TranscriptCue[]>([]);
    const [activeCueIndex, setActiveCueIndex] = useState<number>(-1);
    const [isTranscriptVisible, setIsTranscriptVisible] = useState(false);
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

    const lastActiveNodeRef = useRef<number>(-1);
    const animationRef = useRef<number>(0);
    
    // Direct DOM Refs for max performance (60fps without React state)
    const scrubFillRef = useRef<HTMLDivElement>(null);
    const scrubThumbRef = useRef<HTMLDivElement>(null);
    const timeDisplayRef = useRef<HTMLSpanElement>(null);
    const timeRemainingRef = useRef<HTMLSpanElement>(null);
    const rangeRef = useRef<HTMLInputElement>(null);
    const scrubRef = useRef<number | null>(null);

    // Parse transcript
    useEffect(() => {
        if (podcast.transcript) {
            setCues(parseTranscript(podcast.transcript));
        } else {
            setCues([]);
        }
    }, [podcast.transcript]);

    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current && localScrubTime === null && scrubRef.current === null) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    // Smooth playhead update
    useEffect(() => {
        if (isPlaying && localScrubTime === null) {
            const updateTime = () => {
                if (audioRef.current) {
                    const time = audioRef.current.currentTime;
                    // Direct DOM updates bypass React render cycle for 60fps fluidity!
                    if (scrubFillRef.current) scrubFillRef.current.style.width = `${(time / (duration || 100)) * 100}%`;
                    if (scrubThumbRef.current) scrubThumbRef.current.style.left = `${(time / (duration || 100)) * 100}%`;
                    if (timeDisplayRef.current) timeDisplayRef.current.textContent = formatTime(time);
                    if (timeRemainingRef.current) timeRemainingRef.current.textContent = `-${formatTime(Math.max(0, duration - time))}`;
                    if (rangeRef.current) rangeRef.current.value = time.toString();
                }
                animationRef.current = requestAnimationFrame(updateTime);
            };
            animationRef.current = requestAnimationFrame(updateTime);
        } else if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, localScrubTime]);

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
            
            // Instantly visually snap
            if (scrubFillRef.current) scrubFillRef.current.style.width = `${(time / (duration || 100)) * 100}%`;
            if (scrubThumbRef.current) scrubThumbRef.current.style.left = `${(time / (duration || 100)) * 100}%`;
            if (timeDisplayRef.current) timeDisplayRef.current.textContent = formatTime(time);
            if (timeRemainingRef.current) timeRemainingRef.current.textContent = `-${formatTime(Math.max(0, duration - time))}`;
            if (rangeRef.current) rangeRef.current.value = time.toString();
        }
    };

    // Calculate active cue based on currentTime
    useEffect(() => {
        if (cues.length === 0) return;

        let activeIdx = -1;
        for (let i = 0; i < cues.length; i++) {
            if (currentTime >= cues[i].startTime) {
                activeIdx = i;
            } else {
                break;
            }
        }
        
        setActiveCueIndex(activeIdx);

    }, [currentTime, cues]);

    // Auto-scroll to active cue within the transcript container
    useEffect(() => {
        if (!isTranscriptVisible || !isAutoScrollEnabled || activeCueIndex < 0) return;
        if (!transcriptContainerRef.current) return;

        if (lastActiveNodeRef.current !== activeCueIndex) {
            lastActiveNodeRef.current = activeCueIndex;
            
            const container = transcriptContainerRef.current;
            const activeEl = container.querySelector(`[data-cue-index="${activeCueIndex}"]`) as HTMLElement;
            
            if (activeEl && container) {
                const elTop = activeEl.offsetTop;
                const elHeight = activeEl.offsetHeight;
                const containerHeight = container.offsetHeight;
                
                // Keep the active element near the vertical center
                container.scrollTo({
                    top: elTop - containerHeight / 2 + elHeight / 2,
                    behavior: 'smooth'
                });
            }
        }
    }, [activeCueIndex, isTranscriptVisible, isAutoScrollEnabled]);

    const toggleTranscript = () => {
        const nextVal = !isTranscriptVisible;
        setIsTranscriptVisible(nextVal);
        onTranscriptToggle?.(nextVal);
        
        if (nextVal) {
            setIsAutoScrollEnabled(true);
            // Scroll to top of the home container when opening transcript
            setTimeout(() => {
                const scrollContainer = document.getElementById('home-scroll-container');
                if (scrollContainer) {
                    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 50);
        }
    };

    const displayTime = localScrubTime !== null ? localScrubTime : currentTime;
    const remainingTime = Math.max(0, duration - displayTime);

    return (
        <div className="w-full flex flex-col items-center">
            {/* Lecteur Audio Custom */}
            <div className="w-[92%] sm:w-2/3 md:w-3/4 max-w-[380px] md:max-w-[460px] lg:max-w-[380px] z-40 mt-1 flex flex-col items-center gap-3">
                <audio
                    ref={audioRef}
                    src={podcast.audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    controlsList="nodownload"
                    className="hidden"
                />
                
                {/* Minimalist Player UI */}
                <div id="podcast-player-pill" className="w-[105%] -ml-[2.5%] sm:w-full sm:ml-0 flex items-center bg-[#FAF6ED]/95 backdrop-blur-md pl-1 sm:pr-2 py-2 relative z-50">
                    <button
                        onClick={togglePlay}
                        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E87C3E] text-white hover:bg-[#D66B2D] active:scale-95 transition-all mx-1 shrink-0"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-[2px]" />}
                    </button>

                    <div className="flex flex-1 items-center gap-2 sm:gap-3 shrink-0 ml-1">
                        <span ref={timeDisplayRef} className="text-xs text-slate-500 font-medium tabular-nums min-w-[36px] text-right">
                            {formatTime(displayTime)}
                        </span>
                        
                        <div className="relative flex-1 h-4 flex items-center group cursor-pointer touch-manipulation">
                            <input
                                ref={rangeRef}
                                type="range"
                                min="0"
                                max={duration || 100}
                                step="0.01"
                                defaultValue={0}
                                onPointerDown={() => {
                                    scrubRef.current = currentTime;
                                    setLocalScrubTime(currentTime);
                                }}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    scrubRef.current = val;
                                    // Update DOM directly during scrub
                                    if (scrubFillRef.current) scrubFillRef.current.style.width = `${(val / (duration || 100)) * 100}%`;
                                    if (scrubThumbRef.current) scrubThumbRef.current.style.left = `${(val / (duration || 100)) * 100}%`;
                                    if (timeDisplayRef.current) timeDisplayRef.current.textContent = formatTime(val);
                                    if (timeRemainingRef.current) timeRemainingRef.current.textContent = `-${formatTime(Math.max(0, duration - val))}`;
                                }}
                                onPointerUp={() => {
                                    if (scrubRef.current !== null) {
                                        handleSeek(scrubRef.current);
                                        setLocalScrubTime(null);
                                        scrubRef.current = null;
                                    }
                                }}
                                onPointerCancel={() => { setLocalScrubTime(null); scrubRef.current = null; }}
                                onTouchCancel={() => { setLocalScrubTime(null); scrubRef.current = null; }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 touch-none"
                                aria-label="Seek podcast"
                            />
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden pointer-events-none">
                                <div
                                    ref={scrubFillRef}
                                    className="h-full bg-[#E87C3E]"
                                    style={{ width: `${(displayTime / (duration || 100)) * 100}%` }}
                                />
                            </div>
                            {/* Thumb */}
                            <div
                                ref={scrubThumbRef}
                                className="absolute h-3.5 w-3.5 bg-[#E87C3E] rounded-full pointer-events-none -translate-x-1/2"
                                style={{ left: `${(displayTime / (duration || 100)) * 100}%` }}
                            />
                        </div>

                        <span ref={timeRemainingRef} className="text-xs text-slate-400 font-medium tabular-nums min-w-[36px]">
                            -{formatTime(remainingTime)}
                        </span>
                    </div>
                </div>

                {/* Transcription Toggle */}
                <button
                    onClick={toggleTranscript}
                    className="w-[92%] sm:w-2/3 md:w-3/4 max-w-[380px] md:max-w-[460px] lg:max-w-[380px] py-2 sm:py-2.5 px-4 mt-2 bg-[#EFE8D8] hover:bg-[#E5DCC5] text-[#8E5A3E] rounded-full text-[11px] sm:text-xs font-semibold tracking-wide uppercase transition-all flex items-center justify-center gap-2 active:scale-95 group border-none"
                >
                    <BookOpen size={14} className="text-[#8E5A3E]" />
                    {isTranscriptVisible ? t('podcasts.hideTranscript', 'Masquer la retranscription') : t('podcasts.showTranscript', 'Afficher la retranscription')}
                </button>
            </div>

            {/* Transcript Area — Fullscreen scrollable container */}
            {isTranscriptVisible && (
                <div className="w-full mt-2 sm:mt-4 bg-white/80 backdrop-blur-md rounded-t-3xl border-t border-slate-200/50 shadow-[0_-5px_30px_rgba(0,0,0,0.03)] flex flex-col relative z-30 animate-fade-in-up">
                    
                    {/* Transcript Tools Header */}
                    <div className="flex-none px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-white/90 backdrop-blur-sm">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('podcasts.transcript', 'Retranscription')}</span>
                        <button
                            onClick={() => setIsAutoScrollEnabled(!isAutoScrollEnabled)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <div className={cn(
                                "w-2 h-2 rounded-full transition-colors shadow-sm",
                                isAutoScrollEnabled ? "bg-[#5A9C51]" : "bg-slate-300"
                            )}></div>
                            Auto-scroll
                        </button>
                    </div>

                    {/* Scrollable Transcript Content */}
                    <div 
                        ref={transcriptContainerRef}
                        className="w-full px-4 sm:px-6 md:px-10 py-6 overflow-y-auto"
                        style={{ height: 'calc(100dvh - 120px)' }}
                        onTouchMove={() => setIsAutoScrollEnabled(false)}
                        onWheel={() => setIsAutoScrollEnabled(false)}
                    >
                        {cues.length > 0 ? (
                            <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 pb-24">
                                {cues.map((cue, idx) => {
                                    const isActive = idx === activeCueIndex;
                                    
                                    return (
                                        <div 
                                            key={idx} 
                                            data-cue-index={idx}
                                            onClick={() => {
                                                handleSeek(cue.startTime);
                                                setIsAutoScrollEnabled(true);
                                            }}
                                            className={cn(
                                                "p-4 rounded-2xl cursor-pointer transition-all duration-300 border",
                                                (isActive && isAutoScrollEnabled) 
                                                    ? "bg-[#FFF8F0] border-[#E87C3E]/30 shadow-md transform scale-[1.01]" 
                                                    : "border-transparent hover:bg-slate-50",
                                                !isActive && isPlaying && isAutoScrollEnabled ? "opacity-50" : "opacity-100"
                                            )}
                                        >
                                            <div className="flex items-baseline gap-2 mb-2">
                                                <span className={cn(
                                                    "font-bold text-sm tracking-wide transition-colors",
                                                    isActive ? "text-[#E87C3E]" : "text-[#8E5A3E]"
                                                )}>
                                                    {cue.speaker}
                                                </span>
                                                <span className="text-xs text-slate-400 font-mono">
                                                    {formatTime(cue.startTime)}
                                                </span>
                                            </div>
                                            <p className={cn(
                                                "leading-relaxed sm:text-lg whitespace-pre-wrap transition-colors duration-300",
                                                isActive ? "text-slate-900 font-medium" : "text-slate-600"
                                            )}>
                                                {cue.sentences ? cue.sentences.map((sentence, sIdx) => {
                                                    const nextSentenceStart = sIdx === cue.sentences!.length - 1 
                                                        ? (idx === cues.length - 1 ? Infinity : cues[idx + 1].startTime)
                                                        : cue.sentences![sIdx + 1].startTime;
                                                        
                                                    const isSentenceActive = currentTime >= sentence.startTime && currentTime < nextSentenceStart;
                                                    
                                                    return (
                                                        <span 
                                                            key={sIdx} 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSeek(sentence.startTime);
                                                                setIsAutoScrollEnabled(true);
                                                            }}
                                                            className={cn(
                                                                "transition-colors duration-300 rounded px-1 -mx-1",
                                                                (isSentenceActive && isAutoScrollEnabled) 
                                                                    ? "bg-[#E87C3E]/20 text-slate-900" 
                                                                    : "hover:bg-slate-100 cursor-pointer"
                                                            )}
                                                        >
                                                            {sentence.text}{' '}
                                                        </span>
                                                    );
                                                }) : cue.text}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="w-full flex justify-center py-10">
                                <p className="text-slate-400 font-medium">{t('podcasts.transcriptNotAvailable', 'Retranscription non disponible pour le moment.')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
