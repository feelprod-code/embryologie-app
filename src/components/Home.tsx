import { CustomAudioPlayer } from './ui/CustomAudioPlayer';
import { useTranslation } from 'react-i18next';

interface HomeProps {
    // any future props can go here
}

export function Home(_props: HomeProps) {
    const { t, i18n } = useTranslation();

    // Determine which podcast audio to load based on language
    const isEnglish = typeof i18n.language === 'string' && i18n.language.startsWith('en');
    const podcastAudioSrc = isEnglish
        ? `${import.meta.env.BASE_URL}podcast_embryology_english.mp3`
        : "https://audio.ausha.co/6r2X8f6LVNAp.mp3";

    return (
        <div className="w-full h-full relative overflow-x-hidden overflow-y-auto no-scrollbar bg-[#FAF9F6] flex flex-col items-center justify-center">
            {/* Inner responsive layout container */}
            <div className="min-h-full w-full max-w-5xl flex flex-col items-center justify-between px-4 sm:px-6 pt-[env(safe-area-inset-top,2rem)] md:pt-8 pb-[100px] md:pb-4 mx-auto">

                {/* Top Section: Credits & Title */}
                <div className="flex-none flex flex-col items-center w-full pt-10 sm:pt-12 md:pt-16">
                    {/* Top Poster Credits */}
                    <div className="relative z-10 w-full text-center animate-fade-in-up">
                        <div className="text-[10px] sm:text-xs font-sans font-semibold tracking-[0.4em] sm:tracking-[0.6em] text-slate-500 uppercase">
                            {t('home.training_by')}
                        </div>
                        <div className="text-sm md:text-base font-bold tracking-[0.2em] text-slate-800 mt-2 uppercase">
                            Marc Damoiseaux <span className="opacity-70 text-xs font-normal">Ostéopathe D.O.</span>
                        </div>
                    </div>

                    {/* Main Cinematic Title */}
                    <div className="relative z-10 w-full text-center flex flex-col items-center mt-10 sm:mt-12 md:mt-16">
                        <h1 className="text-[13vw] sm:text-7xl md:text-8xl lg:text-9xl font-anton tracking-widest text-slate-700 uppercase leading-[0.85]">
                            {t('home.title_part1')}
                        </h1>
                        <h2 className="text-[10vw] sm:text-5xl md:text-6xl lg:text-7xl font-anton text-[#F27D33] uppercase tracking-widest leading-[0.9] mt-4 sm:mt-6 pr-2">
                            {t('home.title_part2')}
                        </h2>
                    </div>
                </div>

                {/* Center - Vignette & Player */}
                <div className="flex-1 flex flex-col items-center justify-center w-full shrink-0 py-6 sm:py-8">
                    {/* Podcast Thumbnail/Vignette */}
                    <div className="relative w-[65vw] max-w-[320px] sm:max-w-none sm:w-[22rem] md:w-[24rem] lg:w-[26rem] aspect-square shrink-0 mb-4 border border-slate-300 shadow-xl overflow-hidden group z-10 transition-transform duration-700 hover:scale-[1.02]">
                        <img
                            src={`${import.meta.env.BASE_URL}PODCAST.png`}
                            alt="Podcast Embryologie Biodynamique"
                            className="w-full h-full object-cover shadow-inner"
                        />
                    </div>

                    {/* Minimalist Player */}
                    <div className="w-[85%] sm:w-2/3 max-w-[300px] z-20 mt-4 flex flex-col items-center">
                        <CustomAudioPlayer
                            src={podcastAudioSrc}
                            className="w-full"
                        />
                        <span className="font-handwriting text-3xl lg:text-4xl text-slate-600 mt-4 -rotate-2 transform hover:scale-105 transition-transform cursor-pointer">
                            {t('home.start')}
                        </span>
                    </div>
                </div>

                {/* Desktop Only Navigation block has been removed to avoid duplicate menus */}

                {/* Credits FeelProd */}
                <div className="flex-none w-full flex items-center justify-center">
                    <span className="text-[10px] sm:text-[11px] text-slate-400/60 font-light uppercase tracking-[0.2em] text-center relative z-20">
                        {t('home.credits')}
                    </span>
                </div>
            </div>
        </div>
    );
}
