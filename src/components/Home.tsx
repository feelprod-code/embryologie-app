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
    const isEnglish = currentLang === 'en';
    const podcastAudioSrc = isEnglish
        ? "https://s3.eu-west-3.amazonaws.com/embryologie-biodynamique.com/001+Philippe+Guillaume+EN.mp3"
        : "https://audio.ausha.co/6r2X8f6LVNAp.mp3";

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

    const activePodcast = {
        ...currentPodcastsData[0],
        audioUrl: podcastAudioSrc
    };

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
                    : "pt-12 min-[380px]:pt-16 sm:pt-6 lg:pt-10 pb-4" // Intermediate top padding to lower elements a notch
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
                            <div className="relative z-10 w-full text-center flex flex-col items-center mt-6 sm:mt-8">
                                <h1 className="text-4xl min-[380px]:text-5xl sm:text-7xl lg:text-[5rem] xl:text-[6rem] font-anton tracking-widest text-slate-700 uppercase leading-[0.85]">
                                    {t('home.title_part1')}
                                </h1>
                                <h2 className="text-3xl min-[380px]:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-anton text-[#F27D33] uppercase tracking-widest leading-[0.9] mt-1 pr-2">
                                    {t('home.title_part2')}
                                </h2>
                            </div>
                        </div>

                        {/* Spacer */}
                        <div className="flex-[0.5] sm:flex-1 min-h-[0.5vh] max-h-[3vh] sm:max-h-[6vh]"></div>

                        {/* Podcast Thumbnail/Vignette */}
                        <div className="relative w-[92vw] max-w-[420px] sm:max-w-[400px] lg:w-[28rem] xl:w-[32rem] aspect-square shrink-0 mb-4 mt-2 sm:mt-4 border border-slate-300 shadow-xl overflow-hidden group z-10 transition-transform duration-700 hover:scale-[1.02]">
                            <img
                                src={`${import.meta.env.BASE_URL}PODCAST.png`}
                                alt="Podcast Embryologie Biodynamique"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-[1.03] origin-center"
                                loading="eager"
                            />
                        </div>
                    </>
                )}

                {/* ===== PLAYER (always visible) ===== */}
                <div className="flex flex-col items-center justify-center w-full flex-none mt-2 sm:mt-0">
                    <div className="w-full flex flex-col items-center justify-center z-20">
                        <PodcastPlayerInteractive 
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
