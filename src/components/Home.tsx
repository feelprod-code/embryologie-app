import { useState } from 'react';
import { PodcastPlayerInteractive } from './PodcastPlayerInteractive';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils';

import { podcastsData as podcastsFr } from '../data/podcasts';
import { podcastsData as podcastsEn } from '../data/podcasts_en';
import { podcastsData as podcastsEs } from '../data/podcasts_es';
import { podcastsData as podcastsIt } from '../data/podcasts_it';
import { podcastsData as podcastsDe } from '../data/podcasts_de';
import { podcastsData as podcastsJa } from '../data/podcasts_ja';
import { podcastsData as podcastsZh } from '../data/podcasts_zh';

interface HomeProps {
    onNavigate?: (view: 'timeline' | 'home' | 'video-library' | 'embryo-ai' | 'podcasts') => void;
}

export function Home({}: HomeProps) {
    const { t, i18n } = useTranslation();
    const [isTranscriptMode, setIsTranscriptMode] = useState(false);

    // Determine which podcast audio to load based on language
    const currentLang = (typeof i18n.language === 'string' ? i18n.language.split('-')[0] : 'fr') || 'fr';

    const getPodcastData = () => {
        switch (currentLang) {
            case 'en': return podcastsEn;
            case 'es': return podcastsEs;
            case 'de': return podcastsDe;
            case 'it': return podcastsIt;
            case 'ja': return podcastsJa;
            case 'zh': return podcastsZh;
            case 'fr':
            default: return podcastsFr;
        }
    };

    const currentPodcastsData = getPodcastData();

    const activePodcast = currentPodcastsData.find(p => p.id === 'pod-tdt-1') || currentPodcastsData[0];

    return (
        <div id="home-scroll-container" className={cn(
            "w-full h-full relative bg-[#FAF6ED] flex flex-col items-center no-scrollbar overscroll-none",
            isTranscriptMode ? "overflow-y-auto" : "overflow-hidden touch-pan-y"
        )}>
            {/* Inner responsive layout container */}
            <div className={cn(
                "flex-1 w-full max-w-5xl flex flex-col items-center px-4 sm:px-6 mx-auto min-h-full transition-all duration-500",
                isTranscriptMode 
                    ? "pt-4 min-[380px]:pt-6 sm:pt-4 lg:pt-6 pb-20 lg:pb-12" // Transcript open padding
                    : "pt-1 min-[380px]:pt-2 sm:pt-3 lg:pt-1 pb-20 min-[380px]:pb-24 sm:pb-28 lg:pb-2 justify-center -translate-y-1 min-[425px]:-translate-y-2 sm:-translate-y-2 lg:translate-y-0"
            )}>

                {/* ===== POSTER MODE: Title + Vignette (hidden when transcript is open) ===== */}
                {!isTranscriptMode && (
                    <>
                        {/* Top Section: Credits & Title */}
                        <div className="flex flex-col items-center w-full justify-center flex-none">
                            {/* Top Poster Credits */}
                            <div className="relative z-10 w-full text-center animate-fade-in-up">
                                <div className="text-[10px] promax:text-[11px] sm:text-xs md:text-sm lg:text-xs ipad-13:text-base font-sans font-semibold tracking-[0.4em] sm:tracking-[0.6em] text-slate-500 uppercase">
                                    {t('home.training_by')}
                                </div>
                                <div className="text-sm promax:text-[15px] sm:text-lg md:text-xl lg:text-lg ipad-13:text-2xl font-bold tracking-[0.2em] text-slate-800 mt-0.5 sm:mt-1 uppercase">
                                    Marc Damoiseaux <span className="opacity-70 text-xs sm:text-sm md:text-base lg:text-xs ipad-13:text-lg font-normal">Ostéopathe D.O.</span>
                                </div>
                            </div>

                            {/* Main Cinematic Title */}
                            <div className="relative z-10 w-full text-center flex flex-col items-center mt-1.5 xs:mt-2 sm:mt-3 lg:mt-1.5 ipad-13:mt-4 px-2 justify-center">
                                <h1 className={cn(
                                    "font-anton text-slate-700 uppercase leading-[0.85] whitespace-nowrap",
                                    (currentLang === 'ja' || currentLang === 'zh')
                                        ? "text-[32px] xs:text-[38px] sm:text-6xl tracking-tight"
                                        : "text-4xl xs:text-5xl sm:text-7xl md:text-[5rem] lg:text-[4.5rem] xl:text-[5.5rem] ipad-13:text-[6.25rem] tracking-widest"
                                )}>
                                    {t('home.title_part1')}
                                </h1>
                                <h2 className={cn(
                                    "font-anton text-[#F27D33] uppercase leading-[0.9] mt-1 sm:mt-1.5 whitespace-nowrap",
                                    (currentLang === 'ja' || currentLang === 'zh')
                                        ? "text-[28px] xs:text-[34px] sm:text-5xl tracking-normal"
                                        : "text-3xl xs:text-4xl sm:text-5xl md:text-[3.75rem] lg:text-[3.4rem] xl:text-6xl ipad-13:text-[4.5rem] tracking-widest"
                                )}>
                                    {t('home.title_part2')}
                                </h2>
                            </div>
                        </div>

                        {/* Spacer: Gives breathing space above the strictly centered Podcast Image */}
                        <div className="h-4 xs:h-8 promax:h-5 promax-tall:h-14 sm:h-10 md:h-12 lg:h-4 ipad-13:h-14 flex-none"></div>

                        {/* Podcast Thumbnail/Vignette (Strictly Centered) */}
                        <div className="w-full flex justify-center items-center shrink-0">
                            <div className="relative w-[68vw] max-w-[245px] xs:w-[76vw] xs:max-w-[300px] promax:w-[74vw] promax:max-w-[300px] promax-tall:max-w-[340px] sm:w-[400px] sm:max-w-[400px] md:w-[450px] md:max-w-[450px] lg:w-[16rem] lg:max-w-[16rem] xl:w-[18rem] xl:max-w-[18rem] ipad-13:w-[500px] ipad-13:max-w-[500px] aspect-square mx-auto rounded-xl sm:rounded-2xl border border-slate-300/80 shadow-lg overflow-hidden group z-10 transition-transform duration-700 hover:scale-[1.02]">
                                <img
                                    key={currentLang}
                                    src={`${import.meta.env.BASE_URL}PODCAST_${currentLang}.png`}
                                    onError={(e) => {
                                        e.currentTarget.src = `${import.meta.env.BASE_URL}PODCAST.png`;
                                    }}
                                    alt="Podcast Embryologie Biodynamique"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-[1.03] origin-center"
                                    loading="eager"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* ===== PLAYER (always visible) ===== */}
                <div className="flex flex-col items-center justify-center w-full flex-none mt-3.5 xs:mt-6 promax:mt-4 promax-tall:mt-10 sm:mt-8 md:mt-10 lg:mt-3.5 ipad-13:mt-12">
                    <div className="w-full flex flex-col items-center justify-center z-20">
                        <PodcastPlayerInteractive 
                            key={`${activePodcast.id}-${currentLang}`}
                            podcast={activePodcast} 
                            onTranscriptToggle={setIsTranscriptMode}
                        />
                        {!isTranscriptMode && (
                            <span className="font-handwriting text-2xl sm:text-3xl md:text-4xl lg:text-2xl ipad-13:text-4xl text-slate-600 mt-2 xs:mt-3 promax:mt-2 promax-tall:mt-5 sm:mt-5 md:mt-6 lg:mt-2 ipad-13:mt-6 -rotate-2 transform hover:scale-105 transition-transform cursor-pointer">
                                {t('home.start')}
                            </span>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
