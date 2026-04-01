import React from 'react';
import { Pause, ChevronLeft, ChevronRight, Video as VideoIcon, DownloadCloud, Home, Clock, Brain, LogOut } from 'lucide-react';
import { Video, staticFile } from 'remotion';

export interface AppVideoPlayerProps {
    title?: string;
    duration?: string;
    summary?: string;
    videoSrc?: string;
    themeColor?: string;
    categoryId?: "ectoderme" | "mesoderme" | "endoderme" | "oeil";
}

export const AppVideoPlayer: React.FC<AppVideoPlayerProps> = ({
    title = "02 - Tube Neural et Crêtes Neurales",
    duration = "08:15",
    summary = "La formation de la gouttière neurale. Dès le 20ème jour, la plaque neurale commence à s'invaginer le long de son axe central. On observe un soulèvement des bords latéraux qui forment les bourrelets neuraux.",
    videoSrc,
    themeColor = "#F2B729", // Default to yellow for 'Oeil' category
    categoryId = "oeil"
}) => {
    const tabs = [
        { id: "ectoderme", name: "L'ECTODERME", duration: "9H 5M", text: "text-[#5A9C51]", unselectedBg: "bg-[#5A9C51]/10", unselectedBorder: "border-[#5A9C51]/30", bgColor: "bg-[#5A9C51]", borderColor: "border-[#5A9C51]" },
        { id: "endoderme", name: "L'ENDODERME", duration: "5H 43M", text: "text-[#4171B5]", unselectedBg: "bg-[#4171B5]/10", unselectedBorder: "border-[#4171B5]/30", bgColor: "bg-[#4171B5]", borderColor: "border-[#4171B5]" },
        { id: "mesoderme", name: "LE MÉSODERME", duration: "4H 56M", text: "text-[#F27D33]", unselectedBg: "bg-[#F27D33]/10", unselectedBorder: "border-[#F27D33]/30", bgColor: "bg-[#F27D33]", borderColor: "border-[#F27D33]" },
        { id: "oeil", name: "L'OEIL", duration: "4H 2M", text: "text-[#F2B729]", unselectedBg: "bg-[#F2B729]/10", unselectedBorder: "border-[#F2B729]/30", bgColor: "bg-[#F2B729]", borderColor: "border-[#F2B729]" }
    ];

    return (
        <div className="w-full flex-1 flex flex-col items-center justify-start h-full p-4 pt-10 gap-4 bg-[#FAF6ED]">
            {/* Top Tabs */}
            <div className="w-full px-2 sm:px-4 shrink-0 -mt-2 mb-2">
                <div className="grid grid-cols-4 items-stretch gap-1 sm:gap-2 w-full max-w-4xl mx-auto">
                    {tabs.map((tab, i) => {
                        const isSelected = tab.id === categoryId;
                        return (
                            <div key={i} className={
                                `relative flex flex-col items-center justify-center py-2 px-1 sm:px-2 rounded-xl border transition-all duration-300 ` + 
                                (isSelected ? `shadow-md ${tab.bgColor} ${tab.borderColor} text-white z-10 scale-[1.03]` : `${tab.unselectedBg} ${tab.unselectedBorder} shadow-sm`)
                            }>
                                <span className={`font-bebas text-[11px] sm:text-[14px] tracking-wider leading-none mb-0.5 text-center line-clamp-1 ${isSelected ? "text-white" : tab.text}`}>
                                    {tab.name}
                                </span>
                                <span className={`text-[9px] sm:text-[10px] font-bold text-center ${isSelected ? "text-white/90" : tab.text}`}>
                                    {tab.duration}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top Video Area */}
            <div className="w-full max-w-4xl flex flex-col items-center justify-center">
                {/* Fake Video Player Container */}
                <div className="relative aspect-video w-full rounded-2xl md:rounded-3xl shadow-xl border border-slate-800 bg-black flex items-center justify-center overflow-hidden">
                    {/* Actual Video Playback */}
                    {videoSrc && (
                        <div className="absolute inset-0 z-0">
                            <Video src={staticFile(videoSrc)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}
                    
                    {/* Fake Subtitles */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-10">
                        <span className="text-slate-700 bg-[#FAF6ED]/95 px-3 py-1.5 rounded-xl mx-2 text-center font-sans shadow-md font-medium text-xs md:text-sm max-w-[80%]">
                            {summary.substring(0, 60)}...
                        </span>
                    </div>

                    {/* Fake Player Bottom Gradient */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end gap-1 z-10">
                        <div className="flex items-center gap-3 w-full">
                            <span className="text-white/90 text-xs font-medium min-w-[36px] text-left">00:00</span>
                            <div className="relative flex-1 h-3 flex items-center">
                                <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                                    <div className="h-full w-[35%]" style={{ backgroundColor: themeColor }} />
                                </div>
                                <div className="absolute h-3 w-3 bg-white rounded-full shadow border border-slate-300 transform -translate-x-1/2 left-[35%]" />
                            </div>
                            <span className="text-white/90 text-xs font-medium min-w-[36px] text-right">{duration}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-4 text-white">
                                <Pause size={20} fill="currentColor" />
                                <span className="font-bebas tracking-wide mt-1">1x</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Single Line Controls below video */}
                <div className="bg-[#FAF6ED] p-2 rounded-xl shadow-sm border border-slate-200 w-full mt-2 lg:max-w-4xl flex justify-between items-center relative min-h-[44px]">
                    <div className="flex items-center gap-1 z-10">
                        <div 
                            className="flex items-center justify-center py-1.5 px-4 rounded-lg text-sm font-bold"
                            style={{ backgroundColor: `${themeColor}1A`, color: themeColor, borderColor: `${themeColor}33`, borderWidth: 1 }}
                        >x1</div>
                        <div className="flex items-center justify-center py-1.5 px-4 rounded-lg text-sm font-bold text-slate-500 hover:bg-[#FAF6ED]">x1.25</div>
                    </div>
                    
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-3 z-10">
                        <div className="flex items-center justify-center py-1.5 w-24 text-slate-600 rounded-lg border border-slate-200"><ChevronLeft size={20}/></div>
                        <div className="flex items-center justify-center py-1.5 w-24 text-slate-600 rounded-lg border border-slate-200"><ChevronRight size={20}/></div>
                    </div>

                    <div className="flex items-center justify-end z-10 pr-2">
                        <DownloadCloud size={20} className="text-slate-500" />
                    </div>
                </div>
            </div>

            {/* Bottom Transcript Area */}
            <div className="w-full max-w-4xl bg-[#FAF6ED] rounded-2xl shadow-sm border border-slate-200 flex flex-col pt-0 relative overflow-hidden flex-1">
                <div className="bg-[#FAF6ED] border-b border-slate-200 p-2 shadow-sm w-full flex items-center justify-between">
                    <div className="flex flex-row items-center px-2 gap-2">
                        <h3 className="font-anton text-[15px] tracking-wide uppercase" style={{ color: themeColor }}>{title}</h3>
                    </div>
                    <div className="flex items-center gap-3 pr-2">
                        <span className="font-bebas text-base tracking-wider pt-0.5" style={{ color: themeColor }}>{duration}</span>
                    </div>
                </div>
                
                <div className="flex justify-center py-2 bg-[#FAF6ED]/50 border-b border-slate-100">
                    <div className="bg-slate-100/80 p-1 rounded-lg flex items-center">
                        <div className="px-6 py-1.5 text-sm font-medium rounded-md bg-white text-slate-800 shadow-sm">Résumé</div>
                        <div className="px-6 py-1.5 text-sm font-medium rounded-md text-slate-500">Re-transcription interactive</div>
                    </div>
                </div>

                <div className="flex-1 p-6 pr-12 overflow-hidden relative">
                    <div className="prose prose-slate max-w-none">
                        <p className="text-slate-600 leading-relaxed text-[15px] mb-2">
                            {summary}
                        </p>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF6ED] to-transparent pointer-events-none" />
                </div>
            </div>

            {/* Bottom Tab Bar (Matching Real App) */}
            <nav className="bg-[#FAF6ED]/95 backdrop-blur-xl border-t border-slate-200 flex justify-between items-center w-full px-2 shrink-0 z-50 pb-[env(safe-area-inset-bottom,16px)] mt-4">
                <div className="flex flex-col items-center justify-start pt-3 pb-2 gap-1 text-slate-600 flex-1">
                    <Home size={24} />
                    <span className="text-[9px] tracking-wide transition-all font-normal whitespace-nowrap truncate w-full text-center px-0.5">Accueil</span>
                </div>
                <div className="flex flex-col items-center justify-start pt-3 pb-2 gap-1 text-slate-600 flex-1">
                    <Clock size={24} />
                    <span className="text-[9px] tracking-wide transition-all font-normal whitespace-nowrap truncate w-full text-center px-0.5">Chronologie</span>
                </div>
                <div className="flex flex-col items-center justify-start pt-3 pb-2 gap-1 text-slate-800 flex-1">
                    <div className="scale-105">
                        <VideoIcon size={24} style={{ color: themeColor }} />
                    </div>
                    <span className="text-[9px] tracking-wide transition-all font-bold whitespace-nowrap truncate w-full text-center px-0.5" style={{ color: themeColor }}>Vidéos</span>
                </div>
                <div className="flex flex-col items-center justify-start pt-3 pb-2 gap-1 text-slate-600 flex-1">
                    <Brain size={24} />
                    <span className="text-[9px] tracking-wide transition-all font-normal whitespace-nowrap truncate w-full text-center px-0.5">Assistant IA</span>
                </div>
                <div className="flex flex-col items-center justify-start pt-3 pb-2 gap-1 text-red-500 flex-1">
                    <LogOut size={24} className="text-red-400" />
                    <span className="text-[9px] tracking-wide transition-all font-normal whitespace-nowrap truncate w-full text-center px-0.5 text-red-500">Quitter</span>
                </div>
                <div className="flex flex-col items-center justify-start pt-3 pb-3 gap-1 text-slate-600 flex-1">
                    <div className="w-[20px] h-[20px] rounded-full overflow-hidden flex border border-slate-200 mt-0.5 shrink-0">
                        <div className="flex-1 bg-blue-700 h-full"></div>
                        <div className="flex-1 bg-white h-full"></div>
                        <div className="flex-1 bg-red-600 h-full"></div>
                    </div>
                    <span className="text-[9px] tracking-wide transition-all font-normal w-full text-center">FR</span>
                </div>
            </nav>
        </div>
    );
};
