import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  'Français',
  'English',
  'Español',
  'Italiano',
  'Deutsch',
  '中文',
  '日本語'
];

export const AnimatedLanguageFooter = () => {
  const [index, setIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    // Changement toutes les 800ms
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LANGUAGES.length);
    }, 800); 

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2.5 text-[11px] xs:text-xs promax:text-[13.5px] sm:text-[15px] md:text-base lg:text-[13px] ipad-13:text-xl font-bold text-[#A06C50] uppercase tracking-[0.2em] w-full max-w-[340px] sm:max-w-[440px] md:max-w-[480px] ipad-13:max-w-[560px] translate-x-5 sm:translate-x-6">
      <div className="flex justify-end items-center text-right whitespace-nowrap">
        <span>{t('home.available_in', "Disponible en")}</span>
      </div>
      <div className="relative h-6 sm:h-7 md:h-8 ipad-13:h-9 overflow-hidden flex justify-start items-center text-left">
        <AnimatePresence mode="wait">
          <motion.span
            key={LANGUAGES[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 flex items-center text-[#F27D33] whitespace-nowrap"
          >
            {LANGUAGES[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};
