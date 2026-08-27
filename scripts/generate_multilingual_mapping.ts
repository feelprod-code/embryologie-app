import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, '..');
const publicPdfsDir = path.join(appDir, 'public', 'pdfs');

import { videoCourses as videoCoursesFr } from '../src/data/videoCourses';
import { videoCourses as videoCoursesEn } from '../src/data/videoCourses_en';
import { videoCourses as videoCoursesDe } from '../src/data/videoCourses_de';
import { videoCourses as videoCoursesEs } from '../src/data/videoCourses_es';
import { videoCourses as videoCoursesIt } from '../src/data/videoCourses_it';
import { videoCourses as videoCoursesJa } from '../src/data/videoCourses_ja';
import { videoCourses as videoCoursesZh } from '../src/data/videoCourses_zh';

const LANG_MAP: Record<string, any[]> = {
    fr: videoCoursesFr,
    en: videoCoursesEn,
    de: videoCoursesDe,
    es: videoCoursesEs,
    it: videoCoursesIt,
    ja: videoCoursesJa,
    zh: videoCoursesZh
};

const MASTER_FILENAMES: Record<string, Record<string, string>> = {
    fr: {
        ectoderme: "L-Ectoderme-Recueil-Integral.pdf",
        mesoderme: "Le-Mesoderme-Recueil-Integral.pdf",
        endoderme: "L-Endoderme-Recueil-Integral.pdf",
        oeil: "L-Oeil-Recueil-Integral.pdf"
    },
    en: {
        ectoderme: "The-Ectoderm-Complete-Handbook.pdf",
        mesoderme: "The-Mesoderm-Complete-Handbook.pdf",
        endoderme: "The-Endoderm-Complete-Handbook.pdf",
        oeil: "The-Eye-Complete-Handbook.pdf"
    },
    de: {
        ectoderme: "Das-Ektoderm-Gesamthandbuch.pdf",
        mesoderme: "Das-Mesoderm-Gesamthandbuch.pdf",
        endoderme: "Das-Endoderm-Gesamthandbuch.pdf",
        oeil: "Das-Auge-Gesamthandbuch.pdf"
    },
    es: {
        ectoderme: "El-Ectodermo-Manual-Integral.pdf",
        mesoderme: "El-Mesodermo-Manual-Integral.pdf",
        endoderme: "El-Endodermo-Manual-Integral.pdf",
        oeil: "El-Ojo-Manual-Integral.pdf"
    },
    it: {
        ectoderme: "L-Ectoderma-Manuale-Integrale.pdf",
        mesoderme: "Il-Mesoderma-Manuale-Integrale.pdf",
        endoderme: "L-Endoderma-Manuale-Integrale.pdf",
        oeil: "L-Occhio-Manuale-Integrale.pdf"
    },
    ja: {
        ectoderme: "外胚葉-完全講義録.pdf",
        mesoderme: "中胚葉-完全講義録.pdf",
        endoderme: "内胚葉-完全講義録.pdf",
        oeil: "眼-完全講義録.pdf"
    },
    zh: {
        ectoderme: "外胚层-研讨会完整汇编.pdf",
        mesoderme: "中胚层-研讨会完整汇编.pdf",
        endoderme: "内胚层-研讨会完整汇编.pdf",
        oeil: "眼睛-研讨会完整汇编.pdf"
    }
};

const mapping: Record<string, Record<string, string>> = {
    fr: {},
    en: {},
    de: {},
    es: {},
    it: {},
    ja: {},
    zh: {}
};

for (const lang of Object.keys(LANG_MAP)) {
    const courses = LANG_MAP[lang];
    const langPdfBase = lang === 'fr' ? publicPdfsDir : path.join(publicPdfsDir, lang);
    const langUrlPrefix = lang === 'fr' ? '/pdfs' : `/pdfs/${lang}`;

    for (const course of courses) {
        if (course.isGlobalPdf) {
            const masterName = MASTER_FILENAMES[lang]?.[course.categoryId];
            if (masterName) {
                mapping[lang][course.id] = `${langUrlPrefix}/cours_complets/${masterName}`;
            }
            continue;
        }

        const catDir = path.join(langPdfBase, course.categoryId);
        if (!fs.existsSync(catDir)) continue;

        const files = fs.readdirSync(catDir).filter(f => f.endsWith('.pdf'));
        const numMatch = course.id.match(/\d+/) || course.title.match(/^\d+/);
        const numStr = numMatch ? String(numMatch[0]).padStart(2, '0') : '';

        // Find file starting with `${numStr} -`
        const matchedFile = files.find(f => f.startsWith(`${numStr} -`));
        if (matchedFile) {
            mapping[lang][course.id] = `${langUrlPrefix}/${course.categoryId}/${matchedFile}`;
        } else {
            // Fallback to first matching
            console.warn(`[${lang}] No exact match for ${course.id} (num: ${numStr}) in ${catDir}`);
        }
    }
    console.log(`[${lang}] Mapped ${Object.keys(mapping[lang]).length} PDF courses.`);
}

const outPath = path.join(appDir, 'src', 'data', 'pdfFileMappingMultilingual.json');
fs.writeFileSync(outPath, JSON.stringify(mapping, null, 2), 'utf8');
console.log(`✓ Saved multilingual mapping to ${outPath}`);
