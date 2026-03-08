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
        <div className="w-full h-full relative bg-[#FAF9F6] flex flex-col items-center overflow-hidden">
            {/* Inner responsive layout container */}
            {/* Inner responsive layout container */}
            <div className="flex-1 w-full max-w-5xl flex flex-col items-center px-4 sm:px-6 pt-2 sm:pt-6 pb-24 sm:pb-6 md:pb-12 mx-auto h-full">

                {/* Top Section: Credits & Title */}
                <div className="flex flex-col items-center w-full justify-center flex-none">
                    {/* Top Poster Credits */}
                    <div className="relative z-10 w-full text-center animate-fade-in-up mt-2 sm:mt-6">
                        <div className="text-[10px] sm:text-xs font-sans font-semibold tracking-[0.4em] sm:tracking-[0.6em] text-slate-500 uppercase">
                            {t('home.training_by')}
                        </div>
                        <div className="text-sm md:text-base font-bold tracking-[0.2em] text-slate-800 mt-1 uppercase">
                            Marc Damoiseaux <span className="opacity-70 text-xs font-normal">Ostéopathe D.O.</span>
                        </div>
                    </div>

                    {/* Main Cinematic Title */}
                    <div className="relative z-10 w-full text-center flex flex-col items-center mt-3 sm:mt-8">
                        <h1 className="text-4xl min-[380px]:text-5xl sm:text-6xl md:text-7xl font-anton tracking-widest text-slate-700 uppercase leading-[0.85]">
                            {t('home.title_part1')}
                        </h1>
                        <h2 className="text-3xl min-[380px]:text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-anton text-[#F27D33] uppercase tracking-widest leading-[0.9] mt-1 pr-2">
                            {t('home.title_part2')}
                        </h2>
                    </div>
                </div>

                {/* 
                  Magic Flexible Spacer 
                  Grows to perfectly distribute empty space between Header and Center Content 
                */}
                <div className="flex-1 min-h-[2vh] max-h-[6vh]"></div>

                {/* Center - Vignette & Player */}
                <div className="flex flex-col items-center justify-center w-full flex-none">
                    {/* Podcast Thumbnail/Vignette */}
                    <div className="relative w-[80vw] max-w-[340px] sm:max-w-[320px] md:w-[24rem] lg:w-[28rem] aspect-square shrink-0 mb-4 border border-slate-300 shadow-xl overflow-hidden group z-10 transition-transform duration-700 hover:scale-[1.02]">
                        <img
                            src={`${import.meta.env.BASE_URL}PODCAST.png`}
                            alt="Podcast Embryologie Biodynamique"
                            className="w-full h-full object-cover shadow-inner"
                        />
                    </div>

                    {/* Minimalist Player */}
                    <div className="w-[90%] sm:w-2/3 max-w-[320px] z-20 mt-1 flex flex-col items-center">
                        <CustomAudioPlayer
                            src={podcastAudioSrc}
                            className="w-full"
                        />
                        <span className="font-handwriting text-2xl lg:text-3xl text-slate-600 mt-2 -rotate-2 transform hover:scale-105 transition-transform cursor-pointer">
                            {t('home.start')}
                        </span>
                    </div>
                </div>

                {/* 
                  Magic Flexible Spacer 
                  Grows to distribute empty space between Center Content and Footer
                */}
                <div className="flex-[2] min-h-[4vh]"></div>

                {/* Credits FeelProd */}
                <div className="flex-none w-full flex flex-col items-center justify-end opacity-90 mt-auto pb-2">
                    <span className="text-[10px] sm:text-[11px] md:text-sm text-slate-500/80 font-medium uppercase tracking-[0.3em] text-center relative z-20 mb-1">
                        {t('home.credits', 'RÉALISATION FEELPROD')}
                    </span>
                    <div className="w-12 h-[1px] bg-slate-300/50 mt-1 mb-2"></div>
                </div>

            </div>
        </div>
    );
}
