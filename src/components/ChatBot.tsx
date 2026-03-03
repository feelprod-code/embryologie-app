import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Loader2, PlayCircle, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { detailedStages } from '../data/embryologie';
import { videoCourses, type VideoCourse } from '../data/videoCourses';
import { podcastsData } from '../data/podcasts';
import { cn } from '../utils';

// Helper to stringify context
const getCourseContext = () => {
    let text = detailedStages.map(stage => {
        let t = `--- STADE: ${stage.title} (${stage.dayLabel} - ${stage.period}) ---\n`;
        t += `Description globale: ${stage.generalDescription}\n`;
        t += `Événements:\n`;
        stage.events.forEach(e => {
            t += `  - [Feuillet: ${e.layer}] ${e.movement}: ${e.description}\n`;
        });
        if (stage.practicalIntegration) {
            t += `Pratique Clinique:\n`;
            t += `  - Fulcrums: ${stage.practicalIntegration.fulcrums}\n`;
            t += `  - Palpation: ${stage.practicalIntegration.generalPalpation}\n`;
            t += `  - Posture: ${stage.practicalIntegration.therapistPosture}\n`;
            t += `  - Psychosomatique: ${stage.practicalIntegration.psychosomatic}\n`;
        }
        return t;
    }).join('\n\n');

    text += "\n\n=== TRANSCRIPTIONS DES COURS VIDÉOS (Mise en pratique et Théorie) ===\n";
    videoCourses.forEach(c => {
        if (c.transcriptMarkdown) {
            text += `\n--- VIDÉO: ${c.title} (Catégorie: ${c.categoryId}, ID_VIDEO: ${c.id}) ---\n`;
            text += c.transcriptMarkdown + "\n";
        }
    });

    text += "\n\n=== TRANSCRIPTIONS DES PODCASTS ===\n";
    podcastsData.forEach(p => {
        if (p.transcript) {
            text += `\n--- PODCAST: ${p.title} ---\n`;
            text += p.transcript + "\n";
        }
    });

    return text;
};

const SYSTEM_PROMPT = `Tu es "Embryo-Bot", un assistant virtuel expert en embryologie biodynamique, basé prioritairement sur les enseignements de Marc Damoiseaux, mais disposant d'une vaste connaissance externe sur le domaine (Blechschmidt, Jealous, Freeman, etc.).
Ton rôle est d'aider les étudiants ou praticiens en répondant à leurs questions de façon précise et clinique.

RÈGLE ABSOLUE NUMÉRO 1 : Tu dois D'ABORD chercher la réponse dans le contexte de Marc Damoiseaux fourni ci-dessous. Si tu la trouves, utilise-la et cite le stade (ex: "Source: J28 - Plis Céphalique").
RÈGLE ABSOLUE NUMÉRO 2 : Si la réponse n'est PAS dans le contexte de Marc Damoiseaux, tu es AUTORISÉ à utiliser tes connaissances générales externes sur l'embryologie (notamment biodynamique). Dans ce cas, tu DOIS obligatoirement préciser que cette information est "Hors du cours de Damoiseaux" et tu DOIS citer tes sources externes.
NOTE SPÉCIALE EXPERTISE JEALOUS : Pour toute question complexe sur l'approche de James Jealous (Biodynamique), tu peux te référer implicitement ou explicitement à la documentation et aux principes énoncés dans ses travaux.
RÈGLE ABSOLUE NUMÉRO 3 : Adopte un ton professionnel, encourageant, et précis.
RÈGLE ABSOLUE NUMÉRO 4 : Rédige tes réponses avec le plus grand soin visuel : aère le texte avec des paragraphes et mets les mots-clés en **gras**.
RÈGLE ABSOLUE NUMÉRO 5 : Lorsque tu cites ou fais référence à un cours vidéo, tu DOIS ABSOLUMENT formater la source exacte sous forme de lien markdown avec le protocole "video://" suivi STRICTEMENT de "l'ID_VIDEO". Ne mets JAMAIS d'url classique du type "https://". Exemple parfait: Si c'est une vidéo de l'Endoderme, écrit exactement ceci : [Source exacte](video://endoderme-01).

CONTEXTE DU COURS DE MARC DAMOISEAUX :
${getCourseContext()}
`;

type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

