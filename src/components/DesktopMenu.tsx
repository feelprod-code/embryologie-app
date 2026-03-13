
import { cn } from '../utils';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './ui/LanguageSwitcher';

import { LogOut } from 'lucide-react';

interface DesktopMenuProps {
    currentView: string;
    setCurrentView: (view: any) => void;
    isAdmin?: boolean;
    onLogout?: () => void;
}

export function DesktopMenu({ currentView, setCurrentView, isAdmin, onLogout }: DesktopMenuProps) {
    const { t } = useTranslation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full h-[60px] bg-[#FAF6ED] border-b border-slate-200 hidden lg:flex items-center justify-between px-6 xl:px-12 shadow-sm">
            {/* Empty Left Spacer for centering */}
            <div className="flex flex-1"></div>

            {/* Navigation Links (Centered without logo) */}
            <div className="flex shrink-0 items-center justify-center gap-2 lg:gap-4">
                <button
                    onClick={() => setCurrentView('home')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide transition-colors",
                        currentView === 'home'
                            ? "bg-[#F27D33] text-white shadow-md"
                            : "bg-transparent text-slate-600 hover:bg-[#F5F1E8] hover:text-slate-900"
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
                            : "bg-transparent text-slate-600 hover:bg-[#F5F1E8] hover:text-slate-900"
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
                            : "bg-transparent text-slate-600 hover:bg-[#F5F1E8] hover:text-slate-900"
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
                            : "bg-transparent text-slate-600 hover:bg-[#F5F1E8] hover:text-slate-900"
                    )}
                >
                    {t('nav.ai_assistant', 'Assistant IA')}
                </button>

                {isAdmin && (
                    <button
                        onClick={() => setCurrentView('admin')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide transition-colors",
                            currentView === 'admin'
                                ? "bg-[#F27D33] text-white shadow-md"
                                : "bg-transparent text-slate-600 hover:bg-[#F5F1E8] hover:text-slate-900"
                        )}
                    >
                        Admin
                    </button>
                )}
            </div>

            {/* Language / Tools */}
            <div className="flex flex-1 items-center justify-end gap-5">
                <LanguageSwitcher variant="desktop-nav" />
                {onLogout && (
                    <button
                        onClick={onLogout}
                        className="flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                        title="Se déconnecter"
                    >
                        <LogOut size={20} />
                    </button>
                )}
            </div>
        </nav>
    );
}
