import { ArrowLeft, Headphones, ExternalLink } from 'lucide-react';
import { podcastsData, type PodcastItem } from '../data/podcasts';

interface PodcastLibraryListProps {
    onNavigate: (view: 'timeline' | 'home' | 'video-library') => void;
    onSelectPodcast: (podcast: PodcastItem) => void;
}

export function PodcastLibraryList({ onNavigate, onSelectPodcast }: PodcastLibraryListProps) {
    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in pb-16 px-4">

            {/* Header (Même style que Vidéothèque & Chronologie) */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 gap-4">
                <div className="flex flex-col items-center sm:items-start">
                    <div className="inline-flex items-center justify-center border border-primary/20 bg-primary/5 px-4 py-1.5 rounded-full shadow-sm mb-3 sm:mb-4">
                        <span className="text-xs md:text-sm font-bold text-primary uppercase tracking-widest text-center flex items-center gap-2">
                            <Headphones size={16} /> Écouter & Approfondir
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-anton text-dark uppercase tracking-widest text-center sm:text-left drop-shadow-sm">
                        Ressources <span className="text-primary">&</span> Podcasts
                    </h1>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4 shrink-0 mt-4 sm:mt-0">
                    <button
                        onClick={() => onNavigate('home')}
                        className="group relative inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3.5 bg-dark text-white font-bebas text-base sm:text-xl tracking-widest uppercase rounded-xl sm:rounded-2xl transition-all hover:bg-black shadow-md hover:shadow-lg overflow-hidden shrink-0"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        <ArrowLeft size={20} className="mr-2 sm:mr-3 group-hover:-translate-x-1 transition-transform" />
                        Retour Accueil
                    </button>
                </div>
            </div>

            {/* Grille des Ressources (Podcasts & Liens) */}
            <h2 className="text-2xl font-anton text-slate-800 uppercase tracking-widest pl-2 mb-6 border-l-4 border-primary">
                Toutes les Ressources
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {podcastsData.map((item, index) => {
                    const content = (
                        <div
                            key={item.id}
                            className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={item.externalLink ? undefined : () => onSelectPodcast(item)}
                        >
                            {/* Image Carrée */}
                            <div className="relative w-full aspect-square overflow-hidden bg-blue-900 shrink-0">
                                {item.thumbnailUrl ? (
                                    <>
                                        <img
                                            src={item.thumbnailUrl}
                                            alt={item.title}
                                            className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-blue-500/30 mix-blend-multiply pointer-events-none"></div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-blue-200">
                                        {item.externalLink ? <ExternalLink size={48} className="opacity-50" /> : <Headphones size={48} className="opacity-50" />}
                                    </div>
                                )}

                                {/* Play Overlay sur Hover */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                                        {item.externalLink ? <ExternalLink size={28} className="ml-0.5" /> : <Headphones size={28} className="ml-1" />}
                                    </div>
                                </div>

                                {/* Badge "Nouveau" ou "Highlight" */}
                                {item.isHighlight && (
                                    <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-md z-10">
                                        À la une
                                    </div>
                                )}
                            </div>

                            {/* Contenu Textuel */}
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="font-bebas text-2xl text-dark leading-tight mb-2 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    );

                    if (item.externalLink) {
                        return (
                            <a key={item.id} href={item.externalLink} target="_blank" rel="noopener noreferrer" className="block outline-none h-full">
                                {content}
                            </a>
                        );
                    }

                    return <div key={item.id} className="block outline-none h-full">{content}</div>;
                })}
            </div>

        </div>
    );
}