export const ChatBot: React.FC<{ onClose?: () => void; onNavigateToVideo?: (video: VideoCourse) => void }> = ({ onClose, onNavigateToVideo }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>(() => {
        const saved = localStorage.getItem('embryo_chat_history');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse chat history");
            }
        }
        return [
            { role: 'assistant', content: "Bonjour ! Je suis Embryo AI, votre assistant dédié au cours d'embryologie de Marc Damoiseaux.\n\nPosez-moi vos questions sur les **cascades cinétiques**, les **feuillets** ou la **pratique biodynamique**." }
        ];
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        localStorage.setItem('embryo_chat_history', JSON.stringify(messages));
    }, [messages]);

    const handleClearChat = () => {
        setMessages([
            { role: 'assistant', content: "Bonjour ! Je suis Embryo AI, votre assistant dédié au cours d'embryologie de Marc Damoiseaux.\n\nPosez-moi vos questions sur les **cascades cinétiques**, les **feuillets** ou la **pratique biodynamique**." }
        ]);
        localStorage.removeItem('embryo_chat_history');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);
        setError(null);

        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

        if (!apiKey) {
            setError("Clé API OpenRouter manquante. Veuillez configurer VITE_OPENROUTER_API_KEY dans votre fichier .env.local.");
            setIsLoading(false);
            return;
        }

        try {
            const apiMessages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages.filter(m => m.role !== 'system'),
                { role: 'user', content: userMessage }
            ];

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "Embryologie Biodynamique App",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "google/gemini-3.1-pro-preview", // Modèle Pro beaucoup plus performant demandé
                    messages: apiMessages,
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur réseau: ${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;

            setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
        } catch (err: any) {
            console.error("ChatBot Error:", err);
            setError("Désolé, une erreur est survenue lors de la communication avec l'IA. Vérifiez votre clé d'API ou votre connexion.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full bg-white flex flex-col pb-[env(safe-area-inset-bottom,16px)] min-h-[calc(100vh-80px)]">
            {/* Header Sticky */}
            {/* Header Sticky - Capsule Style */}
            <div className="sticky top-0 z-50 w-full bg-[#FAF9F6] pt-[env(safe-area-inset-top,4px)] md:pt-2 flex flex-col items-center shadow-sm md:shadow-none pb-2 md:pb-0 mb-4 px-2">
                <div className="flex items-center justify-center gap-3 sm:gap-4 relative w-full text-center animate-fade-in-up pb-1 max-w-4xl mx-auto">
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="hidden md:flex md:absolute md:left-4 items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 px-6 py-2 rounded-full font-bebas tracking-widest transition-colors shadow-sm active:scale-95 text-base shrink-0"
                            title="Retour Accueil"
                        >
                            ← Retour Accueil
                        </button>
                    )}
                    <div className="inline-flex flex-col items-center justify-center px-6 sm:px-10 py-2 sm:py-3 rounded-full mb-0 whitespace-nowrap max-w-[80vw] md:max-w-full overflow-hidden">
                        <span className="font-bebas font-normal text-xl min-[380px]:text-2xl sm:text-3xl md:text-4xl uppercase tracking-widest truncate leading-none pt-1 drop-shadow-sm text-slate-800">
                            EMBRYO AI
                        </span>
                        <p className="text-[10px] md:text-[12px] text-slate-500 uppercase tracking-widest font-bold mt-1">
                            ASSISTANT INTELLIGENT
                        </p>
                    </div>
                    {messages.length > 1 && (
                        <button
                            onClick={handleClearChat}
                            className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors p-2 md:bg-white md:border md:border-slate-200 md:rounded-full md:shadow-sm hover:bg-slate-50 active:scale-95 flex items-center justify-center shrink-0"
                            title="Effacer la conversation"
                        >
                            <X size={18} />
                            <span className="hidden md:inline ml-2 text-sm font-bold uppercase tracking-widest pt-0.5">Effacer</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 md:p-6 space-y-6 bg-slate-50/50">
                <div className="max-w-4xl mx-auto w-full space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[90%] md:max-w-[85%] rounded-2xl p-4 md:p-6 shadow-sm",
                                msg.role === 'user'
                                    ? "bg-slate-900 text-white rounded-br-md"
                                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
                            )}>
                                {msg.role === 'user' ? (
                                    <p className="text-base md:text-lg font-medium whitespace-pre-wrap leading-relaxed">
                                        {msg.content}
                                    </p>
                                ) : (
                                    <div className="prose prose-slate max-w-none text-base 
                                        prose-headings:font-bebas prose-headings:tracking-wide prose-headings:text-slate-900 prose-headings:mb-3 prose-headings:mt-6 first:prose-headings:mt-0
                                        prose-h2:text-2xl md:prose-h2:text-3xl 
                                        prose-h3:text-xl md:prose-h3:text-2xl prose-h3:text-slate-800 prose-h3:font-montserrat prose-h3:font-bold
                                        prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4 last:prose-p:mb-0
                                        prose-strong:text-slate-900 prose-strong:font-bold
                                        prose-ul:text-slate-700 prose-ul:my-4 prose-li:my-1
                                        prose-a:text-emerald-600 hover:prose-a:text-emerald-700 font-medium">
                                        <ReactMarkdown
                                            rehypePlugins={[rehypeRaw]}
                                            components={{
                                                a: ({ node, href, children, ...props }) => {
                                                    if (href && href.startsWith('video://')) {
                                                        const videoId = href.replace('video://', '');
                                                        const course = videoCourses.find(v => v.id === videoId);
                                                        if (course && onNavigateToVideo) {
                                                            const isEcto = course.categoryId === 'ectoderme';
                                                            const isMeso = course.categoryId === 'mesoderme';
                                                            const isEndo = course.categoryId === 'endoderme';
                                                            const isOeil = course.categoryId === 'oeil';

                                                            const colorClass = isEcto ? "bg-[#5A9C51]/10 text-[#5A9C51] hover:bg-[#5A9C51]/20 border-[#5A9C51]/30" :
                                                                isMeso ? "bg-[#F27D33]/10 text-[#F27D33] hover:bg-[#F27D33]/20 border-[#F27D33]/30" :
                                                                    isEndo ? "bg-[#4171B5]/10 text-[#4171B5] hover:bg-[#4171B5]/20 border-[#4171B5]/30" :
                                                                        isOeil ? "bg-[#F2B729]/10 text-[#F2B729] hover:bg-[#F2B729]/20 border-[#F2B729]/30" :
                                                                            "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300";

                                                            const categoryName = isEcto ? "L'Ectoderme" : isMeso ? "Le Mésoderme" : isEndo ? "L'Endoderme" : isOeil ? "L'Œil" : course.categoryId;
                                                            const numMatch = course.title.match(/^(\d+)/);
                                                            const numStr = numMatch ? `${numMatch[1].padStart(2, '0')} - ` : '';
                                                            const cleanTitle = course.title.replace(/^\d+[\.\-\s_:]*/, '').replace(/\s*_\s*/g, ' : ');
                                                            const displayLabel = `${categoryName} • ${numStr}${cleanTitle}`;

                                                            return (
                                                                <button
                                                                    onClick={() => onNavigateToVideo(course)}
                                                                    className={cn("inline-flex items-center gap-1.5 px-4 pt-1.5 pb-1 rounded-[1.2rem] text-sm md:text-base font-bold transition-all duration-300 border shadow-sm hover:shadow-md hover:-translate-y-0.5 mx-1 mb-1 max-w-full", colorClass)}
                                                                >
                                                                    <PlayCircle size={18} className="shrink-0" />
                                                                    <span className="truncate">{displayLabel}</span>
                                                                </button>
                                                            );
                                                        }
                                                    }
                                                    return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
                                                }
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md p-4 md:p-6 shadow-sm flex items-center gap-3">
                                <Loader2 size={20} className="animate-spin text-slate-400" />
                                <span className="text-sm text-slate-500 font-bold uppercase tracking-wider pt-0.5">Recherche dans les cours de Marc Damoiseaux...</span>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 md:p-6 text-sm font-medium mx-auto max-w-4xl w-full">
                            {error}
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Input Form */}
            <div className="p-4 md:p-6 bg-white border-t border-slate-200 sticky bottom-0 z-20">
                <div className="max-w-4xl mx-auto w-full">
                    <form onSubmit={handleSubmit} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Posez votre question à Embryo AI..."
                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 md:py-6 pr-16 md:pr-20 text-base md:text-lg text-slate-800 focus:outline-none focus:ring-0 focus:border-slate-400 font-medium placeholder:text-slate-400 shadow-inner transition-colors"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-colors disabled:opacity-50 shadow-md active:scale-95"
                        >
                            <ArrowRight size={20} className="md:w-6 md:h-6" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
