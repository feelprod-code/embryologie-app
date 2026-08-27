import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '..', 'src', 'data');

interface GlobalPdfDef {
    id: string;
    categoryId: "ectoderme" | "mesoderme" | "endoderme" | "oeil";
    pages: number;
    titles: Record<string, string>;
    shortSummaries: Record<string, string>;
    fullSummaries: Record<string, string>;
    transcripts: Record<string, string>;
}

const GLOBAL_PDFS: GlobalPdfDef[] = [
    {
        id: "ecto-53",
        categoryId: "ectoderme",
        pages: 203,
        titles: {
            en: "53. Complete Handbook — Global PDF Collection (01 to 52)",
            de: "53. Gesamthandbuch — Globale PDF-Sammlung (01 bis 52)",
            es: "53. Manual Integral — Recopilación PDF Global (01 a 52)",
            it: "53. Manuale Integrale — Raccolta PDF Globale (01 a 52)",
            ja: "53. 完全講義録 — グローバルPDF全集 (01〜52)",
            zh: "53. 完整讲义 — 全局PDF汇编 (01 至 52)"
        },
        shortSummaries: {
            en: "Complete manual and integral collection of the Ectoderm seminar (203 pages). Includes all 51 lesson sheets, transcripts, and high-definition anatomical plates.",
            de: "Vollständiges Handbuch und Gesamtsammlung des Seminars Das Ektoderm (203 Seiten). Enthält alle 51 Lehrblätter, Transkripte und hochauflösenden anatomischen Tafeln.",
            es: "Manual completo y recopilación integral del seminario El Ectodermo (203 páginas). Incluye las 51 fichas de curso, transcripciones y láminas anatómicas de alta definición.",
            it: "Manuale completo e raccolta integrale del seminario L'Ectoderma (203 pagine). Include tutte le 51 schede di corso, trascrizioni e tavole anatomiche ad alta definizione.",
            ja: "外胚葉セミナーの完全マニュアルおよび全集（全203ページ）。全51回の講義シート、文字起こし、高解像度解剖図を収録。",
            zh: "外胚层研讨会完整手册与全集（共203页）。包含全部51份讲义、逐字转录及高清解剖图谱。"
        },
        fullSummaries: {
            en: "This document brings together the entire seminar on The Ectoderm (lessons 1 to 52). It includes all study sheets, full transcripts, clinical summaries, and anatomical diagrams in chronological order. Ideal for continuous reading, A4 printing, or offline review.",
            de: "Dieses Dokument vereint das gesamte Seminar über Das Ektoderm (Lektionen 1 bis 52). Es enthält alle Lehrblätter, vollständigen Transkripte, klinischen Zusammenfassungen und anatomischen Tafeln in chronologischer Reihenfolge. Ideal für kontinuierliches Lesen, A4-Druck oder Offline-Wiederholung.",
            es: "Este documento reúne la totalidad del seminario sobre El Ectodermo (lecciones 1 a 52). Contiene todas las fichas pedagógicas, transcripciones completas, resúmenes clínicos y diagramas anatómicos en orden cronológico. Ideal para una lectura continua, impresión A4 o revisión fuera de línea.",
            it: "Questo documento raccoglie l'intero seminario su L'Ectoderma (lezioni da 1 a 52). Comprende tutte le schede didattiche, trascrizioni integrali, sintesi cliniche e diagrammi anatomici in ordine cronologico. Ideale per la lettura continua, la stampa A4 o la consultazione offline.",
            ja: "外胚葉に関するセミナー全編（第1回〜第52回）を網羅した講義録です。学習シート、完全文字起こし、臨床サマリー、解剖図を時系列順に収録。通読、A4印刷、オフライン学習に最適です。",
            zh: "本文档汇集了外胚层研讨会的完整内容（第1讲至第52讲）。按时间顺序包含所有教学单、完整转录、临床总结和解剖图。非常适合连续阅读、A4打印或离线复习。"
        },
        transcripts: {
            en: "# The Ectoderm — Complete Seminar Handbook (Global Collection)\\n\\nFind below the complete study material for **The Ectoderm** seminar compiling all 51 lessons of the training (203 pages in total).\\n\\nYou can browse this complete collection directly or export/download it as a high-definition A4 PDF.",
            de: "# Das Ektoderm — Vollständiges Seminarhandbuch (Globale Sammlung)\\n\\nHier finden Sie die vollständigen Unterlagen für das Seminar **Das Ektoderm** mit allen 51 Lektionen der Ausbildung (insgesamt 203 Seiten).\\n\\nSie können diese vollständige Sammlung direkt durchblättern oder als hochauflösendes A4-PDF exportieren/herunterladen.",
            es: "# El Ectodermo — Manual Integral del Seminario (Recopilación Global)\\n\\nA continuación encontrará el material completo del seminario **El Ectodermo** que compila las 51 lecciones de la formación (203 páginas en total).\\n\\nPuede consultar esta recopilación directamente o exportarla/descargarla en PDF A4 de alta définition.",
            it: "# L'Ectoderma — Manuale Integrale del Seminario (Raccolta Globale)\\n\\nDi seguito trovate il supporto completo del seminario **L'Ectoderma** che compila le 51 lezioni del corso (203 pagine in totale).\\n\\nÈ possibile sfogliare questa raccolta completa direttamente o esportarla/scaricarla in formato PDF A4 ad alta definizione.",
            ja: "# 外胚葉 — セミナー完全講義録（グローバル全集）\\n\\n全51レッスンの教材をまとめた**外胚葉**セミナーの完全講義録です（全203ページ）。\\n\\n直接閲覧するか、高解像度A4 PDFとしてエクスポート・ダウンロードできます。",
            zh: "# 外胚层 — 研讨会完整手册（全局汇编）\\n\\n以下是**外胚层**研讨会的完整学习资料，汇编了培训的51节课程（共203页）。\\n\\n您可以直接浏览或导出下载高清A4 PDF格式文件。"
        }
    },
    {
        id: "meso-46",
        categoryId: "mesoderme",
        pages: 143,
        titles: {
            en: "46. Complete Handbook — Global PDF Collection (01 to 45)",
            de: "46. Gesamthandbuch — Globale PDF-Sammlung (01 bis 45)",
            es: "46. Manual Integral — Recopilación PDF Global (01 a 45)",
            it: "46. Manuale Integrale — Raccolta PDF Globale (01 a 45)",
            ja: "46. 完全講義録 — グローバルPDF全集 (01〜45)",
            zh: "46. 完整讲义 — 全局PDF汇编 (01 至 45)"
        },
        shortSummaries: {
            en: "Complete manual and integral collection of the Mesoderm seminar (143 pages). Includes all 45 lesson sheets, transcripts, and clinical diagrams.",
            de: "Vollständiges Handbuch und Gesamtsammlung des Seminars Das Mesoderm (143 Seiten). Enthält alle 45 Lehrblätter, Transkripte und klinischen Tafeln.",
            es: "Manual completo y recopilación integral del seminario El Mesodermo (143 páginas). Incluye las 45 fichas de curso, transcripciones y láminas clínicas.",
            it: "Manuale completo e raccolta integrale del seminario Il Mesoderma (143 pagine). Include tutte le 45 schede di corso, trascrizioni e tavole cliniche.",
            ja: "中胚葉セミナーの完全マニュアルおよび全集（全143ページ）。全45回の講義シート、文字起こし、臨床解剖図を収録。",
            zh: "中胚层研讨会完整手册与全集（共143页）。包含全部45份讲义、逐字转录及临床图谱。"
        },
        fullSummaries: {
            en: "This document brings together the entire seminar on The Mesoderm (lessons 1 to 47). It includes all study sheets, full transcripts, clinical summaries, and anatomical diagrams in chronological order. Ideal for continuous reading, A4 printing, or offline review.",
            de: "Dieses Dokument vereint das gesamte Seminar über Das Mesoderm (Lektionen 1 bis 47). Es enthält alle Lehrblätter, vollständigen Transkripte, klinischen Zusammenfassungen und anatomischen Tafeln in chronologischer Reihenfolge.",
            es: "Este documento reúne la totalidad del seminario sobre El Mesodermo (lecciones 1 a 47). Contiene todas las fichas pedagógicas, transcripciones completas, resúmenes clínicos y diagramas anatómicos en orden cronológico.",
            it: "Questo documento raccoglie l'intero seminario su Il Mesoderma (lezioni da 1 a 47). Comprende tutte le schede didattiche, trascrizioni integrali, sintesi cliniche e diagrammi anatomici in ordine cronologico.",
            ja: "中胚葉に関するセミナー全編（第1回〜第47回）を網羅した講義録です。学習シート、完全文字起こし、臨床サマリー、解剖図を時系列順に収録。",
            zh: "本文档汇集了中胚层研讨会的完整内容（第1讲至第47讲）。按时间顺序包含所有教学单、完整转录、临床总结和解剖图。"
        },
        transcripts: {
            en: "# The Mesoderm — Complete Seminar Handbook (Global Collection)\\n\\nFind below the complete study material for **The Mesoderm** seminar compiling all 45 lessons of the training (143 pages in total).\\n\\nYou can browse this complete collection directly or export/download it as a high-definition A4 PDF.",
            de: "# Das Mesoderm — Vollständiges Seminarhandbuch (Globale Sammlung)\\n\\nHier finden Sie die vollständigen Unterlagen für das Seminar **Das Mesoderm** mit allen 45 Lektionen der Ausbildung (insgesamt 143 Seiten).\\n\\nSie können diese vollständige Sammlung direkt durchblättern oder als hochauflösendes A4-PDF exportieren/herunterladen.",
            es: "# El Mesodermo — Manual Integral del Seminario (Recopilación Global)\\n\\nA continuación encontrará el material completo del seminario **El Mesodermo** que compila las 45 lecciones de la formación (143 páginas en total).\\n\\nPuede consultar esta recopilación directamente o exportarla/descargarla en PDF A4 de alta definición.",
            it: "# Il Mesoderma — Manuale Integrale del Seminario (Raccolta Globale)\\n\\nDi seguito trovate il supporto completo del seminario **Il Mesoderma** che compila le 45 lezioni del corso (143 pagine in totale).\\n\\nÈ possibile sfogliare questa raccolta completa direttamente o esportarla/scaricarla in formato PDF A4 ad alta definizione.",
            ja: "# 中胚葉 — セミナー完全講義録（グローバル全集）\\n\\n全45レッスンの教材をまとめた**中胚葉**セミナーの完全講義録です（全143ページ）。\\n\\n直接閲覧するか、高解像度A4 PDFとしてエクスポート・ダウンロードできます。",
            zh: "# 中胚层 — 研讨会完整手册（全局汇编）\\n\\n以下是**中胚层**研讨会的完整学习资料，汇编了培训的45节课程（共143页）。\\n\\n您可以直接浏览或导出下载高清A4 PDF格式文件。"
        }
    },
    {
        id: "endo-42",
        categoryId: "endoderme",
        pages: 162,
        titles: {
            en: "42. Complete Handbook — Global PDF Collection (01 to 41)",
            de: "42. Gesamthandbuch — Globale PDF-Sammlung (01 bis 41)",
            es: "42. Manual Integral — Recopilación PDF Global (01 a 41)",
            it: "42. Manuale Integrale — Raccolta PDF Globale (01 a 41)",
            ja: "42. 完全講義録 — グローバルPDF全集 (01〜41)",
            zh: "42. 完整讲义 — 全局PDF汇编 (01 至 41)"
        },
        shortSummaries: {
            en: "Complete manual and integral collection of the Endoderm seminar (162 pages). Includes all 40 lesson sheets, transcripts, and clinical diagrams.",
            de: "Vollständiges Handbuch und Gesamtsammlung des Seminars Das Endoderm (162 Seiten). Enthält alle 40 Lehrblätter, Transkripte und klinischen Tafeln.",
            es: "Manual completo y recopilación integral del seminario El Endodermo (162 páginas). Incluye las 40 fichas de curso, transcripciones y láminas clínicas.",
            it: "Manuale completo e raccolta integrale del seminario L'Endoderma (162 pagine). Include tutte le 40 schede di corso, trascrizioni e tavole cliniche.",
            ja: "内胚葉セミナーの完全マニュアルおよび全集（全162ページ）。全40回の講義シート、文字起こし、臨床解剖図を収録。",
            zh: "内胚层研讨会完整手册与全集（共162页）。包含全部40份讲义、逐字转录及临床图谱。"
        },
        fullSummaries: {
            en: "This document brings together the entire seminar on The Endoderm (lessons 1 to 41). It includes all study sheets, full transcripts, clinical summaries, and anatomical diagrams in chronological order.",
            de: "Dieses Dokument vereint das gesamte Seminar über Das Endoderm (Lektionen 1 bis 41). Es enthält alle Lehrblätter, vollständigen Transkripte, klinischen Zusammenfassungen und anatomischen Tafeln in chronologischer Reihenfolge.",
            es: "Este documento reúne la totalidad del seminario sobre El Endodermo (lecciones 1 a 41). Contiene todas las fichas pedagógicas, transcripciones completas, resúmenes clínicos y diagramas anatómicos en orden cronológico.",
            it: "Questo documento raccoglie l'intero seminario su L'Endoderma (lezioni da 1 a 41). Comprende tutte le schede didattiche, trascrizioni integrali, sintesi cliniche e diagrammi anatomici in ordine cronologico.",
            ja: "内胚葉に関するセミナー全編（第1回〜第41回）を網羅した講義録です。学習シート、完全文字起こし、臨床サマリー、解剖図を時系列順に収録。",
            zh: "本文档汇集了内胚层研讨会的完整内容（第1讲至第41讲）。按时间顺序包含所有教学单、完整转录、临床总结和解剖图。"
        },
        transcripts: {
            en: "# The Endoderm — Complete Seminar Handbook (Global Collection)\\n\\nFind below the complete study material for **The Endoderm** seminar compiling all 40 lessons of the training (162 pages in total).\\n\\nYou can browse this complete collection directly or export/download it as a high-definition A4 PDF.",
            de: "# Das Endoderm — Vollständiges Seminarhandbuch (Globale Sammlung)\\n\\nHier finden Sie die vollständigen Unterlagen für das Seminar **Das Endoderm** mit allen 40 Lektionen der Ausbildung (insgesamt 162 Seiten).\\n\\nSie können diese vollständige Sammlung direkt durchblättern oder als hochauflösendes A4-PDF exportieren/herunterladen.",
            es: "# El Endodermo — Manual Integral del Seminario (Recopilación Global)\\n\\nA continuación encontrará el material completo del seminario **El Endodermo** que compila las 40 lecciones de la formación (162 páginas en total).\\n\\nPuede consultar esta recopilación directamente o exportarla/descargarla en PDF A4 de alta definición.",
            it: "# L'Endoderma — Manuale Integrale del Seminario (Raccolta Globale)\\n\\nDi seguito trovate il supporto completo del seminario **L'Endoderma** che compila le 40 lezioni del corso (162 pagine in totale).\\n\\nÈ possibile sfogliare questa raccolta completa direttamente o esportarla/scaricarla in formato PDF A4 ad alta definizione.",
            ja: "# 内胚葉 — セミナー完全講義録（グローバル全集）\\n\\n全40レッスンの教材をまとめた**内胚葉**セミナーの完全講義録です（全162ページ）。\\n\\n直接閲覧するか、高解像度A4 PDFとしてエクスポート・ダウンロードできます。",
            zh: "# 内胚层 — 研讨会完整手册（全局汇编）\\n\\n以下是**内胚层**研讨会的完整学习资料，汇编了培训的40节课程（共162页）。\\n\\n您可以直接浏览或导出下载高清A4 PDF格式文件。"
        }
    },
    {
        id: "oeil-33",
        categoryId: "oeil",
        pages: 103,
        titles: {
            en: "33. Complete Handbook — Global PDF Collection (01 to 32)",
            de: "33. Gesamthandbuch — Globale PDF-Sammlung (01 bis 32)",
            es: "33. Manual Integral — Recopilación PDF Global (01 a 32)",
            it: "33. Manuale Integrale — Raccolta PDF Globale (01 a 32)",
            ja: "33. 完全講義録 — グローバルPDF全集 (01〜32)",
            zh: "33. 完整讲义 — 全局PDF汇编 (01 至 32)"
        },
        shortSummaries: {
            en: "Complete manual and integral collection of The Eye seminar (103 pages). Includes all 32 lesson sheets, transcripts, and clinical diagrams.",
            de: "Vollständiges Handbuch und Gesamtsammlung des Seminars Das Auge (103 Seiten). Enthält alle 32 Lehrblätter, Transkripte und klinischen Tafeln.",
            es: "Manual completo y recopilación integral del seminario El Ojo (103 páginas). Incluye las 32 fichas de curso, transcripciones y láminas clínicas.",
            it: "Manuale completo e raccolta integrale del seminario L'Occhio (103 pagine). Include tutte le 32 schede di corso, trascrizioni e tavole cliniche.",
            ja: "眼セミナーの完全マニュアルおよび全集（全103ページ）。全32回の講義シート、文字起こし、臨床解剖図を収録。",
            zh: "眼研讨会完整手册与全集（共103页）。包含全部32份讲义、逐字转录及临床图谱。"
        },
        fullSummaries: {
            en: "This document brings together the entire seminar on The Eye (lessons 1 to 32). It includes all study sheets, full transcripts, clinical summaries, and anatomical diagrams in chronological order.",
            de: "Dieses Dokument vereint das gesamte Seminar über Das Auge (Lektionen 1 bis 32). Es enthält alle Lehrblätter, vollständigen Transkripte, klinischen Zusammenfassungen und anatomischen Tafeln in chronologischer Reihenfolge.",
            es: "Este documento reúne la totalidad del seminario sobre El Ojo (lecciones 1 a 32). Contiene todas las fichas pedagógicas, transcripciones completas, resúmenes clínicos y diagramas anatómicos en orden cronológico.",
            it: "Questo documento raccoglie l'intero seminario su L'Occhio (lezioni da 1 a 32). Comprende tutte le schede didattiche, trascrizioni integrali, sintesi cliniche e diagrammi anatomici in ordine cronologico.",
            ja: "眼に関するセミナー全編（第1回〜第32回）を網羅した講義録です。学習シート、完全文字起こし、臨床サマリー、解剖図を時系列順に収録。",
            zh: "本文档汇集了眼研讨会的完整内容（第1讲至第32讲）。按时间顺序包含所有教学单、完整转录、临床总结和解剖图。"
        },
        transcripts: {
            en: "# The Eye — Complete Seminar Handbook (Global Collection)\\n\\nFind below the complete study material for **The Eye** seminar compiling all 32 lessons of the training (103 pages in total).\\n\\nYou can browse this complete collection directly or export/download it as a high-definition A4 PDF.",
            de: "# Das Auge — Vollständiges Seminarhandbuch (Globale Sammlung)\\n\\nHier finden Sie die vollständigen Unterlagen für das Seminar **Das Auge** mit allen 32 Lektionen der Ausbildung (insgesamt 103 Seiten).\\n\\nSie können diese vollständige Sammlung direkt durchblättern oder als hochauflösendes A4-PDF exportieren/herunterladen.",
            es: "# El Ojo — Manual Integral del Seminario (Recopilación Global)\\n\\nA continuación encontrará el material completo del seminario **El Ojo** que compila las 32 lecciones de la formación (103 páginas en total).\\n\\nPuede consultar esta recopilación directamente o exportarla/descargarla en PDF A4 de alta definición.",
            it: "# L'Occhio — Manuale Integrale del Seminario (Raccolta Globale)\\n\\nDi seguito trovate il supporto completo del seminario **L'Occhio** che compila le 32 lezioni del corso (103 pagine in totale).\\n\\nÈ possibile sfogliare questa raccolta completa direttamente o esportarla/scaricarla in formato PDF A4 ad alta definizione.",
            ja: "# 眼 — セミナー完全講義録（グローバル全集）\\n\\n全32レッスンの教材をまとめた**眼**セミナーの完全講義録です（全103ページ）。\\n\\n直接閲覧するか、高解像度A4 PDFとしてエクスポート・ダウンロードできます。",
            zh: "# 眼睛 — 研讨会完整手册（全局汇编）\\n\\n以下是**眼睛**研讨会的完整学习资料，汇编了培训的32节课程（共103页）。\\n\\n您可以直接浏览或导出下载高清A4 PDF格式文件。"
        }
    }
];

