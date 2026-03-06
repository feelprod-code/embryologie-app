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

    // Default state to L'Ectoderme to skip 'Tous'
    const [selectedLayer, setSelectedLayer] = useState<string>("L'Ectoderme");

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
        <div className="w-full flex-1 flex flex-col pt-0 pb-16">
            {/* STICKY HEADER CONTAINER FOR VIDEO LIBRARY */}
            <div className="sticky top-[0px] md:top-[20px] lg:top-[20px] z-20 w-[100vw] md:w-full bg-[#FAF9F6] -mx-2 sm:-mx-6 lg:mx-0 pt-[env(safe-area-inset-top,4px)] md:pt-[56px] lg:pt-[56px] flex flex-col items-center pb-[24px] md:pb-[16px] px-2 border-b border-transparent md:border-slate-100 shadow-sm md:shadow-none">
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-1 relative w-full text-center animate-fade-in-up pb-1 md:pb-0">
                    <div className="inline-flex items-center justify-center px-4 sm:px-8 md:px-8 py-2 sm:py-3 md:py-2 rounded-full mb-0 whitespace-nowrap max-w-[95vw] md:max-w-full overflow-hidden">
                        <span className="font-bebas font-normal text-xl min-[380px]:text-2xl sm:text-3xl md:text-2xl lg:text-xl uppercase tracking-widest truncate leading-none md:leading-[1.1] pt-1 md:pt-0 drop-shadow-sm text-slate-800">
                            {t('videoLibrary.completeFormation')}
                        </span>
                    </div>
                </div>

                {/* Category Pills (identical spacing to Timeline) */}
                <div className="w-full pb-2 mb-2 sm:mb-0 border-t border-slate-100 pt-2 sm:pt-2 md:pt-1">
                    <div className="flex flex-nowrap items-stretch justify-center gap-1 sm:gap-1.5 md:gap-1.5 w-full max-w-4xl mx-auto px-2 md:px-0">
                        {tabs.map(layer => {
                            const isSelected = selectedLayer === layer;

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

                            return (
                                <button
                                    key={layer}
                                    onClick={() => setSelectedLayer(layer)}
                                    className={cn(
                                        "flex-1 relative flex flex-col items-center justify-center py-2 sm:py-2 md:py-2 lg:py-1 px-2 sm:px-3 md:px-3 lg:px-2 rounded-xl sm:rounded-xl md:rounded-xl lg:rounded-xl border transition-transform duration-200 cursor-pointer touch-manipulation active:scale-[0.98]",
                                        isSelected
                                            ? `shadow-md scale-100 ${style.activeBg} ${style.activeBorder} text-white z-10`
                                            : `${style.unselectedBg} ${style.unselectedBorder} ${style.unselectedText} shadow-sm ${style.hover}`
                                    )}
                                >
                                    <span className={cn(
                                        "font-bebas text-lg sm:text-lg md:text-sm lg:text-sm tracking-wider leading-none mb-[1px] md:mb-[1px] whitespace-nowrap",
                                        isSelected ? "text-white" : style.unselectedText
                                    )}>
                                        {t(`videoLibrary.layers.${tKeys[layer as keyof typeof tKeys]}`)}
                                    </span>

                                    <span className={cn(
                                        "text-[9px] sm:text-[9px] md:text-[9px] uppercase font-bold truncate w-full px-1 opacity-80 text-center",
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
                className="flex flex-col gap-1 sm:gap-2 w-full max-w-4xl mx-auto px-4 lg:px-0"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {
                    filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => {
                            const activeListStyle = {
                                "L'Ectoderme": { textHover: "group-hover:text-[#5A9C51]", bgHover: "group-hover:bg-[#5A9C51]/10", rowBgHover: "hover:bg-[#5A9C51]/5 border-l-2 border-transparent hover:border-[#5A9C51]" },
                                "Le Mésoderme": { textHover: "group-hover:text-[#F27D33]", bgHover: "group-hover:bg-[#F27D33]/10", rowBgHover: "hover:bg-[#F27D33]/5 border-l-2 border-transparent hover:border-[#F27D33]" },
                                "L'Endoderme": { textHover: "group-hover:text-[#4171B5]", bgHover: "group-hover:bg-[#4171B5]/10", rowBgHover: "hover:bg-[#4171B5]/5 border-l-2 border-transparent hover:border-[#4171B5]" },
                                "L'Oeil": { textHover: "group-hover:text-[#F2B729]", bgHover: "group-hover:bg-[#F2B729]/10", rowBgHover: "hover:bg-[#F2B729]/5 border-l-2 border-transparent hover:border-[#F2B729]" },
                            }[selectedLayer] || { textHover: "group-hover:text-[#8B1111]", bgHover: "group-hover:bg-red-50", rowBgHover: "hover:bg-black/[0.02]" };

                            return (
                                <motion.div
                                    key={course.id}
                                    variants={itemVariants}
                                    className="w-full"
                                >
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => onSelectVideo(course)}
                                        className={cn(
                                            "group relative w-full text-left flex flex-row items-center py-4 sm:py-3 md:py-3 lg:py-2 border-b border-slate-200/60 last:border-0 active:scale-[0.99] transition-all duration-300 cursor-pointer overflow-hidden touch-manipulation px-2 sm:px-3 md:px-4 lg:px-3 rounded-xl sm:rounded-xl md:rounded-xl lg:rounded-xl",
                                            activeListStyle.rowBgHover
                                        )}
                                    >
                                        {/* Effet de tap natif pour mobile */}
                                        <div className="absolute inset-0 bg-slate-900 opacity-0 active:opacity-[0.03] transition-opacity duration-[50ms]"></div>

                                        {/* Minimalist Play Icon */}
                                        <div className="flex-shrink-0 w-10 h-10 sm:w-10 sm:h-10 md:w-8 md:h-8 lg:w-7 lg:h-7 flex items-center justify-center mr-3 sm:mr-4 md:mr-4 lg:mr-3">
                                            <div className={cn("w-8 h-8 sm:w-8 sm:h-8 md:w-6 md:h-6 lg:w-6 lg:h-6 rounded-full flex items-center justify-center shadow-[inset_0_1px_4px_rgba(0,0,0,0.05)] bg-slate-100/50 transition-all duration-300 group-hover:scale-110", activeListStyle.bgHover)}>
                                                <Play className={cn("w-4 h-4 sm:w-4 sm:h-4 md:w-3 md:h-3 lg:w-3 lg:h-3 text-slate-300 transition-colors translate-x-[1px]", activeListStyle.textHover)} fill="currentColor" strokeWidth={1} />
                                            </div>
                                        </div>

                                        {/* Minimalist Info */}
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h3 className={cn(
                                                "text-sm sm:text-base md:text-[14px] lg:text-[13px] font-sans font-medium tracking-wide truncate transition-transform duration-300 uppercase sm:group-hover:translate-x-1",
                                                "text-slate-700", activeListStyle.textHover
                                            )}>
                                                {(course.title.match(/^(\d+)/) ? `${course.title.match(/^(\d+)/)?.[1].padStart(2, '0')}- ` : '') + course.title.replace(/^\d+[.\-\s_:]*/, '').replace(/\s*_\s*/g, ' : ')}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1 md:mt-0.5 lg:mt-0.5 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                                                <span className="text-[10px] sm:text-[10px] md:text-[9px] lg:text-[9px] text-slate-400 font-medium font-sans flex items-center gap-1">
                                                    <BookOpen className="w-3 h-3 sm:w-3 sm:h-3 md:w-2.5 md:h-2.5 lg:w-2.5 lg:h-2.5" />
                                                    {t('videoLibrary.includedTranscript')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Sleek Duration */}
                                        {course.duration && (
                                            <div className={cn("flex-shrink-0 flex flex-col items-end justify-center text-slate-400 transition-transform duration-300 sm:group-hover:-translate-x-1", activeListStyle.textHover)}>
                                                <span className="font-bebas text-lg sm:text-lg md:text-sm lg:text-base tracking-wider pt-1">{course.duration}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm py-20 px-6 text-center mt-4 flex flex-col items-center justify-center">
                            <p className="text-slate-700 text-lg sm:text-xl font-medium">{t('videoLibrary.noVideoTitle')}</p>
                            <p className="text-slate-400 text-sm mt-3">{t('videoLibrary.noVideoSub')}</p>
                        </div>
                    )
                }
            </motion.div >
        </div >
    );
};
