import React, { useState } from 'react';
import { Layers, Droplet, Heart, Brain, Baby, CircleDot, Waves, ArrowRightLeft, Clock, GitCommitHorizontal, Sparkles, Stethoscope, HeartHandshake, Eye, Home as HomeIcon, Video } from 'lucide-react';
import { detailedStages as detailedStagesFr, type StageDataV2, type EmbryoLayer } from './data/embryologie';
import { detailedStages as detailedStagesEn } from './data/embryologie_en';
import { detailedStages as detailedStagesEs } from './data/embryologie_es';
import { detailedStages as detailedStagesIt } from './data/embryologie_it';
import { detailedStages as detailedStagesDe } from './data/embryologie_de';
import { detailedStages as detailedStagesZh } from './data/embryologie_zh';
import { detailedStages as detailedStagesJa } from './data/embryologie_ja';
import { Mermaid } from './components/Mermaid';
import { ChatBot } from './components/ChatBot';
import { Home } from './components/Home';
import { VideoLibraryList } from './components/VideoLibraryList';
import { VideoPlayerPage } from './components/VideoPlayerPage';
import { type VideoCourse } from './data/videoCourses';
import { cn } from './utils';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './components/ui/LanguageSwitcher';

const iconMap: Record<string, React.ReactNode> = {
  "j-0": <CircleDot size={20} className="text-blue-400" />,
  "j-1": <Droplet size={20} className="text-purple-400" />,
  "j-1-4": <Layers size={20} className="text-indigo-400" />,
  "j-5-8": <ArrowRightLeft size={20} className="text-rose-400" />,
  "j-7-14": <CircleDot size={20} className="text-pink-400" />,
  "j-14-21": <Waves size={20} className="text-red-400" />,
  "j-21-22": <Activity size={20} className="text-purple-400" />,
  "j-22-28": <Heart size={20} className="text-orange-400" />,
  "j-28": <Layers size={20} className="text-yellow-400" />,
  "j-45": <Brain size={20} className="text-primary" />,
  "maturation-12ans": <Baby size={20} className="text-cyan-400" />,
};

