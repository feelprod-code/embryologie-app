import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Headphones, X, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { type PodcastItem, podcastsData as podcastsDataFr } from '../data/podcasts';
import { podcastsData as podcastsDataEn } from '../data/podcasts_en';
import { podcastsData as podcastsDataEs } from '../data/podcasts_es';
import { useTranslation } from 'react-i18next';

interface PodcastPlayerPageProps {
    podcast: PodcastItem;
    onBack: () => void;
}

export const PodcastPlayerPage: React.FC<PodcastPlayerPageProps> = ({ podcast: initialPodcast, onBack }) => {
    const { t, i18n } = useTranslation();

    const podcastsData = i18n.language.startsWith('en')
        ? podcastsDataEn
        : i18n.language.startsWith('es')
            ? podcastsDataEs
            : podcastsDataFr;

    const podcast = podcastsData.find(p => p.id === initialPodcast.id) || initialPodcast;

    const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);

    return (
        <div className="flex flex-col items-center w-full h-full bg-slate-50 relative overflow-hidden animate-fade-in z-50">
            {/* Bouton de Retour Global */}
            <button
                onClick={onBack}
                className="absolute top-4 left-4 md:top-6 md:left-6 z-50 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md text-slate-700 hover:text-primary rounded-full shadow-lg border border-slate-200 hover:scale-105 transition-all"
                aria-label={t('podcasts.backToLibrary')}
                title={t('podcasts.backToLibrary')}
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
                        title={t('podcasts.clickToReadSummary')}
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
                                    <span className="font-bebas tracking-wide text-white text-xl uppercase">{t('podcasts.readSummary')}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl shadow-2xl bg-slate-800 flex flex-col items-center justify-center text-slate-400 border-4 border-white transition-transform duration-300 group-hover:scale-105">
                                <Headphones size={48} className="opacity-50" />
                                <span className="mt-4 font-bebas text-xl tracking-widest uppercase">{t('podcasts.podcastType')}</span>
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
                                {t('podcasts.browserNoAudioSupport')}
                            </audio>
                        </div>
                    ) : (
                        <div className="w-full max-w-lg mt-4 bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 flex flex-col items-center gap-3 z-40">
                            <Headphones size={32} className="text-slate-300" />
                            <p className="text-slate-500 font-medium">{t('podcasts.audioNotConfigured')}</p>
                        </div>
                    )}
                </div>

                {/* Partie Inférieure : Fenêtre de Retranscription */}
                <div className="flex-1 w-full bg-white rounded-t-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.06)] border-t border-slate-200 overflow-hidden flex flex-col relative z-30">
                    <div className="shrink-0 w-full px-6 py-4 border-b border-slate-100 bg-slate-50/90 backdrop-blur-sm flex justify-center sticky top-0 z-20">
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white text-slate-700 rounded-full text-sm font-bold uppercase tracking-widest shadow-sm border border-slate-200">
                            <BookOpen size={18} className="text-primary" />
                            {t('podcasts.transcript')}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar relative">
                        <div className="p-6 md:p-10 lg:p-14 pb-32">
                            {podcast.transcript ? (
                                <div className="prose prose-slate bg-transparent lg:prose-lg max-w-none text-slate-700 leading-loose text-[15px] md:text-lg
                                    prose-h1:font-anton prose-h1:text-dark prose-h1:uppercase prose-h1:tracking-wide prose-h1:text-4xl prose-h1:mb-8
                                    prose-h2:font-bebas prose-h2:text-primary prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5
                                    prose-h3:font-montserrat prose-h3:font-bold prose-h3:text-xl prose-h3:text-slate-800
                                    prose-p:mb-6 md:prose-p:mb-8
                                    prose-strong:text-dark prose-strong:font-bold
                                    prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-primary/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:shadow-sm prose-blockquote:italic prose-blockquote:my-8
                                    prose-ul:my-6 prose-li:my-2 prose-li:leading-relaxed
                                ">
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                        {podcast.transcript.replace(/\n(?!#)/g, '\n\n').replace(/\n{3,}/g, '\n\n')}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-slate-400 gap-4 mt-8">
                                    <BookOpen size={48} className="opacity-20" />
                                    <p className="text-xl font-medium text-center" dangerouslySetInnerHTML={{ __html: t('podcasts.transcriptNotAvailable') }}></p>
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
                                    {t('podcasts.episodeSummary')}
                                </span>
                                <h3 className="font-bebas text-2xl md:text-3xl tracking-wide text-dark uppercase leading-none">
                                    {podcast.title}
                                </h3>
                            </div>
                            <button
                                onClick={() => setSummaryModalOpen(false)}
                                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-all shadow-sm shrink-0 ml-4"
                                aria-label={t('podcasts.closeSummary')}
                                title={t('podcasts.closeSummary')}
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
                                {t('podcasts.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
