import React from 'react';
import { Heart, Sparkles, Stethoscope, Eye, Home, Clock, Video, Brain, GitCommitHorizontal } from 'lucide-react';
import { detailedStages as detailedStagesFr, type StageDataV2, type EmbryoLayer } from '../data/embryologie';
import { cn } from './AppDesktopMenu';

// Empty line to clear the deleted block
const layerColors: Record<EmbryoLayer | string, string> = {
  "L'Ectoderme": "bg-[#5A9C51]/10 text-[#5A9C51] border-[#5A9C51]/40",
  "L'Endoderme": "bg-[#4171B5]/10 text-[#4171B5] border-[#4171B5]/40",
  "Le Mésoderme": "bg-[#F27D33]/10 text-[#F27D33] border-[#F27D33]/40",
  "L'Oeil": "bg-[#F2B729]/10 text-[#F2B729] border-[#F2B729]/40",
  "Global": "bg-[#EAE4D3] text-slate-700 border-slate-200",
  "N/A": "bg-transparent text-slate-400 border-transparent",
};

export const AppTimelineDay: React.FC<{
  simulatedFrame?: number;
  startScrollFrame?: number;
  stopScrollFrame?: number;
  activeStageId?: string;
  activeContentId?: string;
  scrollDays?: number;
}> = ({ 
  simulatedFrame = 0, 
  startScrollFrame = 0, 
  stopScrollFrame = 1,
  activeStageId = 'j-1',
  activeContentId,
  scrollDays = 120
}) => {

  const contentId = activeContentId || activeStageId;
  const activeContentStage = detailedStagesFr.find(s => s.id === contentId) as StageDataV2 || detailedStagesFr[0];
  const activeIndex = detailedStagesFr.findIndex(s => s.id === activeStageId);
  const [playingVideoIdx, setPlayingVideoIdx] = React.useState<number | null>(null);

  // Scroll interpolation over dynamic height based on content
  let translateY = 0;
  if (simulatedFrame > startScrollFrame) {
      const progress = Math.min(1, Math.max(0, (simulatedFrame - startScrollFrame) / (stopScrollFrame - startScrollFrame)));
      
      let maxScroll = 600;
      if (contentId === 'j-28') maxScroll = 500; // Long pour voir le mock complet Ciné-dynamique
      else if (contentId === 'j-14-21') maxScroll = 450; // moyen
      else if (contentId === 'j-7-14') maxScroll = 400; // moyen
      else if (contentId === 'j-1') maxScroll = 600; // long

      translateY = -maxScroll * progress; 
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#FAF6ED] overflow-hidden relative">
      <div className="flex-1 w-full flex flex-col relative overflow-hidden bg-[#FAF6ED]">
        
        {/* EN-TÊTE ÉPINGLÉ (Ne scrolle pas) */}
        <div className="w-full bg-[#FAF6ED] pt-16 flex flex-col items-center pb-2 border-b border-slate-200/60 shadow-sm shrink-0 z-20">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 relative w-full text-center pb-1">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full mb-0 whitespace-nowrap overflow-hidden">
              <span className="font-bebas font-normal text-3xl uppercase tracking-widest truncate leading-none pt-1 drop-shadow-sm text-slate-800">
                MOUVEMENT DU DÉVELOPPEMENT
              </span>
            </div>
          </div>

          <div className="-mx-2 w-[calc(100%+16px)] overflow-x-hidden pb-1 pt-1 mt-1 border-t border-slate-100">
            <div className="flex flex-nowrap items-stretch gap-2 w-max px-2" style={{ transform: `translateX(-${scrollDays}px)` }}>
              {detailedStagesFr.map((stage) => {
                const isActive = stage.id === activeStageId;
                const idx = detailedStagesFr.findIndex(s => s.id === stage.id);
                const isPast = idx < activeIndex;

                return (
                  <div
                    key={stage.id}
                    className={cn(
                      "relative flex flex-col items-center justify-center py-2 px-3 rounded-xl min-w-[125px] w-[125px] shrink-0",
                      isActive
                        ? "bg-slate-900 text-white scale-100 shadow-md"
                        : isPast
                          ? "bg-white text-slate-500 opacity-80 border border-slate-200/60"
                          : "bg-white text-slate-600 border border-slate-200/60"
                    )}
                  >
                    {isActive && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 rounded-full border border-white"></div>
                    )}
                    <span className={cn(
                      "font-bebas text-xl tracking-wider leading-none mb-0.5 whitespace-nowrap",
                      isActive ? "text-white" : "text-slate-800"
                    )}>
                      {stage.dayLabel}
                    </span>
                    <span className={cn(
                      "text-[9px] uppercase font-bold truncate w-full px-1 opacity-80 text-center",
                      isActive ? "text-slate-300" : "text-slate-500"
                    )}>
                      {stage.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CONTENU DÉFILANT */}
        <div className="flex-1 w-full relative overflow-hidden">
          <div style={{ transform: `translateY(${translateY}px)` }} className="w-full flex flex-col pb-32 pt-4 px-4 relative z-10 transition-transform duration-[0ms]">
            <div className="bg-[#FAF6ED] rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden flex flex-col">
              <div className="relative z-10 p-6 flex-1">
                <div className="flex flex-row flex-nowrap items-center w-full overflow-x-hidden gap-2 mb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-[#EAE4D3]/80 px-2 py-1 rounded-md whitespace-nowrap">
                    {activeContentStage.dayLabel}
                  </span>
                  <span className="text-slate-300 flex-shrink-0">•</span>
                  <span className="text-[10px] font-bold text-[#F27D33] uppercase tracking-widest whitespace-nowrap">
                    {activeContentStage.period}
                  </span>
                </div>

                <h2 className="text-xl font-anton text-slate-800 mb-3 leading-tight tracking-wide uppercase break-words hyphens-auto">
                  {activeContentStage.title}
                </h2>

                <p className="text-[13px] text-slate-600 leading-relaxed max-w-4xl mb-6 font-medium border-l-4 border-slate-300 pl-4">
                  {activeContentStage.generalDescription}
                </p>

                <div className="space-y-6">
                  <h3 className="flex items-center text-lg text-slate-800 font-bebas tracking-wide mb-4 uppercase">
                    <Heart className="mr-2 text-[#F27D33]" size={18} fill="none" />
                    Processus par Feuillet
                  </h3>

                  <div className="grid gap-3">
                    {activeContentStage.events.map((event, idx) => {
                      const isPlaying = playingVideoIdx === idx;
                      return (
                      <div
                        key={idx}
                        onClick={() => {
                            if (event.videoUrl) setPlayingVideoIdx(isPlaying ? null : idx);
                        }}
                        className={cn(
                          "group relative flex flex-col items-start bg-white rounded-[1rem] p-4 border shadow-sm transition-all duration-300",
                          event.videoUrl ? "cursor-pointer hover:border-slate-400 border-slate-300" : "border-slate-200"
                        )}
                      >
                        {event.order && (
                          <div className="absolute -left-2 -top-2 w-6 h-6 rounded-full bg-[#FAF6ED] border-2 border-slate-200 shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-400 z-10 font-anton">
                            {event.order}
                          </div>
                        )}

                        <div className="w-full mb-2">
                          {event.layer !== 'N/A' && (
                          <span className={cn(
                            "inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider whitespace-nowrap",
                            layerColors[event.layer] || "bg-slate-100 text-slate-500 border-slate-200"
                          )}>
                            {event.layer}
                          </span>
                          )}
                        </div>

                        <div className="w-full flex flex-col">
                          <div className="flex items-center justify-between w-full mb-1">
                            <h4 className="text-slate-800 font-bold text-[14px] font-sans">
                                {event.movement}
                            </h4>
                            {(event as any).videoUrl && (
                                <div className="text-[10px] bg-red-600 text-white px-2 py-1 rounded-full flex items-center gap-1 font-bold tracking-widest uppercase">
                                    <Video size={10} strokeWidth={3} /> {isPlaying ? 'Fermer' : 'Vidéo'}
                                </div>
                            )}
                          </div>
                          <p className="text-slate-600 text-[12px] leading-relaxed font-medium">
                            {event.description}
                          </p>

                          {(event as any).videoUrl && isPlaying && (
                            <div className="w-full mt-4 rounded-xl overflow-hidden bg-black aspect-video relative shadow-inner">
                              <iframe
                                src={(event as any).videoUrl}
                                className="absolute inset-0 w-full h-full border-0"
                                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                allowFullScreen
                              ></iframe>
                            </div>
                          )}
                        </div>
                      </div>
                    )})}
                  </div>

                  {activeContentStage.mermaidCode && (
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <h3 className="flex items-center text-lg text-slate-800 font-bebas tracking-wide mb-4 uppercase">
                        <GitCommitHorizontal className="mr-2 text-[#b91c1c]" size={18} fill="none" strokeWidth={2.5} />
                        Ciné-Dynamique
                      </h3>
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center font-sans text-sm pb-8">
                        {/* J1 Mermaid Mock */}
                        {activeContentStage.id === 'j-1' && (
                          <div className="flex flex-col items-center w-full">
                            <div className="border border-slate-300 rounded px-6 py-3 text-center bg-white text-slate-700 shadow-sm z-10 text-[11px] w-full max-w-[180px]">
                              Fécondation
                            </div>
                            
                            <div className="h-4 w-px bg-slate-300 relative my-1">
                                <div className="absolute -bottom-1 -left-1 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-300" />
                            </div>
                            
                            <div className="border border-slate-300 rounded-full px-6 py-3 text-center bg-white text-slate-700 shadow-sm z-10 text-[11px] w-full max-w-[180px]">
                              Reconnaissance ZP3
                            </div>
                            
                            <div className="h-4 w-px bg-slate-300 relative my-1">
                                <div className="absolute -bottom-1 -left-1 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-300" />
                            </div>

                            <div className="border border-slate-300 rounded px-6 py-3 text-center bg-white text-slate-700 shadow-sm z-10 text-[11px] w-full max-w-[180px]">
                              Choc Électromagnétique
                            </div>
                            
                            <div className="h-4 w-px bg-slate-300 relative my-1">
                                <div className="absolute -bottom-1 -left-1 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-300" />
                            </div>

                            <div className="border border-slate-300 rounded-full px-6 py-3 text-center bg-white text-slate-700 shadow-sm z-10 text-[11px] w-full max-w-[180px]">
                              Vague Calcique
                            </div>
                            
                            <div className="flex justify-between w-full max-w-[280px] relative mt-1 h-[30px]">
                              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 280 30">
                                <path d="M 140,0 C 140,15 65,15 65,25" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
                                <path d="M 140,0 C 140,15 215,15 215,25" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
                                <polygon points="61 24, 69 24, 65 30" fill="#cbd5e1" />
                                <polygon points="211 24, 219 24, 215 30" fill="#cbd5e1" />
                              </svg>
                            </div>

                            <div className="flex justify-between w-full max-w-[300px] mt-1 gap-2">
                                <div className="flex-1 border-2 border-[#F2B729] rounded bg-white text-[#F2B729] text-[10px] text-center p-3 z-10">
                                  Fondation Diencéphale<br/>Polarité Sensorielle
                                </div>
                                <div className="flex-1 border border-slate-300 rounded bg-white text-slate-700 text-[10px] text-center p-3 z-10">
                                  Figeage Axe<br/>Crânio-Caudal
                                </div>
                            </div>
                          </div>
                        )}

                        {/* J7-14 Mermaid Mock */}
                        {activeContentStage.id === 'j-7-14' && (
                          <div className="flex flex-col items-center w-full">
                            <div className="border border-slate-300 rounded px-6 py-3 text-center bg-white text-slate-700 shadow-sm z-10 text-[11px] w-full max-w-[240px]">
                              Croissance Périphérique<br/>Différentielle
                            </div>
                            
                            <div className="h-6 w-px bg-slate-300 relative my-1">
                                <div className="absolute -bottom-1 -left-1 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-300" />
                            </div>
                            
                            <div className="border-2 border-[#F27D33] rounded px-6 py-3 text-center bg-white text-[#F27D33] shadow-sm z-10 text-[11px] w-full max-w-[240px]">
                              Traction Arachnoïdienne
                            </div>
                            
                            <div className="h-6 w-px bg-slate-300 relative my-1">
                                <div className="absolute -bottom-1 -left-1 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-300" />
                            </div>

                            <div className="border-2 border-[#F27D33] rounded px-6 py-3 text-center bg-white text-[#F27D33] shadow-sm z-10 text-[11px] w-full max-w-[240px]">
                              Déchirement du Réticulum
                            </div>
                            
                            <div className="h-6 w-px bg-slate-300 relative my-1">
                                <div className="absolute -bottom-1 -left-1 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-300" />
                            </div>

                            <div className="border-2 border-[#F27D33] rounded px-6 py-3 text-center bg-white text-[#F27D33] shadow-sm z-10 text-[11px] w-full max-w-[240px]">
                              Création Cœlome Externe<br/>Mésoderme Extra-Embryonnaire
                            </div>
                          </div>
                        )}

                        {/* Simulation statique simplifiée du graphe Mermaid de J28 */}
                        {activeContentStage.id === 'j-28' && (
                          <div className="flex flex-col items-center w-full">
                            <div className="border border-slate-300 rounded px-4 py-2 text-center bg-white text-slate-700 shadow-sm z-10 text-[11px] mb-6 relative">
                              Enroulement Global Terminal
                            </div>
                            <div className="flex justify-between w-full max-w-[280px] relative -mt-[38px]">
                              {/* Lignes de connexion */}
                              <svg className="absolute top-0 left-0 w-full h-[60px] pointer-events-none z-0 overflow-visible" viewBox="0 0 280 60">
                                <path d="M 140,15 C 140,30 40,30 40,55" fill="none" stroke="#e2e8f0" strokeWidth="1.5" markerStart="url(#arrowhead)" />
                                <path d="M 140,15 C 140,30 240,30 240,55" fill="none" stroke="#e2e8f0" strokeWidth="1.5" markerStart="url(#arrowhead)" />
                                <defs>
                                  <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                                    <polygon points="0 0, 6 3, 0 6" fill="#cbd5e1" />
                                  </marker>
                                </defs>
                                <polyline points="40,53 37,45 43,45" fill="#cbd5e1" />
                                <polyline points="240,53 237,45 243,45" fill="#cbd5e1" />
                              </svg>

                              <div className="w-[120px] border-2 border-[#5A9C51] rounded bg-white text-[#5A9C51] text-[10px] text-center p-2 mt-12 z-10 bg-opacity-90">
                                Fermeture du Neuropore Postérieur
                              </div>
                              <div className="w-[120px] border-2 border-[#F27D33] rounded bg-white text-[#F27D33] text-[10px] text-center p-2 mt-12 z-10 bg-opacity-90">
                                Intégration Finale du Cœlome Externe
                              </div>
                            </div>
                          </div>
                        )}
                        {/* J14-21 Mermaid Mock */}
                        {activeContentStage.id === 'j-14-21' && (
                          <div className="flex flex-col items-center w-full gap-4 relative">
                            <div className="flex justify-between w-full max-w-[280px]">
                                <div className="w-[120px] border-2 border-[#5A9C51] rounded bg-white text-[#5A9C51] text-[10px] text-center p-2 z-10">
                                  Ligne Primitive
                                </div>
                                <div className="w-[120px] border-2 border-[#5A9C51] rounded bg-white text-[#5A9C51] text-[10px] text-center p-2 z-10">
                                  Champ d'Aspiration
                                </div>
                            </div>
                            <svg className="absolute top-[16px] left-[130px] w-[30px] h-[10px]" viewBox="0 0 30 10">
                               <polyline points="20,0 30,5 20,10" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
                               <line x1="0" y1="5" x2="30" y2="5" stroke="#cbd5e1" strokeWidth="1.5" />
                            </svg>
                            <div className="w-[180px] border-2 border-[#F27D33] rounded bg-white text-[#F27D33] text-[10px] text-center p-2 z-10 ml-auto mr-4">
                                Invagination Bottle Cells
                            </div>
                            <div className="w-[180px] border-2 border-[#F27D33] rounded bg-white text-[#F27D33] text-[10px] text-center p-2 z-10 ml-auto mr-4">
                                Naissance du Mésoderme 3ème Tissu
                            </div>
                            <div className="w-[180px] border border-slate-400 rounded bg-white text-slate-700 text-[10px] text-center p-2 z-10 mr-auto ml-4 mt-2">
                                Rotation Ciliaire 60°
                            </div>
                            <div className="w-[180px] border border-slate-400 rounded bg-white text-slate-700 text-[10px] text-center p-2 z-10 mr-auto ml-4">
                                Asymétrie Gauche-Droite
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeContentStage.practicalIntegration && (
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <h3 className="flex items-center text-lg text-slate-800 font-bebas tracking-wide mb-4 uppercase">
                        <Sparkles className="mr-2 text-[#F27D33]" size={18} />
                        Intégration Pratique
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                          <div>
                            <h4 className="flex items-center text-slate-800 font-semibold text-[13px] mb-2 uppercase tracking-wide">
                              <Eye size={16} className="mr-2 text-[#F27D33]" /> Fulcrums
                            </h4>
                            <p className="text-slate-600 text-[12px] leading-relaxed font-medium">{activeContentStage.practicalIntegration.fulcrums}</p>
                          </div>
                          <div>
                            <h4 className="flex items-center text-slate-800 font-semibold text-[13px] mb-2 uppercase tracking-wide">
                              <Stethoscope size={16} className="mr-2 text-[#F27D33]" /> Palpation
                            </h4>
                            <p className="text-slate-600 text-[12px] leading-relaxed font-medium">{activeContentStage.practicalIntegration.generalPalpation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATIC MOBILE BOTTOM NAVIGATION (Matches AppVideoLibrary exactly) */}
      <nav className="absolute bottom-0 w-full bg-[#FAF6ED]/95 backdrop-blur-xl border-t border-slate-200 pb-[24px] shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.05)] flex justify-between px-2 pt-3 z-40">
          <div className="flex flex-col items-center flex-1 text-slate-500">
              <Home size={20} strokeWidth={2} />
              <span className="mt-1 text-[8px] font-medium text-center">Accueil</span>
          </div>
          <div className="flex flex-col items-center flex-1 text-slate-800 relative">
              <Clock size={20} strokeWidth={2.5} />
              <div className="absolute opacity-100 top-0"><Clock size={20} strokeWidth={2.5} color="#1E293B" /></div>
              <span className="mt-1 text-[8px] font-bold text-center relative top-[1px]">Chronologie</span>
          </div>
          <div className="flex flex-col items-center flex-1 text-slate-500">
              <Video size={20} strokeWidth={2} />
              <span className="mt-1 text-[8px] font-medium text-center">Vidéos</span>
          </div>
          <div className="flex flex-col items-center flex-1 text-slate-500">
              <Brain size={20} strokeWidth={2} />
              <span className="mt-1 text-[8px] font-medium text-center truncate">Assistant ...</span>
          </div>
          <div className="flex flex-col items-center flex-1 text-slate-500">
              <div className="w-5 h-5 rounded-full overflow-hidden flex border border-slate-200">
                  <div className="flex-1 bg-blue-700 h-full"></div>
                  <div className="flex-1 bg-white h-full"></div>
                  <div className="flex-1 bg-red-600 h-full"></div>
              </div>
              <span className="mt-1 text-[8px] font-medium text-center">FR</span>
          </div>
      </nav>

    </div>
  );
};