const langs = ['en', 'de', 'es', 'it', 'ja', 'zh'];

for (const lang of langs) {
    const filePath = path.join(dataDir, `videoCourses_${lang}.ts`);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Remove any previously malformed global items
    content = content.replace(/\n\s*\{\s*"id":\s*"(ecto-53|meso-46|endo-42|oeil-33)"[\s\S]*?\n\s*\},?/g, '');

    // Ensure all trailing objects have commas correctly
    // Add the 4 items
    for (const gPdf of GLOBAL_PDFS) {
        const itemSnippet = `,\n    {\n        "id": "${gPdf.id}",\n        "categoryId": "${gPdf.categoryId}",\n        "youtubeId": "",\n        "duration": "${gPdf.pages} p.",\n        "title": ${JSON.stringify(gPdf.titles[lang])},\n        "shortSummary": ${JSON.stringify(gPdf.shortSummaries[lang])},\n        "fullSummary": ${JSON.stringify(gPdf.fullSummaries[lang])},\n        "transcriptMarkdown": ${JSON.stringify(gPdf.transcripts[lang])},\n        "isGlobalPdf": true,\n        "pdfTotalPages": ${gPdf.pages}\n    }`;

        if (gPdf.categoryId === 'ectoderme') {
            const mesoTarget = content.indexOf('"id": "meso-01"');
            if (mesoTarget !== -1) {
                const prevBracket = content.lastIndexOf('{', mesoTarget);
                content = content.slice(0, prevBracket) + itemSnippet.slice(1) + ',\n    ' + content.slice(prevBracket);
            }
        } else if (gPdf.categoryId === 'mesoderme') {
            const endoTarget = content.indexOf('"id": "endo-01"');
            if (endoTarget !== -1) {
                const prevBracket = content.lastIndexOf('{', endoTarget);
                content = content.slice(0, prevBracket) + itemSnippet.slice(1) + ',\n    ' + content.slice(prevBracket);
            }
        } else if (gPdf.categoryId === 'endoderme') {
            const oeilTarget = content.indexOf('"id": "oeil-1"');
            if (oeilTarget !== -1) {
                const prevBracket = content.lastIndexOf('{', oeilTarget);
                content = content.slice(0, prevBracket) + itemSnippet.slice(1) + ',\n    ' + content.slice(prevBracket);
            }
        } else if (gPdf.categoryId === 'oeil') {
            // Place at the very end of the array before ];
            const lastBracket = content.lastIndexOf('}');
            content = content.slice(0, lastBracket + 1) + itemSnippet + '\n];\n';
        }
    }

    // Clean up any double commas or syntax glitches
    content = content.replace(/,(\s*),/g, ',');
    content = content.replace(/,(\s*)\];/g, '$1];');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Perfectly formatted ${filePath}`);
}

console.log('All files sanitized and formatted.');
