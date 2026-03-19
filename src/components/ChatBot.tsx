import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Loader2, PlayCircle, X, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { detailedStages as detailedStagesFr } from '../data/embryologie';
import { detailedStages as detailedStagesEn } from '../data/embryologie_en';
import { detailedStages as detailedStagesEs } from '../data/embryologie_es';
import { detailedStages as detailedStagesIt } from '../data/embryologie_it';
import { detailedStages as detailedStagesDe } from '../data/embryologie_de';
import { detailedStages as detailedStagesZh } from '../data/embryologie_zh';
import { detailedStages as detailedStagesJa } from '../data/embryologie_ja';

import { videoCourses as videoCoursesFr, type VideoCourse } from '../data/videoCourses';
import { videoCourses as videoCoursesEn } from '../data/videoCourses_en';
import { videoCourses as videoCoursesEs } from '../data/videoCourses_es';
import { videoCourses as videoCoursesIt } from '../data/videoCourses_it';
import { videoCourses as videoCoursesDe } from '../data/videoCourses_de';
import { videoCourses as videoCoursesZh } from '../data/videoCourses_zh';
import { videoCourses as videoCoursesJa } from '../data/videoCourses_ja';

import { podcastsData as podcastsDataFr } from '../data/podcasts';
import { podcastsData as podcastsDataEn } from '../data/podcasts_en';
import { podcastsData as podcastsDataEs } from '../data/podcasts_es';
import { podcastsData as podcastsDataIt } from '../data/podcasts_it';
import { podcastsData as podcastsDataDe } from '../data/podcasts_de';
import { podcastsData as podcastsDataZh } from '../data/podcasts_zh';
import { podcastsData as podcastsDataJa } from '../data/podcasts_ja';
import { cn } from '../utils';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

