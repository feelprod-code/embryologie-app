import { useTranslation } from 'react-i18next';
import { cn } from '../../utils';
import { useState, useRef, useEffect } from 'react';

const languages = [
    { code: 'fr', flag: '🇫🇷', label: 'Français' },
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'es', flag: '🇪🇸', label: 'Español' },
];

export function LanguageSwitcher({ variant = 'desktop-nav' }: { variant?: 'desktop-nav' | 'bottom-nav' }) {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const currentLang = typeof i18n.language === 'string' ? i18n.language : 'fr';
    const activeLang = languages.find(l => currentLang.startsWith(l.code)) || languages[0];

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            {/* Trigger Button - A circle containing the flag */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-center rounded-full transition-all duration-200 border",
                    variant === 'bottom-nav'
                        ? "w-8 h-8 bg-white shadow-sm border-slate-200/80 active:scale-95"
                        : "w-10 h-10 bg-white/80 border-slate-200 shadow-sm hover:bg-white hover:shadow"
                )}
                aria-label="Changer de langue"
            >
                <span className={cn("drop-shadow-sm transition-transform", isOpen && "scale-110", variant === 'bottom-nav' ? "text-base" : "text-xl")}>
                    {activeLang.flag}
                </span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className={cn(
                        "absolute right-0 flex flex-col bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-xl overflow-hidden min-w-[130px] z-50 animate-in fade-in zoom-in-95 duration-100",
                        variant === 'bottom-nav' ? "bottom-full mb-3 origin-bottom-right" : "top-full mt-3 origin-top-right"
                    )}
                >
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                i18n.changeLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 active:bg-slate-100",
                                activeLang.code === lang.code ? "text-[#F27D33] bg-orange-50/50" : "text-slate-700"
                            )}
                        >
                            <span className="text-xl drop-shadow-sm">{lang.flag}</span>
                            <span>{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
