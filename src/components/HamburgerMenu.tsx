import React, { useState } from 'react';
import { Menu, X, Home, Clock, MonitorPlay, BookOpen } from 'lucide-react';
import { cn } from '../utils';

interface HamburgerMenuProps {
    currentView: 'home' | 'timeline' | 'podcasts' | 'video-library' | 'video-player' | 'podcast-player';
    onNavigate: (view: 'home' | 'timeline' | 'podcasts' | 'video-library' | 'video-player' | 'podcast-player') => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ currentView, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleNavigate = (view: 'home' | 'timeline' | 'podcasts' | 'video-library' | 'video-player' | 'podcast-player') => {
        onNavigate(view);
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 right-4 md:top-6 md:right-6 z-50 p-3 bg-white rounded-full shadow-md border border-slate-200 text-slate-700 hover:text-primary hover:border-primary transition-all hover:scale-105"
                aria-label="Menu principal"
            >
                <Menu size={24} />
            </button>

            {/* OVERLAY */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* MENU PORTAL */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-100 flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="p-6 flex justify-between items-center border-b border-slate-100">
                    <span className="font-anton text-2xl uppercase tracking-wide text-dark">Menu</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-6 space-y-4">
                    <button
                        onClick={() => handleNavigate('home')}
                        className={cn(
                            "w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bebas text-xl tracking-wide transition-all",
                            currentView === 'home'
                                ? "bg-primary text-white shadow-md"
                                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        )}
                    >
                        <Home size={24} />
                        Accueil
                    </button>

                    <button
                        onClick={() => handleNavigate('timeline')}
                        className={cn(
                            "w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bebas text-xl tracking-wide transition-all",
                            currentView === 'timeline'
                                ? "bg-primary text-white shadow-md"
                                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        )}
                    >
                        <Clock size={24} />
                        Chronologie
                    </button>

                    <button
                        onClick={() => handleNavigate('video-library')}
                        className={cn(
                            "w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bebas text-xl tracking-wide transition-all",
                            currentView === 'video-library' || currentView === 'video-player'
                                ? "bg-dark text-white shadow-md"
                                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        )}
                    >
                        <MonitorPlay size={24} className={currentView === 'video-library' || currentView === 'video-player' ? "text-primary" : ""} />
                        Cours Vidéos
                    </button>

                    <button
                        onClick={() => handleNavigate('podcasts')}
                        className={cn(
                            "w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bebas text-xl tracking-wide transition-all",
                            currentView === 'podcasts' || currentView === 'podcast-player'
                                ? "bg-white text-primary border-2 border-primary shadow-sm"
                                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-2 border-transparent"
                        )}
                    >
                        <BookOpen size={24} />
                        Ressources
                    </button>
                </nav>

                <div className="p-6 border-t border-slate-100 bg-slate-50">
                    <p className="text-center text-sm text-slate-400 font-medium">
                        Embryologie Biodynamique © 2024
                    </p>
                </div>
            </div>
        </>
    );
};
