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
    <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold text-[#A06C50] uppercase tracking-[0.2em]">
      <span>{t('home.available_in', "Disponible en")}</span>
      <div className="relative w-28 sm:w-36 h-5 sm:h-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={LANGUAGES[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 flex items-center text-[#F27D33]"
          >
            {LANGUAGES[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};
