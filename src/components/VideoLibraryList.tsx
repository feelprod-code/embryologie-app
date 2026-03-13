import React, { useState } from 'react';
import { type VideoCourse, videoCourses as videoCoursesFr, getCategoryTotalDuration } from '../data/videoCourses';
import { videoCourses as videoCoursesEn } from '../data/videoCourses_en';
import { videoCourses as videoCoursesEs } from '../data/videoCourses_es';
import { videoCourses as videoCoursesIt } from '../data/videoCourses_it';
import { videoCourses as videoCoursesDe } from '../data/videoCourses_de';
import { videoCourses as videoCoursesZh } from '../data/videoCourses_zh';
import { videoCourses as videoCoursesJa } from '../data/videoCourses_ja';
import { Play, Clock, BookOpen } from 'lucide-react';
import { cn } from '../utils';
import { motion, type Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';



interface VideoLibraryListProps {
    onSelectVideo: (video: VideoCourse) => void;
}

export const VideoLibraryList: React.FC<VideoLibraryListProps> = ({ onSelectVideo }) => {
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

    // UI state for immediate button feedback
    // UI state for immediate button feedback
    const [activeTab, setActiveTab] = useState<string>("L'Ectoderme");
    const [touchedCourseId, setTouchedCourseId] = useState<string | null>(null);

    // Deferred state for the heavy list rendering
    const [selectedLayer, setSelectedLayer] = useState<string>("L'Ectoderme");
    const isPending = false;

    const filteredCourses = videoCourses.filter((v: VideoCourse) => {
        let mappedCategory: string = v.categoryId;
        if (v.categoryId === 'ectoderme') mappedCategory = "L'Ectoderme";
        if (v.categoryId === 'endoderme') mappedCategory = "L'Endoderme";
        if (v.categoryId === 'mesoderme') mappedCategory = "Le Mésoderme";
        if (v.categoryId === 'oeil') mappedCategory = "L'Oeil";
        return selectedLayer === mappedCategory;
    });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const tabs = ["L'Ectoderme", "L'Endoderme", "Le Mésoderme", "L'Oeil"];
    const tKeys: Record<string, string> = { "L'Ectoderme": "ectoderm", "L'Endoderme": "endoderm", "Le Mésoderme": "mesoderm", "L'Oeil": "eye" };

    return (
        <div className="w-full flex-1 flex flex-col pt-0 pb-4 md:pb-0">
            {/* STICKY HEADER CONTAINER FOR VIDEO LIBRARY */}
            <div className="sticky top-0 z-40 w-full bg-[#FAF6ED] pt-4 flex flex-col items-center pb-4 border-b border-transparent md:border-slate-100">
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-1 relative w-full text-center pb-1 md:pb-0">
                    <div className="inline-flex items-center justify-center px-4 sm:px-8 md:px-8 py-2 sm:py-3 md:py-2 rounded-full mb-0 whitespace-nowrap max-w-[95vw] md:max-w-full overflow-hidden">
                        <span className="font-bebas font-normal text-xl min-[380px]:text-2xl sm:text-3xl md:text-2xl lg:text-xl uppercase tracking-widest truncate leading-none md:leading-[1.1] pt-1 md:pt-0 drop-shadow-sm text-slate-800">
                            {t('videoLibrary.completeFormation')}
                        </span>
                    </div>
                </div>

                {/* Category Pills (identical spacing to Timeline) */}
                <div className="w-full pb-2 mb-2 sm:mb-0 border-t border-slate-100 pt-2 sm:pt-2 md:pt-1">
                    <div className="grid grid-cols-4 items-stretch gap-1.5 sm:gap-2 w-full max-w-4xl mx-auto px-2 md:px-0">
                        {tabs.map(layer => {
                            const isSelected = activeTab === layer;

                            const lmap = { "L'Ectoderme": "ectoderme", "Le Mésoderme": "mesoderme", "L'Endoderme": "endoderme", "L'Oeil": "oeil" };
                            const cId = lmap[layer as keyof typeof lmap];

                            const layerStyles: Record<string, { activeBg: string; activeBorder: string; activeText: string; dot: string; hover: string; unselectedBg?: string; unselectedText?: string; unselectedBorder?: string }> = {
                                "L'Ectoderme": {
                                    activeBg: "bg-[#5A9C51]", activeBorder: "border-[#5A9C51]", activeText: "text-white", dot: "bg-[#5A9C51]", hover: "md:hover:bg-[#5A9C51]/20",
                                    unselectedBg: "bg-[#5A9C51]/10", unselectedText: "text-[#5A9C51]", unselectedBorder: "border-[#5A9C51]/30"
                                },
                                "Le Mésoderme": {
                                    activeBg: "bg-[#F27D33]", activeBorder: "border-[#F27D33]", activeText: "text-white", dot: "bg-[#F27D33]", hover: "md:hover:bg-[#F27D33]/20",
                                    unselectedBg: "bg-[#F27D33]/10", unselectedText: "text-[#F27D33]", unselectedBorder: "border-[#F27D33]/30"
                                },
                                "L'Endoderme": {
                                    activeBg: "bg-[#4171B5]", activeBorder: "border-[#4171B5]", activeText: "text-white", dot: "bg-[#4171B5]", hover: "md:hover:bg-[#4171B5]/20",
                                    unselectedBg: "bg-[#4171B5]/10", unselectedText: "text-[#4171B5]", unselectedBorder: "border-[#4171B5]/30"
                                },
                                "L'Oeil": {
                                    activeBg: "bg-[#F2B729]", activeBorder: "border-[#F2B729]", activeText: "text-white", dot: "bg-[#F2B729]", hover: "md:hover:bg-[#F2B729]/20",
                                    unselectedBg: "bg-[#F2B729]/10", unselectedText: "text-[#F2B729]", unselectedBorder: "border-[#F2B729]/30"
                                }
                            };
                            const style = layerStyles[layer];

                            const handleLayerSelect = () => {
                                if (activeTab === layer) return;
                                setActiveTab(layer);
                                setSelectedLayer(layer);
                            };

                            return (
                                <button
                                    key={layer}
                                    onClick={handleLayerSelect}
                                    onTouchStart={() => {
                                        // On mobile, fire immediately and don't wait for click
                                        // We don't preventDefault here because it might block vertical scrolling
                                        handleLayerSelect();
                                    }}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center py-2.5 sm:py-3 px-1 sm:px-4 md:px-4 lg:px-3 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer touch-manipulation w-full min-w-0",
                                        isSelected
                                            ? `shadow-md scale-100 ${style.activeBg} ${style.activeBorder} text-white z-10`
                                            : `${style.unselectedBg} ${style.unselectedBorder} ${style.unselectedText} shadow-sm ${style.hover}`
                                    )}
                                >
                                    <span className={cn(
                                        "font-bebas text-[15px] sm:text-xl md:text-lg lg:text-lg tracking-wider leading-none mb-1 md:mb-1 w-full text-center overflow-hidden text-ellipsis whitespace-nowrap",
                                        isSelected ? "text-white" : style.unselectedText
                                    )}>
                                        {t(`videoLibrary.layers.${tKeys[layer as keyof typeof tKeys]}`)}
                                    </span>

                                    <span className={cn(
                                        "text-[9px] sm:text-[10px] md:text-[10px] uppercase font-bold truncate w-full px-0 sm:px-1 opacity-80 text-center",
                                        isSelected ? "text-white/80" : style.unselectedText
                                    )}>
                                        <Clock size={9} className="hidden lg:inline mr-1 mb-[1px]" />
                                        {getCategoryTotalDuration(cId as "ectoderme" | "endoderme" | "mesoderme" | "oeil")}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Video List */}
            <motion.div
                key={selectedLayer}
                className={cn(
                    "flex flex-col gap-1 sm:gap-2 w-full max-w-4xl lg:max-w-6xl xl:max-w-[90%] mx-auto px-4 lg:px-0 transition-opacity duration-200",
                    isPending ? "opacity-70" : "opacity-100"
                )}
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {
                    filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => {
                            const activeListStyle = {
                                "L'Ectoderme": { textHover: "md:group-hover:text-[#5A9C51]", hoverBg: "md:hover:bg-[#5A9C51]/5", tapBg: "rgba(90, 156, 81, 0.15)", textColor: "text-[#5A9C51]" },
                                "Le Mésoderme": { textHover: "md:group-hover:text-[#F27D33]", hoverBg: "md:hover:bg-[#F27D33]/5", tapBg: "rgba(242, 125, 51, 0.15)", textColor: "text-[#F27D33]" },
                                "L'Endoderme": { textHover: "md:group-hover:text-[#4171B5]", hoverBg: "md:hover:bg-[#4171B5]/5", tapBg: "rgba(65, 113, 181, 0.15)", textColor: "text-[#4171B5]" },
                                "L'Oeil": { textHover: "md:group-hover:text-[#F2B729]", hoverBg: "md:hover:bg-[#F2B729]/5", tapBg: "rgba(242, 183, 41, 0.15)", textColor: "text-[#F2B729]" },
                            }[selectedLayer] || { textHover: "md:group-hover:text-[#8B1111]", hoverBg: "md:hover:bg-black/[0.02]", tapBg: "rgba(0, 0, 0, 0.05)", textColor: "text-slate-300" };

                            const isTouched = touchedCourseId === course.id;

                            return (
                                <motion.div
                                    key={course.id}
                                    variants={itemVariants}
                                    className="w-full"
                                >
                                    <button
                                        onClick={() => onSelectVideo(course)}
                                        onTouchStart={() => setTouchedCourseId(course.id)}
                                        onTouchEnd={() => setTimeout(() => setTouchedCourseId(null), 150)}
                                        onTouchCancel={() => setTouchedCourseId(null)}
                                        style={{
                                            backgroundColor: isTouched ? activeListStyle.tapBg : 'transparent',
                                            transform: isTouched ? 'scale(0.96)' : 'scale(1)',
                                            transition: 'transform 0.15s ease-out, background-color 0.15s ease-out',
                                        }}
                                        className={cn(
                                            "group relative w-full text-left flex flex-row items-center py-4 sm:py-3 md:py-3 lg:py-2 border-b border-slate-200/60 last:border-0 cursor-pointer overflow-hidden touch-manipulation px-2 sm:px-3 md:px-4 lg:px-3 rounded-xl",
                                            activeListStyle.hoverBg
                                        )}
                                    >

                                        {/* Minimalist Play Icon */}
                                        <div className="flex-shrink-0 w-10 h-10 sm:w-10 sm:h-10 md:w-8 md:h-8 lg:w-7 lg:h-7 flex items-center justify-center mr-3 sm:mr-4 md:mr-4 lg:mr-3">
                                            <div className={cn("w-8 h-8 sm:w-8 sm:h-8 md:w-6 md:h-6 lg:w-6 lg:h-6 rounded-full flex items-center justify-center shadow-[inset_0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-300 md:group-hover:scale-110", isTouched ? 'bg-transparent scale-90' : 'bg-[#FAF6ED]')}>
                                                <Play className={cn("w-4 h-4 sm:w-4 sm:h-4 md:w-3 md:h-3 lg:w-3 lg:h-3 transition-colors translate-x-[1px]", activeListStyle.textColor)} fill="currentColor" strokeWidth={1} />
                                            </div>
                                        </div>

                                        {/* Minimalist Info */}
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h3 className={cn(
                                                "text-sm sm:text-base md:text-[14px] lg:text-[13px] font-sans font-medium tracking-wide truncate transition-transform duration-300 uppercase md:group-hover:translate-x-1",
                                                "text-slate-700", activeListStyle.textHover
                                            )}>
                                                {(course.title.match(/^(\d+)/) ? `${course.title.match(/^(\d+)/)?.[1].padStart(2, '0')}- ` : '') + course.title.replace(/^\d+[.\-\s_:]*/, '').replace(/\s*_\s*/g, ' : ')}
                                            </h3>
                                            {course.shortSummary && (
                                                <p className="text-[11px] sm:text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed px-0.5 group-hover:text-slate-500 transition-colors">
                                                    {course.shortSummary}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-1 md:mt-0.5 lg:mt-0.5 opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                                <span className="text-[10px] sm:text-[10px] md:text-[9px] lg:text-[9px] text-slate-400 font-medium font-sans flex items-center gap-1">
                                                    <BookOpen className="w-3 h-3 sm:w-3 sm:h-3 md:w-2.5 md:h-2.5 lg:w-2.5 lg:h-2.5" />
                                                    {t('videoLibrary.includedTranscript')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Sleek Duration */}
                                        {course.duration && (
                                            <div className={cn("flex-shrink-0 flex flex-col items-end justify-center text-slate-400 transition-transform duration-300 md:group-hover:-translate-x-1", activeListStyle.textHover)}>
                                                <span className="font-bebas text-lg sm:text-lg md:text-sm lg:text-base tracking-wider pt-1">{course.duration}</span>
                                            </div>
                                        )}
                                    </button>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="bg-card flex-1 min-h-[400px] w-full rounded-3xl border border-slate-200 shadow-sm py-20 px-6 text-center mt-4 flex flex-col items-center justify-center">
                            <p className="text-slate-700 text-lg sm:text-xl font-medium">{t('videoLibrary.noVideoTitle')}</p>
                            <p className="text-slate-400 text-sm mt-3">{t('videoLibrary.noVideoSub')}</p>
                        </div>
                    )
                }
            </motion.div >
        </div >
    );
};
