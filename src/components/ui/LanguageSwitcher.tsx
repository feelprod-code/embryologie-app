import { useTranslation } from 'react-i18next';
import { cn } from '../../utils';
import { useState, useRef, useEffect } from 'react';

const languages = [
    {
        code: 'fr',
        label: 'Français',
        flag: (
            <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <mask id="mask_fr" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
                    <circle cx="256" cy="256" r="256" fill="white" />
                </mask>
                <g mask="url(#mask_fr)">
                    <rect width="170.6" height="512" fill="#002395" />
                    <rect x="170.6" width="170.6" height="512" fill="#FFFFFF" />
                    <rect x="341.3" width="171.4" height="512" fill="#ED2939" />
                </g>
            </svg>
        )
    },
    {
        code: 'en',
        label: 'English',
        flag: (
            <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <mask id="mask_en" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
                    <circle cx="256" cy="256" r="256" fill="white" />
                </mask>
                <g mask="url(#mask_en)">
                    <rect width="512" height="512" fill="#012169" />
                    <path d="M0 0 L512 512 M512 0 L0 512" stroke="#FFFFFF" strokeWidth="60" />
                    <path d="M0 0 L512 512 M512 0 L0 512" stroke="#C8102E" strokeWidth="40" />
                    <path d="M256 0 V512 M0 256 H512" stroke="#FFFFFF" strokeWidth="100" />
                    <path d="M256 0 V512 M0 256 H512" stroke="#C8102E" strokeWidth="60" />
                </g>
            </svg>
        )
    },
    {
        code: 'es',
        label: 'Español',
        flag: (
            <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <mask id="mask_es" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
                    <circle cx="256" cy="256" r="256" fill="white" />
                </mask>
                <g mask="url(#mask_es)">
                    <rect width="512" height="128" fill="#AA151B" />
                    <rect y="128" width="512" height="256" fill="#F1BF00" />
                    <rect y="384" width="512" height="128" fill="#AA151B" />
                    <circle cx="160" cy="256" r="50" fill="#AA151B" opacity="0.8" />
                </g>
            </svg>
        )
    },
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
            {/* Trigger Button - A circle containing the flag exactly the size of other icons (e.g. 24px inner for mobile) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex flex-col items-center justify-center transition-all duration-200 group active:scale-95",
                    variant === 'bottom-nav' ? "pt-3 pb-2 gap-1 w-full" : "w-10 h-10 rounded-full hover:bg-slate-100"
                )}
                aria-label="Changer de langue"
            >
                <div className={cn(
                    "transition-transform duration-200 overflow-hidden flex items-center justify-center rounded-full shadow-[0_0_0_0.5px_rgba(0,0,0,0.05)] bg-slate-50",
                    variant === 'bottom-nav' ? "w-6 h-6" : "w-7 h-7"
                )}>
                    {activeLang.flag}
                </div>
                {variant === 'bottom-nav' && (
                    <span className={cn("text-[10px] tracking-wide transition-all font-normal text-slate-400 group-hover:text-slate-600")}>
                        {activeLang.code.toUpperCase()}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className={cn(
                        "absolute right-0 flex flex-col bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-xl overflow-hidden min-w-[130px] z-50 animate-in fade-in zoom-in-95 duration-100",
                        variant === 'bottom-nav' ? "bottom-full mb-2 origin-bottom-right" : "top-full mt-2 origin-top-right"
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
                            <div className="w-5 h-5 rounded-full overflow-hidden shadow-[0_0_0_0.5px_rgba(0,0,0,0.05)] bg-slate-50 flex-shrink-0">
                                {lang.flag}
                            </div>
                            <span>{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
