import React from 'react';
import { Play, BookOpen, Home, Clock, Video, Brain } from 'lucide-react';
import { cn } from './AppDesktopMenu';
import { videoCourses } from '../data/videoCourses';

export const AppVideoLibrary: React.FC<{ 
    simulatedFrame?: number, 
    startScrollFrame?: number, 
    stopScrollFrame?: number,
    selectedCategory?: "ectoderme" | "mesoderme" | "endoderme" | "oeil",
    highlightedIndex?: number,
    forceNoSelectedTab?: boolean
}> = ({ simulatedFrame = 0, startScrollFrame = 0, stopScrollFrame = 1, selectedCategory = "mesoderme", highlightedIndex = -1, forceNoSelectedTab = false }) => {
    
    // We pull the real videos from the real data file!
    const realVideos = videoCourses.filter(v => v.categoryId === selectedCategory);

    // Keep the exact same styles for the tabs based on screenshots
    const tabs = [
        { id: "ectoderme", name: "L'ECTODERME", duration: "9H 5M", text: "text-[#5A9C51]", unselectedBg: "bg-[#5A9C51]/10", unselectedBorder: "border-[#5A9C51]/30", bgColor: "bg-[#5A9C51]", borderColor: "border-[#5A9C51]" },
        { id: "endoderme", name: "L'ENDODERME", duration: "5H 43M", text: "text-[#4171B5]", unselectedBg: "bg-[#4171B5]/10", unselectedBorder: "border-[#4171B5]/30", bgColor: "bg-[#4171B5]", borderColor: "border-[#4171B5]" },
        { id: "mesoderme", name: "LE MÉSODERME", duration: "4H 56M", text: "text-[#F27D33]", unselectedBg: "bg-[#F27D33]/10", unselectedBorder: "border-[#F27D33]/30", bgColor: "bg-[#F27D33]", borderColor: "border-[#F27D33]" },
        { id: "oeil", name: "L'OEIL", duration: "4H 2M", text: "text-[#F2B729]", unselectedBg: "bg-[#F2B729]/10", unselectedBorder: "border-[#F2B729]/30", bgColor: "bg-[#F2B729]", borderColor: "border-[#F2B729]" }
    ];

    // Scroll interpolation if used inside Remotion
    let translateY = 0;
    if (simulatedFrame > startScrollFrame) {
        const progress = Math.min(1, Math.max(0, (simulatedFrame - startScrollFrame) / (stopScrollFrame - startScrollFrame)));
        // 1 video is about 120px height now (with full summary). 
        const maxScroll = Math.max(0, (realVideos.length * 120) - 100); 
        translateY = -maxScroll * progress; 
    }

    return (
        <div className="w-full h-full flex flex-col bg-[#FAF6ED] overflow-hidden relative">
            
            {/* Header Tabs (STICKY) */}
            <div className="w-full bg-[#FAF6ED] pt-12 flex flex-col items-center pb-4 shrink-0 z-30 relative">
                <h1 className="font-bebas text-2xl tracking-widest text-[#1A202C] mb-4">FORMATION COMPLÈTE</h1>
                
                <div className="w-full px-2 sm:px-4">
                    <div className="grid grid-cols-4 items-stretch gap-1 sm:gap-2 w-full max-w-4xl mx-auto">
                        {tabs.map((tab, i) => {
                            const isSelected = !forceNoSelectedTab && tab.id === selectedCategory;
                            return (
                            <div key={i} className={cn(
                                "relative flex flex-col items-center justify-center py-2 px-1 sm:px-2 rounded-xl border transition-all duration-300",
                                isSelected ? `shadow-md ${tab.bgColor} ${tab.borderColor} text-white z-10 scale-[1.03]` : `${tab.unselectedBg} ${tab.unselectedBorder} shadow-sm`
                            )}>
                                <span className={cn("font-bebas text-[11px] sm:text-[14px] tracking-wider leading-none mb-0.5 text-center line-clamp-1", isSelected ? "text-white" : tab.text)}>
                                    {tab.name}
                                </span>
                                <span className={cn("text-[9px] sm:text-[10px] font-bold text-center", isSelected ? "text-white/90" : tab.text)}>
                                    {tab.duration}
                                </span>
                            </div>
                        )})}
                    </div>
                </div>
            </div>

            {/* List of Real Videos (SCROLLABLE AREA) */}
            <div className="flex-1 w-full relative overflow-hidden bg-[#FAF6ED]">
                <div 
                    className="flex flex-col gap-1 w-full max-w-4xl mx-auto px-4 mt-2 pb-24"
                    style={{ transform: `translateY(${translateY}px)` }}
                >
                    {realVideos.map((vid, i) => {
                        // We use the tab's color for the video titles and icons!
                        const colorHex = selectedCategory === "ectoderme" ? "#5A9C51" : 
                                         selectedCategory === "endoderme" ? "#4171B5" : 
                                         selectedCategory === "mesoderme" ? "#F27D33" : "#F2B729";
                                         
                        const isHighlighted = highlightedIndex === i;
                        
                        return (
                            <div 
                                key={i} 
                                className={cn(
                                    "w-full text-left flex flex-row items-start py-4 relative rounded-xl transition-all duration-500",
                                    isHighlighted ? "bg-[#FFF3CD] px-3 -ml-3 shadow-sm border border-yellow-200/50" : ""
                                )}
                            >
                                {/* Thin subtle separator if not first and not highlighted */}
                                {i !== 0 && !isHighlighted && <div className="absolute top-0 left-12 right-0 h-[1px] bg-slate-200/40"></div>}
                                
                                <div className="w-8 h-8 flex items-center justify-center mr-3 shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm border border-slate-100">
                                        <Play className="w-4 h-4 translate-x-[1px]" style={{color: colorHex}} fill="currentColor" strokeWidth={1} />
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0 pr-3">
                                    <h3 className="text-[13px] font-sans font-bold uppercase text-[#2D3748] leading-tight mb-1">
                                        {(() => {
                                            const baseTitle = `${String(i + 1).padStart(2, '0')}- ${vid.title.replace(/^\d+[\.\-]\s*/, '').replace(/^0\d+[\.\-]\s*/, '')}`.toUpperCase();
                                            if (baseTitle.includes("& GÉNÉRALITÉS 2")) {
                                                return <>{baseTitle.replace("& GÉNÉRALITÉS 2", "")}<br/>& GÉNÉRALITÉS 2</>;
                                            }
                                            if (baseTitle.includes("& GÉNÉRALITÉS 1")) {
                                                return <>{baseTitle.replace("& GÉNÉRALITÉS 1", "")}<br/>& GÉNÉRALITÉS 1</>;
                                            }
                                            if (baseTitle.includes("SYSTÈMES, LES 5 PHASES")) {
                                                const parts = baseTitle.split("SYSTÈMES, LES 5 PHASES");
                                                return <>{parts[0]}SYSTÈMES,<br/>LES 5 PHASES{parts[1]}</>;
                                            }
                                            return baseTitle;
                                        })()}
                                    </h3>
                                    
                                    {/* Résumé visible, non tronqué */}
                                    <p className="text-[11px] text-[#A0AEC0] font-sans mt-1 leading-snug">
                                        {vid.shortSummary || vid.fullSummary || "Résumé non disponible."}
                                    </p>

                                    <div className="flex items-center gap-1 mt-2 mb-1">
                                        <BookOpen className="w-3 h-3 text-[#CBD5E0]" />
                                        <span className="text-[10px] text-[#A0AEC0] font-medium font-sans">
                                            Transcription incluse
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-shrink-0 flex flex-col items-end">
                                    <span className="font-bebas text-[16px] tracking-wider pt-0.5" style={{color: colorHex}}>{vid.duration}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* STATIC MOBILE BOTTOM NAVIGATION (7 ITEMS) */}
            <nav className="absolute bottom-0 w-full bg-[#FAF6ED]/95 backdrop-blur-xl border-t border-slate-200 pb-[24px] shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.05)] flex justify-between px-2 pt-3 z-40">
                <div className="flex flex-col items-center flex-1 text-slate-500">
                    <Home size={20} strokeWidth={2} />
                    <span className="mt-1 text-[8px] font-medium text-center">Accueil</span>
                </div>
                <div className="flex flex-col items-center flex-1 text-slate-500">
                    <Clock size={20} strokeWidth={2} />
                    <span className="mt-1 text-[8px] font-medium text-center">Chronologie</span>
                </div>
                <div className="flex flex-col items-center flex-1 text-[#F27D33]">
                    <Video size={20} strokeWidth={2.5} fill="currentColor" opacity={0.2} />
                    <div className="absolute opacity-100 mt-[1px]"><Video size={20} strokeWidth={2.5} color="#F27D33" /></div>
                    <span className="mt-1 text-[8px] font-bold text-center relative top-[1px]">Vidéos</span>
                </div>
                <div className="flex flex-col items-center flex-1 text-slate-500">
                    <Brain size={20} strokeWidth={2} />
                    <span className="mt-1 text-[8px] font-medium text-center truncate">Assistant ...</span>
                </div>
                <div className="flex flex-col items-center flex-1 text-slate-500">
                    {/* Drapeau FR fake SVG */}
                    <div className="w-5 h-5 rounded-full overflow-hidden flex border border-slate-200">
                        <div className="flex-1 bg-blue-700 h-full"></div>
                        <div className="flex-1 bg-white h-full"></div>
                        <div className="flex-1 bg-red-600 h-full"></div>
                    </div>
                    <span className="mt-1 text-[8px] font-medium text-center">FR</span>
                </div>
            </nav>

        </div>
    );
};
