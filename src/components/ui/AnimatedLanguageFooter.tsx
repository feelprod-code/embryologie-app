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
    <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs font-bold text-[#A06C50] uppercase tracking-[0.2em] w-full max-w-[320px]">
      <div className="flex justify-end items-center text-right">
        <span>{t('home.available_in', "Disponible en")}</span>
      </div>
      <div className="relative h-5 sm:h-6 overflow-hidden flex justify-start items-center text-left">
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