// Helper to stringify context
const getCourseContext = (lang: string) => {
    const detailedStages = lang.startsWith('en') ? detailedStagesEn 
                         : lang.startsWith('es') ? detailedStagesEs 
                         : lang.startsWith('it') ? detailedStagesIt
                         : lang.startsWith('de') ? detailedStagesDe
                         : lang.startsWith('zh') ? detailedStagesZh
                         : lang.startsWith('ja') ? detailedStagesJa
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

    const videoCourses = lang.startsWith('en') ? videoCoursesEn 
                       : lang.startsWith('es') ? videoCoursesEs 
                       : lang.startsWith('it') ? videoCoursesIt
                       : lang.startsWith('de') ? videoCoursesDe
                       : lang.startsWith('zh') ? videoCoursesZh
                       : lang.startsWith('ja') ? videoCoursesJa
                       : videoCoursesFr;
                       
    const podcastsData = lang.startsWith('en') ? podcastsDataEn 
                       : lang.startsWith('es') ? podcastsDataEs 
                       : lang.startsWith('it') ? podcastsDataIt
                       : lang.startsWith('de') ? podcastsDataDe
                       : lang.startsWith('zh') ? podcastsDataZh
                       : lang.startsWith('ja') ? podcastsDataJa
                       : podcastsDataFr;

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

const getSystemPrompt = (lang: string, customContext?: string) => `Tu es "Assistant IA", un assistant virtuel expert en embryologie biodynamique, basé prioritairement sur les enseignements de Marc Damoiseaux, mais disposant d'une vaste connaissance externe sur le domaine (Blechschmidt, Jealous, Freeman, etc.).
Ton rôle est d'aider les étudiants ou praticiens en répondant à leurs questions de façon précise et clinique.

RÈGLE ABSOLUE NUMÉRO 1 : Tu dois D'ABORD chercher la réponse dans le contexte de Marc Damoiseaux fourni ci-dessous. Si tu la trouves, utilise-la et cite le stade (ex: "Source: J28 - Plis Céphalique").
RÈGLE ABSOLUE NUMÉRO 2 : Si la réponse n'est PAS dans le contexte de Marc Damoiseaux, tu es AUTORISÉ à utiliser tes connaissances générales externes sur l'embryologie (notamment biodynamique). Dans ce cas, tu DOIS obligatoirement préciser que cette information est "Hors du cours de Damoiseaux" et tu DOIS citer tes sources externes.
NOTE SPÉCIALE EXPERTISE JEALOUS : Pour toute question complexe sur l'approche de James Jealous (Biodynamique), tu peux te référer implicitement ou explicitement à la documentation et aux principes énoncés dans ses travaux.
RÈGLE ABSOLUE NUMÉRO 3 : Adopte un ton professionnel, encourageant, et précis.
RÈGLE ABSOLUE NUMÉRO 4 : Organise IMPÉRATIVEMENT  ta réponse avec de VRAIS titres Markdown (utilise ## pour les grands titres, ### pour les sous-titres) afin de structurer la lecture. Ne mets JAMAIS le contenu sur la même ligne qu'un titre, va toujours à la ligne. Aère le texte au maximum avec des paragraphes et utilise le **gras** uniquement pour mettre en valeur les mots-clés dans les phrases.
RÈGLE ABSOLUE NUMÉRO 5 : Lorsque tu cites ou fais référence à un cours vidéo, tu DOIS ABSOLUMENT formater la source exacte sous forme de lien markdown avec une ancre commençant STRICTEMENT par "#video-ID_VIDEO". Ne mets JAMAIS d'url classique du type "https://" ni de protocole inventé. Exemple parfait: Si cest une vidéo de l'Endoderme, écrit exactement ceci : [Source exacte](#video-endoderme-01).
RÈGLE ABSOLUE NUMÉRO 6 : Tu réponds IMPÉRATIVEMENT dans la langue de l'utilisateur. Langue actuelle: ${lang}.

CONTEXTE DU COURS :
${customContext !== undefined ? customContext : getCourseContext(lang)}
`;

type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

export const ChatBot: React.FC<{ onNavigateToVideo?: (video: VideoCourse) => void; isAdmin?: boolean }> = ({ onNavigateToVideo, isAdmin = false }) => {
    const { t, i18n } = useTranslation();
    const videoCourses = i18n.language.startsWith('en') ? videoCoursesEn 
                       : i18n.language.startsWith('es') ? videoCoursesEs 
                       : i18n.language.startsWith('it') ? videoCoursesIt
                       : i18n.language.startsWith('de') ? videoCoursesDe
                       : i18n.language.startsWith('zh') ? videoCoursesZh
                       : i18n.language.startsWith('ja') ? videoCoursesJa
                       : videoCoursesFr;

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
    const [isFastMode, setIsFastMode] = useState(!isAdmin);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Sync isFastMode if isAdmin prop changes dynamically
    useEffect(() => {
        setIsFastMode(!isAdmin);
    }, [isAdmin]);

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

        const clonedAnswer = answerNode.cloneNode(true) as HTMLElement;
        
        // Clean up video buttons for print rendering and preserve color codes
        const buttons = clonedAnswer.querySelectorAll('button.inline-flex');
        buttons.forEach(btn => {
            const span = document.createElement('span');
            const className = btn.className;
            
            let category = 'default';
            if (className.includes('bg-[#5A9C51]')) { category = 'ectoderme'; }
            else if (className.includes('bg-[#F27D33]')) { category = 'mesoderme'; }
            else if (className.includes('bg-[#4171B5]')) { category = 'endoderme'; }
            else if (className.includes('bg-[#F2B729]')) { category = 'oeil'; }

            const isEcto = category === 'ectoderme';
            const isMeso = category === 'mesoderme';
            const isEndo = category === 'endoderme';
            const isOeil = category === 'oeil';

            // Solid identity colors with white text for the PDF export print script
            const bgColor = isEcto ? '#5A9C51' : isMeso ? '#F27D33' : isEndo ? '#4171B5' : isOeil ? '#F2B729' : '#64748b';
            const textColor = '#ffffff';

            const textContent = btn.textContent || 'Source Vidéo';
            span.textContent = `▶ ${textContent.trim()}`;
            span.setAttribute('style', `
                display: inline-block;
                background-color: ${bgColor} !important;
                color: ${textColor} !important;
                padding: 4px 10px;
                border-radius: 6px;
                text-decoration: none;
                font-family: 'Roboto', sans-serif;
                font-size: 11px;
                font-weight: 700;
                margin: 2px 2px;
                border: none;
                vertical-align: middle;
            `);
            
            // To remove surrounding parentheses in the printed DOM if they exist around the button
            const prevSibling = btn.previousSibling;
            const nextSibling = btn.nextSibling;
            if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE && prevSibling.textContent?.trim().endsWith('(')) {
                prevSibling.textContent = prevSibling.textContent.replace(/\(\s*$/, '');
            }
            if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE && nextSibling.textContent?.trim().startsWith(')')) {
                nextSibling.textContent = nextSibling.textContent.replace(/^\s*\)/, '');
            }

            btn.parentNode?.replaceChild(span, btn);
        });

        // Ensure headings have decent margins in print
        const headings = clonedAnswer.querySelectorAll('h2, h3, h4');
        headings.forEach(h => {
            (h as HTMLElement).style.marginTop = '28px';
            (h as HTMLElement).style.marginBottom = '14px';
        });

        // Ensure images print nicely
        const images = clonedAnswer.querySelectorAll('img');
        images.forEach(img => {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.margin = '20px auto';
            img.style.borderRadius = '12px';
            img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        });

        const questionContent = messages[idx - 1]?.role === 'user' ? messages[idx - 1].content : questionNode?.innerText;
        const questionHTML = questionContent ? `
            <div style="background-color: rgba(174, 125, 92, 0.04); border-left: 5px solid #AE7D5C; padding: 28px; margin-bottom: 50px; border-radius: 0 16px 16px 0; page-break-inside: avoid;">
                <div style="font-family: 'Roboto', sans-serif; font-size: 12px; font-weight: 900; color: #AE7D5C; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px;">${t('chatbot.question')}</div>
                <div style="font-family: 'Roboto', sans-serif; font-size: 19px; font-weight: 500; color: #1E2A33; white-space: pre-wrap; line-height: 1.7;">${questionContent}</div>
            </div>
        ` : '';

        // Open a completely native new window exclusively to host the beautiful HTML for vector printing
        // Omitting the 3rd argument forces it to be a real tab, restoring full native scrolling which popup windows often block
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert("Veuillez autoriser l'ouverture des fenêtres pop-up (bloqueur actif).");
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Export PDF - Embryo AI</title>
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet">
                <style>
                    /* Absolute Scroll Reset against ALL browser quirks */
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        height: 100vh !important;
                        overflow: hidden !important; /* Lock body, scroll the wrapper */
                        background-color: #EFECE1; /* A subtle sophisticated grey-beige for the screen canvas */
                        font-family: 'Roboto', sans-serif;
                        -webkit-font-smoothing: antialiased;
                    }

                    #fixed-scroll-wrapper {
                        width: 100%;
                        height: 100vh;
                        overflow-y: scroll !important;
                        overflow-x: hidden !important;
                        -webkit-overflow-scrolling: touch;
                        padding: 40px 0;
                        box-sizing: border-box;
                    }

                    /* The A4 Format Simulation */
                    .a4-page {
                        width: 210mm;
                        min-height: 297mm;
                        background-color: #FDFBEF !important; /* Charte: Beige Clair */
                        box-shadow: 0 40px 80px rgba(174, 125, 92, 0.15), 0 5px 15px rgba(0,0,0,0.05); /* Stunning visual shadow */
                        border-radius: 6px;
                        box-sizing: border-box;
                        padding: 25mm 25mm; /* Belles marges latérales élégantes ("de beaux espaces") */
                        position: relative;
                        color: #1E2A33; /* Charte: Gris Anthracite */
                        margin: 0 auto;
                    }

                    /* Typography Overrides (Charte Graphique TDT - Haute qualité) */
                    .prose { color: #1E2A33; max-width: none; line-height: 1.8; }
                    
                    /* Tous les titres en Bebas Neue, Brun Terre, épais */
                    .prose h1, .prose h2, .prose h3 { 
                        font-family: 'Bebas Neue', cursive; 
                        color: #AE7D5C; /* Brun Terre */
                        letter-spacing: 1px; 
                        margin-top: 2.5em; 
                        margin-bottom: 0.8em; 
                        line-height: 1.2;
                    }
                    .prose h1 { font-size: 30px; }
                    .prose h2 { font-size: 24px; }
                    .prose h3 { font-size: 20px; }
                    
                    /* Sous-titres plus profonds */
                    .prose h4 { 
                        font-family: 'Roboto', sans-serif; 
                        font-size: 18px; 
                        font-weight: 900; 
                        color: #1E2A33; 
                        margin-top: 2.2em; 
                        margin-bottom: 0.8em; 
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    
                    .prose p { font-size: 16px; margin-bottom: 28px; font-weight: 400; text-align: justify; }
                    
                    /* "Ce qui doit être en gras tu le mets en gras" */
                    .prose strong, .prose b { 
                        color: #475569; 
                        font-weight: 900 !important; /* Plus épais ! */
                    }

                    /* Formatage des exemples / code */
                    .prose code {
                        font-family: 'Courier New', Courier, monospace;
                        background-color: rgba(174, 125, 92, 0.1);
                        padding: 3px 6px;
                        border-radius: 4px;
                        color: #AE7D5C;
                        font-size: 0.9em;
                        font-weight: 700;
                    }

                    .prose pre {
                        display: block;
                        background-color: #1E2A33;
                        color: #FDFBEF;
                        padding: 20px;
                        border-radius: 12px;
                        overflow-x: auto;
                        margin: 24px 0;
                        box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
                    }

                    .prose pre code {
                        background-color: transparent;
                        padding: 0;
                        color: inherit;
                        font-weight: 400;
                    }
                    
                    .prose ul, .prose ol { padding-left: 20px; margin-bottom: 24px; }
                    .prose li { margin-bottom: 12px; line-height: 1.8; color: #1E2A33; font-size: 16px; }
                    
                    .prose blockquote { 
                        border-left: 5px solid #AE7D5C; 
                        color: rgba(30, 42, 51, 0.85); 
                        font-style: italic; 
                        padding: 20px 24px;
                        background: rgba(174, 125, 92, 0.05);
                        border-radius: 0 12px 12px 0;
                        margin: 30px 0;
                        font-weight: 500;
                    }
                    
                    .prose a { color: #AE7D5C; text-decoration: none; border-bottom: 1px solid #AE7D5C; transition: opacity 0.2s; font-weight: 500;}

                    .prose img {
                        max-width: 100%;
                        height: auto;
                        display: block;
                        margin: 40px auto;
                        border-radius: 12px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.08); /* Beautiful subtle image shadow */
                    }

                    /* Responsive pour les petits écrans (tablettes/mobiles) avant impression */
                    @media screen and (max-width: 230mm) {
                        #fixed-scroll-wrapper { padding: 20px 0; }
                        .a4-page {
                            width: 94%;
                            padding: 15mm 15mm;
                            border-radius: 8px;
                            box-shadow: 0 10px 30px rgba(174, 125, 92, 0.1);
                        }
                    }

                    /* Print specific optimizations */
                    @media print {
                        body, html { 
                            background-color: white !important;
                            height: auto !important;
                            overflow: visible !important;
                            -webkit-print-color-adjust: exact !important; 
                            print-color-adjust: exact !important; 
                        }
                        #fixed-scroll-wrapper { 
                            display: block !important;
                            height: auto !important; 
                            overflow: visible !important; 
                            padding: 0 !important; 
                        }
                        .a4-page {
                            width: 100% !important;
                            min-height: 0 !important;
                            margin: 0 !important;
                            border-radius: 0 !important;
                            box-shadow: none !important;
                            padding: 0 !important; /* Printers handle physical margins */
                            background-color: transparent !important;
                        }
                        @page { margin: 15mm; }
                        .no-print { display: none !important; }
                    }
                </style>
            </head>
            <body>
                <div id="fixed-scroll-wrapper">
                    <div class="no-print" style="position: fixed; top: 20px; right: 20px; z-index: 999999; display: flex; gap: 10px; pointer-events: none;">
                        <button onclick="window.close()" style="pointer-events: auto; background-color: #FAF6ED; color: #AE7D5C; border: none; padding: 8px 16px; border-radius: 6px; font-family: 'Roboto', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                            ✕ Retour
                        </button>
                        <button onclick="window.print()" style="pointer-events: auto; background-color: #FAF6ED; color: #AE7D5C; border: none; padding: 8px 18px; border-radius: 6px; font-family: 'Roboto', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                            🖨️ Imprimer
                        </button>
                    </div>
                    
                    <div class="a4-page">
                        <!-- HEADER -->
                        <div style="text-align: center; margin-bottom: 50px; padding-bottom: 30px; border-bottom: 2px solid rgba(174, 125, 92, 0.2);">
                            <h1 style="font-family: 'Bebas Neue', cursive; color: #AE7D5C; font-size: 56px; letter-spacing: 4px; margin: 0; line-height: 1;">EMBRYO AI</h1>
                            <p style="font-family: 'Roboto', sans-serif; color: #1E2A33; font-size: 14px; text-transform: uppercase; letter-spacing: 4px; margin-top: 10px; font-weight: 700; opacity: 0.6;">${t('chatbot.summaryDocument')}</p>
                        </div>
                        
                        ${questionHTML}
                        
                        <div style="font-family: 'Roboto', sans-serif; font-size: 13px; font-weight: 900; color: #AE7D5C; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 30px; margin-top: 50px; display: inline-block; border-bottom: 2px solid #AE7D5C; padding-bottom: 6px;">${t('chatbot.detailedAnswer')}</div>
                        
                        <div class="prose">
                            ${clonedAnswer.innerHTML}
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
        
        // Finalize document stream so the native renderer paints it
        printWindow.document.close();
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
            let currentContext: string | undefined = undefined;

            if (isFastMode) {
                const { data: pineconeData, error: pineconeError } = await supabase.functions.invoke('ask-pinecone', {
                    body: { query: userMessage, topK: 5 }
                });

                if (pineconeError) {
                    console.error("Pinecone search error:", pineconeError);
                } else if (pineconeData && pineconeData.results) {
                    currentContext = "EXTRAITS PERTINENTS DE LA BASE DE CONNAISSANCES:\n---\n" +
                        pineconeData.results.map((r: any) => `Document: ${r.metadata.title || 'Inconnu'}\nAuteur: ${r.metadata.author || 'Inconnu'}\nContenu: ${r.text || r.metadata.text}`).join('\n\n') +
                        "\n---";
                }
            }

            const apiMessages = [
                { role: 'system', content: getSystemPrompt(i18n.language, currentContext) },
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
                    model: "google/gemini-2.5-pro", // Modèle Pro beaucoup plus performant demandé
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
            <div className="flex-none z-30 w-full bg-[#FAF6ED]/90 backdrop-blur-md pt-4 flex flex-col items-center pb-4 border-b border-transparent md:border-slate-100">
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-1 relative w-full text-center pb-1 md:pb-0 max-w-4xl mx-auto">
                    <div className="inline-flex flex-col md:flex-row items-center justify-center px-4 sm:px-8 md:px-8 py-2 sm:py-3 md:py-2 rounded-full mb-0 whitespace-nowrap max-w-[95vw] md:max-w-full overflow-hidden">
                        <span className="font-bebas font-normal text-xl min-[380px]:text-2xl sm:text-3xl md:text-2xl lg:text-xl uppercase tracking-widest truncate leading-none md:leading-[1.1] pt-1 md:pt-0 drop-shadow-sm text-slate-800">
                            EMBRYO AI
                        </span>
                        <span className="hidden md:inline text-slate-400 mx-2">•</span>
                        <p className="text-[10px] sm:text-[11px] md:text-[11px] text-slate-500 uppercase tracking-widest mt-1 md:mt-1 font-medium hidden sm:block">
                            {t('chatbot.assistantRole')}
                        </p>
                    </div>
                    <div className="absolute right-2 sm:right-4 flex items-center gap-1.5 sm:gap-2">
                        {isAdmin && (
                            <div className="flex bg-slate-100 p-0.5 rounded-full border border-slate-200/60 shadow-sm ml-8 xs:ml-0">
                                <button
                                    type="button"
                                    onClick={() => setIsFastMode(true)}
                                    className={cn(
                                        "flex items-center justify-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all",
                                        isFastMode
                                            ? "bg-[#A06C50] text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                    )}
                                    title="Mode Rapide (RAG Pinecone) : Recherche uniquement la pertinence"
                                >
                                    FAST
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsFastMode(false)}
                                    className={cn(
                                        "flex items-center justify-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all",
                                        !isFastMode
                                            ? "bg-[#A06C50] text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                    )}
                                    title="Mode Profond : Donne le cours intégral à lire à l'IA (- rapide)"
                                >
                                    DEEP
                                </button>
                            </div>
                        )}
                        {messages.length > 1 && (
                            <button
                                type="button"
                                onClick={handleClearChat}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 md:p-2 md:bg-[#FAF6ED] md:border md:border-slate-200 md:rounded-full md:shadow-sm hover:bg-transparent active:scale-95 flex items-center justify-center shrink-0"
                                title={t('chatbot.clearConversationTitle')}
                            >
                                <X size={16} className="md:w-[18px] md:h-[18px]" />
                                <span className="hidden md:inline ml-2 text-xs font-bold uppercase tracking-widest pt-0.5">{t('chatbot.clear')}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overscroll-none p-4 md:p-8 space-y-6 bg-transparent" id="chatbot-messages" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="max-w-4xl mx-auto w-full space-y-6">
                    {messages.map((msg, idx) => {
                        // Strip any parentheses or brackets tightly wrapping video links
                        const processedContent = msg.content.replace(/[\(\[]\s*(\[[^\]]+\]\(#video-[a-zA-Z0-9_-]+\))\s*[\)\]]/g, '$1');
                        
                        return (
                        <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[90%] md:max-w-[85%] rounded-3xl p-4 md:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]",
                                msg.role === 'user'
                                    ? "bg-slate-800 text-white rounded-br-md"
                                    : "bg-white text-slate-800 rounded-bl-md relative group border border-slate-100"
                            )}>
                                {msg.role === 'user' ? (
                                    <p id={`msg-${idx}`} className="text-base md:text-lg font-medium whitespace-pre-wrap leading-relaxed">
                                        {processedContent}
                                    </p>
                                ) : (
                                    <>
                                        <div id={`msg-${idx}`} className="prose prose-slate max-w-none text-base 
                                        prose-headings:font-bebas prose-headings:tracking-wide prose-headings:text-slate-700 prose-headings:mb-3 prose-headings:mt-6 first:prose-headings:mt-0
                                        prose-h1:font-bebas prose-h1:text-slate-700 prose-h1:text-3xl md:prose-h1:text-4xl
                                        prose-h2:text-2xl md:prose-h2:text-3xl 
                                        prose-h3:text-xl md:prose-h3:text-2xl prose-h3:text-slate-700 prose-h3:font-montserrat prose-h3:font-bold
                                        prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4 last:prose-p:mb-0
                                        prose-strong:text-slate-500 prose-strong:font-bold
                                        prose-ul:text-slate-700 prose-ul:my-4 prose-li:my-1
                                        prose-a:text-slate-700 hover:prose-a:text-slate-500 prose-a:font-bold prose-a:underline-offset-4
                                        prose-code:font-mono prose-code:text-slate-700 prose-code:bg-slate-100 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md
                                        prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-pre:rounded-xl prose-pre:p-5 prose-pre:my-6 prose-pre:overflow-x-auto prose-pre:shadow-sm">
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

                                                                const colorClass = isEcto ? "bg-[#5A9C51] text-white hover:bg-[#4a8443] border-[#5A9C51]" :
                                                                    isMeso ? "bg-[#F27D33] text-white hover:bg-[#e06c27] border-[#F27D33]" :
                                                                        isEndo ? "bg-[#4171B5] text-white hover:bg-[#345d96] border-[#4171B5]" :
                                                                            isOeil ? "bg-[#F2B729] text-white hover:bg-[#d9a321] border-[#F2B729]" :
                                                                                "bg-slate-600 text-white hover:bg-slate-700 border-slate-600";

                                                                let categoryName: string = course.categoryId;
                                                                if (isEcto) categoryName = t('categories.ectoderm', { defaultValue: i18n.language.startsWith('en') ? 'Ectoderm' : i18n.language.startsWith('es') ? 'Ectodermo' : i18n.language.startsWith('it') ? 'Ectoderma' : i18n.language.startsWith('de') ? 'Ektoderm' : i18n.language.startsWith('zh') ? '外胚层' : i18n.language.startsWith('ja') ? '外胚葉' : "L'Ectoderme" });
                                                                if (isMeso) categoryName = t('categories.mesoderm', { defaultValue: i18n.language.startsWith('en') ? 'Mesoderm' : i18n.language.startsWith('es') ? 'Mesodermo' : i18n.language.startsWith('it') ? 'Mesoderma' : i18n.language.startsWith('de') ? 'Mesoderm' : i18n.language.startsWith('zh') ? '中胚层' : i18n.language.startsWith('ja') ? '中胚葉' : "Le Mésoderme" });
                                                                if (isEndo) categoryName = t('categories.endoderm', { defaultValue: i18n.language.startsWith('en') ? 'Endoderm' : i18n.language.startsWith('es') ? 'Endodermo' : i18n.language.startsWith('it') ? 'Endoderma' : i18n.language.startsWith('de') ? 'Entoderm' : i18n.language.startsWith('zh') ? '内胚层' : i18n.language.startsWith('ja') ? '内胚葉' : "L'Endoderme" });
                                                                if (isOeil) categoryName = t('categories.eye', { defaultValue: i18n.language.startsWith('en') ? 'Eye' : i18n.language.startsWith('es') ? 'Ojo' : i18n.language.startsWith('it') ? 'Occhio' : i18n.language.startsWith('de') ? 'Auge' : i18n.language.startsWith('zh') ? '眼睛' : i18n.language.startsWith('ja') ? '目' : "L'Œil" });
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
                                                {processedContent}
                                            </ReactMarkdown>
                                        </div>
                                        {idx > 0 && (
                                            <div className="mt-4 pt-3 flex justify-end">
                                                <button
                                                    onClick={() => handleExportPDF(idx)}
                                                    className="flex items-center justify-center gap-1.5 text-xs text-[#AE7D5C] hover:bg-[#FAF6ED] px-3 py-1.5 rounded-md transition-all active:scale-95 opacity-80 hover:opacity-100"
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
                    );
                })}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md p-4 md:p-6 shadow-sm flex items-center gap-3">
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
                    <form onSubmit={handleSubmit} className="relative flex items-center shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-100/50 p-1.5 focus-within:ring-4 focus-within:ring-[#A06C50]/10 transition-all">
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
