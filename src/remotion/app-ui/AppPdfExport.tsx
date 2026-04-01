import React from 'react';

export const AppPdfExport: React.FC<{
    frameScrollOffset: number; // to control progressive internal scroll
}> = ({ frameScrollOffset }) => {
    return (
        <div 
            className="w-[850px] bg-[#FAF8F5] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-slate-200 flex flex-col items-center p-16 font-sans text-slate-700 relative overflow-hidden" 
            style={{ 
                minHeight: '2000px',
                transform: `translateY(${frameScrollOffset}px)`
            }}
        >
            {/* Header Watermark */}
            <div className="absolute top-8 left-0 w-full flex justify-between px-16 text-[11px] tracking-[0.5em] text-slate-300 font-bold select-none opacity-80">
                E M B R Y O A I &nbsp;&nbsp;&nbsp;&nbsp; E M B R Y O A I &nbsp;&nbsp;&nbsp;&nbsp; E M B R Y O A I &nbsp;&nbsp;&nbsp;&nbsp; E M B R Y O A I
            </div>

            <div className="w-full border-b-2 border-[#9B6B56]/20 pb-8 mb-12 mt-10 flex flex-col items-center text-center">
                <h1 className="font-bebas text-[#9B6B56] text-[55px] tracking-[0.15em] leading-none mb-8">
                    DOCUMENT DE SYNTHÈSE
                </h1>
                
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 w-full max-w-[85%]">
                    <h2 className="text-[#9B6B56] font-bold text-[15px] tracking-[0.3em] uppercase mb-4 opacity-90">
                        QUESTION
                    </h2>
                    <p className="font-serif text-[26px] font-medium text-slate-800 italic">
                        " Le LCR "
                    </p>
                </div>
            </div>

            <div className="w-full flex-1 flex flex-col gap-10 text-[19px] leading-[1.75] text-slate-600 px-4 pb-32">
                
                <div className="flex items-center gap-6 mb-2">
                    <div className="h-px bg-[#9B6B56]/40 flex-1" />
                    <h3 className="font-bold text-[#1c2e4a] text-[13px] uppercase tracking-widest text-center max-w-[60%]">
                        RÉPONSE D'APRÈS L'ENSEIGNEMENT DE MARC DAMOISEAUX
                    </h3>
                    <div className="h-px bg-[#9B6B56]/40 flex-1" />
                </div>

                <p className="font-medium text-[21px] text-slate-800">
                    Bonjour ! Le Liquide Céphalo-Rachidien (LCR) est en effet un sujet fascinant et central en embryologie biodynamique. Voici une explication structurée, en nous basant prioritairement sur les enseignements de Marc Damoiseaux.
                </p>

                <div className="mt-4">
                    <h4 className="font-bebas text-[#9B6B56] text-[40px] tracking-wide mb-4 leading-none">
                        Le Liquide Céphalo-Rachidien (LCR) en Embryologie Biodynamique
                    </h4>
                    <p>
                        Le LCR est bien plus qu'un simple guide mécanique de protection et de nutrition pour le système nerveux. Dans l'approche biodynamique, il est considéré comme une expression fluidique du Souffle de Vie, porteur de l'information originelle et du plan de santé de l'individu.
                    </p>
                </div>

                <div className="mt-4">
                    <h4 className="font-bebas text-[#9B6B56] text-[32px] tracking-wide mb-4 leading-none">
                        L'Origine Amniotique : Le LCR Primitif
                    </h4>
                    <p className="mb-5">
                        L'un des points fondamentaux enseignés par Marc Damoiseaux est que l'origine du LCR est à chercher bien avant la formation des plexus choroïdes.
                    </p>
                    <p className="mb-6">
                        Le tout premier LCR est en réalité le liquide amniotique primitif. Dès le 7ème jour, lors de la nidation et de l'apparition de la cavité amniotique par exsudat, le fluide qui la remplit constituera la source directe du LCR.
                    </p>
                    <p className="mb-6 text-slate-500 italic">
                        Source: Jours 5 à 8 - L'Éclosion et la Nidation
                    </p>
                    <p className="mb-6">
                        Ce liquide va être "capturé" à l'intérieur de l'embryon lors du processus de <strong className="text-slate-800">neurulation</strong>. Lorsque l'ectoderme se creuse pour former la gouttière neurale puis le tube neural, il incorpore ce liquide amniotique primitif.
                    </p>
                    <p className="mb-6 italic pl-4 border-l-4 border-slate-300">
                        Comme le précise Marc Damoiseaux : "Au-dessus de cette plaque neurale, nous trouverons plus tard le <strong className="text-slate-800">liquide céphalo-rachidien primitif</strong>, issu de la cavité amniotique. (...) Le <strong className="text-slate-800">système ventriculaire</strong> et ce liquide au centre de soi ne sont autres que du liquide amniotique."
                    </p>

                    <div className="bg-[#5A9C51]/10 border border-[#5A9C51]/30 rounded-xl p-4 text-[#5A9C51] font-bold text-[15px] flex items-center justify-between">
                        <span>L'Ectoderme • 14 - Implantation et Cavité Amniotique</span>
                        <div className="w-8 h-8 rounded-full bg-[#5A9C51] text-white flex items-center justify-center text-[18px] pb-1">▸</div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="font-bebas text-[#9B6B56] text-[32px] tracking-wide mb-4 leading-none uppercase">
                        L'Héritage Fluidique : La Zone B et l'Équilibre des Pressions
                    </h4>
                    <p className="mb-5">
                        Cette origine commune crée un lien indissociable entre le liquide <em className="italic">à l'intérieur</em> du système nerveux (le LCR intra-crânien et intra-spinal) et le champ fluidique qui reste <em className="italic">à l'extérieur</em> du corps physique, qui est la trace énergétique de la cavité amniotique originelle, appelée la <strong className="text-slate-800">Zone B</strong>.
                    </p>
                    <p className="mb-6">
                        L'embryon, puis le fœtus, baigne dans cette "poche des eaux", créant une information de <strong className="text-slate-800">pression interne et externe</strong> constante et cruciale pour son développement.
                    </p>
                    
                    <div className="bg-[#5A9C51]/10 border border-[#5A9C51]/30 rounded-xl p-4 text-[#5A9C51] font-bold text-[15px] flex items-center justify-between mb-6">
                        <span>L'Ectoderme • 14 - Implantation et Cavité Amniotique</span>
                        <div className="w-8 h-8 rounded-full bg-[#5A9C51] text-white flex items-center justify-center text-[18px] pb-1">▸</div>
                    </div>

                    <p className="mb-6">
                        En pratique clinique, cette double notion de LCR est fondamentale. Une technique comme la <strong className="text-slate-800">CV4 (compression du 4ème ventricule)</strong> vise précisément à rééquilibrer les flux et les pressions entre le <strong className="text-slate-800">LCR intra-crânien</strong> et le <strong className="text-slate-800">LCR extra-crânien (Zone B)</strong>. Le but est de restaurer une harmonie entre le microcosme (l'individu) et son environnement fluidique originel.
                    </p>
                    <p className="mb-6 text-slate-500 italic">
                        Source: Jours 21 à 22 - Neurulation, Oeil et Cœur
                    </p>
                </div>

                <div className="mt-6">
                    <h4 className="font-bebas text-[#9B6B56] text-[32px] tracking-wide mb-4 leading-none uppercase">
                        Rôle Clinique et Physiologique
                    </h4>
                    <h5 className="font-bold text-slate-800 text-[20px] mb-3 uppercase tracking-wide">LE "CONTRÔLEUR" DU CORPS</h5>
                    <p className="mb-6">
                        Sur le plan physiologique, Marc Damoiseaux décrit le LCR comme le <strong className="text-slate-800">"contrôleur"</strong> qui assure l'équilibre moléculaire et hormonal spécifique du corps. Sa fabrication se fait via les <strong className="text-slate-800">plexus choroïdes</strong> et sa résorption par les <strong className="text-slate-800">granulations de Pacchioni</strong> dans le système veineux.
                    </p>

                    <div className="bg-[#F27D33]/10 border border-[#F27D33]/30 rounded-xl p-4 text-[#F27D33] font-bold text-[15px] flex items-center justify-between">
                        <span>Le Mésoderme • 19 - Le Systeme Veineux : Notes</span>
                        <div className="w-8 h-8 rounded-full bg-[#F27D33] text-white flex items-center justify-center text-[18px] pb-1">▸</div>
                    </div>
                </div>

                <div className="mt-6">
                    <h5 className="font-bold text-slate-800 text-[20px] mb-3 uppercase tracking-wide">LE VÉHICULE DE LA "POTENCY" (HORS DU COURS DE DAMOISEAUX)</h5>
                    <p className="mb-5">
                        Dans une vision biodynamique plus large, notamment influencée par les travaux de Sutherland et Jealous, le LCR est le véhicule de <strong className="text-slate-800">l'intelligence du Souffle de Vie</strong>. Sa fluctuation rythmique, la "Marée" (Tide), transporte une force thérapeutique organisatrice appelée la "Potency". Un praticien en biodynamie "écoute" cette fluctuation pour percevoir l'état de santé du système et accompagner sa réorganisation vers son plan de santé originel ("Blueprint").
                    </p>
                    <p className="mb-4">
                        La qualité de la fluctuation du LCR informe le praticien sur les fulcrums (points d'appui) autour desquels la force de vie s'organise ou est entravée.
                    </p>
                </div>

                <div className="mt-6">
                    <h4 className="font-bebas text-[#9B6B56] text-[32px] tracking-wide mb-6 leading-none uppercase">
                        EN RÉSUMÉ POUR LA PRATIQUE
                    </h4>
                    
                    <ul className="space-y-6">
                        <li className="flex gap-4">
                            <div className="w-2 h-2 rounded-full bg-[#9B6B56] mt-2 flex-shrink-0" />
                            <p>
                                <strong className="text-slate-800">Origine Fondamentale</strong> L'origine première du LCR est le liquide de la cavité amniotique, qui apparaît vers J7. Cette connexion ne doit jamais être oubliée.
                            </p>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-2 h-2 rounded-full bg-[#9B6B56] mt-2 flex-shrink-0" />
                            <p>
                                <strong className="text-slate-800">Double Compartiment</strong> Pensez toujours au LCR en deux parties : intra-neural (dans les ventricules et le canal spinal) et extra-corporel (l'espace fluidique de la Zone B). Le but thérapeutique est souvent de rétablir la communication et l'équilibre entre les deux.
                            </p>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-2 h-2 rounded-full bg-[#9B6B56] mt-2 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="mb-4">
                                    <strong className="text-slate-800">Qualité Tissulaire</strong> La qualité de la peau (ectoderme) est directement liée à la qualité du LCR, car ils partagent tous deux l'information du liquide amniotique primitif. Agir sur l'un peut influencer l'autre.
                                </p>
                                <div className="bg-[#5A9C51]/10 border border-[#5A9C51]/30 rounded-xl p-4 text-[#5A9C51] font-bold text-[15px] flex items-center justify-between">
                                    <span>L'Ectoderme • 35 - La Plaque Neurale</span>
                                    <div className="w-8 h-8 rounded-full bg-[#5A9C51] text-white flex items-center justify-center text-[18px] pb-1">▸</div>
                                </div>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-2 h-2 rounded-full bg-[#9B6B56] mt-2 flex-shrink-0" />
                            <p>
                                <strong className="text-slate-800">L'Intelligence du LCR</strong> Plus qu'un simple fluide, c'est un milieu intelligent qui transporte le "plan de santé" originel. Accompagner sa fluctuation est un acte thérapeutique puissant pour permettre au corps de se réorganiser de l'intérieur.
                            </p>
                        </li>
                    </ul>
                </div>

                <div className="mt-10 mb-8 border-t border-slate-200 pt-8">
                    <p className="text-[17px] text-slate-500 italic text-center">
                        J'espère que cette synthèse vous éclaire sur la place centrale qu'occupe le LCR dans notre approche. N'hésitez pas si vous avez d'autres questions.
                    </p>
                </div>
                
                {/* Marge intérieure pour forcer le conteneur à être encore plus grand et laisser respirer le fond blanc */}
                <div className="w-full h-[600px] mt-8 shrink-0" />

            </div>

            {/* Pied de Page Blanc - Modifié pour remonter très haut et créer une vaste aération blanche à la fin */}
            <div className="absolute bottom-0 left-0 w-full h-[650px] bg-white pt-16 border-t border-slate-100 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between px-16">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-[#1c2e4a] flex items-center justify-center text-white font-bold text-[12px]">
                            AI
                        </div>
                        <span className="text-[14px] text-slate-400 font-bold tracking-wider">embryologie-app.vercel.app</span>
                    </div>
                    <span className="text-[14px] text-slate-400 font-bold tracking-wider">Page 1 sur 5</span>
                </div>
            </div>
            
        </div>
    );
};
