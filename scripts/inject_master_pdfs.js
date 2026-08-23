import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, '..');
const dataDir = path.join(appDir, 'src', 'data');

const filesToUpdate = [
    { filename: 'videoCourses.ts', lang: 'fr' },
    { filename: 'videoCourses_en.ts', lang: 'en' },
    { filename: 'videoCourses_es.ts', lang: 'es' },
    { filename: 'videoCourses_it.ts', lang: 'it' },
    { filename: 'videoCourses_de.ts', lang: 'de' },
    { filename: 'videoCourses_zh.ts', lang: 'zh' },
    { filename: 'videoCourses_ja.ts', lang: 'ja' }
];

const masterChaptersByLang = {
    fr: {
        ectoderme: {
            id: "ecto-53",
            categoryId: "ectoderme",
            youtubeId: "",
            duration: "203 p.",
            title: "53. Support Intégral — Recueil PDF Global (01 à 52)",
            shortSummary: "Manuel complet et recueil intégral du séminaire L'Ectoderme (203 pages). Comprend l'ensemble des 51 fiches de cours, transcriptions et planches anatomiques haute définition.",
            fullSummary: "Ce document réunit l'intégralité du séminaire sur L'Ectoderme (de la leçon 1 à la leçon 52). Il reprend l'ensemble des fiches pédagogiques, les transcriptions intégrales, les synthèses cliniques et les planches anatomiques dans leur ordre chronologique de progression. Idéal pour une lecture continue, une impression A4 ou une révision globale hors-ligne.",
            transcriptMarkdown: "# L'Ectoderme — Manuel Intégral du Séminaire (Recueil Global)\n\nRetrouvez ci-dessous le support complet du séminaire **L'Ectoderme** compilant les 51 leçons de la formation (203 pages au total).\n\nVous pouvez feuilleter ce recueil complet directement ci-dessous ou le télécharger au format PDF A4 haute définition.\n\n[📥 Télécharger le Recueil Intégral PDF (203 pages)](/pdfs/cours_complets/L-Ectoderme-Recueil-Integral.pdf)",
            pdfUrl: "/pdfs/cours_complets/L-Ectoderme-Recueil-Integral.pdf",
            isGlobalPdf: true,
            pdfTotalPages: 203
        },
        mesoderme: {
            id: "meso-48",
            categoryId: "mesoderme",
            youtubeId: "",
            duration: "143 p.",
            title: "48. Support Intégral — Recueil PDF Global (01 à 47)",
            shortSummary: "Manuel complet et recueil intégral du séminaire Le Mésoderme (143 pages). Comprend l'ensemble des 45 fiches de cours, transcriptions et planches cliniques.",
            fullSummary: "Ce document réunit l'intégralité du séminaire sur Le Mésoderme (de la leçon 1 à la leçon 47). Il reprend l'ensemble des fiches pédagogiques, les transcriptions intégrales, les synthèses cliniques et les planches anatomiques dans leur ordre chronologique de progression. Idéal pour une lecture continue, une impression A4 ou une révision globale hors-ligne.",
            transcriptMarkdown: "# Le Mésoderme — Manuel Intégral du Séminaire (Recueil Global)\n\nRetrouvez ci-dessous le support complet du séminaire **Le Mésoderme** compilant les 45 leçons de la formation (143 pages au total).\n\nVous pouvez feuilleter ce recueil complet directement ci-dessous ou le télécharger au format PDF A4 haute définition.\n\n[📥 Télécharger le Recueil Intégral PDF (143 pages)](/pdfs/cours_complets/Le-Mesoderme-Recueil-Integral.pdf)",
            pdfUrl: "/pdfs/cours_complets/Le-Mesoderme-Recueil-Integral.pdf",
            isGlobalPdf: true,
            pdfTotalPages: 143
        },
        endoderme: {
            id: "endo-42",
            categoryId: "endoderme",
            youtubeId: "",
            duration: "162 p.",
            title: "42. Support Intégral — Recueil PDF Global (01 à 41)",
            shortSummary: "Manuel complet et recueil intégral du séminaire L'Endoderme (162 pages). Comprend l'ensemble des 40 fiches de cours, transcriptions et planches cliniques.",
            fullSummary: "Ce document réunit l'intégralité du séminaire sur L'Endoderme (de la leçon 1 à la leçon 41). Il reprend l'ensemble des fiches pédagogiques, les transcriptions intégrales, les synthèses cliniques et les planches anatomiques dans leur ordre chronologique de progression. Idéal pour une lecture continue, une impression A4 ou une révision globale hors-ligne.",
            transcriptMarkdown: "# L'Endoderme — Manuel Intégral du Séminaire (Recueil Global)\n\nRetrouvez ci-dessous le support complet du séminaire **L'Endoderme** compilant les 40 leçons de la formation (162 pages au total).\n\nVous pouvez feuilleter ce recueil complet directement ci-dessous ou le télécharger au format PDF A4 haute définition.\n\n[📥 Télécharger le Recueil Intégral PDF (162 pages)](/pdfs/cours_complets/L-Endoderme-Recueil-Integral.pdf)",
            pdfUrl: "/pdfs/cours_complets/L-Endoderme-Recueil-Integral.pdf",
            isGlobalPdf: true,
            pdfTotalPages: 162
        },
        oeil: {
            id: "oeil-33",
            categoryId: "oeil",
            youtubeId: "",
            duration: "103 p.",
            title: "33. Support Intégral — Recueil PDF Global (01 à 32)",
            shortSummary: "Manuel complet et recueil intégral du séminaire L'Œil (103 pages). Comprend l'ensemble des 32 fiches de cours, transcriptions et planches cliniques.",
            fullSummary: "Ce document réunit l'intégralité du séminaire sur L'Œil (de la leçon 1 à la leçon 32). Il reprend l'ensemble des fiches pédagogiques, les transcriptions intégrales, les synthèses cliniques et les planches anatomiques dans leur ordre chronologique de progression. Idéal pour une lecture continue, une impression A4 ou une révision globale hors-ligne.",
            transcriptMarkdown: "# L'Œil — Manuel Intégral du Séminaire (Recueil Global)\n\nRetrouvez ci-dessous le support complet du séminaire **L'Œil** compilant les 32 leçons de la formation (103 pages au total).\n\nVous pouvez feuilleter ce recueil complet directement ci-dessous ou le télécharger au format PDF A4 haute définition.\n\n[📥 Télécharger le Recueil Intégral PDF (103 pages)](/pdfs/cours_complets/L-Oeil-Recueil-Integral.pdf)",
            pdfUrl: "/pdfs/cours_complets/L-Oeil-Recueil-Integral.pdf",
            isGlobalPdf: true,
            pdfTotalPages: 103
        }
    },
    en: {
        ectoderme: {
            id: "ecto-53",
            categoryId: "ectoderme",
            youtubeId: "",
            duration: "203 p.",
            title: "53. Comprehensive Manual — Full Global PDF (01 to 52)",
            shortSummary: "Complete course manual and global PDF compilation for The Ectoderm seminar (203 pages). Includes all 51 course sheets, transcripts, and high-definition anatomical plates.",
            fullSummary: "This document compiles the entirety of The Ectoderm seminar (lessons 1 to 52). It brings together all pedagogical sheets, full transcripts, clinical syntheses, and anatomical diagrams in chronological sequence.",
            transcriptMarkdown: "# The Ectoderm — Full Seminar Manual (Global Compilation)\n\nAccess the complete course manual for **The Ectoderm** compiling all 51 lessons of the seminar (203 pages).\n\n[📥 Download Full Course PDF (203 pages)](/pdfs/cours_complets/L-Ectoderme-Recueil-Integral.pdf)",
            pdfUrl: "/pdfs/cours_complets/L-Ectoderme-Recueil-Integral.pdf",
            isGlobalPdf: true,
            pdfTotalPages: 203
        },
        mesoderme: {
            id: "meso-48",
            categoryId: "mesoderme",
            youtubeId: "",
            duration: "143 p.",
            title: "48. Comprehensive Manual — Full Global PDF (01 to 47)",
            shortSummary: "Complete course manual and global PDF compilation for The Mesoderm seminar (143 pages). Includes all 45 course sheets, transcripts, and clinical plates.",
            fullSummary: "This document compiles the entirety of The Mesoderm seminar (lessons 1 to 47). It brings together all pedagogical sheets, full transcripts, clinical syntheses, and anatomical diagrams in chronological sequence.",
            transcriptMarkdown: "# The Mesoderm — Full Seminar Manual (Global Compilation)\n\nAccess the complete course manual for **The Mesoderm** compiling all 45 lessons of the seminar (143 pages).\n\n[📥 Download Full Course PDF (143 pages)](/pdfs/cours_complets/Le-Mesoderme-Recueil-Integral.pdf)",
            pdfUrl: "/pdfs/cours_complets/Le-Mesoderme-Recueil-Integral.pdf",
            isGlobalPdf: true,
            pdfTotalPages: 143
        },
        endoderme: {
            id: "endo-42",
            categoryId: "endoderme",
            youtubeId: "",
            duration: "162 p.",
            title: "42. Comprehensive Manual — Full Global PDF (01 to 41)",
            shortSummary: "Complete course manual and global PDF compilation for The Endoderm seminar (162 pages). Includes all 40 course sheets, transcripts, and clinical plates.",
            fullSummary: "This document compiles the entirety of The Endoderm seminar (lessons 1 to 41). It brings together all pedagogical sheets, full transcripts, clinical syntheses, and anatomical diagrams in chronological sequence.",
            transcriptMarkdown: "# The Endoderm — Full Seminar Manual (Global Compilation)\n\nAccess the complete course manual for **The Endoderm** compiling all 40 lessons of the seminar (162 pages).\n\n[📥 Download Full Course PDF (162 pages)](/pdfs/cours_complets/L-Endoderme-Recueil-Integral.pdf)",
            pdfUrl: "/pdfs/cours_complets/L-Endoderme-Recueil-Integral.pdf",
            isGlobalPdf: true,
            pdfTotalPages: 162
        },
        oeil: {
            id: "oeil-33",
            categoryId: "oeil",
            youtubeId: "",
            duration: "103 p.",
            title: "33. Comprehensive Manual — Full Global PDF (01 to 32)",
            shortSummary: "Complete course manual and global PDF compilation for The Eye seminar (103 pages). Includes all 32 course sheets, transcripts, and clinical plates.",
            fullSummary: "This document compiles the entirety of The Eye seminar (lessons 1 to 32). It brings together all pedagogical sheets, full transcripts, clinical syntheses, and anatomical diagrams in chronological sequence.",
            transcriptMarkdown: "# The Eye — Full Seminar Manual (Global Compilation)\n\nAccess the complete course manual for **The Eye** compiling all 32 lessons of the seminar (103 pages).\n\n[📥 Download Full Course PDF (103 pages)](/pdfs/cours_complets/L-Oeil-Recueil-Integral.pdf)",
            pdfUrl: "/pdfs/cours_complets/L-Oeil-Recueil-Integral.pdf",
            isGlobalPdf: true,
            pdfTotalPages: 103
        }
    }
};

