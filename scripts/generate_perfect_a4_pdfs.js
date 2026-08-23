import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, '..');

// Import videoCourses data
const dataModulePath = path.join(appDir, 'src', 'data', 'videoCourses.ts');
const fileContent = fs.readFileSync(dataModulePath, 'utf8');

// Simple parser for videoCourses array in TS
const jsonStr = fileContent
    .replace(/import[\s\S]*?;/g, '')
    .replace(/export interface[\s\S]*?\}/g, '')
    .replace(/export const videoCourses:\s*VideoCourse\[\]\s*=\s*/, '')
    .replace(/export const getCategoryTotalDuration[\s\S]*$/, '')
    .trim()
    .replace(/;\s*$/, '');

// Evaluate videoCourses
const videoCourses = eval(`(${jsonStr})`);

const categories = {
    ectoderme: {
        label: "L'ECTODERME",
        color: "#5A9C51",
        bg: "rgba(90, 156, 81, 0.08)",
        masterFilename: "L-Ectoderme-Recueil-Integral.pdf"
    },
    mesoderme: {
        label: "LE MÉSODERME",
        color: "#F27D33",
        bg: "rgba(242, 125, 51, 0.08)",
        masterFilename: "Le-Mesoderme-Recueil-Integral.pdf"
    },
    endoderme: {
        label: "L'ENDODERME",
        color: "#4171B5",
        bg: "rgba(65, 113, 181, 0.08)",
        masterFilename: "L-Endoderme-Recueil-Integral.pdf"
    },
    oeil: {
        label: "L'ŒIL",
        color: "#F2B729",
        bg: "rgba(242, 183, 41, 0.08)",
        masterFilename: "L-Oeil-Recueil-Integral.pdf"
    }
};

