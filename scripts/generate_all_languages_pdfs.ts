import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium, type Browser } from '@playwright/test';

import { videoCourses as videoCoursesFr, type VideoCourse } from '../src/data/videoCourses';
import { videoCourses as videoCoursesEn } from '../src/data/videoCourses_en';
import { videoCourses as videoCoursesDe } from '../src/data/videoCourses_de';
import { videoCourses as videoCoursesEs } from '../src/data/videoCourses_es';
import { videoCourses as videoCoursesIt } from '../src/data/videoCourses_it';
import { videoCourses as videoCoursesJa } from '../src/data/videoCourses_ja';
import { videoCourses as videoCoursesZh } from '../src/data/videoCourses_zh';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, '..');

export type SupportedLang = 'fr' | 'en' | 'de' | 'es' | 'it' | 'ja' | 'zh';

const LANG_CONFIGS: Record<SupportedLang, {
    courses: VideoCourse[];
    appName: string;
    subtitle: string;
    categoryLabels: Record<string, string>;
    courseSummary: string;
    pedagogicalSheet: string;
    duration: string;
    fig: string;
    footerBrand: string;
    masterTitles: Record<string, string>;
}> = {
    fr: {
        courses: videoCoursesFr,
        appName: "EMBRYOLOGIE APP",
        subtitle: "FEELPROD • ENSEIGNEMENT MARC DAMOISEAUX",
        categoryLabels: {
            ectoderme: "L'ECTODERME",
            mesoderme: "LE MÉSODERME",
            endoderme: "L'ENDODERME",
            oeil: "L'ŒIL"
        },
        courseSummary: "RÉSUMÉ DU COURS",
        pedagogicalSheet: "FICHE PÉDAGOGIQUE",
        duration: "DURÉE",
        fig: "FIG.",
        footerBrand: "Embryologie Biodynamique • FeelProd",
        masterTitles: {
            ectoderme: "L-Ectoderme-Recueil-Integral.pdf",
            mesoderme: "Le-Mesoderme-Recueil-Integral.pdf",
            endoderme: "L-Endoderme-Recueil-Integral.pdf",
            oeil: "L-Oeil-Recueil-Integral.pdf"
        }
    },
    en: {
        courses: videoCoursesEn,
        appName: "EMBRYOLOGY APP",
        subtitle: "FEELPROD • TEACHING OF MARC DAMOISEAUX",
        categoryLabels: {
            ectoderme: "THE ECTODERM",
            mesoderme: "THE MESODERM",
            endoderme: "THE ENDODERM",
            oeil: "THE EYE"
        },
        courseSummary: "COURSE SUMMARY",
        pedagogicalSheet: "STUDY SHEET",
        duration: "DURATION",
        fig: "FIG.",
        footerBrand: "Biodynamic Embryology • FeelProd",
        masterTitles: {
            ectoderme: "The-Ectoderm-Complete-Handbook.pdf",
            mesoderme: "The-Mesoderm-Complete-Handbook.pdf",
            endoderme: "The-Endoderm-Complete-Handbook.pdf",
            oeil: "The-Eye-Complete-Handbook.pdf"
        }
    },
    de: {
        courses: videoCoursesDe,
        appName: "EMBRYOLOGIE APP",
        subtitle: "FEELPROD • LEHRE VON MARC DAMOISEAUX",
        categoryLabels: {
            ectoderme: "DAS EKTODERM",
            mesoderme: "DAS MESODERM",
            endoderme: "DAS ENDODERM",
            oeil: "DAS AUGE"
        },
        courseSummary: "KURSZUSAMMENFASSUNG",
        pedagogicalSheet: "LEHRBLATT",
        duration: "DAUER",
        fig: "ABB.",
        footerBrand: "Biodynamische Embryologie • FeelProd",
        masterTitles: {
            ectoderme: "Das-Ektoderm-Gesamthandbuch.pdf",
            mesoderme: "Das-Mesoderm-Gesamthandbuch.pdf",
            endoderme: "Das-Endoderm-Gesamthandbuch.pdf",
            oeil: "Das-Auge-Gesamthandbuch.pdf"
        }
    },
    es: {
        courses: videoCoursesEs,
        appName: "EMBRIOLOGÍA APP",
        subtitle: "FEELPROD • ENSEÑANZA DE MARC DAMOISEAUX",
        categoryLabels: {
            ectoderme: "EL ECTODERMO",
            mesoderme: "EL MESODERMO",
            endoderme: "EL ENDODERMO",
            oeil: "EL OJO"
        },
        courseSummary: "RESUMEN DEL CURSO",
        pedagogicalSheet: "FICHA PEDAGÓGICA",
        duration: "DURACIÓN",
        fig: "FIG.",
        footerBrand: "Embriología Biodinámica • FeelProd",
        masterTitles: {
            ectoderme: "El-Ectodermo-Manual-Integral.pdf",
            mesoderme: "El-Mesodermo-Manual-Integral.pdf",
            endoderme: "El-Endodermo-Manual-Integral.pdf",
            oeil: "El-Ojo-Manual-Integral.pdf"
        }
    },
    it: {
        courses: videoCoursesIt,
        appName: "EMBRIOLOGIA APP",
        subtitle: "FEELPROD • INSEGNAMENTO DI MARC DAMOISEAUX",
        categoryLabels: {
            ectoderme: "L'ECTODERMA",
            mesoderme: "IL MESODERMA",
            endoderme: "L'ENDODERMA",
            oeil: "L'OCCHIO"
        },
        courseSummary: "RIASSUNTO DEL CORSO",
        pedagogicalSheet: "SCHEDA DIDATTICA",
        duration: "DURATA",
        fig: "FIG.",
        footerBrand: "Embriologia Biodinamica • FeelProd",
        masterTitles: {
            ectoderme: "L-Ectoderma-Manuale-Integrale.pdf",
            mesoderme: "Il-Mesoderma-Manuale-Integrale.pdf",
            endoderme: "L-Endoderma-Manuale-Integrale.pdf",
            oeil: "L-Occhio-Manuale-Integrale.pdf"
        }
    },
    ja: {
        courses: videoCoursesJa,
        appName: "発生学 APP",
        subtitle: "FEELPROD • マルク・ダモワゾーの教え",
        categoryLabels: {
            ectoderme: "外胚葉",
            mesoderme: "中胚葉",
            endoderme: "内胚葉",
            oeil: "眼"
        },
        courseSummary: "コース概要",
        pedagogicalSheet: "学習シート",
        duration: "所要時間",
        fig: "図",
        footerBrand: "バイオダイナミック発生学 • FeelProd",
        masterTitles: {
            ectoderme: "外胚葉-完全講義録.pdf",
            mesoderme: "中胚葉-完全講義録.pdf",
            endoderme: "内胚葉-完全講義録.pdf",
            oeil: "眼-完全講義録.pdf"
        }
    },
    zh: {
        courses: videoCoursesZh,
        appName: "胚胎学 APP",
        subtitle: "FEELPROD • 马克·达穆瓦佐讲座",
        categoryLabels: {
            ectoderme: "外胚层",
            mesoderme: "中胚层",
            endoderme: "内胚层",
            oeil: "眼睛"
        },
        courseSummary: "课程总结",
        pedagogicalSheet: "教学单",
        duration: "时长",
        fig: "图",
        footerBrand: "生物动力胚胎学 • FeelProd",
        masterTitles: {
            ectoderme: "外胚层-研讨会完整汇编.pdf",
            mesoderme: "中胚层-研讨会完整汇编.pdf",
            endoderme: "内胚层-研讨会完整汇编.pdf",
            oeil: "眼睛-研讨会完整汇编.pdf"
        }
    }
};

