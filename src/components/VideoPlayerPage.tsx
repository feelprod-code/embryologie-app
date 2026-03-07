import React, { useState, useEffect } from 'react';
import { videoCourses as videoCoursesFr, type VideoCourse, getCategoryTotalDuration } from '../data/videoCourses';
import { videoCourses as videoCoursesEn } from '../data/videoCourses_en';
import { videoCourses as videoCoursesEs } from '../data/videoCourses_es';
import { videoCourses as videoCoursesIt } from '../data/videoCourses_it';
import { videoCourses as videoCoursesDe } from '../data/videoCourses_de';
import { videoCourses as videoCoursesZh } from '../data/videoCourses_zh';
import { videoCourses as videoCoursesJa } from '../data/videoCourses_ja';
import { cn } from '../utils';
import { Clock, ChevronLeft, ChevronRight, DownloadCloud } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { CustomVideoPlayer } from './ui/CustomVideoPlayer';
import { useTranslation } from 'react-i18next';




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

  const [currentSpeed, setCurrentSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const course = videoCourses.find((v: VideoCourse) => v.id === initialCourse.id) || initialCourse;

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

  const handleTimeUpdate = () => {
    // Keep stub for backwards compatibility with CustomVideoPlayer prop
  };

  const handleFullscreenChange = (isFs: boolean) => {
    setIsFullscreen(isFs);
  };

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
          <div className="flex flex-nowrap items-stretch justify-center gap-1.5 sm:gap-2 w-full max-w-full lg:max-w-4xl mx-auto px-2 md:px-4 lg:px-0">
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
                    "flex-1 relative flex flex-col items-center justify-center py-2 sm:py-2 md:py-2 lg:py-2 px-2 sm:px-3 md:px-4 lg:px-3 rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl border transition-all duration-300 cursor-pointer touch-manipulation active:scale-[0.98]",
                    isSelected
                      ? `shadow-md scale-100 ${style.activeBg} ${style.activeBorder} text-white z-10`
                      : `bg-white border-slate-200 text-slate-600 shadow-sm ${style.hover}`
                  )}
                >
                  <span className={cn(
                    "font-bebas text-xl sm:text-xl md:text-lg lg:text-lg tracking-wider leading-none mb-1 md:mb-1 whitespace-nowrap",
                    isSelected ? "text-white" : "text-slate-800"
                  )}>
                    {t(`videoLibrary.layers.${tKeys[layer.replace("'", "")] || tKeys[layer]}`)}
                  </span>

                  <span className={cn(
                    "text-[10px] sm:text-[10px] md:text-[10px] uppercase font-bold truncate w-full px-1 opacity-80 text-center",
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

        <div className={cn(
          "flex-1 flex flex-col",
          isFullscreen ? "w-full h-full" : "gap-3 sm:gap-4 min-h-0 px-2 sm:px-0 w-full"
        )}>
          {/* Top Section: Video & Controls */}
          <div className={cn(
            "w-full flex flex-col mx-auto max-w-4xl px-1 md:px-4 lg:px-0",
            isFullscreen ? "max-w-none px-0 md:px-0 lg:px-0" : "gap-1.5 md:gap-2 shrink-0 z-20"
          )}>
            <CustomVideoPlayer
              youtubeId={course.youtubeId}
              cloudflareId={course.cloudflareId}
              categoryId={course.categoryId}
              speed={currentSpeed}
              onTimeUpdate={handleTimeUpdate}
              onFullscreenChange={handleFullscreenChange}
              className={cn(
                isFullscreen ? "" : "rounded-2xl md:rounded-3xl shadow-xl aspect-video border border-slate-800"
              )}
            />

            <div className={cn(
              "bg-white p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-sm border border-slate-200 flex-shrink-0",
              isFullscreen ? "hidden" : ""
            )}>
              {/* COMPACT SINGLE-LINE CONTROLS */}
              <div className="grid grid-cols-3 items-center w-full gap-2 overflow-x-auto no-scrollbar">

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
                <div className="flex items-center gap-2 justify-center shrink-0 w-full">
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
                    <a
                      href={`https://customer-6i2z59dst7q6iswv.cloudflarestream.com/${course.cloudflareId}/downloads/default.mp4`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-center items-center py-1 sm:py-1 md:py-1.5 lg:py-1.5 px-3 sm:px-3 md:px-4 lg:px-4 bg-white active:bg-slate-50 md:hover:bg-slate-50 cursor-pointer touch-manipulation active:scale-95 text-slate-500 md:hover:text-slate-900 transition-colors rounded-md sm:rounded-md md:rounded-lg lg:rounded-lg shadow-sm border border-slate-200"
                      title={t('videoLibrary.download')}
                    >
                      <DownloadCloud className="w-5 h-5 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5" strokeWidth={2.5} />
                    </a>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Bottom Section: Transcript (Scrollable Independent Area) */}
          <div className={cn(
            "w-full max-w-4xl mx-auto bg-white rounded-t-xl md:rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1 min-h-0 pb-8 lg:pb-0 z-10 pt-0 relative",
            isFullscreen ? "hidden" : ""
          )}>

            {/* STICKY TRANSCRIPT HEADER */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 p-2 shadow-sm w-full flex items-center justify-between">
              <div className="flex flex-col px-2 flex-1 min-w-0 pr-2">
                <h3 className={cn("font-anton text-sm md:text-sm lg:text-[15px] tracking-wide uppercase leading-tight truncate",
                  course.categoryId === 'ectoderme' ? "text-[#5A9C51]" :
                    course.categoryId === 'endoderme' ? "text-[#4171B5]" :
                      course.categoryId === 'mesoderme' ? "text-[#F27D33]" :
                        course.categoryId === 'oeil' ? "text-[#F2B729]" : "text-slate-800"
                )}>
                  {(course.title.match(/^(\d+)/) ? `${course.title.match(/^(\d+)/)?.[1].padStart(2, '0')}- ` : '') + course.title.replace(/^\d+[.\-\s_:]*/, '').replace(/\s*_\s*/g, ' : ')}
                </h3>
              </div>

              <div className="flex items-center shrink-0 ml-1">
                <span className={cn(
                  "font-bebas text-sm sm:text-base tracking-wider pt-0.5 shrink-0 ml-2 transition-colors",
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
              "px-4 pt-2 pb-16 md:px-8 md:pt-4 md:pb-12 lg:px-8 lg:pb-12 overflow-y-auto flex-1 no-scrollbar prose prose-slate max-w-none",
              "prose-headings:font-bebas prose-headings:tracking-wide prose-headings:text-dark",
              "prose-h1:hidden",
              "prose-h2:text-2xl md:prose-h2:text-2xl lg:prose-h2:text-[22px] md:prose-h2:mt-8 md:prose-h2:mb-4 lg:prose-h2:mt-8 lg:prose-h2:mb-4",
              "prose-h3:text-xl lg:prose-h3:text-[18px] prose-h3:text-slate-800 prose-h3:font-montserrat prose-h3:font-bold",
              "prose-p:text-slate-600 prose-p:leading-loose md:prose-p:leading-relaxed prose-p:text-[15px] lg:prose-p:text-[15px] prose-p:mb-6 md:prose-p:mb-4",
              "prose-strong:text-slate-800 prose-strong:font-bold",
              "prose-ul:text-slate-600 prose-ul:text-[15px] md:prose-ul:text-[15px] lg:prose-ul:text-[14px] prose-ul:my-6 md:prose-ul:my-4 prose-ul:space-y-3 md:prose-ul:space-y-2",
              "prose-li:leading-relaxed",
              "prose-blockquote:border-l-4 prose-blockquote:bg-slate-50 prose-blockquote:py-4 md:prose-blockquote:py-3 prose-blockquote:px-5 lg:prose-blockquote:px-4 prose-blockquote:rounded-r-2xl prose-blockquote:text-slate-700 prose-blockquote:italic prose-blockquote:my-8 md:prose-blockquote:my-6 prose-blockquote:shadow-sm",
              course.categoryId === 'ectoderme' ? "prose-a:text-[#5A9C51] hover:prose-a:text-[#4a8243] prose-blockquote:border-[#5A9C51] prose-blockquote:bg-[#5A9C51]/5" :
                course.categoryId === 'endoderme' ? "prose-a:text-[#4171B5] hover:prose-a:text-[#33598f] prose-blockquote:border-[#4171B5] prose-blockquote:bg-[#4171B5]/5" :
                  course.categoryId === 'mesoderme' ? "prose-a:text-[#F27D33] hover:prose-a:text-[#d46522] prose-blockquote:border-[#F27D33] prose-blockquote:bg-[#F27D33]/5" :
                    course.categoryId === 'oeil' ? "prose-a:text-[#F2B729] hover:prose-a:text-[#d49d1e] prose-blockquote:border-[#F2B729] prose-blockquote:bg-[#F2B729]/5" :
                      "prose-a:text-slate-800 hover:prose-a:text-slate-900 prose-blockquote:border-slate-800 prose-blockquote:bg-slate-100"
            )}>
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {course.transcriptMarkdown.replace(/\n(?!#)/g, '\n\n').replace(/\n{3,}/g, '\n\n')}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default VideoPlayerPage;