function markdownToHtml(md, accentColor) {
    if (!md) return '';
    let html = md
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    html = html.replace(/&lt;img\s+([^&]+)\/&gt;/g, '<img $1 />');
    html = html.replace(/&lt;img\s+([^&]+)&gt;/g, '<img $1 />');

    // Schemas
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
        return `
            <div class="schema-wrapper">
                <div class="schema-box">
                    <img src="${src}" alt="${alt || 'Schéma anatomique'}" class="schema-img" />
                </div>
                ${alt ? `<div class="schema-caption">${alt}</div>` : ''}
            </div>
        `;
    });

    // Headings
    html = html.replace(/^### (.*$)/gim, `<div class="section-h3">$1</div>`);
    html = html.replace(/^## (.*$)/gim, `<div class="section-h2">$1</div>`);
    html = html.replace(/^# (.*$)/gim, `<div class="section-h1">$1</div>`);

    // Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, `<blockquote>$1</blockquote>`);

    // Bullet lists & paragraphs
    const lines = html.split('\n');
    let inList = false;
    const processedLines = [];

    for (const line of lines) {
        const listMatch = line.match(/^[\*\-] (.*$)/);
        if (listMatch) {
            if (!inList) {
                processedLines.push('<ul style="padding-left: 20px; margin: 10px 0;">');
                inList = true;
            }
            processedLines.push(`<li style="margin-bottom: 5px;">${listMatch[1]}</li>`);
        } else {
            if (inList) {
                processedLines.push('</ul>');
                inList = false;
            }
            if (line.trim().length > 0 && !line.startsWith('<div') && !line.startsWith('<blockquote') && !line.startsWith('<ul')) {
                processedLines.push(`<p>${line}</p>`);
            } else {
                processedLines.push(line);
            }
        }
    }
    if (inList) processedLines.push('</ul>');

    return processedLines.join('\n');
}

function buildLessonHtml(course, isMaster = false) {
    const cat = categories[course.categoryId] || categories.ectoderme;
    const formattedTitle = (course.title.match(/^(\d+)/) ? `${course.title.match(/^(\d+)/)?.[1].padStart(2, '0')}. ` : '') + course.title.replace(/^\d+[.\-\s_:]*/, '').replace(/\s*_\s*/g, ' : ');

    const summaryContent = course.fullSummary || course.shortSummary || '';
    const transcriptContent = course.transcriptMarkdown || '';

    const summaryHtml = summaryContent ? markdownToHtml(summaryContent, cat.color) : '';
    const transcriptHtml = transcriptContent ? markdownToHtml(transcriptContent, cat.color) : '';

    return `
    <div class="lesson-sheet" style="--cat-color: ${cat.color}; --cat-bg: ${cat.bg};">
        <!-- HEADER EXACT MATCH TO SCREENSHOT -->
        <div class="doc-header">
            <div>
                <div class="doc-title-brand">EMBRYOLOGIE APP</div>
                <span class="doc-subtitle-brand">FEELPROD • ENSEIGNEMENT MARC DAMOISEAUX</span>
            </div>
            <div class="category-pill">${cat.label}</div>
        </div>

        <!-- COURSE TITLE -->
        <h1 class="course-heading">${formattedTitle}</h1>

        <!-- BADGES -->
        <div class="badges-row">
            ${course.duration ? `<span class="duration-badge">DURÉE : ${course.duration}</span>` : ''}
            <span class="fiche-badge">FICHE PÉDAGOGIQUE</span>
        </div>

        <!-- SUMMARY CARD -->
        ${summaryHtml ? `
            <div class="summary-card">
                <div class="summary-title">RÉSUMÉ DU COURS</div>
                <div class="summary-text">${summaryHtml}</div>
            </div>
        ` : ''}

        <!-- TRANSCRIPT & SCHEMAS -->
        ${transcriptHtml ? `
            <div class="transcript-content">
                ${transcriptHtml}
            </div>
        ` : ''}
    </div>
    `;
}

function wrapFullDocument(contentHtml, catColor = '#5A9C51', catBg = 'rgba(90,156,81,0.08)') {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">
        <style>
            @page {
                size: A4 portrait;
                margin: 15mm 15mm 15mm 15mm;
            }
            * {
                box-sizing: border-box;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            body {
                font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                color: #1E293B;
                background: #FFFFFF;
                margin: 0;
                padding: 0;
                line-height: 1.68;
                font-size: 10.5pt;
            }
            .lesson-sheet {
                page-break-after: always;
                break-after: page;
                margin-bottom: 20px;
            }
            .lesson-sheet:last-child {
                page-break-after: avoid;
                break-after: avoid;
            }
            .doc-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 12px;
                border-bottom: 1.5px solid #E5DFD3;
                margin-bottom: 22px;
            }
            .doc-title-brand {
                font-family: 'Bebas Neue', sans-serif;
                font-size: 24pt;
                color: #1E293B;
                letter-spacing: 1.5px;
                line-height: 1;
                margin: 0;
            }
            .doc-subtitle-brand {
                font-family: 'Montserrat', sans-serif;
                font-size: 7.5pt;
                font-weight: 600;
                color: #71869D;
                letter-spacing: 1.2px;
                text-transform: uppercase;
                margin-top: 4px;
                display: block;
            }
            .category-pill {
                background-color: var(--cat-color, ${catColor});
                color: #FFFFFF;
                font-family: 'Montserrat', sans-serif;
                font-size: 8.5pt;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.2px;
                padding: 5px 14px;
                border-radius: 9999px;
            }
            .course-heading {
                font-family: 'Bebas Neue', sans-serif;
                color: #1E293B;
                font-size: 28pt;
                letter-spacing: 1px;
                line-height: 1.1;
                margin: 0 0 10px 0;
            }
            .badges-row {
                display: flex;
                gap: 8px;
                margin-bottom: 22px;
            }
            .duration-badge {
                background-color: var(--cat-color, ${catColor});
                color: #FFFFFF;
                font-family: 'Montserrat', sans-serif;
                font-size: 8pt;
                font-weight: 700;
                letter-spacing: 0.8px;
                padding: 3px 10px;
                border-radius: 9999px;
            }
            .fiche-badge {
                background-color: #FAF6ED;
                border: 1px solid #CBD5E1;
                color: #64748B;
                font-family: 'Montserrat', sans-serif;
                font-size: 8pt;
                font-weight: 600;
                letter-spacing: 0.8px;
                padding: 3px 10px;
                border-radius: 9999px;
            }
            .summary-card {
                background-color: var(--cat-bg, ${catBg});
                border-left: 4px solid var(--cat-color, ${catColor});
                border-radius: 0 14px 14px 0;
                padding: 16px 20px;
                margin-bottom: 24px;
                page-break-inside: avoid;
                break-inside: avoid;
            }
            .summary-title {
                font-family: 'Bebas Neue', sans-serif;
                font-size: 15pt;
                color: var(--cat-color, ${catColor});
                letter-spacing: 1px;
                margin: 0 0 6px 0;
            }
            .summary-text {
                font-family: 'Montserrat', sans-serif;
                font-size: 9.8pt;
                line-height: 1.68;
                color: #334155;
                margin: 0;
                text-align: justify;
            }
            h1, h2, h3, h4, .section-h1, .section-h2, .section-h3 {
                page-break-after: avoid;
                break-after: avoid;
            }
            .section-h1 {
                font-family: 'Bebas Neue', sans-serif;
                font-size: 21pt;
                color: var(--cat-color, ${catColor});
                letter-spacing: 1px;
                margin: 26px 0 10px 0;
            }
            .section-h2 {
                font-family: 'Bebas Neue', sans-serif;
                font-size: 16pt;
                color: var(--cat-color, ${catColor});
                letter-spacing: 0.8px;
                margin: 20px 0 8px 0;
                border-bottom: 1px solid rgba(0,0,0,0.06);
                padding-bottom: 3px;
            }
            .section-h3 {
                font-family: 'Bebas Neue', sans-serif;
                font-size: 13.5pt;
                color: #1E293B;
                letter-spacing: 0.6px;
                margin: 16px 0 6px 0;
            }
            p {
                margin: 0 0 12px 0;
                text-align: justify;
                orphans: 3;
                widows: 3;
            }
            strong {
                color: #0F172A;
                font-weight: 700;
            }
            blockquote {
                border-left: 3.5px solid var(--cat-color, ${catColor});
                background: var(--cat-bg, ${catBg});
                padding: 12px 16px;
                margin: 16px 0;
                border-radius: 0 10px 10px 0;
                font-style: italic;
                color: #334155;
                page-break-inside: avoid;
            }
            .schema-wrapper {
                text-align: center;
                margin: 20px auto;
                page-break-inside: avoid;
                break-inside: avoid;
            }
            .schema-box {
                background: #FFFFFF;
                padding: 8px;
                border-radius: 14px;
                border: 1px solid #E2E8F0;
                box-shadow: 0 2px 10px rgba(0,0,0,0.04);
                display: inline-block;
                max-width: 90%;
            }
            .schema-img {
                max-width: 100%;
                max-height: 120mm;
                height: auto;
                border-radius: 10px;
                display: block;
                margin: 0 auto;
            }
            .schema-caption {
                font-family: 'Montserrat', sans-serif;
                font-size: 8.5pt;
                font-weight: 500;
                color: #64748B;
                font-style: italic;
                margin-top: 6px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        ${contentHtml}
    </body>
    </html>
    `;
}

async function main() {
    console.log("Starting Playwright high-definition A4 PDF generation...");
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const pdfOutDir = path.join(appDir, 'public', 'pdfs');
    const masterOutDir = path.join(pdfOutDir, 'cours_complets');
    fs.makedirs ? fs.makedirs(masterOutDir) : fs.mkdirSync(masterOutDir, { recursive: true });

    for (const [catKey, catInfo] of Object.entries(categories)) {
        const catLessons = videoCourses.filter(c => c.categoryId === catKey && !c.isGlobalPdf);
        console.log(`\n======================================================`);
        console.log(`Generating Master & Single PDFs for ${catInfo.label} (${catLessons.length} lessons)`);
        console.log(`======================================================`);

        const catSingleDir = path.join(pdfOutDir, catKey);
        fs.mkdirSync(catSingleDir, { recursive: true });

        // 1. Generate All Single Lesson PDFs
        let combinedHtml = '';
        for (let i = 0; i < catLessons.length; i++) {
            const lesson = catLessons[i];
            const lessonHtml = buildLessonHtml(lesson);
            combinedHtml += lessonHtml;

            const fullHtml = wrapFullDocument(lessonHtml, catInfo.color, catInfo.bg);
            await page.setContent(fullHtml, { waitUntil: 'networkidle' });

            const numMatch = lesson.id.match(/\d+/) || lesson.title.match(/^\d+/);
            const num = numMatch ? String(numMatch[0]).padStart(2, '0') : String(i + 1).padStart(2, '0');
            const cleanTitleStr = lesson.title.replace(/^\d+[.\-\s_:]*/, '').replace(/\s*_\s*/g, ' : ').replace(/[/\\?%*:|"<>]/g, '-').trim();
            const singlePdfName = `${num} - ${cleanTitleStr}.pdf`;
            const singlePdfPath = path.join(catSingleDir, singlePdfName);

            await page.pdf({
                path: singlePdfPath,
                format: 'A4',
                printBackground: true,
                margin: { top: '14mm', right: '14mm', bottom: '14mm', left: '14mm' }
            });
            console.log(`  [${i+1}/${catLessons.length}] Generated: ${singlePdfName}`);
        }

        // 2. Generate Consolidated Master PDF
        console.log(`  -> Generating Consolidated Master PDF: ${catInfo.masterFilename}...`);
        const masterFullHtml = wrapFullDocument(combinedHtml, catInfo.color, catInfo.bg);
        await page.setContent(masterFullHtml, { waitUntil: 'networkidle' });

        const masterPdfPath = path.join(masterOutDir, catInfo.masterFilename);
        await page.pdf({
            path: masterPdfPath,
            format: 'A4',
            printBackground: true,
            margin: { top: '14mm', right: '14mm', bottom: '14mm', left: '14mm' }
        });
        const stats = fs.statSync(masterPdfPath);
        console.log(`  ✓ Master PDF Generated: ${catInfo.masterFilename} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    }

    await browser.close();
    console.log("\n🎉 ALL in-app styled PDFs and Master Consolidations generated successfully!");
}

main().catch(err => {
    console.error("Error generating PDFs:", err);
    process.exit(1);
});
