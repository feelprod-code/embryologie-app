import React from 'react';
import { BookOpen } from 'lucide-react';
import { bibliographieData } from '../data/bibliographie';
import { cn } from '../utils';
import { useTranslation } from 'react-i18next';

export function Bibliographie() {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-4xl flex flex-col items-center animate-fade-in relative z-10 mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12 relative w-full flex flex-col items-center">
        <div className="inline-flex items-center justify-center p-4 bg-[#F27D33]/10 text-[#F27D33] rounded-2xl mb-6 shadow-sm border border-[#F27D33]/20">
          <BookOpen size={40} strokeWidth={1.5} />
        </div>
        <h1 className="font-bebas text-5xl md:text-6xl lg:text-7xl tracking-wider text-slate-800 drop-shadow-sm mb-4">
          Bibliographie
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl text-center">
          Références et ressources liées au cours de Marc Damoiseaux
        </p>
      </div>

      <div className="w-full space-y-8 pb-12">
        {bibliographieData.map((category) => (
          <div 
            key={category.id} 
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <h2 className="font-bebas text-2xl md:text-3xl text-slate-800 mb-6 border-b border-slate-100 pb-4">
              {category.title}
            </h2>
            <ul className="space-y-4">
              {category.items.map((item) => (
                <li key={item.id} className="flex items-start gap-4 text-slate-600 text-sm md:text-base leading-relaxed group">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F27D33]/60 mt-2 shrink-0 transition-all duration-300 group-hover:scale-150 group-hover:bg-[#F27D33]"></div>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
