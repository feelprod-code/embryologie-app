import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Loader2, PlayCircle, X, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import html2pdf from 'html2pdf.js';
import { detailedStages as detailedStagesFr } from '../data/embryologie';
import { detailedStages as detailedStagesEn } from '../data/embryologie_en';
import { detailedStages as detailedStagesEs } from '../data/embryologie_es';
import { videoCourses as videoCoursesFr, type VideoCourse } from '../data/videoCourses';
import { videoCourses as videoCoursesEn } from '../data/videoCourses_en';
import { videoCourses as videoCoursesEs } from '../data/videoCourses_es';
import { podcastsData as podcastsDataFr } from '../data/podcasts';
import { podcastsData as podcastsDataEn } from '../data/podcasts_en';
import { podcastsData as podcastsDataEs } from '../data/podcasts_es';
import { cn } from '../utils';
import { useTranslation } from 'react-i18next';

// Helper to stringify context
const getCourseContext = (lang: string) => {
    const detailedStages = lang.startsWith('en')
        ? detailedStagesEn
        : lang.startsWith('es')
            ? detailedStagesEs
            : detailedStagesFr;

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

    const videoCourses = lang.startsWith('en') ? videoCoursesEn : lang.startsWith('es') ? videoCoursesEs : videoCoursesFr;
    const podcastsData = lang.startsWith('en') ? podcastsDataEn : lang.startsWith('es') ? podcastsDataEs : podcastsDataFr;

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

const getSystemPrompt = (lang: string) => `Tu es "Assistant IA", un assistant virtuel expert en embryologie biodynamique, basé prioritairement sur les enseignements de Marc Damoiseaux, mais disposant d'une vaste connaissance externe sur le domaine (Blechschmidt, Jealous, Freeman, etc.).
Ton rôle est d'aider les étudiants ou praticiens en répondant à leurs questions de façon précise et clinique.

RÈGLE ABSOLUE NUMÉRO 1 : Tu dois D'ABORD chercher la réponse dans le contexte de Marc Damoiseaux fourni ci-dessous. Si tu la trouves, utilise-la et cite le stade (ex: "Source: J28 - Plis Céphalique").
RÈGLE ABSOLUE NUMÉRO 2 : Si la réponse n'est PAS dans le contexte de Marc Damoiseaux, tu es AUTORISÉ à utiliser tes connaissances générales externes sur l'embryologie (notamment biodynamique). Dans ce cas, tu DOIS obligatoirement préciser que cette information est "Hors du cours de Damoiseaux" et tu DOIS citer tes sources externes.
NOTE SPÉCIALE EXPERTISE JEALOUS : Pour toute question complexe sur l'approche de James Jealous (Biodynamique), tu peux te référer implicitement ou explicitement à la documentation et aux principes énoncés dans ses travaux.
RÈGLE ABSOLUE NUMÉRO 3 : Adopte un ton professionnel, encourageant, et précis.
RÈGLE ABSOLUE NUMÉRO 4 : Rédige tes réponses avec le plus grand soin visuel : aère le texte avec des paragraphes et mets les mots-clés en **gras**.
RÈGLE ABSOLUE NUMÉRO 5 : Lorsque tu cites ou fais référence à un cours vidéo, tu DOIS ABSOLUMENT formater la source exacte sous forme de lien markdown avec une ancre commençant STRICTEMENT par "#video-ID_VIDEO". Ne mets JAMAIS d'url classique du type "https://" ni de protocole inventé. Exemple parfait: Si c'est une vidéo de l'Endoderme, écrit exactement ceci : [Source exacte](#video-endoderme-01).
RÈGLE ABSOLUE NUMÉRO 6 : Tu réponds IMPÉRATIVEMENT dans la langue de l'utilisateur. Langue actuelle: ${lang}.

CONTEXTE DU COURS :
${getCourseContext(lang)}
`;

type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

export const ChatBot: React.FC<{ onNavigateToVideo?: (video: VideoCourse) => void }> = ({ onNavigateToVideo }) => {
    const { t, i18n } = useTranslation();
    const videoCourses = i18n.language.startsWith('en') ? videoCoursesEn : i18n.language.startsWith('es') ? videoCoursesEs : videoCoursesFr;

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
            { role: 'assistant', content: t('chatbot.welcomeMessage', { defaultValue: "Bonjour ! Je suis l'Assistant IA, dédié au cours d'embryologie de Marc Damoiseaux.\n\nPosez-moi vos questions sur les **cascades cinétiques**, les **feuillets** ou la **pratique biodynamique**." }) }
        ];
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Prevent body vertical bounce on iOS devices
    useEffect(() => {
        if (window.innerWidth < 768) {
            document.body.style.overflow = 'hidden';
            const canvas = document.getElementById('main-scroll-canvas');
            if (canvas) canvas.style.overflowY = 'hidden';
            return () => {
                document.body.style.overflow = '';
                if (canvas) canvas.style.overflowY = 'auto';
            };
        }
    }, []);

    // Sync welcome message language when user switches language
    useEffect(() => {
        setMessages(prev => {
            if (prev.length > 0 && prev[0].role === 'assistant') {
                const newMessages = [...prev];
                newMessages[0] = { ...newMessages[0], content: t('chatbot.welcomeMessage') };
                return newMessages;
            }
            return prev;
        });
    }, [i18n.language, t]);

    useEffect(() => {
        localStorage.setItem('embryo_chat_history', JSON.stringify(messages));
    }, [messages]);

    const handleClearChat = () => {
        setMessages([
            { role: 'assistant', content: t('chatbot.welcomeMessage') }
        ]);
        localStorage.removeItem('embryo_chat_history');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleExportPDF = (idx: number) => {
        const questionNode = document.getElementById(`msg-${idx - 1}`);
        const answerNode = document.getElementById(`msg-${idx}`);

        if (!answerNode) return;

        const container = document.createElement('div');
        // Styling for PDF context
        container.style.padding = '40px';
        container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        container.style.color = '#334155';
        container.style.background = '#ffffff';

        // Custom Header for PDF
        const headerHTML = `
            <div style="margin-bottom: 30px; text-align: center;">
                <h1 style="color: #8B1111; font-size: 28px; font-weight: bold; margin: 0; font-family: 'Bebas Neue', 'Helvetica Neue', sans-serif; letter-spacing: 2px;">EMBRYO AI</h1>
                <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">${t('chatbot.summaryDocument')}</p>
                <div style="border-bottom: 2px solid #e2e8f0; margin-top: 20px;"></div>
            </div>
        `;

        const questionContent = messages[idx - 1]?.role === 'user' ? messages[idx - 1].content : questionNode?.innerText;
        const questionHTML = questionContent ? `
            <div style="background-color: #f8fafc; border-left: 4px solid #8B1111; padding: 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0; page-break-inside: avoid;">
                <div style="font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${t('chatbot.question')}</div>
                <div style="font-size: 16px; font-weight: 600; color: #0f172a; white-space: pre-wrap; line-height: 1.5;">${questionContent}</div>
            </div>
        ` : '';

        const answerHeaderHTML = `
            <div style="font-size: 12px; font-weight: bold; color: #8B1111; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">${t('chatbot.detailedAnswer')}</div>
        `;

        container.innerHTML = headerHTML + questionHTML + answerHeaderHTML;

        const clonedAnswer = answerNode.cloneNode(true) as HTMLElement;
        clonedAnswer.style.fontSize = '14px';
        clonedAnswer.style.lineHeight = '1.6';

        // Clean up video buttons for PDF rendering (html2pdf has bugs with complex Tailwind buttons)
        const buttons = clonedAnswer.querySelectorAll('button');
        buttons.forEach(btn => {
            const span = document.createElement('span');
            const textContent = btn.textContent || 'Source Vidéo';
            span.innerHTML = `<strong>[Référence : ${textContent.trim()}]</strong>`;
            span.style.color = '#8B1111';
            span.style.display = 'inline-block';
            span.style.margin = '6px 0';
            span.style.fontSize = '13px';
            btn.parentNode?.replaceChild(span, btn);
        });

        // Ensure headings have decent margins in PDF
        const headings = clonedAnswer.querySelectorAll('h2, h3, h4');
        headings.forEach(h => {
            (h as HTMLElement).style.marginTop = '16px';
            (h as HTMLElement).style.marginBottom = '8px';
        });

        container.appendChild(clonedAnswer);

        const opt = {
            margin: 15,
            filename: 'embryo-ai-reponse.pdf',
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };

        html2pdf().set(opt).from(container).save();
    };

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
            setError(t('chatbot.apiKeyMissing'));
            setIsLoading(false);
            return;
        }

        try {
            const apiMessages = [
                { role: 'system', content: getSystemPrompt(i18n.language) },
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
                throw new Error(`${t('chatbot.networkError')}${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;

            setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
        } catch (err: any) {
            console.error("ChatBot Error:", err);
            setError(t('chatbot.generalError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 md:relative md:inset-auto z-40 md:z-10 w-full h-[100dvh] md:h-full bg-transparent flex flex-col overflow-hidden">
            {/* Header Fixed - Capsule Style */}
            <div className="flex-none z-30 w-full bg-[#FAF6ED]/90 backdrop-blur-md pt-[env(safe-area-inset-top,4px)] md:pt-4 flex flex-col items-center pb-2 md:pb-4 px-2">
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-1 relative w-full text-center animate-fade-in-up pb-1 md:pb-0 max-w-4xl mx-auto">
                    <div className="inline-flex flex-col md:flex-row items-center justify-center px-4 sm:px-8 md:px-8 py-2 sm:py-3 md:py-2 rounded-full mb-0 whitespace-nowrap max-w-[95vw] md:max-w-full overflow-hidden">
                        <span className="font-bebas font-normal text-xl sm:text-2xl md:text-xl lg:text-xl uppercase tracking-widest truncate leading-none md:leading-[1.1] pt-1 md:pt-0 drop-shadow-sm text-slate-800">
                            EMBRYO AI
                        </span>
                        <span className="hidden md:inline text-slate-400 mx-2">•</span>
                        <p className="text-[10px] sm:text-[11px] md:text-[11px] text-slate-500 uppercase tracking-widest mt-1 md:mt-1 font-medium">
                            {t('chatbot.assistantRole')}
                        </p>
                    </div>
                    {messages.length > 1 && (
                        <button
                            onClick={handleClearChat}
                            className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors p-2 md:bg-[#FAF6ED] md:border md:border-slate-200 md:rounded-full md:shadow-sm hover:bg-transparent active:scale-95 flex items-center justify-center shrink-0"
                            title={t('chatbot.clearConversationTitle')}
                        >
                            <X size={18} />
                            <span className="hidden md:inline ml-2 text-sm font-bold uppercase tracking-widest pt-0.5">{t('chatbot.clear')}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overscroll-none p-4 md:p-8 space-y-6 bg-transparent" id="chatbot-messages" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="max-w-4xl mx-auto w-full space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[90%] md:max-w-[85%] rounded-3xl p-4 md:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]",
                                msg.role === 'user'
                                    ? "bg-slate-800 text-white rounded-br-md"
                                    : "bg-[#FAF6ED] text-slate-800 rounded-bl-md relative group border border-slate-100/50"
                            )}>
                                {msg.role === 'user' ? (
                                    <p id={`msg-${idx}`} className="text-base md:text-lg font-medium whitespace-pre-wrap leading-relaxed">
                                        {msg.content}
                                    </p>
                                ) : (
                                    <>
                                        <div id={`msg-${idx}`} className="prose prose-slate max-w-none text-base 
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
                                                        if (href && href.startsWith('#video-')) {
                                                            const videoId = href.replace('#video-', '');
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
                                                                        className={cn("inline-flex items-center text-left gap-1.5 px-4 pt-1.5 pb-1 rounded-[1.2rem] text-sm md:text-base font-bold transition-all duration-300 border shadow-sm hover:shadow-md hover:-translate-y-0.5 mx-1 my-1 max-w-full", colorClass)}
                                                                    >
                                                                        <PlayCircle size={18} className="shrink-0" />
                                                                        <span className="truncate whitespace-normal leading-tight">{displayLabel}</span>
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
                                        {idx > 0 && (
                                            <div className="mt-4 pt-3 flex justify-end">
                                                <button
                                                    onClick={() => handleExportPDF(idx)}
                                                    className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 px-3 py-1.5 rounded-md transition-all active:scale-95"
                                                    title={t('chatbot.exportPdfTitle')}
                                                >
                                                    <Download size={14} />
                                                    <span className="font-bold tracking-widest pt-[1px]">{t('chatbot.pdf')}</span>
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-[#FAF6ED] border border-slate-200 rounded-2xl rounded-bl-md p-4 md:p-6 shadow-sm flex items-center gap-3">
                                <Loader2 size={20} className="animate-spin text-slate-400" />
                                <span className="text-sm text-slate-500 font-bold uppercase tracking-wider pt-0.5">{t('chatbot.searching')}</span>
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
            <div className="flex-none p-4 md:p-6 bg-transparent z-40 pb-[calc(1rem+env(safe-area-inset-bottom,0px)+80px)] md:pb-6 relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-[#FAF6ED] before:via-[#FAF6ED]/90 before:to-transparent before:-z-10 mt-auto">
                <div className="max-w-4xl mx-auto w-full relative z-10">
                    <form onSubmit={handleSubmit} className="relative flex items-center shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] rounded-2xl bg-[#FAF6ED]/80 backdrop-blur-xl border border-slate-100/50 p-1.5 focus-within:ring-4 focus-within:ring-[#A06C50]/10 transition-all">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t('chatbot.inputPlaceholder')}
                            className="w-full bg-transparent px-4 py-3 md:py-4 pr-14 text-base md:text-lg text-slate-800 focus:outline-none placeholder:text-slate-400 font-medium"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-[#A06C50] text-white rounded-xl flex items-center justify-center hover:bg-[#8d5c41] transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-md active:scale-95"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
