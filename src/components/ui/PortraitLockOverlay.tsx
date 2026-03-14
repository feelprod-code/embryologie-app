import React from 'react';
import { Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const PortraitLockOverlay: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="portrait-lock-overlay fixed inset-0 z-[9999999] bg-[#FAF6ED] flex-col items-center justify-center p-8 text-center overscroll-none touch-none hidden">
      <div className="mb-6 animate-pulse">
        <Smartphone size={80} className="text-[#F27D33] -rotate-90" strokeWidth={1.5} />
      </div>
      <h2 className="text-4xl font-bebas text-slate-800 tracking-wide mb-4">
        {t('app.portrait_required', 'Mode Portrait Requis')}
      </h2>
      <p className="text-slate-600 font-medium max-w-sm text-lg leading-relaxed">
        {t('app.portrait_desc', 'Pour une expérience optimale, veuillez tourner votre téléphone à la verticale.')}
      </p>
    </div>
  );
};
