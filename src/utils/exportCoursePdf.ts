import { type VideoCourse } from '../data/videoCourses';
import pdfFileMapping from '../data/pdfFileMapping.json';

/**
 * Professional Minimalist & Colorful Markdown to HTML converter matching the in-app typography & design
 */
function markdownToHtml(md: string, accentColor: string = '#5A9C51'): string {
    if (!md) return '';

    let html = md
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Re-enable <img> tags if any were in raw HTML
    html = html.replace(/&lt;img\s+([^&]+)\/&gt;/g, '<img $1 />');
    html = html.replace(/&lt;img\s+([^&]+)&gt;/g, '<img $1 />');

    // Markdown Images ![alt](url) matching in-app CustomMarkdownComponents (scientific anatomical diagram framing)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
        const captionText = alt ? alt.replace(/^Plan Anatomique\s*:\s*/i, '') : 'Structure & Vecteurs Biodynamiques';
        return `
            <div style="margin: 24px auto; text-align: center; page-break-inside: avoid; break-inside: avoid;">
                <div style="background: #FFFFFF; padding: 10px; border-radius: 12px; border: 1.5px solid #CBD5E1; box-shadow: 0 4px 12px rgba(15,23,42,0.06); display: inline-block; max-width: 88%;">
                    <img src="${src}" alt="${captionText}" style="max-width: 100%; height: auto; border-radius: 6px; display: block; margin: 0 auto;" />
                </div>
                <p style="font-family: 'Roboto', sans-serif; font-size: 11.5px; font-weight: 700; color: #475569; letter-spacing: 0.5px; margin-top: 8px; text-align: center; max-width: 85%; margin-left: auto; margin-right: auto; line-height: 1.4; page-break-inside: avoid; text-transform: uppercase;">
                    <span style="color: ${accentColor}; font-weight: 900;">FIG.</span> — ${captionText}
                </p>
            </div>
        `;
    });

    // Headings styled with vibrant in-app Bebas Neue font & category accent color
    html = html.replace(/^### (.*$)/gim, `<h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 19px; color: #1E293B; letter-spacing: 0.8px; margin-top: 24px; margin-bottom: 8px; line-height: 1.25; page-break-after: avoid; break-after: avoid;">$1</h3>`);
    html = html.replace(/^## (.*$)/gim, `<h2 style="font-family: 'Bebas Neue', sans-serif; font-size: 23px; color: ${accentColor}; letter-spacing: 1px; margin-top: 30px; margin-bottom: 12px; line-height: 1.2; border-bottom: 1.5px solid ${accentColor}33; padding-bottom: 4px; page-break-after: avoid; break-after: avoid;">$1</h2>`);
    html = html.replace(/^# (.*$)/gim, `<h1 style="font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: ${accentColor}; letter-spacing: 1.2px; margin-top: 36px; margin-bottom: 16px; line-height: 1.2; page-break-after: avoid; break-after: avoid;">$1</h1>`);

    // Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0F172A; font-weight: 700;">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em style="color: #334155; font-style: italic;">$1</em>');

    // Blockquotes matching in-app style
    html = html.replace(/^\> (.*$)/gim, `<blockquote style="border-left: 3.5px solid ${accentColor}; background: ${accentColor}0D; padding: 14px 18px; margin: 18px 0; border-radius: 0 10px 10px 0; font-style: italic; color: #334155; font-family: 'Montserrat', sans-serif; font-size: 13.5px; line-height: 1.6; page-break-inside: avoid; break-inside: avoid;">$1</blockquote>`);

    // Bullet lists
    const lines = html.split('\n');
    let inList = false;
    const processedLines: string[] = [];

    for (const line of lines) {
        const listMatch = line.match(/^[\*\-] (.*$)/);
        if (listMatch) {
            if (!inList) {
                processedLines.push('<ul style="padding-left: 22px; margin: 14px 0; page-break-inside: avoid; break-inside: avoid;">');
                inList = true;
            }
            processedLines.push(`<li style="font-family: 'Montserrat', sans-serif; font-size: 13.5px; margin-bottom: 7px; line-height: 1.65; color: #1E293B; page-break-inside: avoid; break-inside: avoid;">${listMatch[1]}</li>`);
        } else {
            if (inList) {
                processedLines.push('</ul>');
                inList = false;
            }
            if (line.trim().length > 0 && !line.startsWith('<h') && !line.startsWith('<blockquote') && !line.startsWith('<div') && !line.startsWith('<ul')) {
                processedLines.push(`<p style="font-family: 'Montserrat', sans-serif; font-size: 13.8px; margin-bottom: 14px; line-height: 1.72; color: #1E293B; text-align: justify; page-break-inside: avoid; break-inside: avoid; orphans: 3; widows: 3;">${line}</p>`);
            } else {
                processedLines.push(line);
            }
        }
    }
    if (inList) {
        processedLines.push('</ul>');
    }

    return processedLines.join('\n');
}

/**
 * Professional In-App Styled A4 PDF Exporter
 */
export function exportCoursePdf(course: VideoCourse, t?: any): void {
    if (!course) return;

    // If a pre-generated high-def A4 PDF is available, open it directly in a new tab
    const mappedPdf = (pdfFileMapping as Record<string, string>)[course.id] || course.pdfUrl;
    if (mappedPdf) {
        window.open(mappedPdf, '_blank');
        return;
    }

    const categoryNames: Record<string, { label: string; color: string; bg: string; border: string }> = {
        ectoderme: { label: "L'Ectoderme", color: "#5A9C51", bg: "rgba(90, 156, 81, 0.08)", border: "#5A9C51" },
        mesoderme: { label: "Le Mésoderme", color: "#F27D33", bg: "rgba(242, 125, 51, 0.08)", border: "#F27D33" },
        endoderme: { label: "L'Endoderme", color: "#4171B5", bg: "rgba(65, 113, 181, 0.08)", border: "#4171B5" },
        oeil: { label: "L'Œil", color: "#F2B729", bg: "rgba(242, 183, 41, 0.08)", border: "#F2B729" }
    };

    const categoryInfo = categoryNames[course.categoryId] || { label: course.categoryId, color: "#475569", bg: "#f1f5f9", border: "#cbd5e1" };

    const formattedTitle = (course.title.match(/^(\d+)/) ? `${course.title.match(/^(\d+)/)?.[1].padStart(2, '0')}. ` : '') + course.title.replace(/^\d+[.\-\s_:]*/, '').replace(/\s*_\s*/g, ' : ');
    const safeFilename = `${categoryInfo.label.replace("'", "")} - ${formattedTitle}`.replace(/[^a-z0-9àâçéèêëîïôûùüÿñæœ\-\s]/gi, '_').trim() + '.pdf';

    const summaryContent = course.fullSummary || course.shortSummary || '';
    const transcriptContent = course.transcriptMarkdown || '';

    const summaryHtml = summaryContent ? markdownToHtml(summaryContent, categoryInfo.color) : '';
    const transcriptHtml = transcriptContent ? markdownToHtml(transcriptContent, categoryInfo.color) : '';

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert(t ? t('chatbot.popupBlocked', "Veuillez autoriser l'ouverture des fenêtres pop-up.") : "Veuillez autoriser l'ouverture des fenêtres pop-up.");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${categoryInfo.label} — ${formattedTitle} | Embryo App</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
            <style>
                * {
                    box-sizing: border-box;
                }
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    min-height: 100vh !important;
                    background-color: #FAF6ED;
                    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    -webkit-font-smoothing: antialiased;
                    color: #1E293B;
                }

                #fixed-scroll-wrapper {
                    width: 100%;
                    min-height: 100vh;
                    padding-top: 64px;
                    padding-bottom: 40px;
                    background-color: #FAF6ED;
                }

                .a4-page {
                    width: 210mm;
                    min-height: 297mm;
                    background-color: #FFFFFF !important;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
                    border: 1px solid #EBE5D8;
                    border-radius: 12px;
                    padding: 20mm 20mm;
                    position: relative;
                    color: #1E293B;
                    margin: 0 auto;
                }

                .prose { color: #1E293B; max-width: none; line-height: 1.72; }
                
                p, h1, h2, h3, h4, li, blockquote, div {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                }
                
                h1, h2, h3, h4 {
                    page-break-after: avoid !important;
                    break-after: avoid !important;
                }

                @media screen and (max-width: 230mm) {
                    #fixed-scroll-wrapper { padding-top: 56px; padding-bottom: 20px; }
                    .a4-page {
                        width: 96%;
                        padding: 14mm 14mm;
                    }
                }

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
                        background-color: white !important;
                    }
                    .a4-page {
                        width: 100% !important;
                        min-height: 0 !important;
                        margin: 0 !important;
                        border-radius: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                        padding: 0 !important;
                        background-color: white !important;
                    }
                    @page { 
                        size: A4 portrait; 
                        margin: 15mm; 
                    }
                    .no-print { display: none !important; }
                }
            </style>
        </head>
        <body>
            <div id="fixed-scroll-wrapper">
                <!-- TOP HEADER ACTION BAR -->
                <div class="no-print" style="position: fixed; top: 0; left: 0; right: 0; height: 50px; background: rgba(250, 246, 237, 0.94); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-bottom: 1px solid #EBE5D8; z-index: 999999; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div style="font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #1E293B; letter-spacing: 1.5px; display: flex; align-items: center; gap: 8px;">
                        <span style="color: ${categoryInfo.color}; font-size: 14px;">●</span> EMBRYOLOGIE APP — FICHE A4
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button onclick="window.close()" style="background-color: transparent; color: #64748b; border: 1px solid #CBD5E1; padding: 5px 12px; border-radius: 20px; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;">
                            ✕ Fermer
                        </button>
                        <button onclick="downloadPdfFile()" style="background-color: ${categoryInfo.color}; color: #ffffff; border: none; padding: 6px 16px; border-radius: 20px; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px ${categoryInfo.color}40;">
                            📥 Télécharger le PDF (A4)
                        </button>
                    </div>
                </div>
                
                <div class="a4-page" id="pdf-content">
                    <!-- IN-APP HEADER BRANDING -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #EBE5D8; padding-bottom: 14px; margin-bottom: 24px;">
                        <div>
                            <span style="font-family: 'Bebas Neue', sans-serif; font-size: 26px; color: #1E293B; letter-spacing: 2px; display: block; line-height: 1;">EMBRYOLOGIE APP</span>
                            <span style="font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; color: #64748b; letter-spacing: 1.5px; display: block; text-transform: uppercase; margin-top: 3px;">FeelProd • Enseignement Marc Damoiseaux</span>
                        </div>
                        <div style="background-color: ${categoryInfo.color}; color: #FFFFFF; font-family: 'Montserrat', sans-serif; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 5px 14px; border-radius: 9999px; box-shadow: 0 2px 6px ${categoryInfo.color}30;">
                            ${categoryInfo.label}
                        </div>
                    </div>

                    <!-- COURSE TITLE & BADGES (MATCHING IN-APP HEADER) -->
                    <div style="text-align: left; margin-bottom: 24px; page-break-inside: avoid;">
                        <h1 style="font-family: 'Bebas Neue', sans-serif; color: #1E293B; font-size: 34px; letter-spacing: 1.2px; margin: 0 0 8px 0; line-height: 1.15;">
                            ${formattedTitle}
                        </h1>
                        <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
                            ${course.duration ? `
                                <span style="background-color: ${categoryInfo.color}; color: #FFFFFF; font-family: 'Montserrat', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: 1px; padding: 3px 10px; border-radius: 9999px;">
                                    DURÉE : ${course.duration}
                                </span>
                            ` : ''}
                            <span style="background-color: #FAF6ED; color: #64748B; border: 1px solid #EBE5D8; font-family: 'Montserrat', sans-serif; font-size: 10.5px; font-weight: 600; letter-spacing: 1px; padding: 3px 10px; border-radius: 9999px;">
                                FICHE PÉDAGOGIQUE
                            </span>
                        </div>
                    </div>

                    <!-- CLINICAL SUMMARY (MATCHING IN-APP CARD) -->
                    ${summaryHtml ? `
                        <div style="background-color: ${categoryInfo.bg}; border-left: 4px solid ${categoryInfo.color}; padding: 18px 22px; margin-bottom: 28px; border-radius: 0 14px 14px 0; page-break-inside: avoid; break-inside: avoid;">
                            <div style="font-family: 'Bebas Neue', sans-serif; font-size: 18px; color: ${categoryInfo.color}; letter-spacing: 1.2px; margin-bottom: 6px;">RÉSUMÉ DU COURS</div>
                            <div class="prose" style="font-family: 'Montserrat', sans-serif; font-size: 13.5px; line-height: 1.7; color: #334155;">
                                ${summaryHtml}
                            </div>
                        </div>
                    ` : ''}

                    <!-- FULL TRANSCRIPT AND SCHEMAS (MATCHING IN-APP MARKDOWN RENDERER) -->
                    ${transcriptHtml ? `
                        <div style="margin-top: 24px;">
                            <div class="prose">
                                ${transcriptHtml}
                            </div>
                        </div>
                    ` : ''}

                    <!-- FOOTER -->
                    <div style="margin-top: 45px; padding-top: 14px; border-top: 1px solid #EBE5D8; display: flex; justify-content: space-between; align-items: center; font-family: 'Montserrat', sans-serif; font-size: 9.5px; color: #94A3B8; letter-spacing: 1.2px; text-transform: uppercase; page-break-inside: avoid; break-inside: avoid;">
                        <span>Embryologie Biodynamique • FeelProd</span>
                        <span>${categoryInfo.label} — ${formattedTitle}</span>
                    </div>
                </div>
            </div>

            <script>
                function downloadPdfFile() {
                    var element = document.getElementById('pdf-content');
                    if (typeof html2pdf !== 'undefined') {
                        var opt = {
                            margin:       [10, 10, 10, 10],
                            filename:     '${safeFilename}',
                            image:        { type: 'jpeg', quality: 0.98 },
                            html2canvas:  { scale: 2, useCORS: true, logging: false },
                            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
                            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
                        };
                        html2pdf().set(opt).from(element).save();
                    } else {
                        window.print();
                    }
                }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}
