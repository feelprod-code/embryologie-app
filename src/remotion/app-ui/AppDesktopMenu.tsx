import React from 'react';

// Basic utility for classnames
export const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export const AppDesktopMenu: React.FC<{ currentView?: string }> = ({ currentView = 'video-library' }) => {
    return (
        <nav className="w-full h-[60px] bg-[#FAF6ED] border-b border-slate-200 hidden lg:flex items-center justify-between px-6 xl:px-12 shadow-sm">
            {/* Empty Left Spacer for centering */}
            <div className="flex flex-1"></div>

            {/* Navigation Links */}
            <div className="flex shrink-0 items-center justify-center gap-2 lg:gap-4">
                <div className={cn("flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide", currentView === 'home' ? "bg-[#F27D33] text-white shadow-md" : "bg-transparent text-slate-600")}>
                    Accueil
                </div>
                <div className={cn("flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide", currentView === 'timeline' ? "bg-[#F27D33] text-white shadow-md" : "bg-transparent text-slate-600")}>
                    Chronologie
                </div>
                <div className={cn("flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide", currentView === 'video-library' ? "bg-[#F27D33] text-white shadow-md" : "bg-transparent text-slate-600")}>
                    Vidéos
                </div>
                <div className={cn("flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide", currentView === 'embryo-ai' ? "bg-[#F27D33] text-white shadow-md" : "bg-transparent text-slate-600")}>
                    Assistant IA
                </div>
            </div>

            {/* Language Switcher Mock */}
            <div className="flex flex-1 items-center justify-end gap-5">
                <div className="flex bg-slate-100 p-0.5 rounded-full border border-slate-200/60 shadow-sm">
                    <div className="flex items-center justify-center px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-slate-800 shadow-sm">FR</div>
                    <div className="flex items-center justify-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500">EN</div>
                </div>
            </div>
        </nav>
    );
};
