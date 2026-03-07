import React, { useState, useEffect, useRef } from 'react';
import { videoCourses as videoCoursesFr, type VideoCourse, getCategoryTotalDuration } from '../data/videoCourses';
import { videoCourses as videoCoursesEn } from '../data/videoCourses_en';
import { videoCourses as videoCoursesEs } from '../data/videoCourses_es';
import { videoCourses as videoCoursesIt } from '../data/videoCourses_it';
import { videoCourses as videoCoursesDe } from '../data/videoCourses_de';
import { videoCourses as videoCoursesZh } from '../data/videoCourses_zh';
import { videoCourses as videoCoursesJa } from '../data/videoCourses_ja';
import { cn } from '../utils';
import { Clock, ChevronLeft, ChevronRight, Video, VideoOff, Play, Pause, DownloadCloud, Loader2, CheckCircle2, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { CustomVideoPlayer, type CustomVideoPlayerRef } from './ui/CustomVideoPlayer';
import { useTranslation } from 'react-i18next';

const CACHE_NAME = 'video-offline-cache';




// No more resizable panels required

interface VideoPlayerPageProps {
  course: VideoCourse;
  onSelectVideo: (video: VideoCourse) => void;
}

export const VideoPlayerPage: React.FC<VideoPlayerPageProps> = ({ course: initialCourse, onSelectVideo }) => {
  const { t, i18n } = useTranslation();

  const videoCourses = i18n.language.startsWith('en')
    ? videoCoursesEn
    : i18n.language.startsWith('es')
      ? videoCoursesEs
      : i18n.language.startsWith('it')
        ? videoCoursesIt
        : i18n.language.startsWith('de')
          ? videoCoursesDe
          : i18n.language.startsWith('zh')
            ? videoCoursesZh
            : i18n.language.startsWith('ja')
              ? videoCoursesJa
              : videoCoursesFr;

  const course = videoCourses.find((v: VideoCourse) => v.id === initialCourse.id) || initialCourse;

  const [currentSpeed, setCurrentSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pipWidth, setPipWidth] = useState<number>(360);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [pipTranslate, setPipTranslate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isVideoVisible, setIsVideoVisible] = useState<boolean>(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [localScrubTime, setLocalScrubTime] = useState<number | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  const [isCaching, setIsCaching] = useState<boolean>(false);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);

  const videoUrl = course.cloudflareId ? `/cf-stream/${course.cloudflareId}/downloads/default.mp4` : '';

  useEffect(() => {
    let objectUrl: string | null = null;

    const checkCache = async () => {
      if (!videoUrl || typeof caches === 'undefined') return;
      try {
        const cache = await caches.open(CACHE_NAME);
        const response = await cache.match(videoUrl);
        setIsCached(!!response);
        if (response) {
          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);
          setLocalVideoUrl(objectUrl);
        } else {
          setLocalVideoUrl(null);
        }
      } catch (e) {
        console.error("Cache preview check failed", e);
      }
    };
    checkCache();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [videoUrl]);

  const handleOfflineCache = async () => {
    if (!videoUrl || isCaching || typeof caches === 'undefined') return;

    // Si la vidéo est déjà en cache, l'utilisateur a cliqué pour la supprimer
    if (isCached) {
      if (!isConfirmingDelete) {
        setIsConfirmingDelete(true);
        // Annule la confirmation après 3 secondes
        setTimeout(() => setIsConfirmingDelete(false), 3000);
        return;
      }

      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.delete(videoUrl);
        setIsCached(false);
        setLocalVideoUrl(null);
        setIsConfirmingDelete(false);
      } catch (e) {
        console.error("Erreur lors de la suppression du cache", e);
      }
      return;
    }

    setIsCaching(true);
    try {
      // On passe par le proxy Vite / Vercel pour éviter l'erreur CORS sur la redirection 302 native de Cloudflare
      const response = await fetch(videoUrl);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("La vidéo est en cours de préparation par le serveur (Cloudflare) pour le téléchargement hors-ligne. Veuillez réessayer dans quelques minutes.");
        }
        throw new Error(`Erreur réseau: ${response.status} ${response.statusText}`);
      }

      const cache = await caches.open(CACHE_NAME);
      const clonedResponse = response.clone();
      await cache.put(videoUrl, response);

      const blob = await clonedResponse.blob();
      setLocalVideoUrl(URL.createObjectURL(blob));

      setIsCached(true);
    } catch (e: any) {
      console.error("Failed to cache video", e);
      alert(t('videoLibrary.cacheError', `Erreur lors de l'enregistrement de la vidéo: ${e?.message || 'Erreur inconnue'}`));
    } finally {
      setIsCaching(false);
    }
  };

  // Layout mode state to avoid triple-mounting the video player
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // --- Effects ---
  const isMobileLayout = windowWidth < 768; // Tailwind md
  const isTabletLayout = windowWidth >= 768 && windowWidth < 1024; // Tailwind lg
  const isDesktopLayout = windowWidth >= 1024;

  const pipResizeStartRef = useRef<{ x: number, width: number } | null>(null);
  const pipDragStartRef = useRef<{ clientX: number, clientY: number, startX: number, startY: number, bounds: { minX: number, maxX: number, minY: number, maxY: number } | null } | null>(null);
  const pipContainerRef = useRef<HTMLDivElement>(null);
  const videoPlayerRef = useRef<CustomVideoPlayerRef>(null);

  // Effect to automatically show video on layout change to avoid stuck invisible video state
  useEffect(() => {
    // When switching layouts, ensure video becomes visible if it was hidden in a way incompatible with new layout
    // actually, keeping the state is fine, but resetting is safer.
    // setIsVideoVisible(true); 
  }, [isMobileLayout, isTabletLayout, isDesktopLayout]);

  const handlePipPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsResizing(true);
    pipResizeStartRef.current = { x: e.clientX, width: pipWidth };
  };

  const handlePipDragStart = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // only left click
    e.preventDefault();
    setIsDragging(true);

    let bounds = null;
    if (pipContainerRef.current && pipContainerRef.current.parentElement) {
      const rect = pipContainerRef.current.getBoundingClientRect();
      const parentRect = pipContainerRef.current.parentElement.getBoundingClientRect();

      const baseLeft = rect.left - pipTranslate.x;
      const baseTop = rect.top - pipTranslate.y;
      const margin = 16;

      bounds = {
        minX: parentRect.left + margin - baseLeft,
        maxX: parentRect.right - margin - rect.width - baseLeft,
        minY: parentRect.top + margin - baseTop,
        maxY: parentRect.bottom - margin - rect.height - baseTop
      };
    }

    pipDragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: pipTranslate.x,
      startY: pipTranslate.y,
      bounds
    };
  };

  useEffect(() => {
    if (!isResizing) return;
    const handlePointerMove = (e: PointerEvent) => {
      if (!pipResizeStartRef.current) return;
      // Dragging left (negative delta from start) increases size because it expands to the left
      const deltaX = pipResizeStartRef.current.x - e.clientX;
      const newWidth = Math.max(340, Math.min(800, pipResizeStartRef.current.width + deltaX));
      setPipWidth(newWidth);
    };
    const handlePointerUp = () => {
      setIsResizing(false);
      pipResizeStartRef.current = null;
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isResizing, pipWidth]);

  useEffect(() => {
    if (!isDragging) return;
    const handlePointerMove = (e: PointerEvent) => {
      if (!pipDragStartRef.current) return;
      const deltaX = e.clientX - pipDragStartRef.current.clientX;
      const deltaY = e.clientY - pipDragStartRef.current.clientY;
      let newX = pipDragStartRef.current.startX + deltaX;
      let newY = pipDragStartRef.current.startY + deltaY;

      // Handle bounding calculations natively from precalculated screen-relative bounds
      if (pipDragStartRef.current.bounds) {
        const { minX, maxX, minY, maxY } = pipDragStartRef.current.bounds;
        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));
      }

      setPipTranslate({ x: newX, y: newY });
    };
    const handlePointerUp = () => {
      setIsDragging(false);
      pipDragStartRef.current = null;
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging]);


  const categoryVideos = videoCourses.filter((v: VideoCourse) => v.categoryId === course.categoryId);
  const currentIndex = categoryVideos.findIndex((v: VideoCourse) => v.id === course.id);
  const prevVideo = currentIndex > 0 ? categoryVideos[currentIndex - 1] : null;
  const nextVideo = currentIndex < categoryVideos.length - 1 ? categoryVideos[currentIndex + 1] : null;

  useEffect(() => {
    // Attempt to strictly lock screen orientation to portrait
    if (typeof screen !== 'undefined' && screen.orientation && ('lock' in screen.orientation)) {
      (screen.orientation as any).lock('portrait').catch((err: unknown) => {
        console.log('Orientation lock failed or not supported:', err);
      });
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setCurrentSpeed(1), 0);
    return () => clearTimeout(t);
  }, [course.id, course.cloudflareId]);

  const handleSpeedChange = (speed: number) => {
    setCurrentSpeed(speed);
  };

  const handleTimeUpdate = (time: number, duration?: number) => {
    setCurrentTime(time);
    if (duration && duration > 0) {
      setVideoDuration(duration);
    }
  };

  const handleFullscreenChange = (isFs: boolean) => {
    setIsFullscreen(isFs);
  };

  const TopContent = (
    <div className={cn(
      "w-full flex justify-center items-center h-full max-h-full",
      isFullscreen ? "max-w-none px-0" : "flex-col justify-start md:px-0 lg:px-0"
    )}>
      <div className="w-full flex-grow flex flex-col justify-center min-h-[200px] h-full">
        <CustomVideoPlayer
          ref={videoPlayerRef}
          youtubeId={course.youtubeId}
          cloudflareId={course.cloudflareId}
          localVideoUrl={localVideoUrl}
          categoryId={course.categoryId}
          speed={currentSpeed}
          onTimeUpdate={handleTimeUpdate}
          onFullscreenChange={handleFullscreenChange}
          onPlayStateChange={setIsVideoPlaying}
          className={cn(
            isFullscreen ? "" : "rounded-2xl md:rounded-3xl shadow-xl aspect-video border border-slate-800 w-full h-auto max-h-full object-contain mx-auto"
          )}
        />
      </div>

      <div className={cn(
        "bg-white p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-sm border border-slate-200 flex-shrink-0 w-full mt-2 lg:max-w-4xl mx-auto",
        isFullscreen ? "hidden" : ""
      )}>
        {/* COMPACT SINGLE-LINE CONTROLS */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-2 overflow-x-auto no-scrollbar">

          {/* LEFT: SPEED CONTROLS */}
          <div className="flex items-center gap-1 justify-start shrink-0">
            {[1, 1.25].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={cn(
                  "flex items-center justify-center py-1 sm:py-1 md:py-1.5 lg:py-1.5 px-3 sm:px-3 md:px-4 lg:px-4 rounded-md sm:rounded-md md:rounded-lg lg:rounded-lg text-xs sm:text-xs md:text-sm lg:text-sm font-bold transition-all shadow-sm border cursor-pointer touch-manipulation active:scale-95 min-w-[40px]",
                  currentSpeed === speed
                    ? (course.categoryId === 'ectoderme' ? "bg-[#5A9C51]/10 text-[#5A9C51] border-[#5A9C51]/20" :
                      course.categoryId === 'endoderme' ? "bg-[#4171B5]/10 text-[#4171B5] border-[#4171B5]/20" :
                        course.categoryId === 'mesoderme' ? "bg-[#F27D33]/10 text-[#F27D33] border-[#F27D33]/20" :
                          course.categoryId === 'oeil' ? "bg-[#F2B729]/10 text-[#F2B729] border-[#F2B729]/20" : "bg-red-50 text-[#8B1111] border-red-200")
                    : "bg-white border-slate-200 text-slate-500 md:hover:text-slate-700 md:hover:bg-slate-50 active:bg-slate-50"
                )}
              >
                x{speed}
              </button>
            ))}
          </div>

          {/* CENTER: PREV/NEXT */}
          <div className="flex items-center gap-2 justify-center shrink-0">
            <button
              onClick={() => prevVideo && onSelectVideo(prevVideo)}
              disabled={!prevVideo}
              className="flex items-center justify-center py-1 sm:py-1 md:py-1.5 lg:py-1.5 px-5 sm:px-5 md:px-6 lg:px-6 bg-white active:bg-slate-50 md:hover:bg-slate-50 cursor-pointer touch-manipulation active:scale-95 text-slate-600 rounded-md sm:rounded-md md:rounded-lg lg:rounded-lg shadow-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed border border-slate-200"
              title={t('videoLibrary.previous')}
            >
              <ChevronLeft className="w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-5 lg:h-5" />
            </button>
            <button
              onClick={() => nextVideo && onSelectVideo(nextVideo)}
              disabled={!nextVideo}
              className="flex items-center justify-center py-1 sm:py-1 md:py-1.5 lg:py-1.5 px-5 sm:px-5 md:px-6 lg:px-6 bg-white active:bg-slate-50 md:hover:bg-slate-50 cursor-pointer touch-manipulation active:scale-95 text-slate-600 rounded-md sm:rounded-md md:rounded-lg lg:rounded-lg shadow-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed border border-slate-200"
              title={t('videoLibrary.next')}
            >
              <ChevronRight className="w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-5 lg:h-5" />
            </button>
          </div>

          {/* RIGHT: OFFLINE AND DOWNLOAD */}
          <div className="flex items-center gap-2 justify-end shrink-0">
            {course.cloudflareId && (
              <button
                onClick={handleOfflineCache}
                disabled={isCaching}
                className={`group relative flex justify-center items-center h-7 sm:h-8 px-2 sm:px-3 md:px-4 rounded-md sm:rounded-lg shadow-sm border transition-all ${isCached ? 'bg-[#5A9C51]/10 text-[#5A9C51] border-[#5A9C51]/20' : 'bg-white text-slate-500 border-slate-200 hover:text-slate-700 hover:bg-slate-50'} disabled:opacity-50 touch-manipulation active:scale-95`}
                title={isCaching ? "Enregistrement en cours..." : isCached ? "Supprimer la vidéo de cet appareil" : "Enregistrer pour accès hors-ligne"}
              >
                <div className="relative flex items-center justify-center w-4 h-4 sm:w-4 sm:h-4">
                  {isCaching ? (
                    <Loader2 className="w-full h-full animate-spin" strokeWidth={2.5} />
                  ) : isCached ? (
                    isConfirmingDelete ? (
                      <Trash2 className="w-full h-full text-red-500 animate-in zoom-in duration-200" strokeWidth={2.5} />
                    ) : (
                      <>
                        <CheckCircle2 className="w-full h-full text-[#5A9C51] md:group-hover:opacity-0 transition-opacity absolute" strokeWidth={2.5} />
                        <Trash2 className="w-full h-full text-red-500 opacity-0 md:group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
                      </>
                    )
                  ) : (
                    <DownloadCloud className="w-full h-full" strokeWidth={2.5} />
                  )}
                </div>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );

  const BottomContent = (
    <div className={cn(
      "w-full h-full bg-white md:rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col pt-0 relative",
      isFullscreen && "hidden"
    )}>
      {/* STICKY TRANSCRIPT HEADER */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 p-2 shadow-sm w-full flex items-center justify-between shrink-0">
        <div className="flex flex-row items-center px-2 flex-1 min-w-0 pr-2 gap-2">
          <h3 className={cn("font-anton text-sm md:text-sm lg:text-[15px] tracking-wide uppercase leading-tight truncate",
            course.categoryId === 'ectoderme' ? "text-[#5A9C51]" :
              course.categoryId === 'endoderme' ? "text-[#4171B5]" :
                course.categoryId === 'mesoderme' ? "text-[#F27D33]" :
                  course.categoryId === 'oeil' ? "text-[#F2B729]" : "text-slate-800"
          )}>
            {(course.title.match(/^(\d+)/) ? `${course.title.match(/^(\d+)/)?.[1].padStart(2, '0')}- ` : '') + course.title.replace(/^\d+[.\-\s_:]*/, '').replace(/\s*_\s*/g, ' : ')}
          </h3>

          {course.duration && (
            <span className="text-slate-500 font-semibold text-[13px] tabular-nums tracking-wide shrink-0 ml-2">
              {course.duration}
            </span>
          )}
        </div>

        <div className="flex items-center shrink-0 ml-1 gap-2 sm:gap-3">
          {/* Audio Controls (Only visible when video is hidden) */}
          {!isVideoVisible && (
            <div className="flex items-center bg-slate-50/90 backdrop-blur-md rounded-full border border-slate-200/70 p-1 sm:pr-3 shadow-sm fade-in w-[200px] sm:w-[320px] md:w-[420px] gap-1 sm:gap-2 transition-all relative">
              {/* Playback Buttons */}
              <div className="flex items-center justify-center shrink-0">
                <button
                  onClick={() => prevVideo && onSelectVideo(prevVideo)}
                  disabled={!prevVideo}
                  className="flex items-center justify-center p-1 sm:p-1.5 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title={t('videoLibrary.previous')}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-4 sm:h-4" />
                </button>

                <button
                  onClick={() => videoPlayerRef.current?.togglePlay()}
                  className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 text-white hover:bg-slate-700 active:scale-95 transition-all shadow-sm mx-1"
                  title={isVideoPlaying ? "Pause" : "Play"}
                >
                  {isVideoPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-[1px]" />}
                </button>

                <button
                  onClick={() => nextVideo && onSelectVideo(nextVideo)}
                  disabled={!nextVideo}
                  className="flex items-center justify-center p-1 sm:p-1.5 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title={t('videoLibrary.next')}
                >
                  <ChevronRight className="w-4 h-4 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Scrubber Area */}
              <div className="flex flex-1 items-center gap-1.5 sm:gap-3 shrink-0">
                <span className="text-[9px] sm:text-[11px] text-slate-400 font-medium tabular-nums text-right min-w-[24px] sm:min-w-[32px]">
                  {formatTime(localScrubTime !== null ? localScrubTime : currentTime)}
                </span>
                <div className="relative flex-1 h-3 flex items-center group cursor-pointer touch-manipulation">
                  <input
                    type="range"
                    min="0"
                    max={videoDuration || 100}
                    value={localScrubTime !== null ? localScrubTime : currentTime}
                    onPointerDown={() => setLocalScrubTime(currentTime)}
                    onChange={(e) => setLocalScrubTime(parseFloat(e.target.value))}
                    onPointerUp={(e) => {
                      const val = parseFloat((e.currentTarget as HTMLInputElement).value);
                      videoPlayerRef.current?.seekTo(val);
                      setLocalScrubTime(null);
                    }}
                    onTouchEnd={(e) => {
                      const val = parseFloat((e.currentTarget as HTMLInputElement).value);
                      videoPlayerRef.current?.seekTo(val);
                      setLocalScrubTime(null);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 touch-manipulation"
                  />
                  <div className="w-full h-1 sm:h-1.5 bg-slate-200/80 rounded-full overflow-hidden pointer-events-none">
                    <div
                      className={cn(
                        "h-full transition-all duration-75",
                        course.categoryId === 'ectoderme' ? "bg-[#5A9C51]" :
                          course.categoryId === 'endoderme' ? "bg-[#4171B5]" :
                            course.categoryId === 'mesoderme' ? "bg-[#F27D33]" :
                              course.categoryId === 'oeil' ? "bg-[#F2B729]" : "bg-slate-500"
                      )}
                      style={{ width: `${((localScrubTime !== null ? localScrubTime : currentTime) / (videoDuration || 100)) * 100}%` }}
                    />
                  </div>
                  {/* Custom Thumb */}
                  <div
                    className="absolute h-2.5 w-2.5 sm:h-3 sm:w-3 bg-white rounded-full shadow border border-slate-300 pointer-events-none transform -translate-x-1/2 transition-all duration-75"
                    style={{ left: `${((localScrubTime !== null ? localScrubTime : currentTime) / (videoDuration || 100)) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] sm:text-[11px] text-slate-400 font-medium tabular-nums text-left min-w-[24px] sm:min-w-[32px]">
                  {formatTime(videoDuration)}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsVideoVisible(!isVideoVisible)}
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-md sm:rounded-lg text-slate-500 hover:text-slate-700 transition-colors border border-slate-200 shadow-sm shrink-0"
            title={isVideoVisible ? "Masquer la vidéo" : "Afficher la vidéo"}
          >
            {isVideoVisible ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          </button>
          <span className={cn(
            "font-bebas text-sm sm:text-base tracking-wider pt-0.5 shrink-0 transition-colors hidden md:block",
            course.categoryId === 'ectoderme' ? "text-[#5A9C51]" :
              course.categoryId === 'endoderme' ? "text-[#4171B5]" :
                course.categoryId === 'mesoderme' ? "text-[#F27D33]" :
                  course.categoryId === 'oeil' ? "text-[#F2B729]" : "text-slate-400"
          )}>
            {course.duration || '00:00'}
          </span>
        </div>
      </div>
      <div className={cn(
        "px-3 sm:px-4 md:px-6 pt-2 pb-24 md:pt-4 md:pb-[150px] lg:pb-[200px] overflow-y-auto flex-1 no-scrollbar prose prose-slate max-w-none",
        "prose-headings:font-bebas prose-headings:tracking-wide prose-headings:text-dark",
        "prose-h2:text-2xl md:prose-h2:text-2xl lg:prose-h2:text-[22px] prose-h2:mt-6 prose-h2:mb-3 md:prose-h2:mt-8 md:prose-h2:mb-4 lg:prose-h2:mt-8 lg:prose-h2:mb-4",
        "prose-h3:text-xl lg:prose-h3:text-[18px] prose-h3:text-slate-800 prose-h3:font-montserrat prose-h3:font-bold",
        "prose-p:text-slate-600 prose-p:leading-loose md:prose-p:leading-relaxed prose-p:text-[15px] lg:prose-p:text-[15px] prose-p:mb-6 md:prose-p:mb-4",
        "prose-strong:text-slate-800 prose-strong:font-bold",
        "prose-ul:text-slate-600 prose-ul:text-[15px] md:prose-ul:text-[15px] lg:prose-ul:text-[14px] prose-ul:my-6 md:prose-ul:my-4 prose-ul:space-y-3 md:prose-ul:space-y-2 prose-ul:pl-5",
        "prose-li:leading-relaxed",
        "prose-blockquote:border-l-4 prose-blockquote:bg-slate-50 prose-blockquote:py-4 md:prose-blockquote:py-3 prose-blockquote:px-5 lg:prose-blockquote:px-4 prose-blockquote:rounded-r-2xl prose-blockquote:text-slate-700 prose-blockquote:italic prose-blockquote:my-8 md:prose-blockquote:my-6 prose-blockquote:shadow-sm",
        course.categoryId === 'ectoderme' ? "prose-a:text-[#5A9C51] hover:prose-a:text-[#4a8243] prose-blockquote:border-[#5A9C51] prose-blockquote:bg-[#5A9C51]/5" :
          course.categoryId === 'endoderme' ? "prose-a:text-[#4171B5] hover:prose-a:text-[#33598f] prose-blockquote:border-[#4171B5] prose-blockquote:bg-[#4171B5]/5" :
            course.categoryId === 'mesoderme' ? "prose-a:text-[#F27D33] hover:prose-a:text-[#d46522] prose-blockquote:border-[#F27D33] prose-blockquote:bg-[#F27D33]/5" :
              course.categoryId === 'oeil' ? "prose-a:text-[#F2B729] hover:prose-a:text-[#d49d1e] prose-blockquote:border-[#F2B729] prose-blockquote:bg-[#F2B729]/5" :
                "prose-a:text-slate-800 hover:prose-a:text-slate-900 prose-blockquote:border-slate-800 prose-blockquote:bg-slate-100",
        "[&>*:first-child]:!mt-0"
      )}>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {course.transcriptMarkdown.replace(/^#\s.*$/gm, '').trim().replace(/\n(?!#)/g, '\n\n').replace(/\n{3,}/g, '\n\n')}
        </ReactMarkdown>
      </div>
    </div>
  );

  return (
    <>
      <div className={cn(
        "w-full mx-auto flex flex-col bg-slate-50/50",
        isFullscreen ? "h-screen z-50 fixed inset-0" : "max-w-5xl h-full overflow-hidden relative mx-auto"
      )}>

        <div className={cn(
          "w-full pt-1 pb-2 md:pb-4 mb-2 shrink-0",
          isFullscreen ? "hidden" : ""
        )}>
          <div className="w-full max-w-full lg:max-w-4xl mx-auto px-2 md:px-4 lg:px-0">
            <div className="grid grid-cols-4 items-stretch gap-1.5 sm:gap-2 w-full">
              {["L'Ectoderme", "L'Endoderme", "Le Mésoderme", "L'Oeil"].map(layer => {
                const lmap = { "L'Ectoderme": "ectoderme", "Le Mésoderme": "mesoderme", "L'Endoderme": "endoderme", "L'Oeil": "oeil" };
                const cId = lmap[layer as keyof typeof lmap];
                const isSelected = course.categoryId === cId;
                const tKeys: Record<string, string> = { "L'Ectoderme": "ectoderm", "L'Endoderme": "endoderm", "Le Mésoderme": "mesoderm", "L'Oeil": "eye" };

                const handleLayerClick = () => {
                  if (isSelected) return;
                  const firstCourse = videoCourses.find((v: VideoCourse) => v.categoryId === cId);
                  if (firstCourse) onSelectVideo(firstCourse);
                };

                // Colors based on layer mapping exactly matched with VideoLibraryList
                const layerStyles: Record<string, { activeBg: string; activeBorder: string; activeText: string; hover: string }> = {
                  "L'Ectoderme": { activeBg: "bg-[#5A9C51]", activeBorder: "border-[#5A9C51]", activeText: "text-white", hover: "md:hover:bg-[#5A9C51]/5" },
                  "Le Mésoderme": { activeBg: "bg-[#F27D33]", activeBorder: "border-[#F27D33]", activeText: "text-white", hover: "md:hover:bg-[#F27D33]/5" },
                  "L'Endoderme": { activeBg: "bg-[#4171B5]", activeBorder: "border-[#4171B5]", activeText: "text-white", hover: "md:hover:bg-[#4171B5]/5" },
                  "L'Oeil": { activeBg: "bg-[#F2B729]", activeBorder: "border-[#F2B729]", activeText: "text-white", hover: "md:hover:bg-[#F2B729]/5" }
                };
                const style = layerStyles[layer];

                return (
                  <button
                    key={layer}
                    onClick={handleLayerClick}
                    className={cn(
                      "relative flex flex-col items-center justify-center py-2 sm:py-2 md:py-2 lg:py-2 px-1 sm:px-3 md:px-4 lg:px-3 rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl border transition-all duration-300 cursor-pointer touch-manipulation active:scale-[0.98] w-full min-w-0",
                      isSelected
                        ? `shadow-md scale-100 ${style.activeBg} ${style.activeBorder} text-white z-10`
                        : `bg-white border-slate-200 text-slate-600 shadow-sm ${style.hover}`
                    )}
                  >
                    <span className={cn(
                      "font-bebas text-[15px] sm:text-xl md:text-lg lg:text-lg tracking-wider leading-none mb-1 md:mb-1 w-full text-center overflow-hidden text-ellipsis whitespace-nowrap",
                      isSelected ? "text-white" : "text-slate-800"
                    )}>
                      {t(`videoLibrary.layers.${tKeys[layer.replace("'", "")] || tKeys[layer]}`)}
                    </span>

                    <span className={cn(
                      "text-[9px] sm:text-[10px] md:text-[10px] uppercase font-bold truncate w-full px-0 sm:px-1 opacity-80 text-center",
                      isSelected ? "text-white/80" : "text-slate-500"
                    )}>
                      <Clock size={10} className="hidden lg:inline mr-1 mb-[1px]" />
                      {getCategoryTotalDuration(cId as "ectoderme" | "endoderme" | "mesoderme" | "oeil")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- MOBILE VIEW: Resizable Split Pane (Vertical) --- */}
        {isMobileLayout && (
          <div className="flex-1 flex flex-col min-h-0 px-2 w-full">
            {isFullscreen ? (
              <div className="w-full h-full">
                {TopContent}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col">
                <div
                  className={cn(
                    "w-full flex-none transition-all duration-300 ease-in-out",
                    !isVideoVisible ? "h-0 overflow-hidden" : ""
                  )}
                  style={{
                    // We calculate the ideal height: 16/9 aspect ratio + ~38px for the top info controls
                    height: isVideoVisible ? 'calc(100vw * 9 / 16 + 38px)' : '0'
                  }}
                >
                  <div className="w-full h-full pb-1">
                    {TopContent}
                  </div>
                </div>
                <div className="flex-1 min-h-0 pt-1">
                  {BottomContent}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TABLET & DESKTOP VIEW: Floating Picture-in-Picture in Corner --- */}
        {(isTabletLayout || isDesktopLayout) && (
          <div className="flex-1 relative w-full h-full pb-4 px-4">
            {isFullscreen ? (
              <div className="w-full h-full fixed inset-0 z-[100] bg-black">
                {TopContent}
              </div>
            ) : (
              <>
                {/* Transcript Background (Full Tablet Width) */}
                <div className="w-full h-full relative">
                  {BottomContent}
                </div>

                <div
                  ref={pipContainerRef}
                  className={cn(
                    "absolute bottom-[90px] right-6 z-[90] rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] bg-white/95 backdrop-blur-xl border border-white/60 p-1.5 flex flex-col",
                    (!isResizing && !isDragging) && "transition-transform duration-300 ease-out",
                    !isVideoVisible && "opacity-0 pointer-events-none scale-0 -z-50 right-0 bottom-0"
                  )}
                  style={{
                    width: isVideoVisible ? `${pipWidth}px` : undefined,
                    height: 'auto',
                    touchAction: 'none',
                    transform: `translate(${pipTranslate.x}px, ${pipTranslate.y}px)`
                  }}
                >
                  {/* Drag Handle */}
                  <div
                    className="absolute -top-3 -left-3 w-8 h-8 bg-white border border-slate-200 shadow-[0_4px_10px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center cursor-nwse-resize z-50 touch-none active:bg-slate-50 transition-colors"
                    onPointerDown={handlePipPointerDown}
                  >
                    <div className="w-3 h-3 rounded-full bg-slate-300/50 flex items-center justify-center">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        course.categoryId === 'ectoderme' ? "bg-[#5A9C51]" :
                          course.categoryId === 'endoderme' ? "bg-[#4171B5]" :
                            course.categoryId === 'mesoderme' ? "bg-[#F27D33]" :
                              course.categoryId === 'oeil' ? "bg-[#F2B729]" : "bg-slate-400"
                      )} />
                    </div>
                  </div>

                  {/* PiP Controls Header */}
                  <div
                    className="flex items-center justify-between px-2 pb-1.5 pt-0.5 cursor-move touch-none active:bg-slate-50/50 rounded-t-lg transition-colors"
                    onPointerDown={handlePipDragStart}
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0 pointer-events-none">Lecteur Vidéo</span>
                  </div>

                  <div className="w-full flex flex-col">
                    {TopContent}
                  </div>
                </div>
              </>
            )}
          </div>
        )}


      </div >
    </>
  );
};

export default VideoPlayerPage;
