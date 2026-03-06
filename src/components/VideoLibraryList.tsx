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
    onClose?: () => void;
}

export const VideoLibraryList: React.FC<VideoLibraryListProps> = ({ onSelectVideo, onClose }) => {
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
            <div className="sticky top-0 md:top-[68px] z-50 w-[100vw] md:w-full bg-[#FAF9F6] -mx-2 sm:-mx-6 lg:mx-0 pt-[env(safe-area-inset-top,4px)] md:pt-2 flex flex-col items-center shadow-sm md:shadow-none pb-2 md:pb-0 mb-4 px-2">
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 relative w-full text-center animate-fade-in-up pb-1">
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="hidden md:flex md:absolute md:left-4 items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 px-6 py-2 rounded-full font-bebas tracking-widest transition-colors shadow-sm active:scale-95 text-base shrink-0"
                        >
                            {t('videoLibrary.backToHome')}
                        </button>
                    )}
                    <div className="inline-flex items-center justify-center px-4 sm:px-8 py-2 sm:py-3 rounded-full mb-0 whitespace-nowrap max-w-[95vw] md:max-w-full overflow-hidden">
                        <span className="font-bebas font-normal text-xl min-[380px]:text-2xl sm:text-3xl md:text-4xl uppercase tracking-widest truncate leading-none pt-1 drop-shadow-sm text-slate-800">
                            {t('videoLibrary.completeFormation')}
                        </span>
                    </div>
                </div>

                {/* Category Pills (identical spacing to Timeline) */}
                <div className="w-[100vw] md:w-full overflow-x-auto no-scrollbar -mx-2 sm:-mx-6 lg:mx-0 pb-3 pt-3 mt-1 border-t border-slate-100 snap-x">
                    <div className="flex flex-nowrap items-stretch gap-2 px-4 w-max mx-auto">
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
                                        "relative flex flex-col items-center justify-center py-3 px-2 rounded-[1.2rem] min-w-[120px] sm:min-w-[140px] border shrink-0 snap-center transition-all duration-300 cursor-pointer touch-manipulation active:scale-95",
                                        isSelected
                                            ? `shadow-md scale-100 ${style.activeBg} ${style.activeBorder} text-white`
                                            : `${style.unselectedBg} ${style.unselectedBorder} ${style.unselectedText} shadow-sm ${style.hover}`
                                    )}
                                >
                                    <span className={cn(
                                        "font-bebas text-lg sm:text-xl tracking-wider leading-none mb-1 whitespace-nowrap",
                                        isSelected ? "text-white" : style.unselectedText
                                    )}>
                                        {t(`videoLibrary.layers.${tKeys[layer as keyof typeof tKeys]}`)}
                                    </span>

                                    <span className={cn(
                                        "text-[10px] uppercase font-bold truncate w-full px-2 opacity-80 text-center",
                                        isSelected ? "text-white/80" : style.unselectedText
                                    )}>
                                        <Clock size={10} className="inline mr-1 mb-[1px]" />
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
                className="flex flex-col gap-3 sm:gap-4 w-full max-w-4xl mx-auto"
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
                                            "group relative w-full text-left flex flex-row items-center py-4 sm:py-5 border-b border-slate-200/60 last:border-0 active:scale-[0.99] transition-all duration-300 cursor-pointer overflow-hidden touch-manipulation px-2 sm:px-4 rounded-xl sm:rounded-2xl",
                                            activeListStyle.rowBgHover
                                        )}
                                    >
                                        {/* Effet de tap natif pour mobile */}
                                        <div className="absolute inset-0 bg-slate-900 opacity-0 active:opacity-[0.03] transition-opacity duration-[50ms]"></div>

                                        {/* Minimalist Play Icon */}
                                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mr-3 sm:mr-5">
                                            <div className={cn("w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-[inset_0_1px_4px_rgba(0,0,0,0.05)] bg-slate-100/50 transition-all duration-300 group-hover:scale-110", activeListStyle.bgHover)}>
                                                <Play className={cn("w-4 h-4 sm:w-5 sm:h-5 text-slate-300 transition-colors translate-x-[1px]", activeListStyle.textHover)} fill="currentColor" strokeWidth={1} />
                                            </div>
                                        </div>

                                        {/* Minimalist Info */}
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h3 className={cn(
                                                "text-sm sm:text-lg lg:text-xl font-sans font-medium tracking-wide truncate transition-transform duration-300 uppercase sm:group-hover:translate-x-1",
                                                "text-slate-700", activeListStyle.textHover
                                            )}>
                                                {(course.title.match(/^(\d+)/) ? `${course.title.match(/^(\d+)/)?.[1].padStart(2, '0')}- ` : '') + course.title.replace(/^\d+[.\-\s_:]*/, '').replace(/\s*_\s*/g, ' : ')}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                                                <span className="text-[10px] sm:text-xs text-slate-400 font-medium font-sans flex items-center gap-1">
                                                    <BookOpen size={10} />
                                                    {t('videoLibrary.includedTranscript')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Sleek Duration */}
                                        {course.duration && (
                                            <div className={cn("flex-shrink-0 flex flex-col items-end justify-center text-slate-400 transition-transform duration-300 sm:group-hover:-translate-x-1", activeListStyle.textHover)}>
                                                <span className="font-bebas text-lg sm:text-xl tracking-wider pt-1">{course.duration}</span>
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
