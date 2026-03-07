import React from 'react';
import { cn } from '../utils';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './ui/LanguageSwitcher';

interface DesktopMenuProps {
    currentView: string;
    setCurrentView: (view: any) => void;
}

export function DesktopMenu({ currentView, setCurrentView }: DesktopMenuProps) {
    const { t } = useTranslation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full h-[60px] bg-[#FAF9F6] border-b border-slate-200 hidden md:flex items-center justify-between px-6 xl:px-12 shadow-sm">
            {/* Brand / Logo Area */}
            <div className="flex flex-1 items-center justify-start">
                <span className="font-bebas text-2xl text-[#F27D33] tracking-widest leading-none pt-1 cursor-pointer" onClick={() => setCurrentView('home')}>
                    EMBRYOLOGIE
                </span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center justify-center gap-2 lg:gap-4 shrink-0">
                <button
                    onClick={() => setCurrentView('home')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide transition-colors",
                        currentView === 'home'
                            ? "bg-[#F27D33] text-white shadow-md"
                            : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                >
                    {t('nav.home', 'Accueil')}
                </button>

                <button
                    onClick={() => setCurrentView('timeline')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide transition-colors",
                        currentView === 'timeline'
                            ? "bg-[#F27D33] text-white shadow-md"
                            : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                >
                    {t('nav.timeline', 'Chronologie')}
                </button>

                <button
                    onClick={() => setCurrentView('video-library')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide transition-colors",
                        currentView === 'video-library' || currentView === 'video-player'
                            ? "bg-[#F27D33] text-white shadow-md"
                            : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                >
                    {t('nav.videos', 'Vidéos')}
                </button>

                <button
                    onClick={() => setCurrentView('embryo-ai')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide transition-colors",
                        currentView === 'embryo-ai'
                            ? "bg-[#F27D33] text-white shadow-md"
                            : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                >
                    {t('nav.ai_assistant', 'Embryo AI')}
                </button>
            </div>

            {/* Language / Tools */}
            <div className="flex flex-1 items-center justify-end">
                <LanguageSwitcher variant="desktop-nav" />
            </div>
        </nav>
    );
}
