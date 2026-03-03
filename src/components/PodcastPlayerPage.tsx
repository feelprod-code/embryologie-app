import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Headphones, X, Info } from 'lucide-react';
import { type PodcastItem } from '../data/podcasts';

interface PodcastPlayerPageProps {
    podcast: PodcastItem;
    onBack: () => void;
}

export const PodcastPlayerPage: React.FC<PodcastPlayerPageProps> = ({ podcast, onBack }) => {
    const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);

    return (
        <div className="flex flex-col items-center w-full h-full bg-slate-50 relative overflow-hidden animate-fade-in z-50">
            {/* Bouton de Retour Global */}
            <button
                onClick={onBack}
                className="absolute top-4 left-4 md:top-6 md:left-6 z-50 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md text-slate-700 hover:text-primary rounded-full shadow-lg border border-slate-200 hover:scale-105 transition-all"
                aria-label="Retour à la bibliothèque"
            >
                <ArrowLeft size={24} />
            </button>

            {/* Container Centralisé */}
            <div className="w-full max-w-4xl h-full flex flex-col relative px-4 md:px-8">

                {/* Partie Supérieure : Vignette Interactive, Titre et Lecteur Audio */}
                <div className="flex-shrink-0 pt-20 md:pt-16 pb-6 flex flex-col items-center justify-center gap-6">
                    {/* Vignette Carrée Interactive */}
                    <div
                        className="relative group cursor-pointer"
                        onClick={() => setSummaryModalOpen(true)}
                        title="Cliquez pour lire le résumé complet"
                    >
                        {podcast.thumbnailUrl ? (
                            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-[1.03] border-4 border-white">
                                <img
                                    src={podcast.thumbnailUrl}
                                    alt={podcast.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Info size={36} className="text-white mb-2" />
                                    <span className="font-bebas tracking-wide text-white text-xl uppercase">Lire le résumé</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl shadow-2xl bg-slate-800 flex flex-col items-center justify-center text-slate-400 border-4 border-white transition-transform duration-300 group-hover:scale-105">
                                <Headphones size={48} className="opacity-50" />
                                <span className="mt-4 font-bebas text-xl tracking-widest uppercase">Podcast</span>
                            </div>
                        )}
                    </div>

                    {/* Lecteur Audio Custom */}
                    {podcast.audioUrl ? (
                        <div className="w-full max-w-lg mt-4 z-40">
                            <audio
                                controls
                                className="w-full rounded-2xl bg-slate-50 h-14"
                                src={podcast.audioUrl}
                                controlsList="nodownload"
                            >
                                Votre navigateur ne supporte pas l'élément audio.
                            </audio>
                        </div>
                    ) : (
                        <div className="w-full max-w-lg mt-4 bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 flex flex-col items-center gap-3 z-40">
                            <Headphones size={32} className="text-slate-300" />
                            <p className="text-slate-500 font-medium">Fichier audio non configuré.</p>
                        </div>
                    )}
                </div>

                {/* Partie Inférieure : Fenêtre de Retranscription */}
                <div className="flex-1 w-full bg-white rounded-t-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.06)] border-t border-slate-200 overflow-hidden flex flex-col relative z-30">
                    <div className="shrink-0 w-full px-6 py-4 border-b border-slate-100 bg-slate-50/90 backdrop-blur-sm flex justify-center sticky top-0 z-20">
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white text-slate-700 rounded-full text-sm font-bold uppercase tracking-widest shadow-sm border border-slate-200">
                            <BookOpen size={18} className="text-primary" />
                            Retranscription
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar relative">
                        <div className="p-6 md:p-10 lg:p-14 pb-32">
                            {podcast.transcript ? (
                                <div className="prose prose-slate bg-transparent lg:prose-lg max-w-none text-slate-700 leading-relaxed
                                    prose-h1:font-anton prose-h1:text-dark prose-h1:uppercase prose-h1:tracking-wide
                                    prose-h2:font-bebas prose-h2:text-primary prose-h2:text-3xl prose-h2:mb-4
                                    prose-h3:font-bold prose-h3:text-slate-800
                                    prose-p:mb-6
                                    prose-strong:text-dark prose-strong:font-bold
                                    prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic
                                    prose-ul:my-6 prose-li:my-2
                                ">
                                    {podcast.transcript.split('\n\n').map((paragraph, index) => {
                                        if (paragraph.startsWith('### ')) {
                                            return <h3 key={index}>{paragraph.replace('### ', '')}</h3>;
                                        } else if (paragraph.startsWith('## ')) {
                                            return <h2 key={index}>{paragraph.replace('## ', '')}</h2>;
                                        } else if (paragraph.startsWith('# ')) {
                                            return <h1 key={index}>{paragraph.replace('# ', '')}</h1>;
                                        } else if (paragraph.startsWith('> ')) {
                                            return <blockquote key={index}><p>{paragraph.replace('> ', '')}</p></blockquote>;
                                        }
                                        return <p key={index}>{paragraph}</p>;
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-slate-400 gap-4 mt-8">
                                    <BookOpen size={48} className="opacity-20" />
                                    <p className="text-xl font-medium text-center">La retranscription de ce podcast<br />n'est pas encore disponible.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal du Résumé */}
            {isSummaryModalOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-fade-in"
                    onClick={() => setSummaryModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Modal */}
                        <div className="flex flex-shrink-0 items-center justify-between p-6 border-b border-slate-100 bg-slate-50 relative z-10">
                            <div>
                                <span className="text-primary text-xs font-bold uppercase tracking-widest mb-1 block">
                                    Résumé de l'épisode
                                </span>
                                <h3 className="font-bebas text-2xl md:text-3xl tracking-wide text-dark uppercase leading-none">
                                    {podcast.title}
                                </h3>
                            </div>
                            <button
                                onClick={() => setSummaryModalOpen(false)}
                                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-all shadow-sm shrink-0 ml-4"
                                aria-label="Fermer le résumé"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Contenu Modal */}
                        <div className="p-6 md:p-8 overflow-y-auto no-scrollbar relative">
                            <div className="prose prose-slate prose-lg md:prose-xl max-w-none text-slate-700 leading-relaxed font-serif">
                                {podcast.description.split('\n\n').map((p, i) => (
                                    <p key={i} className="mb-4">{p}</p>
                                ))}
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="flex-shrink-0 p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                            <button
                                onClick={() => setSummaryModalOpen(false)}
                                className="px-6 py-2 bg-dark hover:bg-primary text-white font-bebas text-xl tracking-wider uppercase rounded-xl transition-colors shadow-md"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
