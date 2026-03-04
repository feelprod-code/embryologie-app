import { Clock, MonitorPlay, Bot } from 'lucide-react';
import { CustomAudioPlayer } from './ui/CustomAudioPlayer';
import { useTranslation } from 'react-i18next';

interface HomeProps {
    onNavigate: (view: 'timeline' | 'video-library' | 'embryo-ai') => void;
}

export function Home({ onNavigate }: HomeProps) {
    const { t } = useTranslation();

    return (
        <div className="w-full h-full flex flex-col items-center justify-between relative overflow-x-hidden overflow-y-auto no-scrollbar px-4 sm:px-6 py-2 lg:py-4 z-10 bg-[#FAF9F6]">

            {/* Top Section: Credits & Title */}
            <div className="flex flex-col items-center justify-start w-full shrink-0 flex-1 pt-2 sm:pt-4">
                {/* Top Poster Credits - Moved Higher */}
                <div className="relative z-10 w-full text-center animate-fade-in-up mt-0 sm:mt-1">
                    <span className="text-[10px] sm:text-xs font-sans font-semibold tracking-[0.4em] sm:tracking-[0.6em] text-slate-500 uppercase">
                        {t('home.training_by')}
                    </span>
                    <div className="text-sm md:text-base font-bold tracking-[0.2em] text-slate-800 mt-1 uppercase">
                        Marc Damoiseaux <span className="opacity-70 text-xs font-normal">Ostéopathe D.O.</span>
                    </div>
                </div>

                {/* Main Cinematic Title */}
                <div className="relative z-10 w-full text-center flex flex-col items-center mt-8 sm:mt-12 mb-2">
                    <h1 className="text-[13vw] sm:text-7xl md:text-8xl lg:text-9xl font-anton tracking-widest text-slate-700 uppercase leading-[0.85]">
                        {t('home.title_part1')}
                    </h1>
                    <h2 className="text-[10vw] sm:text-5xl md:text-6xl lg:text-7xl font-anton text-[#F27D33] uppercase tracking-widest leading-[0.9] mt-6 sm:mt-10 pr-2">
                        {t('home.title_part2')}
                    </h2>
                </div>

                {/* Center - Vignette & Player */}
                <div className="relative z-10 w-full flex flex-col items-center justify-center shrink-0 mt-4 sm:mt-12 mb-2">
                    {/* Podcast Thumbnail/Vignette HUGE with sharp corners for poster look */}
                    <div className="relative w-[60vw] max-w-[280px] sm:max-w-none sm:w-[22rem] md:w-[26rem] lg:w-[30rem] aspect-square shrink-0 mb-4 sm:mb-6 rounded-sm border border-slate-300 shadow-xl overflow-hidden group z-10 transition-transform duration-700 hover:scale-[1.02]">
                        <img
                            src={`${import.meta.env.BASE_URL}PODCAST.png`}
                            alt="Podcast Embryologie Biodynamique"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Minimalist Player */}
                    <div className="w-[85%] sm:w-2/3 max-w-[280px] z-20 mt-2 flex flex-col items-center">
                        <CustomAudioPlayer
                            src="https://audio.ausha.co/6r2X8f6LVNAp.mp3"
                            className="w-full"
                        />
                        <span className="font-handwriting text-3xl lg:text-4xl text-slate-600 mt-5 -rotate-2 transform hover:scale-105 transition-transform cursor-pointer">
                            {t('home.start')}
                        </span>
                    </div>
                </div>

                {/* Desktop Only Navigation (Hidden on Mobile because of App.tsx Tab Bar) */}
                <div className="hidden md:flex relative z-20 shrink-0 flex-nowrap items-stretch justify-center w-full max-w-4xl gap-4 mt-6 mb-6">
                    <button
                        onClick={() => onNavigate('timeline')}
                        className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4 rounded-sm font-bold font-bebas tracking-widest text-lg lg:text-xl transition-all bg-transparent text-slate-700 border border-slate-300 hover:border-slate-500 shadow-sm active:scale-95 px-4 leading-tight text-center"
                    >
                        <Clock size={16} className="w-7 h-7 mb-1" strokeWidth={1.5} />
                        <span className="truncate w-full">{t('nav.timeline')}</span>
                    </button>

                    <button
                        onClick={() => onNavigate('video-library')}
                        className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4 rounded-sm font-bold font-bebas tracking-widest text-lg lg:text-xl transition-all border shadow-sm bg-[#8B1111] border-[#6E0F12] text-[#FAF9F6] hover:bg-[#6E0F12] active:scale-95 group px-4 leading-tight text-center"
                    >
                        <MonitorPlay size={16} className="w-7 h-7 mb-1 text-[#FAF9F6]/80 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                        <span className="truncate w-full">{t('nav.videos')}</span>
                    </button>

                    <button
                        onClick={() => onNavigate('embryo-ai')}
                        className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4 rounded-sm font-bold font-bebas tracking-widest text-lg lg:text-xl transition-all bg-transparent text-slate-700 border border-slate-300 hover:border-slate-500 shadow-sm active:scale-95 px-4 leading-tight text-center"
                    >
                        <Bot size={16} className="w-7 h-7 mb-1" strokeWidth={1.5} />
                        <span className="truncate w-full">{t('home.ai_assistant')}</span>
                    </button>
                </div>
            </div>

            {/* Credits FeelProd */}
            <div className="w-full shrink-0 flex items-center justify-center pt-2 pb-24 md:pb-8">
                <div className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-widest pt-2">
                    {t('home.credits')}
                </div>
            </div>
        </div>
    );
}