const CATEGORIES_STYLE: Record<string, { color: string; bg: string }> = {
    ectoderme: { color: "#5A9C51", bg: "rgba(90, 156, 81, 0.08)" },
    mesoderme: { color: "#F27D33", bg: "rgba(242, 125, 51, 0.08)" },
    endoderme: { color: "#4171B5", bg: "rgba(65, 113, 181, 0.08)" },
    oeil: { color: "#F2B729", bg: "rgba(242, 183, 41, 0.08)" }
};

function markdownToHtml(md: string, accentColor: string, figLabel: string = "FIG."): string {
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
                ${alt ? `<div class="schema-caption"><strong style="color: ${accentColor};">${figLabel}</strong> — ${alt}</div>` : ''}
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
    const processedLines: string[] = [];

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

function buildLessonHtml(course: VideoCourse, lang: SupportedLang) {
    const config = LANG_CONFIGS[lang];
    const catStyle = CATEGORIES_STYLE[course.categoryId] || CATEGORIES_STYLE.ectoderme;
    const catLabel = config.categoryLabels[course.categoryId] || course.categoryId;

    const formattedTitle = (course.title.match(/^(\d+)/) ? `${course.title.match(/^(\d+)/)?.[1].padStart(2, '0')}. ` : '') + course.title.replace(/^\d+[.\-\s_:]*/, '').replace(/\s*_\s*/g, ' : ');

    const summaryContent = course.fullSummary || course.shortSummary || '';
    const transcriptContent = course.transcriptMarkdown || '';

    const summaryHtml = summaryContent ? markdownToHtml(summaryContent, catStyle.color, config.fig) : '';
    const transcriptHtml = transcriptContent ? markdownToHtml(transcriptContent, catStyle.color, config.fig) : '';

    return `
    <div class="lesson-sheet" style="--cat-color: ${catStyle.color}; --cat-bg: ${catStyle.bg};">
        <!-- HEADER -->
        <div class="doc-header">
            <div>
                <div class="doc-title-brand">${config.appName}</div>
                <span class="doc-subtitle-brand">${config.subtitle}</span>
            </div>
            <div class="category-pill">${catLabel}</div>
        </div>

        <!-- COURSE TITLE -->
        <h1 class="course-heading">${formattedTitle}</h1>

        <!-- BADGES -->
        <div class="badges-row">
            ${course.duration ? `<span class="duration-badge">${config.duration} : ${course.duration}</span>` : ''}
            <span class="fiche-badge">${config.pedagogicalSheet}</span>
        </div>

        <!-- SUMMARY CARD -->
        ${summaryHtml ? `
            <div class="summary-card">
                <div class="summary-title">${config.courseSummary}</div>
                <div class="summary-text">${summaryHtml}</div>
            </div>
        ` : ''}

        <!-- TRANSCRIPT & SCHEMAS -->
        ${transcriptHtml ? `
            <div class="transcript-content">
                ${transcriptHtml}
            </div>
        ` : ''}

        <!-- FOOTER -->
        <div class="doc-footer">
            <span>${config.footerBrand}</span>
            <span>${catLabel} — ${formattedTitle}</span>
        </div>
    </div>
    `;
}

function wrapFullDocument(contentHtml: string, lang: SupportedLang, catColor = '#5A9C51', catBg = 'rgba(90,156,81,0.08)') {
    return `
    <!DOCTYPE html>
    <html lang="${lang}">
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
            .doc-footer {
                margin-top: 40px;
                padding-top: 12px;
                border-top: 1px solid #E5DFD3;
                display: flex;
                justify-content: space-between;
                font-family: 'Montserrat', sans-serif;
                font-size: 8pt;
                color: #94A3B8;
                text-transform: uppercase;
                letter-spacing: 1px;
                page-break-inside: avoid;
                break-inside: avoid;
            }
        </style>
    </head>
    <body>
        ${contentHtml}
    </body>
    </html>
    `;
}

async function generatePdfsForLang(browser: Browser, lang: SupportedLang) {
    const config = LANG_CONFIGS[lang];
    const page = await browser.newPage();
    const categories = ['ectoderme', 'mesoderme', 'endoderme', 'oeil'] as const;

    const basePdfDir = path.join(appDir, 'public', 'pdfs', lang === 'fr' ? '' : lang);
    const masterOutDir = path.join(basePdfDir, 'cours_complets');
    fs.mkdirSync(masterOutDir, { recursive: true });

    console.log(`\n======================================================`);
    console.log(`🚀 [${lang.toUpperCase()}] Generating PDFs (${config.courses.length} courses total)`);
    console.log(`======================================================`);

    for (const catKey of categories) {
        const catStyle = CATEGORIES_STYLE[catKey];
        const catLessons = config.courses.filter(c => c.categoryId === catKey && !c.isGlobalPdf);
        const catSingleDir = path.join(basePdfDir, catKey);
        fs.mkdirSync(catSingleDir, { recursive: true });

        console.log(`\n--- [${lang.toUpperCase()}] Category: ${catKey} (${catLessons.length} lessons) ---`);

        // 1. Generate Single Lesson PDFs
        let combinedHtml = '';
        for (let i = 0; i < catLessons.length; i++) {
            const lesson = catLessons[i];
            const lessonHtml = buildLessonHtml(lesson, lang);
            combinedHtml += lessonHtml;

            const fullHtml = wrapFullDocument(lessonHtml, lang, catStyle.color, catStyle.bg);
            await page.setContent(fullHtml, { waitUntil: 'networkidle' });

            const numMatch = lesson.id.match(/\d+/) || lesson.title.match(/^\d+/);
            const num = numMatch ? String(numMatch[0]).padStart(2, '0') : String(i + 1).padStart(2, '0');
            const rawTitle = lesson.title.split('\n')[0] || '';
            const cleanTitleStr = rawTitle.replace(/^\d+[.\-\s_:]*/, '').replace(/\s*_\s*/g, ' : ').replace(/[/\\?%*:|"<>\r\n]/g, '-').trim().slice(0, 60);
            const singlePdfName = `${num} - ${cleanTitleStr}.pdf`;
            const singlePdfPath = path.join(catSingleDir, singlePdfName);

            await page.pdf({
                path: singlePdfPath,
                format: 'A4',
                printBackground: true,
                margin: { top: '14mm', right: '14mm', bottom: '14mm', left: '14mm' }
            });
            console.log(`  [${lang.toUpperCase()}] [${i + 1}/${catLessons.length}] ✓ ${singlePdfName}`);
        }

        // 2. Generate Consolidated Master PDF (Recueil Intégral)
        const masterFileName = config.masterTitles[catKey] || `${catKey}-Recueil-Integral.pdf`;
        console.log(`  -> [${lang.toUpperCase()}] Generating Master Recueil: ${masterFileName}...`);

        const masterFullHtml = wrapFullDocument(combinedHtml, lang, catStyle.color, catStyle.bg);
        await page.setContent(masterFullHtml, { waitUntil: 'networkidle' });

        const masterPdfPath = path.join(masterOutDir, masterFileName);
        await page.pdf({
            path: masterPdfPath,
            format: 'A4',
            printBackground: true,
            margin: { top: '14mm', right: '14mm', bottom: '14mm', left: '14mm' }
        });
        const stats = fs.statSync(masterPdfPath);
        console.log(`  ✓ [${lang.toUpperCase()}] Master Recueil Generated: ${masterFileName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    }

    await page.close();
}

async function main() {
    const rawArg = process.argv[2];
    const langsToProcess: SupportedLang[] = rawArg 
        ? (rawArg.split(',').map(s => s.trim()) as SupportedLang[])
        : ['fr', 'en', 'de', 'es', 'it', 'ja', 'zh'];

    console.log(`Starting High-Definition A4 PDF Exporter for languages: ${langsToProcess.join(', ')}`);
    const browser = await chromium.launch();

    for (const lang of langsToProcess) {
        if (!LANG_CONFIGS[lang]) continue;
        await generatePdfsForLang(browser, lang);
    }

    await browser.close();
    console.log("\n🎉 ALL in-app styled PDFs and Master Consolidations generated successfully across all languages!");
}

main().catch(err => {
    console.error("Error generating multilingual PDFs:", err);
    process.exit(1);
});
