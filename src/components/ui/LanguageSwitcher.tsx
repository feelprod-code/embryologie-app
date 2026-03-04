import { useTranslation } from 'react-i18next';
import { cn } from '../../utils';
import { useState } from 'react';

const languages = [
    { code: 'fr', flag: '🇫🇷', label: 'FR' },
    { code: 'en', flag: '🇬🇧', label: 'EN' },
    { code: 'es', flag: '🇪🇸', label: 'ES' },
];

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const currentLang = i18n.language || 'fr';
    const [isOpen, setIsOpen] = useState(false);

    const activeLang = languages.find(l => currentLang.startsWith(l.code)) || languages[0];

    return (
        <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[60]">
            <div
                className={cn(
                    "flex flex-col items-center bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-lg rounded-full overflow-hidden transition-all duration-300",
                    isOpen ? "h-auto py-2" : "h-[42px] cursor-pointer"
                )}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Active/Top Item */}
                <div className="w-[42px] h-[42px] flex items-center justify-center shrink-0 transition-transform">
                    <span className="text-xl drop-shadow-sm">{activeLang.flag}</span>
                </div>

                {/* Dropdown Items */}
                <div
                    className={cn(
                        "flex flex-col items-center gap-2 overflow-hidden transition-all duration-300 w-[42px]",
                        isOpen ? "opacity-100 max-h-40 mt-1" : "opacity-0 max-h-0"
                    )}
                >
                    {languages.filter(l => l.code !== activeLang.code).map((lang) => (
                        <button
                            key={lang.code}
                            onClick={(e) => {
                                e.stopPropagation();
                                i18n.changeLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                            aria-label={`Change language to ${lang.label}`}
                        >
                            <span className="text-xl drop-shadow-sm opacity-80 hover:opacity-100 transition-opacity">{lang.flag}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
