import { type VideoCourse } from '../data/videoCourses';

/**
 * Professional Minimalist & Colorful Markdown to HTML converter
 */
function markdownToHtml(md: string, accentColor: string = '#0F172A'): string {
    if (!md) return '';

    let html = md
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Re-enable <img> tags if any were in raw HTML
    html = html.replace(/&lt;img\s+([^&]+)\/&gt;/g, '<img $1 />');
    html = html.replace(/&lt;img\s+([^&]+)&gt;/g, '<img $1 />');

    // Markdown Images ![alt](url)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
        return `
            <div style="text-align: center; margin: 24px 0; page-break-inside: avoid; break-inside: avoid;">
                <img src="${src}" alt="${alt || 'Schéma embryologique'}" style="max-width: 80%; height: auto; border-radius: 8px; border: 1px solid #e2e8f0; margin: 0 auto; display: block;" />
                ${alt ? `<p style="font-size: 12px; font-weight: 500; color: #64748b; font-style: italic; margin-top: 6px; text-align: center; page-break-inside: avoid;">${alt}</p>` : ''}
            </div>
        `;
    });

    // Headings styled with vibrant category accent color
    html = html.replace(/^### (.*$)/gim, `<h3 style="font-family: 'Bebas Neue', cursive; font-size: 20px; color: ${accentColor}; margin-top: 24px; margin-bottom: 8px; line-height: 1.2; page-break-after: avoid; break-after: avoid;">$1</h3>`);
    html = html.replace(/^## (.*$)/gim, `<h2 style="font-family: 'Bebas Neue', cursive; font-size: 24px; color: ${accentColor}; margin-top: 28px; margin-bottom: 12px; line-height: 1.2; border-bottom: 1.5px solid ${accentColor}33; padding-bottom: 4px; page-break-after: avoid; break-after: avoid;">$1</h2>`);
    html = html.replace(/^# (.*$)/gim, `<h1 style="font-family: 'Bebas Neue', cursive; font-size: 30px; color: ${accentColor}; margin-top: 32px; margin-bottom: 16px; line-height: 1.2; page-break-after: avoid; break-after: avoid;">$1</h1>`);

    // Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0F172A; font-weight: 800;">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, `<blockquote style="border-left: 3px solid ${accentColor}; background: ${accentColor}0D; padding: 12px 16px; margin: 16px 0; border-radius: 0 6px 6px 0; font-style: italic; color: #334155; page-break-inside: avoid; break-inside: avoid;">$1</blockquote>`);

    // Bullet lists
    const lines = html.split('\n');
    let inList = false;
    const processedLines: string[] = [];

    for (const line of lines) {
        const listMatch = line.match(/^[\*\-] (.*$)/);
        if (listMatch) {
            if (!inList) {
                processedLines.push('<ul style="padding-left: 20px; margin: 12px 0; page-break-inside: avoid; break-inside: avoid;">');
                inList = true;
            }
            processedLines.push(`<li style="margin-bottom: 6px; line-height: 1.6; color: #1E293B; page-break-inside: avoid; break-inside: avoid;">${listMatch[1]}</li>`);
        } else {
            if (inList) {
                processedLines.push('</ul>');
                inList = false;
            }
            if (line.trim().length > 0 && !line.startsWith('<h') && !line.startsWith('<blockquote') && !line.startsWith('<div')) {
                processedLines.push(`<p style="font-size: 14.5px; margin-bottom: 14px; line-height: 1.65; color: #1E293B; text-align: justify; page-break-inside: avoid; break-inside: avoid; orphans: 3; widows: 3;">${line}</p>`);
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
 * Professional Minimalist & Colorful A4 PDF Exporter
 */
export function exportCoursePdf(course: VideoCourse, t?: (key: string, fallback?: string) => string): void {
    if (!course) return;

    const categoryNames: Record<string, { label: string; color: string; bg: string }> = {
        ectoderme: { label: "L'Ectoderme", color: "#5A9C51", bg: "rgba(90, 156, 81, 0.08)" },
        mesoderme: { label: "Le Mésoderme", color: "#F27D33", bg: "rgba(242, 125, 51, 0.08)" },
        endoderme: { label: "L'Endoderme", color: "#4171B5", bg: "rgba(65, 113, 181, 0.08)" },
        oeil: { label: "L'Œil", color: "#F2B729", bg: "rgba(242, 183, 41, 0.08)" }
    };

    const categoryInfo = categoryNames[course.categoryId] || { label: course.categoryId, color: "#475569", bg: "#f1f5f9" };

    const formattedTitle = (course.title.match(/^(\d+)/) ? `${course.title.match(/^(\d+)/)?.[1].padStart(2, '0')}- ` : '') + course.title.replace(/^\d+[.\-\s_:]*/, '').replace(/\s*_\s*/g, ' : ');
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
            <title>${categoryInfo.label} - ${formattedTitle} | FeelProd</title>
            <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
            <style>
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    min-height: 100vh !important;
                    background-color: #F8FAFC;
                    font-family: 'Roboto', sans-serif;
                    -webkit-font-smoothing: antialiased;
                }

                #fixed-scroll-wrapper {
                    width: 100%;
                    min-height: 100vh;
                    padding-top: 68px;
                    padding-bottom: 30px;
                    box-sizing: border-box;
                }

                .a4-page {
                    width: 210mm;
                    min-height: 297mm;
                    background-color: #FFFFFF !important;
                    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
                    border: 1px solid #E2E8F0;
                    border-radius: 6px;
                    box-sizing: border-box;
                    padding: 18mm 18mm;
                    position: relative;
                    color: #1E293B;
                    margin: 0 auto;
                }

                .prose { color: #1E293B; max-width: none; line-height: 1.65; }
                
                p, h1, h2, h3, h4, li, blockquote, div {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                }
                
                h1, h2, h3, h4 {
                    page-break-after: avoid !important;
                    break-after: avoid !important;
                }

                @media screen and (max-width: 230mm) {
                    #fixed-scroll-wrapper { padding-top: 58px; padding-bottom: 15px; }
                    .a4-page {
                        width: 95%;
                        padding: 12mm 12mm;
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
                    @page { margin: 15mm; }
                    .no-print { display: none !important; }
                }
            </style>
        </head>
        <body>
            <div id="fixed-scroll-wrapper">
                <!-- TOP HEADER BANNER (ULTRA SLIM & MINIMALIST) -->
                <div class="no-print" style="position: fixed; top: 0; left: 0; right: 0; height: 48px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-bottom: 1px solid #E2E8F0; z-index: 999999; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.02);">
                    <div style="font-family: 'Bebas Neue', cursive; font-size: 17px; color: #0F172A; letter-spacing: 1px; display: flex; align-items: center; gap: 6px;">
                        <span style="color: ${categoryInfo.color}; font-size: 11px;">●</span> EMBRYO AI — EXPORT PDF
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button onclick="window.close()" style="background-color: transparent; color: #64748b; border: 1px solid #E2E8F0; padding: 4px 10px; border-radius: 20px; font-family: 'Roboto', sans-serif; font-size: 11px; font-weight: 600; cursor: pointer;">
                            ✕ Fermer
                        </button>
                        <button onclick="handleShareAction()" style="background-color: ${categoryInfo.color}; color: #ffffff; border: none; padding: 5px 14px; border-radius: 20px; font-family: 'Roboto', sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 6px ${categoryInfo.bg};">
                            📤 Partager PDF
                        </button>
                    </div>
                </div>
                
                <div class="a4-page" id="pdf-content">
                    <!-- BRANDING HEADER -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 12px; margin-bottom: 24px;">
                        <div>
                            <span style="font-family: 'Bebas Neue', cursive; font-size: 24px; color: #0F172A; letter-spacing: 2px;">EMBRYO AI</span>
                            <span style="font-family: 'Roboto', sans-serif; font-size: 9.5px; font-weight: 700; color: #64748b; letter-spacing: 1.5px; display: block; text-transform: uppercase;">FeelProd — Support d'Embryologie</span>
                        </div>
                        <div style="background-color: ${categoryInfo.bg}; color: ${categoryInfo.color}; border: 1.5px solid ${categoryInfo.color}; font-family: 'Roboto', sans-serif; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 16px;">
                            ${categoryInfo.label}
                        </div>
                    </div>

                    <!-- COURSE TITLE -->
                    <div style="text-align: left; margin-bottom: 24px; page-break-inside: avoid;">
                        <h1 style="font-family: 'Bebas Neue', cursive; color: ${categoryInfo.color}; font-size: 30px; letter-spacing: 1.5px; margin: 0 0 4px 0; line-height: 1.15;">
                            ${formattedTitle}
                        </h1>
                        ${course.duration ? `<p style="font-family: 'Roboto', sans-serif; color: #64748b; font-size: 12px; font-weight: 600; margin: 0;">Durée du cours : ${course.duration}</p>` : ''}
                    </div>

                    ${summaryHtml ? `
                        <div style="background-color: #F8FAFC; border-left: 3px solid ${categoryInfo.color}; padding: 16px 18px; margin-bottom: 26px; border-radius: 0 8px 8px 0; page-break-inside: avoid; break-inside: avoid;">
                            <div style="font-family: 'Bebas Neue', cursive; font-size: 17px; color: ${categoryInfo.color}; letter-spacing: 1px; margin-bottom: 6px;">RÉSUMÉ DU COURS</div>
                            <div class="prose" style="font-size: 13.5px; color: #334155;">
                                ${summaryHtml}
                            </div>
                        </div>
                    ` : ''}

                    ${transcriptHtml ? `
                        <div style="margin-top: 20px;">
                            <div style="font-family: 'Bebas Neue', cursive; font-size: 19px; color: ${categoryInfo.color}; letter-spacing: 1px; margin-bottom: 14px; border-bottom: 1.5px solid ${categoryInfo.color}33; padding-bottom: 4px; display: inline-block; page-break-after: avoid; break-after: avoid;">
                                RE-TRANSCRIPTION ET SCHÉMAS DÉTAILLÉS
                            </div>
                            <div class="prose">
                                ${transcriptHtml}
                            </div>
                        </div>
                    ` : ''}

                    <!-- FOOTER -->
                    <div style="margin-top: 40px; padding-top: 14px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 10px; color: #94a3b8; letter-spacing: 1.5px; text-transform: uppercase; page-break-inside: avoid; break-inside: avoid;">
                        Embryo AI — Document d'Étude FeelProd
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

                function handleShareAction() {
                    downloadPdfFile();
                }
            </script>
        </body>
        </html>
    `);

    printWindow.document.close();
}
