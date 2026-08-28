import React, { useState, useRef, useEffect } from 'react';
import { type VideoCourse, videoCourses as videoCoursesFr, getCategoryTotalDuration } from '../data/videoCourses';
import { videoCourses as videoCoursesEn } from '../data/videoCourses_en';
import { videoCourses as videoCoursesEs } from '../data/videoCourses_es';
import { videoCourses as videoCoursesIt } from '../data/videoCourses_it';
import { videoCourses as videoCoursesDe } from '../data/videoCourses_de';
import { videoCourses as videoCoursesZh } from '../data/videoCourses_zh';
import { videoCourses as videoCoursesJa } from '../data/videoCourses_ja';
import { Play, Clock, BookOpen, X, Lock, FileText, Share2 } from 'lucide-react';
import { cn } from '../utils';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { exportCoursePdf } from '../utils/exportCoursePdf';
import { getCoursePdfUrl } from '../utils/getPdfUrl';
import PDFShareDropdown from './PDFShareDropdown';



interface VideoLibraryListProps {
    onSelectVideo: (video: VideoCourse) => void;
    hasFullAccess?: boolean;
    onLockedVideoClick?: () => void;
}

export const VideoLibraryList: React.FC<VideoLibraryListProps> = ({ onSelectVideo, hasFullAccess = true, onLockedVideoClick }) => {
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
    const [activeTab, setActiveTab] = useState<string>("L'Ectoderme");
    const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
    const [highlightedCourseId, setHighlightedCourseId] = useState<string | null>(null);
    const touchStartPos = useRef<{ x: number, y: number } | null>(null);

    const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    useEffect(() => {
        if (expandedCourseId && itemRefs.current[expandedCourseId]) {
            // Un léger délai permet à Framer Motion de démarrer l'animation 
            // pour qu'il calcule correctement le centrage avec la nouvelle hauteur
            const timeoutId = setTimeout(() => {
                const el = itemRefs.current[expandedCourseId];
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 150);
            return () => clearTimeout(timeoutId);
        }
    }, [expandedCourseId]);

    // Deferred state for the heavy list rendering
    const [selectedLayer, setSelectedLayer] = useState<string>("L'Ectoderme");
    const isPending = false;

    const filteredCourses = videoCourses.filter((v: VideoCourse) => {
        let mappedCategory: string = v.categoryId;
        if (v.categoryId === 'ectoderme') mappedCategory = "L'Ectoderme";
        if (v.categoryId === 'endoderme') mappedCategory = "L'Endoderme";
        if (v.categoryId === 'mesoderme') mappedCategory = "Le Mésoderme";
        if (v.categoryId === 'oeil') mappedCategory = "L'Oeil";
        return selectedLayer === mappedCategory && !v.isGlobalPdf;
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
                    <div className="grid grid-cols-4 items-stretch gap-1 sm:gap-2 w-full max-w-4xl mx-auto px-1 sm:px-2 md:px-0">
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
                                    onTouchStart={(e) => {
                                        touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                                    }}
                                    onTouchEnd={(e) => {
                                        if (!touchStartPos.current) return;
                                        const dx = Math.abs(e.changedTouches[0].clientX - touchStartPos.current.x);
                                        const dy = Math.abs(e.changedTouches[0].clientY - touchStartPos.current.y);
                                        touchStartPos.current = null;
                                        if (dx < 10 && dy < 10) {
                                            if (activeTab !== layer) {
                                                if (e.cancelable) e.preventDefault();
                                                handleLayerSelect();
                                            }
                                        }
                                    }}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center py-2.5 sm:py-3 px-0 min-[375px]:px-1 sm:px-4 md:px-4 lg:px-3 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer touch-manipulation w-full min-w-0 active:scale-[0.98]",
                                        isSelected
                                            ? `shadow-md scale-100 ${style.activeBg} ${style.activeBorder} text-white z-10`
                                            : `${style.unselectedBg} ${style.unselectedBorder} ${style.unselectedText} shadow-sm ${style.hover}`
                                    )}
                                >
                                    <span className={cn(
                                        "pointer-events-none font-bebas text-[12px] min-[375px]:text-[14px] sm:text-xl md:text-lg lg:text-lg tracking-wider leading-[1.1] mb-1 md:mb-1 w-full text-center overflow-hidden text-ellipsis whitespace-nowrap",
                                        isSelected ? "text-white" : style.unselectedText
                                    )}>
                                        {t(`videoLibrary.layers.${tKeys[layer as keyof typeof tKeys]}`)}
                                    </span>

                                    <span className={cn(
                                        "pointer-events-none text-[9px] sm:text-[10px] md:text-[10px] uppercase font-bold truncate w-full px-0 sm:px-1 opacity-80 text-center",
                                        isSelected ? "text-white/80" : style.unselectedText
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
                        filteredCourses.map((course, index) => {
                            const isLocked = !hasFullAccess && index >= 2;

                            const activeListStyle = {
                                "L'Ectoderme": { textHover: "md:group-hover:text-[#5A9C51]", hoverBg: "md:hover:bg-[#5A9C51]/5", whileTapBg: "rgba(90,156,81,0.15)", textColor: "text-[#5A9C51]" },
                                "Le Mésoderme": { textHover: "md:group-hover:text-[#F27D33]", hoverBg: "md:hover:bg-[#F27D33]/5", whileTapBg: "rgba(242,125,51,0.15)", textColor: "text-[#F27D33]" },
                                "L'Endoderme": { textHover: "md:group-hover:text-[#4171B5]", hoverBg: "md:hover:bg-[#4171B5]/5", whileTapBg: "rgba(65,113,181,0.15)", textColor: "text-[#4171B5]" },
                                "L'Oeil": { textHover: "md:group-hover:text-[#F2B729]", hoverBg: "md:hover:bg-[#F2B729]/5", whileTapBg: "rgba(242,183,41,0.15)", textColor: "text-[#F2B729]" },
                            }[selectedLayer] || { textHover: "md:group-hover:text-[#8B1111]", hoverBg: "md:hover:bg-black/[0.02]", whileTapBg: "rgba(0,0,0,0.05)", textColor: "text-slate-300" };

                            const isExpanded = expandedCourseId === course.id;
                            const isHighlighted = highlightedCourseId === course.id;

                            const handleMouseClick = () => {
                                if (isLocked) {
                                    onLockedVideoClick?.();
                                    return;
                                }
                                setExpandedCourseId(isExpanded ? null : course.id);
                                setHighlightedCourseId(null);
                            };

                            const handleTouchTap = () => {
                                if (isLocked) {
                                    onLockedVideoClick?.();
                                    return;
                                }
                                if (isExpanded) {
                                    setExpandedCourseId(null);
                                    setHighlightedCourseId(null);
                                } else if (isHighlighted) {
                                    setExpandedCourseId(course.id);
                                    setHighlightedCourseId(null);
                                } else {
                                    setHighlightedCourseId(course.id);
                                }
                            };

                            const handlePlayTap = (e: React.MouseEvent | React.TouchEvent) => {
                                e.stopPropagation();
                                if (isLocked) {
                                    onLockedVideoClick?.();
                                    return;
                                }
                                if (course.isGlobalPdf) {
                                    const pdfUrl = getCoursePdfUrl(course, i18n.language);
                                    if (pdfUrl) {
                                        window.open(pdfUrl, '_blank');
                                        return;
                                    }
                                }
                                onSelectVideo(course);
                            };

                            const bgColors = {
                                "ectoderme": "#5A9C51",
                                "mesoderme": "#F27D33",
                                "endoderme": "#4171B5",
                                "oeil": "#F2B729"
                            };
                            const categoryColor = bgColors[course.categoryId as keyof typeof bgColors] || "#8B1111";

                            return (
                                <motion.div
                                    key={course.id}
                                    ref={(el: HTMLDivElement | null) => {
                                        if (el) {
                                            itemRefs.current[course.id] = el;
                                        }
                                    }}
                                    layout
                                    variants={itemVariants}
                                    className="w-full relative"
                                    style={{ zIndex: isExpanded ? 50 : 1, marginBottom: isExpanded ? 24 : 0, marginTop: isExpanded ? 24 : 0 }}
                                >
                                    <motion.div
                                        layout
                                        onClick={!isExpanded ? handleMouseClick : undefined}
                                        onTouchStart={!isExpanded ? (e: React.TouchEvent) => {
                                            touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                                        } : undefined}
                                        onTouchEnd={!isExpanded ? (e: React.TouchEvent) => {
                                            if (!touchStartPos.current) return;
                                            const dx = Math.abs(e.changedTouches[0].clientX - touchStartPos.current.x);
                                            const dy = Math.abs(e.changedTouches[0].clientY - touchStartPos.current.y);
                                            touchStartPos.current = null;
                                            if (dx < 10 && dy < 10) {
                                                if (e.cancelable) e.preventDefault();
                                                handleTouchTap();
                                            }
                                        } : undefined}
                                        className={cn(
                                            "w-full text-left flex touch-manipulation transition-all duration-300 overflow-hidden",
                                            isExpanded 
                                                ? "flex-col p-6 sm:p-8 md:p-10 bg-[#FAF6ED] rounded-3xl sm:rounded-[2rem] shadow-2xl border border-slate-200/50" 
                                                : cn(
                                                    "flex-row items-center py-4 sm:py-3 md:py-3 lg:py-2 border-b border-slate-200/60 last:border-0 rounded-xl px-2 sm:px-3 md:px-4 lg:px-3 cursor-pointer group transition-colors",
                                                    activeListStyle.hoverBg
                                                )
                                        )}
                                        whileTap={!isExpanded ? { backgroundColor: activeListStyle.whileTapBg } : {}}
                                        style={!isExpanded ? {
                                            backgroundColor: isHighlighted ? activeListStyle.whileTapBg : undefined,
                                            transition: 'background-color 0.15s ease-out',
                                        } : undefined}
                                    >
                                        <AnimatePresence mode="wait">
                                            {!isExpanded ? (
                                                <motion.div 
                                                    key="collapsed"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                                                    className={cn("flex flex-row items-center w-full", isLocked && "opacity-60 grayscale-[0.3]")}
                                                >
                                                    {/* Minimalist Play/Lock/PDF Icon */}
                                                    <div className="flex-shrink-0 w-10 h-10 sm:w-10 sm:h-10 md:w-8 md:h-8 lg:w-8 lg:h-8 flex items-center justify-center mr-3 sm:mr-4 md:mr-4 lg:mr-3 relative">
                                                        <div className="absolute inset-0 bg-[#F4F1E8] rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] opacity-100"></div>
                                                        {isLocked ? (
                                                            <Lock className={cn("w-4 h-4 sm:w-4 sm:h-4 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 transition-colors relative z-10", activeListStyle.textColor)} strokeWidth={2.5} />
                                                        ) : course.isGlobalPdf ? (
                                                            <FileText className="w-4 h-4 sm:w-4 sm:h-4 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 relative z-10" style={{ color: categoryColor }} strokeWidth={2.5} />
                                                        ) : (
                                                            <Play className={cn("w-4 h-4 sm:w-4 sm:h-4 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 transition-colors translate-x-[1.5px] relative z-10", activeListStyle.textColor)} fill="currentColor" strokeWidth={0} />
                                                        )}
                                                    </div>

                                                    {/* Minimalist Info */}
                                                    <div className="flex-1 min-w-0 pr-2 sm:pr-4">
                                                        <h3 className={cn(
                                                            "text-sm sm:text-base md:text-[14px] lg:text-[13px] font-sans font-medium tracking-wide transition-transform duration-300 uppercase md:group-hover:translate-x-1 leading-snug",
                                                            "text-slate-700", activeListStyle.textHover
                                                        )}>
                                                            {(course.title.match(/^(\d+)/) ? `${course.title.match(/^(\d+)/)?.[1].padStart(2, '0')}- ` : '') + course.title.replace(/^\d+[.\-\s_:]*/, '').replace(/\s*_\s*/g, ' : ')}
                                                        </h3>
                                                        {course.shortSummary && (
                                                            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed px-0.5 group-hover:text-slate-500 transition-colors">
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
                                                        <div className={cn("flex-shrink-0 flex flex-col items-end justify-center transition-transform duration-300 md:group-hover:-translate-x-1", activeListStyle.textColor)}>
                                                            <span className="font-bebas text-lg sm:text-lg md:text-sm lg:text-base tracking-wider pt-1">{course.duration}</span>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ) : (
                                                <motion.div 
                                                    key="expanded"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1, transition: { delay: 0.1 } }}
                                                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                                                    className="flex flex-col w-full h-full"
                                                >
                                                    {/* Top Bar: Title & Duration & Close */}
                                                    <div className="flex justify-between items-start mb-5 relative">
                                                        <div className="flex-1 pr-10">
                                                            <h2 className="text-[20px] sm:text-[24px] md:text-[28px] font-bebas tracking-wide text-slate-800 leading-[1.1]">
                                                                {(course.title.match(/^(\d+)/) ? `${course.title.match(/^(\d+)/)?.[1].padStart(2, '0')}. ` : '') + course.title.replace(/^\d+[.\-\s_:]*/, '').replace(/\s*_\s*/g, ' : ')}
                                                            </h2>
                                                            <div className="flex items-center gap-2 sm:gap-3 mt-3">
                                                                <span className="px-3 py-1 rounded-full text-white font-sans font-bold text-[10px] sm:text-[11px] tracking-widest shadow-sm" style={{ backgroundColor: categoryColor }}>
                                                                    {t('videoLibrary.duration', 'DURÉE')} : {course.duration}
                                                                </span>

                                                                <PDFShareDropdown
                                                                    pdfUrl={getCoursePdfUrl(course, i18n.language)}
                                                                    title={course.title}
                                                                    courseTitle={course.title}
                                                                    accentColor={categoryColor}
                                                                    variant="pill"
                                                                    buttonClassName="shadow-2xs text-[10px] sm:text-[11px] py-1 px-3"
                                                                    course={course}
                                                                />
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setExpandedCourseId(null); setHighlightedCourseId(null); }}
                                                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#EAF0F6] text-[#71869D] hover:text-slate-600 hover:bg-slate-200 transition-colors active:scale-95 absolute top-[-8px] right-[-8px] sm:top-[-4px] sm:right-[-4px]"
                                                        >
                                                            <X size={18} strokeWidth={2.5} />
                                                        </button>
                                                    </div>

                                                    {/* Big Summary */}
                                                    <div className="mb-8">
                                                        <p className="text-base md:text-lg xl:text-xl text-slate-600 leading-[1.7] font-sans font-light">
                                                            {course.shortSummary || course.fullSummary || "Résumé non disponible."}
                                                        </p>
                                                    </div>

                                                    {/* Play / Open PDF Button matching design */}
                                                    <div className="flex items-center justify-center mt-auto pb-1">
                                                        <button 
                                                            onClick={handlePlayTap}
                                                            className="group flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 rounded-[16px] sm:rounded-[18px] transition-all duration-300 transform shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] w-full overflow-hidden relative"
                                                            style={{ backgroundColor: categoryColor }}
                                                        >
                                                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                                            {course.isGlobalPdf ? (
                                                                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" />
                                                            ) : (
                                                                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white relative z-10" />
                                                            )}
                                                            <span className="text-white font-bebas text-[20px] sm:text-2xl tracking-widest pt-0.5 relative z-10">
                                                                {course.isGlobalPdf ? t('videoLibrary.openGlobalPdf', 'OUVRIR LE RECUEIL INTÉGRAL') : t('videoLibrary.playNow', 'DÉMARRER LA VIDÉO')}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
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

            {/* Credits FeelProd */}
            <div className="flex-none w-full flex flex-col items-center justify-end opacity-90 mt-12 mb-20 lg:mb-8">
                <span className="text-[10px] sm:text-sm lg:text-base text-slate-500/80 font-light uppercase tracking-[0.3em] text-center mb-1">
                    {t('home.credits', 'RÉALISATION FEELPROD')}
                </span>
                <div className="w-12 h-[1px] bg-slate-300/50 mt-1 mb-1"></div>
            </div>
        </div >
    );
};