// --- Missing Icon Fallback ---
function Activity({ className, size }: { className?: string; size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

const layerColors: Record<EmbryoLayer, string> = {
  "L'Ectoderme": "bg-[#5A9C51]/10 text-[#5A9C51] border-[#5A9C51]/40",
  "L'Endoderme": "bg-[#4171B5]/10 text-[#4171B5] border-[#4171B5]/40",
  "Le Mésoderme": "bg-[#F27D33]/10 text-[#F27D33] border-[#F27D33]/40",
  "L'Oeil": "bg-[#F2B729]/10 text-[#F2B729] border-[#F2B729]/40",
  "Global": "bg-slate-100 text-slate-700 border-slate-200",
  "N/A": "bg-transparent text-slate-400 border-transparent",
};

function App() {
  const { t, i18n } = useTranslation();

  const detailedStages = i18n.language.startsWith('en')
    ? detailedStagesEn
    : i18n.language.startsWith('es')
      ? detailedStagesEs
      : i18n.language.startsWith('it')
        ? detailedStagesIt
        : i18n.language.startsWith('de')
          ? detailedStagesDe
          : i18n.language.startsWith('zh')
            ? detailedStagesZh
            : i18n.language.startsWith('ja')
              ? detailedStagesJa
              : detailedStagesFr;

  const [activeStageId, setActiveStageId] = useState<string>(detailedStages[0].id);

  type View = 'home' | 'timeline' | 'embryo-ai' | 'video-library' | 'video-player' | 'podcast-player' | 'podcasts';
  const [currentView, setCurrentView] = useState<View>('home');
  const [activeVideo, setActiveVideo] = useState<VideoCourse | null>(null);

  const activeStage = detailedStages.find(s => s.id === activeStageId) as StageDataV2 || detailedStages[0];
  // Use original index for timeline visual order
  const getOriginalIndex = (id: string) => detailedStages.findIndex(s => s.id === id);
  const activeIndex = getOriginalIndex(activeStageId);

  return (
    <div className="flex flex-col items-center h-[100dvh] w-full max-w-full relative bg-[#FAF9F6] text-slate-800 overflow-hidden">
      {/* Cinematic Background Gradients (Global) */}
      {currentView !== 'video-player' && (
        <>
          <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#fff_0%,_#FAF9F6_60%)] pointer-events-none z-0"></div>
          <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#f5f5f0]/50 to-[#FAF9F6] pointer-events-none z-0"></div>
        </>
      )}

      {/* iOS-Style Bottom Tab Bar for Mobile - FIXED OUTSIDE SCROLL */}
      {currentView !== 'podcast-player' && (
        <nav className="fixed bottom-0 z-50 w-full bg-white/90 backdrop-blur-xl border-t border-slate-200 flex md:hidden pb-[env(safe-area-inset-bottom,16px)] shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.1)] overscroll-none">
          <button
            onClick={() => setCurrentView('home')}
            onTouchStart={(e) => { e.preventDefault(); setCurrentView('home'); }}
            className={cn(
              "flex flex-1 flex-col items-center justify-center pt-3 pb-2 gap-1 transition-colors cursor-pointer touch-manipulation active:scale-95 group",
              currentView === 'home' ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div className={cn("transition-transform duration-200", currentView === 'home' ? "scale-105" : "group-hover:scale-105")}>
              <HomeIcon size={24} />
            </div>
            <span className={cn("text-[10px] tracking-wide transition-all", currentView === 'home' ? "font-medium" : "font-normal")}>{t('nav.home')}</span>
          </button>

          <button
            onClick={() => setCurrentView('timeline')}
            onTouchStart={(e) => { e.preventDefault(); setCurrentView('timeline'); }}
            className={cn(
              "flex flex-1 flex-col items-center justify-center pt-3 pb-2 gap-1 transition-colors cursor-pointer touch-manipulation active:scale-95 group",
              currentView === 'timeline' ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div className={cn("transition-transform duration-200", currentView === 'timeline' ? "scale-105" : "group-hover:scale-105")}>
              <Clock size={24} />
            </div>
            <span className={cn("text-[10px] tracking-wide transition-all", currentView === 'timeline' ? "font-medium" : "font-normal")}>{t('nav.timeline')}</span>
          </button>

          <button
            onClick={() => setCurrentView('video-library')}
            onTouchStart={(e) => { e.preventDefault(); setCurrentView('video-library'); }}
            className={cn(
              "flex flex-1 flex-col items-center justify-center pt-3 pb-2 gap-1 transition-colors cursor-pointer touch-manipulation active:scale-95 group",
              currentView === 'video-library' || currentView === 'video-player' ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div className={cn("transition-transform duration-200", currentView === 'video-library' || currentView === 'video-player' ? "scale-105" : "group-hover:scale-105")}>
              <Video size={24} />
            </div>
            <span className={cn("text-[10px] tracking-wide transition-all", currentView === 'video-library' || currentView === 'video-player' ? "font-medium" : "font-normal")}>{t('nav.videos')}</span>
          </button>

          <button
            onClick={() => setCurrentView('embryo-ai')}
            onTouchStart={(e) => { e.preventDefault(); setCurrentView('embryo-ai'); }}
            className={cn(
              "flex flex-1 flex-col items-center justify-center pt-3 pb-2 gap-1 transition-colors cursor-pointer touch-manipulation active:scale-95 group",
              currentView === 'embryo-ai' ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div className={cn("transition-transform duration-200", currentView === 'embryo-ai' ? "scale-105" : "group-hover:scale-105")}>
              <Brain size={24} />
            </div>
            <span className={cn("text-[10px] tracking-wide transition-all", currentView === 'embryo-ai' ? "font-medium" : "font-normal")}>{t('home.ai_assistant')}</span>
          </button>

          {/* Mobile bottom nav Language Switcher */}
          <div className="flex flex-1 items-center justify-center pb-2 pt-3">
            <LanguageSwitcher variant="bottom-nav" />
          </div>
        </nav>
      )}

      {/* INNER SCROLLABLE CANVAS - Scroll contained to let Safari rest */}
      <div className="flex-1 w-full h-full flex flex-col items-center overflow-y-auto overflow-x-hidden relative z-10 overscroll-y-none no-scrollbar" id="main-scroll-canvas" style={{ WebkitOverflowScrolling: 'touch' }}>

        {/* Desktop Top Navigation Bar */}
        <nav className="sticky top-0 z-50 w-full h-[60px] bg-[#FAF9F6] border-b border-slate-200 hidden md:flex items-center justify-center gap-4 px-6 shadow-sm">
          <button
            onClick={() => setCurrentView('home')}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide transition-all",
              currentView === 'home'
                ? "bg-[#F27D33] text-white shadow-md"
                : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            {t('nav.home', 'Accueil')}
          </button>

          <button
            onClick={() => setCurrentView('timeline')}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide transition-all",
              currentView === 'timeline'
                ? "bg-[#F27D33] text-white shadow-md"
                : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            {t('nav.timeline')}
          </button>

          <button
            onClick={() => setCurrentView('video-library')}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide transition-all",
              currentView === 'video-library'
                ? "bg-[#F27D33] text-white shadow-md"
                : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            {t('nav.videos')}
          </button>

          <button
            onClick={() => setCurrentView('embryo-ai')}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide transition-all",
              currentView === 'embryo-ai'
                ? "bg-[#F27D33] text-white shadow-md"
                : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            {t('nav.ai_assistant', 'Embryo AI')}
          </button>

          <div className="flex-1"></div>

          {/* Desktop Nav Language Switcher */}
          <LanguageSwitcher variant="desktop-nav" />
        </nav>

        {/* Main Container Wrapper */}
        <div className={cn(
          "flex flex-col items-center w-full flex-1",
          currentView === 'home' || currentView === 'video-player' || currentView === 'embryo-ai'
            ? "p-0"
            : "px-2 sm:px-6 lg:px-8 w-full pb-[100px]",
          currentView === 'home' ? "overflow-hidden h-[calc(100vh-69px)]" : "",
          currentView === 'video-player' ? "pt-0 md:pt-2 pb-[90px] md:pb-2 overflow-hidden h-[100dvh] md:h-[calc(100vh-60px)]" : "pt-0"
        )}>

          {/* Desktop Top Navigation Bar */}

          {currentView === 'home' && (
            <div className="w-full h-full flex items-center justify-center">
              <Home />
            </div>
          )}

          {currentView === 'embryo-ai' && (
            <div className="w-full relative h-[calc(100vh-69px)] flex flex-col items-center md:items-stretch md:justify-start py-0 px-0 sm:px-4 md:px-0 pt-0">
              <ChatBot
                onNavigateToVideo={(video) => {
                  setActiveVideo(video);
                  setCurrentView('video-player');
                }}
              />
            </div>
          )}



          {currentView === 'video-library' && (
            <div className="w-full max-w-5xl flex flex-col items-center animate-fade-in relative z-10 pb-24 lg:pb-0 mx-auto">
              <div className="w-full">
                <VideoLibraryList
                  onSelectVideo={(video) => {
                    setActiveVideo(video);
                    setCurrentView('video-player');
                  }}
                />
              </div>
            </div>
          )}

          {currentView === 'video-player' && activeVideo && (
            <div className="w-full animate-fade-in h-full">
              <VideoPlayerPage
                course={activeVideo}
                onSelectVideo={setActiveVideo}
              />
            </div>
          )}

          {currentView === 'timeline' && (
            <div className="w-full max-w-5xl flex flex-col animate-fade-in relative z-10 mx-auto">

              {/* STICKY HEADER CONTAINER FOR TIMELINE */}
              <div className="sticky top-[60px] md:top-[60px] lg:top-[60px] z-40 w-[100vw] lg:w-full bg-[#FAF9F6] -mx-2 sm:-mx-6 lg:mx-0 pt-4 flex flex-col items-center pb-4 px-2 border-b border-transparent md:border-slate-100">
                {/* TIMELINE BADGE */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-1 relative w-full text-center pb-1 md:pb-0">
                  <div className="inline-flex items-center justify-center px-4 sm:px-8 md:px-8 py-2 sm:py-3 md:py-2 rounded-full mb-0 whitespace-nowrap max-w-[95vw] lg:max-w-full overflow-hidden">
                    <span className="font-bebas font-normal text-xl min-[380px]:text-2xl sm:text-3xl md:text-2xl lg:text-4xl uppercase tracking-widest truncate leading-none md:leading-[1.1] pt-1 md:pt-0 drop-shadow-sm text-slate-800">
                      {t('app.developmental_movement')}
                    </span>
                  </div>
                </div>

                {/* MOBILE TIMELINE NAVIGATION (Horizontal chip selection) */}
                <div className="w-[100vw] lg:hidden overflow-x-auto no-scrollbar -mx-2 sm:-mx-6 lg:mx-0 pb-3 pt-3 mt-1 border-t border-slate-100 snap-x">
                  <div className="flex flex-nowrap items-stretch gap-2 px-4 w-max mx-auto">
                    {detailedStages.map((stage) => {
                      const isActive = stage.id === activeStageId;
                      const idx = getOriginalIndex(stage.id);
                      const isPast = idx < activeIndex;

                      return (
                        <button
                          key={stage.id}
                          onClick={() => setActiveStageId(stage.id)}
                          onTouchStart={(e) => { e.preventDefault(); setActiveStageId(stage.id); }}
                          className={cn(
                            "relative flex flex-col items-center justify-center py-3 px-2 rounded-[1.2rem] min-w-[120px] sm:min-w-[140px] border shrink-0 snap-center transition-all duration-300",
                            isActive
                              ? "bg-slate-900 border-slate-800 text-white shadow-md scale-100"
                              : isPast
                                ? "bg-slate-50 border-slate-200 text-slate-500 opacity-80"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
                          )}
                        >
                          {isActive && (
                            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 rounded-full shadow-sm animate-in zoom-in"></div>
                          )}
                          <span className={cn(
                            "font-bebas text-lg sm:text-xl tracking-wider leading-none mb-1 whitespace-nowrap",
                            isActive ? "text-white" : "text-slate-800"
                          )}>
                            {stage.dayLabel}
                          </span>
                          <span className={cn(
                            "text-[10px] uppercase font-bold truncate w-full px-2 opacity-80 text-center",
                            isActive ? "text-slate-300" : "text-slate-500"
                          )}>
                            {stage.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-12 lg:gap-10">

                {/* TIMELINE NAVIGATION (Vertical Left Column - Desktop Only) */}
                <div className="hidden lg:block lg:col-span-4 relative max-h-[calc(100vh-140px)] overflow-y-auto hide-scrollbar border-b-0 border-slate-200 mb-0 sticky top-[90px] z-10 bg-transparent p-0 self-start">
                  {/* Removed vertical lateral bar as requested */}
                  <div className="space-y-6 relative pb-10 mt-6">
                    {detailedStages.map((stage) => {
                      const isActive = stage.id === activeStageId;
                      const idx = getOriginalIndex(stage.id);
                      const isPast = idx < activeIndex;

                      return (
                        <button
                          key={stage.id}
                          onClick={() => setActiveStageId(stage.id)}
                          className={cn(
                            "w-full text-left flex items-start group relative transition-all duration-300",
                            isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                          )}
                        >
                          {/* Timeline Dot */}
                          <div className={cn(
                            "relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 flex-shrink-0 shadow-sm",
                            isActive ? "bg-white border-primary glow-blue scale-110" :
                              isPast ? "bg-slate-50 border-slate-300" : "bg-white border-slate-200"
                          )}>
                            {iconMap[stage.id] || <CircleDot size={20} className={isActive ? "text-primary" : "text-slate-400"} />}
                          </div>

                          {/* Content */}
                          <div className={cn(
                            "ml-6 pt-1 transition-all duration-300 flex-1",
                            isActive ? "translate-x-2" : ""
                          )}>
                            <div className="flex items-center gap-2 mb-1">
                              <Clock size={14} className={isActive ? "text-primary" : "text-slate-400"} />
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {stage.dayLabel}
                              </span>
                            </div>
                            <h3 className={cn(
                              "text-base lg:text-lg transition-colors leading-tight mb-1 font-bebas tracking-wide",
                              isActive ? "text-slate-950 text-xl lg:text-2xl" : "text-slate-700"
                            )}>
                              {stage.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                              {stage.period}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STAGE DETAILS (Right Column) */}
                <div className="lg:col-span-8">
                  {activeStage ? (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden animate-fade-in flex flex-col h-full">
                      {/* Background Color Hint (Subtle for light theme) */}
                      <div className={cn(
                        "absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.04] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 transition-colors duration-1000 pointer-events-none",
                        activeStage.themeColor.replace('900', '500') // Use a lighter version of the color for the hint
                      )}></div>

                      <div className="relative z-10 p-8 md:p-14 flex-1">
                        <div className="flex flex-row flex-nowrap items-center w-full overflow-x-auto no-scrollbar gap-2 mb-4 md:mb-6">
                          <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100/80 px-2.5 py-1 rounded-md whitespace-nowrap">
                            {activeStage.dayLabel}
                          </span>
                          <span className="text-slate-300 flex-shrink-0">•</span>
                          <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest whitespace-nowrap">
                            {activeStage.period}
                          </span>
                        </div>

                        <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-anton text-dark mb-2 md:mb-4 leading-tight tracking-wide uppercase break-words hyphens-auto">
                          {activeStage.title}
                        </h2>

                        <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-4xl mb-6 md:mb-10 font-medium border-l-4 border-slate-300 pl-4 md:pl-6">
                          {activeStage.generalDescription}
                        </p>

                        <div className="space-y-6 md:space-y-8">
                          <h3 className="flex items-center text-lg md:text-xl text-dark font-bebas tracking-wide mb-6 md:mb-8 uppercase">
                            <Heart className="mr-3 text-primary animate-pulse-slow shrink-0" size={20} />
                            {t('app.timeline_processes')}
                          </h3>

                          <div className="grid gap-5">
                            {activeStage.events
                              .map((event, idx) => (
                                <div
                                  key={idx}
                                  className="group relative flex flex-col sm:flex-row items-start sm:items-center bg-slate-50 rounded-[1.2rem] p-4 border border-slate-200 hover:bg-white transition-all hover:shadow-md hover:border-slate-300"
                                >
                                  {/* Order Indicator (if exists) */}
                                  {event.order && (
                                    <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-primary group-hover:border-primary transition-colors z-10 font-anton">
                                      {event.order}
                                    </div>
                                  )}

                                  <div className="w-full sm:w-1/4 mb-4 sm:mb-0 sm:pr-6">
                                    <span className={cn(
                                      "inline-flex items-center px-4 py-1.5 rounded-[1.2rem] text-xs font-bold border uppercase tracking-wider",
                                      layerColors[event.layer]
                                    )}>
                                      {(() => {
                                        const l = event.layer;
                                        const lang = i18n.language || 'fr';
                                        const map: Record<string, Record<string, string>> = {
                                          "L'Ectoderme": { en: "Ectoderm", es: "Ectodermo", de: "Ektoderm", it: "Ectoderma", ja: "外胚葉", zh: "外胚层" },
                                          "Le Mésoderme": { en: "Mesoderm", es: "Mesodermo", de: "Mesoderm", it: "Mesoderma", ja: "中胚葉", zh: "中胚层" },
                                          "L'Endoderme": { en: "Endoderm", es: "Endodermo", de: "Endoderm", it: "Endoderma", ja: "内胚葉", zh: "内胚层" },
                                          "L'Oeil": { en: "Eye", es: "Ojo", de: "Auge", it: "Occhio", ja: "目", zh: "眼" },
                                          "Général": { en: "General", es: "General", de: "Allgemein", it: "Generale", ja: "一般", zh: "概括" },
                                        };
                                        return map[l]?.[lang] || l;
                                      })()}
                                    </span>
                                  </div>

                                  {/* Content */}
                                  <div className="w-full sm:w-3/4 flex flex-col">
                                    <h4 className="text-dark font-bold mb-2 text-xl font-sans">
                                      {event.movement}
                                    </h4>
                                    <p className="text-slate-600 text-base leading-relaxed font-medium">
                                      {event.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>

                          {/* MERMAID CHART INSERTION */}
                          {activeStage.mermaidCode && (
                            <div className="mt-16 pt-10 border-t border-slate-200 animate-fade-in">
                              <h3 className="flex items-center text-2xl text-dark font-bebas tracking-wide mb-8 uppercase">
                                <GitCommitHorizontal className="mr-3 text-primary" size={28} />
                                {t('app.timeline_cine_dynamic')}
                              </h3>
                              <div className="bg-slate-50 p-4 sm:p-8 rounded-3xl border border-slate-200 shadow-inner overflow-x-auto w-full">
                                <div className="min-w-[600px] flex justify-center mx-auto">
                                  <Mermaid chart={activeStage.mermaidCode} />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* PRACTICAL INTEGRATION SECTION */}
                          {activeStage.practicalIntegration && (
                            <div className="mt-16 pt-10 border-t border-slate-200 animate-fade-in">
                              <h3 className="flex items-center text-2xl text-dark font-bebas tracking-wide mb-8 uppercase">
                                <Sparkles className="mr-3 text-primary" size={28} />
                                {t('app.timeline_practical')}
                              </h3>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Fulcrums & Palpation */}
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                                  <div>
                                    <h4 className="flex items-center text-dark font-bold text-lg mb-3 uppercase tracking-wide">
                                      <Eye size={20} className="mr-2 text-primary" /> {t('app.timeline_fulcrums')}
                                    </h4>
                                    <p className="text-slate-600 text-base leading-relaxed font-medium">{activeStage.practicalIntegration.fulcrums}</p>
                                  </div>
                                  <div>
                                    <h4 className="flex items-center text-dark font-bold text-lg mb-3 uppercase tracking-wide">
                                      <Stethoscope size={20} className="mr-2 text-primary" />
                                      {t('app.timeline_palpation')}
                                    </h4>
                                    <p className="text-slate-600 text-base leading-relaxed font-medium">{activeStage.practicalIntegration.generalPalpation}</p>
                                  </div>
                                  <div>
                                    <h4 className="flex items-center text-dark font-bold text-lg mb-3 uppercase tracking-wide">
                                      <HeartHandshake size={20} className="mr-2 text-primary" />
                                      {t('app.timeline_therapist_posture')}
                                    </h4>
                                    <p className="text-slate-600 text-base leading-relaxed font-medium">{activeStage.practicalIntegration.therapistPosture}</p>
                                  </div>
                                </div>

                                <div className="space-y-6">
                                  {/* Psychosomatic */}
                                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                    <h4 className="flex items-center text-dark font-bold text-lg mb-3 uppercase tracking-wide">
                                      <Brain size={20} className="mr-2 text-primary" /> {t('app.timeline_psychosomatic')}
                                    </h4>
                                    <p className="text-slate-600 text-base leading-relaxed font-medium">{activeStage.practicalIntegration.psychosomatic}</p>
                                  </div>

                                  {/* Layer Perceptions (if any) */}
                                  {activeStage.practicalIntegration.layerPerceptions && activeStage.practicalIntegration.layerPerceptions.length > 0 && (
                                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                      <h4 className="text-dark font-bold text-lg mb-5 uppercase tracking-wide">{t('app.timeline_layer_perceptions')}</h4>
                                      <div className="space-y-5">
                                        {activeStage.practicalIntegration.layerPerceptions.map((lp, idx) => (
                                          <div key={idx} className="flex flex-col">
                                            <span className={cn("text-xs font-bold px-3 py-1 rounded-lg w-max mb-2 uppercase tracking-wide border", layerColors[lp.layer])}>{lp.layer}</span>
                                            <p className="text-slate-600 text-sm font-medium leading-relaxed">{lp.perception}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-16 flex items-center justify-center h-full">
                      <p className="text-slate-400 font-medium text-lg">{t('app.timeline_no_data')}</p>
                    </div>
                  )}
                </div>
              </div>
              {/* Added spacer to clear tab bar on mobile/tablet */}
              <div className="h-24 lg:h-0 w-full shrink-0"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
