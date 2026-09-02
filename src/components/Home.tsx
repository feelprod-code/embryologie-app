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
                    : "pt-12 min-[380px]:pt-16 sm:pt-6 lg:pt-10 pb-32 sm:pb-36" // Intermediate top padding to lower elements a notch, pb-32 prevents nav bar overlap
            )}>

                {/* ===== POSTER MODE: Title + Vignette (hidden when transcript is open) ===== */}
                {!isTranscriptMode && (
                    <>
                        {/* Top Section: Credits & Title */}
                        <div className="flex flex-col items-center w-full justify-center flex-none -mt-8 sm:-mt-0">
                            {/* Top Poster Credits */}
                            <div className="relative z-10 w-full text-center animate-fade-in-up -mt-2 sm:-mt-2">
                                <div className="text-[10px] sm:text-xs md:text-sm font-sans font-semibold tracking-[0.4em] sm:tracking-[0.6em] text-slate-500 uppercase">
                                    {t('home.training_by')}
                                </div>
                                <div className="text-sm sm:text-lg lg:text-xl font-bold tracking-[0.2em] text-slate-800 mt-1 uppercase">
                                    Marc Damoiseaux <span className="opacity-70 text-xs sm:text-sm font-normal">Ostéopathe D.O.</span>
                                </div>
                            </div>

                            {/* Main Cinematic Title */}
                            <div className="relative z-10 w-full text-center flex flex-col items-center mt-6 sm:mt-8 px-2 h-[62px] min-[380px]:h-[78px] sm:h-[110px] lg:h-[130px] justify-center">
                                <h1 className={cn(
                                    "font-anton text-slate-700 uppercase leading-[0.85] whitespace-nowrap",
                                    (currentLang === 'ja' || currentLang === 'zh')
                                        ? "text-[32px] min-[380px]:text-[38px] sm:text-6xl tracking-tight"
                                        : "text-4xl min-[380px]:text-5xl sm:text-7xl lg:text-[5rem] xl:text-[6rem] tracking-widest"
                                )}>
                                    {t('home.title_part1')}
                                </h1>
                                <h2 className={cn(
                                    "font-anton text-[#F27D33] uppercase leading-[0.9] mt-1 whitespace-nowrap",
                                    (currentLang === 'ja' || currentLang === 'zh')
                                        ? "text-[28px] min-[380px]:text-[34px] sm:text-5xl tracking-normal"
                                        : "text-3xl min-[380px]:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-widest pr-2"
                                )}>
                                    {t('home.title_part2')}
                                </h2>
                            </div>
                        </div>

                        {/* Spacer */}
                        <div className="flex-[0.5] sm:flex-1 min-h-[0.5vh] max-h-[3vh] sm:max-h-[6vh]"></div>

                        {/* Podcast Thumbnail/Vignette (Strictly Centered) */}
                        <div className="w-full flex justify-center items-center shrink-0">
                            <div className="relative w-[75vw] max-w-[320px] sm:max-w-[340px] md:max-w-[360px] lg:w-[21rem] xl:w-[23rem] aspect-square mx-auto mb-3 sm:mb-4 mt-1.5 sm:mt-3 rounded-xl sm:rounded-2xl border border-slate-300/80 shadow-lg overflow-hidden group z-10 transition-transform duration-700 hover:scale-[1.02]">
                                <img
                                    src={`${import.meta.env.BASE_URL}PODCAST.png`}
                                    alt="Podcast Embryologie Biodynamique"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-[1.03] origin-center"
                                    loading="eager"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* ===== PLAYER (always visible) ===== */}
                <div className="flex flex-col items-center justify-center w-full flex-none mt-2 sm:mt-0">
                    <div className="w-full flex flex-col items-center justify-center z-20">
                        <PodcastPlayerInteractive 
                            key={`${activePodcast.id}-${currentLang}`}
                            podcast={activePodcast} 
                            onTranscriptToggle={setIsTranscriptMode}
                        />
                        {!isTranscriptMode && (
                            <span className="font-handwriting text-2xl sm:text-3xl lg:text-3xl text-slate-600 mt-2 sm:mt-3 lg:mt-2 -rotate-2 transform hover:scale-105 transition-transform cursor-pointer">
                                {t('home.start')}
                            </span>
                        )}
                    </div>
                </div>

                {/* ===== POSTER MODE: Spacer (hidden when transcript is open) ===== */}
                {!isTranscriptMode && (
                    <div className="flex-[2.5] sm:flex-[2.5] min-h-[7vh] sm:min-h-[4.5vh]"></div>
                )}

            </div>
        </div>
    );
}
