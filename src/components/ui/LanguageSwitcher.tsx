import { useTranslation } from 'react-i18next';
import { cn } from '../../utils';
import { useState, useRef, useEffect } from 'react';

const languages = [
    { code: 'fr', label: 'Français', flag: <img src="/icons/flag-fr.svg" alt="FR" className="w-full h-full object-cover" /> },
    { code: 'en', label: 'English', flag: <img src="/icons/flag-gb.svg" alt="EN" className="w-full h-full object-cover" /> },
    { code: 'es', label: 'Español', flag: <img src="/icons/flag-es.svg" alt="ES" className="w-full h-full object-cover" /> },
    { code: 'it', label: 'Italiano', flag: <img src="/icons/flag-it.svg" alt="IT" className="w-full h-full object-cover" /> },
    { code: 'de', label: 'Deutsch', flag: <img src="/icons/flag-de.svg" alt="DE" className="w-full h-full object-cover" /> },
    { code: 'zh', label: '中文', flag: <img src="/icons/flag-cn.svg" alt="ZH" className="w-full h-full object-cover" /> },
    { code: 'ja', label: '日本語', flag: <img src="/icons/flag-jp.svg" alt="JA" className="w-full h-full object-cover" /> }
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
                    "flex flex-col items-center justify-start transition-all duration-200 group active:scale-95 w-full",
                    variant === 'bottom-nav' ? "pt-3 pb-2 gap-1 overflow-hidden" : "w-10 h-10 rounded-full hover:bg-slate-100 justify-center"
                )}
                aria-label="Changer de langue"
            >
                <div className={cn(
                    "flex px-1 items-center justify-center transition-transform duration-200",
                    variant === 'bottom-nav' ? "h-[24px]" : ""
                )}>
                    <div className={cn(
                        "overflow-hidden flex items-center justify-center rounded-full shadow-[0_0_0_0.5px_rgba(0,0,0,0.05)] bg-slate-50",
                        variant === 'bottom-nav' ? "w-[24px] h-[24px]" : "w-7 h-7"
                    )}>
                        {activeLang.flag}
                    </div>
                </div>
                {variant === 'bottom-nav' && (
                    <span className={cn("mt-auto text-[10px] tracking-wide transition-all font-normal text-slate-400 group-hover:text-slate-600 whitespace-nowrap truncate w-full text-center px-0.5")}>
                        {activeLang.code.toUpperCase()}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className={cn(
                        "absolute right-0 flex flex-col bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-xl overflow-hidden min-w-[130px] z-[60] animate-in fade-in zoom-in-95 duration-100",
                        variant === 'bottom-nav' ? "bottom-full mb-4 origin-bottom-right shadow-[0_4px_24px_-8px_rgba(0,0,0,0.3)] right-2" : "top-full mt-2 origin-top-right"
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
