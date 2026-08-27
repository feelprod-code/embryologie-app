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
        subtitle: "FEELPROD • MARC DAMOISEAUX TEACHINGS",
        categoryLabels: {
            ectoderme: "THE ECTODERM",
            mesoderme: "THE MESODERM",
            endoderme: "THE ENDODERM",
            oeil: "THE EYE"
        },
        courseSummary: "COURSE SUMMARY",
        pedagogicalSheet: "PEDAGOGICAL SHEET",
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
        subtitle: "FEELPROD • MARC DAMOISEAUX LEHRE",
        categoryLabels: {
            ectoderme: "DAS EKTODERM",
            mesoderme: "DAS MESODERM",
            endoderme: "DAS ENTODERM",
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
            endoderme: "Das-Entoderm-Gesamthandbuch.pdf",
            oeil: "Das-Auge-Gesamthandbuch.pdf"
        }
    },
    es: {
        courses: videoCoursesEs,
        appName: "EMBRIOLOGÍA APP",
        subtitle: "FEELPROD • ENSEÑANZAS MARC DAMOISEAUX",
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
        subtitle: "FEELPROD • INSEGNAMENTO MARC DAMOISEAUX",
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
        appName: "発生学アプリ (EMBRYOLOGY)",
        subtitle: "FEELPROD • マルク・ダモワゾー講義録",
        categoryLabels: {
            ectoderme: "外胚葉 (ECTODERM)",
            mesoderme: "中胚葉 (MESODERM)",
            endoderme: "内胚葉 (ENDODERM)",
            oeil: "眼 (EYE)"
        },
        courseSummary: "講義要約 (SUMMARY)",
        pedagogicalSheet: "教育・臨床シート (SHEET)",
        duration: "所要時間",
        fig: "図 (FIG.)",
        footerBrand: "バイオダイナミクス発生学 • FeelProd",
        masterTitles: {
            ectoderme: "外胚葉-完全講義録.pdf",
            mesoderme: "中胚葉-完全講義録.pdf",
            endoderme: "内胚葉-完全講義録.pdf",
            oeil: "眼-完全講義録.pdf"
        }
    },
    zh: {
        courses: videoCoursesZh,
        appName: "胚胎学应用 (EMBRYOLOGY)",
        subtitle: "FEELPROD • 马克·达莫瓦索教学体系",
        categoryLabels: {
            ectoderme: "外胚层 (ECTODERM)",
            mesoderme: "中胚层 (MESODERM)",
            endoderme: "内胚层 (ENDODERM)",
            oeil: "眼睛 (EYE)"
        },
        courseSummary: "课程概述 (SUMMARY)",
        pedagogicalSheet: "教学与临床手册",
        duration: "时长",
        fig: "图 (FIG.)",
        footerBrand: "生物动力学胚胎学 • FeelProd",
        masterTitles: {
            ectoderme: "外胚层-研讨会完整汇编.pdf",
            mesoderme: "中胚层-研讨会完整汇编.pdf",
            endoderme: "内胚层-研讨会完整汇编.pdf",
            oeil: "眼睛-研讨会完整汇编.pdf"
        }
    }
};

const CATEGORY_COLORS: Record<string, string> = {
    ectoderme: "#5A9C51",
    mesoderme: "#F27D33",
    endoderme: "#4171B5",
    oeil: "#F2B729"
};

function getLocalImageDataUri(src: string): string {
    if (!src) return '';
    try {
        let cleanPath = src.split('?')[0];
        let localRel = '';
        if (cleanPath.startsWith('http')) {
            const url = new URL(cleanPath);
            localRel = url.pathname.replace(/^\/+/, '');
            if (localRel.startsWith('storage/v1/object/public/schemas/')) {
                localRel = localRel.replace('storage/v1/object/public/schemas/', 'public/');
            }
        } else {
            localRel = cleanPath.replace(/^\/+/, '');
        }

        const absPath = path.resolve(appDir, localRel);
        if (fs.existsSync(absPath)) {
            const ext = path.extname(absPath).toLowerCase();
            const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
            const b64 = fs.readFileSync(absPath).toString('base64');
            return `data:${mime};base64,${b64}`;
        }
    } catch {
        // ignore
    }
    return src;
}