for (const target of filesToUpdate) {
    const filePath = path.join(dataDir, target.filename);
    if (!fs.existsSync(filePath)) continue;
    
    console.log(`Processing ${target.filename}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const chapters = masterChaptersByLang[target.lang] || masterChaptersByLang['en'];
    
    // Check if ecto-53 is already present
    if (!content.includes('"ecto-53"') && !content.includes("'ecto-53'")) {
        // Insert ecto-53 after ecto-52
        const ecto52Pattern = /(id:\s*["']ecto-52["'][\s\S]*?\},?)/;
        if (ecto52Pattern.test(content)) {
            const ecto53Str = `\n  ${JSON.stringify(chapters.ectoderme, null, 4).replace(/"([^"]+)":/g, '$1:')},`;
            content = content.replace(ecto52Pattern, `$1${ecto53Str}`);
        }
    }
    
    // Check if meso-48 is already present
    if (!content.includes('"meso-48"') && !content.includes("'meso-48'")) {
        const meso47Pattern = /(id:\s*["']meso-47["'][\s\S]*?\},?)/;
        if (meso47Pattern.test(content)) {
            const meso48Str = `\n  ${JSON.stringify(chapters.mesoderme, null, 4).replace(/"([^"]+)":/g, '$1:')},`;
            content = content.replace(meso47Pattern, `$1${meso48Str}`);
        }
    }
    
    // Check if endo-42 is already present
    if (!content.includes('"endo-42"') && !content.includes("'endo-42'")) {
        const endo41Pattern = /(id:\s*["']endo-41["'][\s\S]*?\},?)/;
        if (endo41Pattern.test(content)) {
            const endo42Str = `\n  ${JSON.stringify(chapters.endoderme, null, 4).replace(/"([^"]+)":/g, '$1:')},`;
            content = content.replace(endo41Pattern, `$1${endo42Str}`);
        }
    }
    
    // Check if oeil-33 is already present
    if (!content.includes('"oeil-33"') && !content.includes("'oeil-33'")) {
        const oeil32Pattern = /(id:\s*["']oeil-32["'][\s\S]*?\},?)/;
        if (oeil32Pattern.test(content)) {
            const oeil33Str = `\n  ${JSON.stringify(chapters.oeil, null, 4).replace(/"([^"]+)":/g, '$1:')},`;
            content = content.replace(oeil32Pattern, `$1${oeil33Str}`);
        }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${target.filename} successfully.`);
}

console.log("All video course files updated with terminal chapters!");