function renderHtmlForCourse(course: VideoCourse, lang: SupportedLang): string {
    const config = LANG_CONFIGS[lang];
    const catColor = CATEGORY_COLORS[course.categoryId] || "#5A9C51";
    const catLabel = config.categoryLabels[course.categoryId] || course.categoryId.toUpperCase();

    const rawSummary = course.fullSummary || course.shortSummary || '';
    const paragraphs = rawSummary.split(/\n\n+/).filter(p => p.trim().length > 0);
    const summaryHtml = paragraphs.map(p => `<p class="summary-p">${p.replace(/\n/g, '<br/>')}</p>`).join('');

    const schemasHtml = (course.schemas || []).map((schema, idx) => {
        const dataUri = getLocalImageDataUri(schema.url);
        const title = schema.title || `${config.fig} ${idx + 1}`;
        const desc = schema.description ? `<p class="fig-desc">${schema.description}</p>` : '';
        return `
            <div class="schema-card">
                <div class="schema-img-container">
                    <img src="${dataUri}" class="schema-img" alt="${title}" />
                </div>
                <div class="schema-caption">
                    <span class="fig-badge" style="background:${catColor};">${config.fig} ${idx + 1}</span>
                    <span class="fig-title">${title}</span>
                    ${desc}
                </div>
            </div>
        `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <title>${course.title}</title>
    <style>
        @page { size: A4 portrait; margin: 0; }
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background: #FAF7F2; color: #2C2825; width: 210mm; min-height: 297mm; }
        .page-container { padding: 18mm 18mm 16mm 18mm; width: 210mm; min-height: 297mm; display: flex; flex-direction: column; justify-content: space-between; page-break-after: always; position: relative; }
        .header-box { border-bottom: 2.5px solid ${catColor}; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
        .brand-title { font-size: 9px; font-weight: 800; letter-spacing: 2px; color: #7A7267; text-transform: uppercase; margin-bottom: 4px; }
        .cat-badge { display: inline-block; padding: 3px 9px; border-radius: 6px; font-size: 9.5px; font-weight: 800; letter-spacing: 1px; color: #FFFFFF; background: ${catColor}; text-transform: uppercase; margin-bottom: 6px; }
        .course-h1 { font-size: 20px; font-weight: 800; color: #1E1B18; margin: 0; line-height: 1.25; }
        .meta-box { text-align: right; }
        .duration-pill { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; background: #EFEBE4; color: #5C5549; margin-bottom: 4px; }
        .section-title { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: ${catColor}; margin-top: 14px; margin-bottom: 8px; border-left: 3px solid ${catColor}; padding-left: 8px; }
        .summary-card { background: #FFFFFF; border: 1px solid #EAE4D9; border-radius: 12px; padding: 14px 16px; margin-bottom: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); }
        .summary-p { font-size: 11px; line-height: 1.65; color: #423D36; margin: 0 0 10px 0; text-align: justify; }
        .summary-p:last-child { margin-bottom: 0; }
        .schemas-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 14px; }
        .schema-card { background: #FFFFFF; border: 1px solid #EAE4D9; border-radius: 12px; overflow: hidden; page-break-inside: avoid; display: flex; flex-direction: column; }
        .schema-img-container { width: 100%; height: 165px; background: #F4EFEA; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 6px; }
        .schema-img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .schema-caption { padding: 8px 10px 10px 10px; }
        .fig-badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 8px; font-weight: 800; color: #FFFFFF; margin-right: 6px; }
        .fig-title { font-size: 10px; font-weight: 700; color: #1E1B18; }
        .fig-desc { font-size: 9px; line-height: 1.4; color: #6E665A; margin: 4px 0 0 0; }
        .footer-box { border-top: 1px solid #EAE4D9; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 8.5px; color: #8C8477; margin-top: auto; }
        .footer-brand { font-weight: 700; color: #5C5549; }
    </style>
</head>
<body>
    <div class="page-container">
        <div>
            <div class="header-box">
                <div>
                    <div class="brand-title">${config.subtitle}</div>
                    <div class="cat-badge">${catLabel}</div>
                    <h1 class="course-h1">${course.title}</h1>
                </div>
                <div class="meta-box">
                    <div class="duration-pill">${config.duration} : ${course.duration || 'N/A'}</div>
                    <div style="font-size:8.5px; color:#8C8477; font-weight:700;">${config.pedagogicalSheet}</div>
                </div>
            </div>

            <div class="section-title">${config.courseSummary}</div>
            <div class="summary-card">
                ${summaryHtml}
            </div>

            ${course.schemas && course.schemas.length > 0 ? `
                <div class="section-title">PLANCHES ANATOMIQUES & SCHÉMAS (${course.schemas.length})</div>
                <div class="schemas-grid">
                    ${schemasHtml}
                </div>
            ` : ''}
        </div>

        <div class="footer-box">
            <span>${config.footerBrand}</span>
            <span>Marc Damoiseaux • Cours Cliniques & Biodynamique</span>
            <span>A4 Document • ${course.id.toUpperCase()}</span>
        </div>
    </div>
</body>
</html>`;
}

const TARGET_COURSES = ['ecto-05', 'ecto-06', 'ecto-15', 'ecto-17', 'meso-06', 'meso-41'];
const ALL_LANGS: SupportedLang[] = ['fr', 'en', 'de', 'es', 'it', 'ja', 'zh'];

async function regenerateBlechschmidtPdfs() {
    console.log("Starting targeted PDF regeneration for courses mentioning Erich Blechschmidt...");
    const browser = await chromium.launch({ headless: true });

    for (const lang of ALL_LANGS) {
        const config = LANG_CONFIGS[lang];
        console.log(`\nProcessing language: [${lang.toUpperCase()}]`);

        for (const courseId of TARGET_COURSES) {
            const course = config.courses.find(c => c.id === courseId);
            if (!course) continue;

            const html = renderHtmlForCourse(course, lang);
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'load' });

            const baseDir = lang === 'fr' 
                ? path.resolve(appDir, 'public/pdfs', course.categoryId)
                : path.resolve(appDir, 'public/pdfs', lang, course.categoryId);

            if (!fs.existsSync(baseDir)) {
                fs.mkdirSync(baseDir, { recursive: true });
            }

            // Find existing PDF path for this course or construct clean title
            let safeTitle = course.title.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
            if (safeTitle.length > 55) safeTitle = safeTitle.substring(0, 52) + '...';
            const outPath = path.join(baseDir, `${safeTitle}.pdf`);

            // Also check existing files in directory matching prefix
            const files = fs.readdirSync(baseDir);
            const prefix = course.id.split('-')[1];
            const existingFile = files.find(f => f.startsWith(`${prefix} - `) || f.startsWith(`${parseInt(prefix, 10)} - `));

            const finalPath = existingFile ? path.join(baseDir, existingFile) : outPath;

            await page.pdf({
                path: finalPath,
                format: 'A4',
                printBackground: true,
                margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
            });

            console.log(`  ✓ Updated PDF: ${path.relative(appDir, finalPath)}`);
            await page.close();
        }
    }

    await browser.close();
    console.log("\nAll targeted course PDFs successfully regenerated with Erich Blechschmidt!");
}

regenerateBlechschmidtPdfs().catch(err => {
    console.error("Error regenerating PDFs:", err);
    process.exit(1);
});
