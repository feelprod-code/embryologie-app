import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Share2, Download, Mail, Copy, Check, ChevronDown, FileText, Printer, ExternalLink, Sparkles, Lock, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { videoCourses as videoCoursesFr, type VideoCourse } from "../data/videoCourses";
import { videoCourses as videoCoursesEn } from "../data/videoCourses_en";
import { videoCourses as videoCoursesEs } from "../data/videoCourses_es";
import { videoCourses as videoCoursesIt } from "../data/videoCourses_it";
import { videoCourses as videoCoursesDe } from "../data/videoCourses_de";
import { videoCourses as videoCoursesZh } from "../data/videoCourses_zh";
import { videoCourses as videoCoursesJa } from "../data/videoCourses_ja";
import { exportCoursePdf, getNormalizedLang } from "../utils/exportCoursePdf";
import { getCoursePdfUrl } from "../utils/getPdfUrl";

interface PDFShareDropdownProps {
  pdfUrl: string;
  title?: string;
  courseTitle?: string;
  author?: string;
  variant?: "viewer-bar" | "toolbar" | "pill" | "icon" | "header";
  align?: "left" | "right";
  buttonClassName?: string;
  accentColor?: string;
  onViewInPlayer?: () => void;
  course?: VideoCourse;
  hasFullAccess?: boolean;
  onLockedClick?: () => void;
}

const DROPDOWN_TEXTS: Record<string, {
  shareBtn: string;
  docTitle: string;
  chapterSection: string;
  integralSection: string;
  openChapterTab: string;
  openChapterTabSub: string;
  openIntegralTab: string;
  openIntegralTabSub: string;
  exportChapter: string;
  exportChapterSub: string;
  exportIntegral: string;
  exportIntegralSub: string;
  downloadChapter: string;
  downloadChapterSub: string;
  downloadIntegral: string;
  downloadIntegralSub: string;
  nativeShare: string;
  nativeShareSub: string;
  download: string;
  downloadSub: string;
  openNewTab: string;
  openNewTabSub: string;
  email: string;
  emailSub: string;
  copy: string;
  copySub: string;
  copied: string;
  copiedSub: string;
  print: string;
  printSub: string;
  exportPdf: string;
  exportPdfSub: string;
}> = {
  fr: {
    shareBtn: "Partager",
    docTitle: "DOCUMENTS PDF",
    chapterSection: "Fiche du Chapitre",
    integralSection: "Recueil Intégral",
    openChapterTab: "Ouvrir la Fiche (Plein écran)",
    openChapterTabSub: "Dans un nouvel onglet",
    openIntegralTab: "Ouvrir le Recueil (Plein écran)",
    openIntegralTabSub: "Manuel complet du séminaire",
    exportChapter: "Générer la Fiche A4",
    exportChapterSub: "Export HD de la leçon",
    exportIntegral: "Générer le Recueil A4",
    exportIntegralSub: "Toutes les leçons du séminaire",
    downloadChapter: "Télécharger la Fiche (.pdf)",
    downloadChapterSub: "Fichier PDF de la leçon",
    downloadIntegral: "Télécharger le Recueil (.pdf)",
    downloadIntegralSub: "Manuel complet officiel",
    nativeShare: "Partager",
    nativeShareSub: "AirDrop, Messages, Réseaux",
    download: "Enregistrer sur l'appareil",
    downloadSub: "Télécharger le fichier A4 (.pdf)",
    openNewTab: "Plein écran / Onglet séparé",
    openNewTabSub: "Ouvrir dans le navigateur",
    email: "Envoyer par e-mail",
    emailSub: "Lien pré-rempli dans Mail",
    copy: "Copier le lien direct",
    copySub: "Copier l'adresse URL du document",
    copied: "Lien copié !",
    copiedSub: "Prêt à être collé",
    print: "Imprimer le document",
    printSub: "Format A4 standard",
    exportPdf: "Générer la Fiche A4",
    exportPdfSub: "Export HD personnalisé"
  },
  en: {
    shareBtn: "Share",
    docTitle: "PDF DOCUMENTS",
    chapterSection: "Chapter Sheet",
    integralSection: "Integral Book",
    openChapterTab: "Open Sheet (Full screen)",
    openChapterTabSub: "In a new tab",
    openIntegralTab: "Open Book (Full screen)",
    openIntegralTabSub: "Complete seminar manual",
    exportChapter: "Generate A4 Sheet",
    exportChapterSub: "HD lesson export",
    exportIntegral: "Generate Full Book A4",
    exportIntegralSub: "All seminar lessons",
    downloadChapter: "Download Sheet (.pdf)",
    downloadChapterSub: "Lesson PDF document",
    downloadIntegral: "Download Full Book (.pdf)",
    downloadIntegralSub: "Official complete manual",
    nativeShare: "Share",
    nativeShareSub: "AirDrop, Messages, Socials",
    download: "Save to device",
    downloadSub: "Download A4 file (.pdf)",
    openNewTab: "Full screen / New tab",
    openNewTabSub: "Open in browser",
    email: "Send by email",
    emailSub: "Pre-filled link in Mail",
    copy: "Copy direct link",
    copySub: "Copy document URL address",
    copied: "Link copied!",
    copiedSub: "Ready to paste",
    print: "Print document",
    printSub: "Standard A4 format",
    exportPdf: "Generate A4 Sheet",
    exportPdfSub: "High-definition export"
  },
  de: {
    shareBtn: "Teilen",
    docTitle: "PDF DOKUMENTE",
    chapterSection: "Kapitelblatt",
    integralSection: "Gesamtwerk",
    openChapterTab: "Blatt öffnen (Vollbild)",
    openChapterTabSub: "In neuem Tab",
    openIntegralTab: "Gesamtwerk öffnen (Vollbild)",
    openIntegralTabSub: "Vollständiges Seminarhandbuch",
    exportChapter: "A4-Blatt generieren",
    exportChapterSub: "HD-Export der Lektion",
    exportIntegral: "Gesamtwerk A4 generieren",
    exportIntegralSub: "Alle Lektionen des Seminars",
    downloadChapter: "Blatt herunterladen (.pdf)",
    downloadChapterSub: "PDF-Datei der Lektion",
    downloadIntegral: "Gesamtwerk herunterladen (.pdf)",
    downloadIntegralSub: "Offizielles Handbuch",
    nativeShare: "Teilen",
    nativeShareSub: "AirDrop, Nachrichten, Netzwerke",
    download: "Auf Gerät speichern",
    downloadSub: "A4-Datei herunterladen (.pdf)",
    openNewTab: "Vollbild / Neuer Tab",
    openNewTabSub: "Im Browser öffnen",
    email: "Per E-Mail senden",
    emailSub: "Vorausgefüllter Link in Mail",
    copy: "Direkten Link kopieren",
    copySub: "Dokument-URL kopieren",
    copied: "Link kopiert!",
    copiedSub: "Bereit zum Einfügen",
    print: "Dokument drucken",
    printSub: "Standard A4-Format",
    exportPdf: "A4-Blatt generieren",
    exportPdfSub: "HD-Export"
  },
  es: {
    shareBtn: "Compartir",
    docTitle: "DOCUMENTOS PDF",
    chapterSection: "Ficha del Capítulo",
    integralSection: "Manual Integral",
    openChapterTab: "Abrir Ficha (Pantalla completa)",
    openChapterTabSub: "En una nueva pestaña",
    openIntegralTab: "Abrir Manual (Pantalla completa)",
    openIntegralTabSub: "Manual completo del seminario",
    exportChapter: "Generar Ficha A4",
    exportChapterSub: "Exportación HD de la lección",
    exportIntegral: "Generar Manual A4",
    exportIntegralSub: "Todas las lecciones",
    downloadChapter: "Descargar Ficha (.pdf)",
    downloadChapterSub: "Archivo PDF de la lección",
    downloadIntegral: "Descargar Manual (.pdf)",
    downloadIntegralSub: "Manual completo oficial",
    nativeShare: "Compartir",
    nativeShareSub: "AirDrop, Mensajes, Redes",
    download: "Guardar en el dispositivo",
    downloadSub: "Descargar archivo A4 (.pdf)",
    openNewTab: "Pantalla completa / Nueva pestaña",
    openNewTabSub: "Abrir en el navegador",
    email: "Enviar por correo",
    emailSub: "Enlace preparado en Mail",
    copy: "Copiar enlace directo",
    copySub: "Copiar dirección URL",
    copied: "¡Enlace copiado!",
    copiedSub: "Listo para pegar",
    print: "Imprimir documento",
    printSub: "Formato A4 estándar",
    exportPdf: "Generar Ficha A4",
    exportPdfSub: "Exportación HD"
  },
  it: {
    shareBtn: "Condividi",
    docTitle: "DOCUMENTI PDF",
    chapterSection: "Scheda del Capitolo",
    integralSection: "Raccolta Integrale",
    openChapterTab: "Apri Scheda (Schermo intero)",
    openChapterTabSub: "In una nuova scheda",
    openIntegralTab: "Apri Raccolta (Schermo intero)",
    openIntegralTabSub: "Manuale completo del seminario",
    exportChapter: "Genera Scheda A4",
    exportChapterSub: "Esportazione HD della lezione",
    exportIntegral: "Genera Raccolta A4",
    exportIntegralSub: "Tutte le lezioni del seminario",
    downloadChapter: "Scarica Scheda (.pdf)",
    downloadChapterSub: "File PDF della lezione",
    downloadIntegral: "Scarica Raccolta (.pdf)",
    downloadIntegralSub: "Manuale completo ufficiale",
    nativeShare: "Condividi",
    nativeShareSub: "AirDrop, Messaggi, Social",
    download: "Salva sul dispositivo",
    downloadSub: "Scarica file A4 (.pdf)",
    openNewTab: "Schermo intero / Nuova scheda",
    openNewTabSub: "Apri nel browser",
    email: "Invia per e-mail",
    emailSub: "Link precompilato in Mail",
    copy: "Copia link direct",
    copySub: "Copia indirizzo URL",
    copied: "Link copiato!",
    copiedSub: "Pronto per essere incollato",
    print: "Stampa documento",
    printSub: "Formato A4 standard",
    exportPdf: "Genera Scheda A4",
    exportPdfSub: "Esportazione HD"
  },
  ja: {
    shareBtn: "共有",
    docTitle: "PDFドキュメント",
    chapterSection: "章のシート",
    integralSection: "完全版マニュアル",
    openChapterTab: "シートを開く (全画面)",
    openChapterTabSub: "新しいタブで開く",
    openIntegralTab: "完全版を開く (全画面)",
    openIntegralTabSub: "セミナー完全版テキスト",
    exportChapter: "A4シートを生成",
    exportChapterSub: "レッスンの高解像度エクスポート",
    exportIntegral: "完全版A4を生成",
    exportIntegralSub: "すべてのレッスンを収録",
    downloadChapter: "シートをダウンロード (.pdf)",
    downloadChapterSub: "レッスンPDFファイル",
    downloadIntegral: "完全版をダウンロード (.pdf)",
    downloadIntegralSub: "公式完全版マニュアル",
    nativeShare: "共有",
    nativeShareSub: "AirDrop、メッセージ、SNS",
    download: "端末に保存",
    downloadSub: "A4ファイルをダウンロード (.pdf)",
    openNewTab: "全画面 / 新規タブ",
    openNewTabSub: "ブラウザで開く",
    email: "メールで送信",
    emailSub: "メールでリンクを送信",
    copy: "直接リンクをコピー",
    copySub: "ドキュメントURLをコピー",
    copied: "コピーしました！",
    copiedSub: "貼り付け可能です",
    print: "印刷する",
    printSub: "標準A4フォーマット",
    exportPdf: "A4シートを生成",
    exportPdfSub: "高解像度エクスポート"
  },
  zh: {
    shareBtn: "分享",
    docTitle: "PDF 文档",
    chapterSection: "章节学习单",
    integralSection: "完整全书",
    openChapterTab: "打开学习单 (全屏)",
    openChapterTabSub: "在新标签页中打开",
    openIntegralTab: "打开全书 (全屏)",
    openIntegralTabSub: "研讨会完整教材",
    exportChapter: "生成 A4 学习单",
    exportChapterSub: "单课高清导出",
    exportIntegral: "生成全套 A4 教材",
    exportIntegralSub: "收录所有课时",
    downloadChapter: "下载学习单 (.pdf)",
    downloadChapterSub: "单课 PDF 文件",
    downloadIntegral: "下载完整全书 (.pdf)",
    downloadIntegralSub: "官方完整教材",
    nativeShare: "分享",
    nativeShareSub: "隔空投送、信息、社交应用",
    download: "保存到设备",
    downloadSub: "下载 A4 文件 (.pdf)",
    openNewTab: "全屏 / 新标签页",
    openNewTabSub: "在浏览器中打开",
    email: "通过邮件发送",
    emailSub: "在邮件中打开预填链接",
    copy: "复制直接链接",
    copySub: "复制文档网址",
    copied: "链接已复制！",
    copiedSub: "已准备好粘贴",
    print: "打印文档",
    printSub: "标准 A4 格式",
    exportPdf: "生成 A4 学习单",
    exportPdfSub: "高清导出"
  }
};

export default function PDFShareDropdown({
  pdfUrl,
  title = "Document PDF",
  courseTitle,
  author = "Marc Damoiseaux",
  variant = "viewer-bar",
  align = "right",
  buttonClassName = "",
  accentColor = "#5A9C51",
  onViewInPlayer,
  course,
  hasFullAccess = false,
  onLockedClick,
}: PDFShareDropdownProps) {
  const { t, i18n } = useTranslation();
  const langKey = getNormalizedLang(i18n.language);
  const labels = DROPDOWN_TEXTS[langKey] || DROPDOWN_TEXTS.fr;

  const isIntegral = Boolean(
    course?.isGlobalPdf ||
    (pdfUrl && (pdfUrl.includes('cours_complets') || pdfUrl.toLowerCase().includes('integral') || pdfUrl.toLowerCase().includes('recueil')))
  );
  const isLocked = isIntegral && !hasFullAccess;

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 320,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) {
      if (onLockedClick) {
        onLockedClick();
      }
      return;
    }
    setIsOpen(!isOpen);
  };

  // Compute fixed position on open, resize, or scroll
  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 1000;

    const menuWidth = Math.min(320, windowWidth - 24);
    const menuHeight = 380; // Estimated max height

    // Horizontal position
    let left = align === "right" ? rect.right - menuWidth : rect.left;
    if (left + menuWidth > windowWidth - 12) {
      left = windowWidth - menuWidth - 12;
    }
    if (left < 12) {
      left = 12;
    }

    // Vertical position (open upward if near bottom edge)
    let top = rect.bottom + 6;
    if (rect.bottom + menuHeight > windowHeight - 16 && rect.top > menuHeight) {
      top = rect.top - menuHeight - 6;
    }

    // Ensure it doesn't go above screen
    if (top < 12) top = 12;

    setPosition({ top, left, width: menuWidth });
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();

      const handleScrollOrResize = () => {
        updatePosition();
      };

      const handleClickOutside = (e: MouseEvent | TouchEvent) => {
        const target = e.target as Node;
        if (
          buttonRef.current &&
          !buttonRef.current.contains(target) &&
          menuRef.current &&
          !menuRef.current.contains(target)
        ) {
          setIsOpen(false);
        }
      };

      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);

      return () => {
        window.removeEventListener("scroll", handleScrollOrResize, true);
        window.removeEventListener("resize", handleScrollOrResize);
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }
  }, [isOpen]);

  const resolvedPdfUrl = course 
    ? getCoursePdfUrl(course, i18n.language) 
    : (pdfUrl ? (pdfUrl.startsWith('/pdfs/') ? getCoursePdfUrl(pdfUrl, i18n.language) : pdfUrl) : '');

  const currentLang = i18n.language;
  const videoCoursesAll = currentLang.startsWith('en') ? videoCoursesEn
    : currentLang.startsWith('es') ? videoCoursesEs
    : currentLang.startsWith('it') ? videoCoursesIt
    : currentLang.startsWith('de') ? videoCoursesDe
    : currentLang.startsWith('zh') ? videoCoursesZh
    : currentLang.startsWith('ja') ? videoCoursesJa
    : videoCoursesFr;

  const globalCourse = course ? videoCoursesAll.find(c => c.categoryId === course.categoryId && c.isGlobalPdf) : undefined;
  const globalPdfUrl = globalCourse ? getCoursePdfUrl(globalCourse, currentLang) : '';
  const isGlobalLocked = !hasFullAccess;

  // Resolve absolute URL
  const getFullUrl = () => {
    const targetUrl = resolvedPdfUrl || pdfUrl;
    if (!targetUrl) return "";
    if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
      return targetUrl;
    }
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      return targetUrl.startsWith("/") ? `${origin}${targetUrl}` : `${origin}/${targetUrl}`;
    }
    return targetUrl;
  };

  const getCleanFileName = () => {
    const targetUrl = resolvedPdfUrl || pdfUrl;
    if (!targetUrl) return `${title || "document"}.pdf`;
    const parts = targetUrl.split("/");
    let rawName = decodeURIComponent(parts[parts.length - 1] || "");
    if (!rawName.toLowerCase().endsWith(".pdf")) {
      rawName = `${title || "document"}.pdf`;
    }
    return rawName;
  };

  // 1. Partager natif (Web Share API)
  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) {
      setIsOpen(false);
      onLockedClick?.();
      return;
    }
    setIsOpen(false);
    const fullUrl = getFullUrl();
    const cleanTitle = title || "Document PDF";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        let fileToShare: File | null = null;
        try {
          const res = await fetch(fullUrl);
          if (res.ok) {
            const blob = await res.blob();
            fileToShare = new File([blob], getCleanFileName(), { type: "application/pdf" });
          }
        } catch {}

        if (fileToShare && navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
          await navigator.share({
            files: [fileToShare],
            title: cleanTitle,
            text: courseTitle ? `${cleanTitle} (${courseTitle})` : cleanTitle,
          });
          return;
        }

        await navigator.share({
          title: cleanTitle,
          text: courseTitle ? `${cleanTitle} (${courseTitle})` : cleanTitle,
          url: fullUrl,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSaveToDisk = async (customUrl?: string, customFilename?: string) => {
    const urlToUse = (typeof customUrl === 'string' && customUrl) ? customUrl : getFullUrl();
    const isTargetLocked = (urlToUse.includes('cours_complets') || urlToUse.toLowerCase().includes('integral')) && !hasFullAccess;
    if (isTargetLocked) {
      setIsOpen(false);
      onLockedClick?.();
      return;
    }
    setIsOpen(false);

    const fileName = customFilename || (urlToUse ? urlToUse.split("/").pop() : undefined) || getCleanFileName();

    if (urlToUse) {
      setIsDownloading(true);
      try {
        const res = await fetch(urlToUse);
        if (res.ok) {
          const blob = await res.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(blobUrl);
          setIsDownloading(false);
          return;
        }
      } catch {
        const a = document.createElement("a");
        a.href = urlToUse;
        a.download = fileName;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      setIsDownloading(false);
      return;
    }

    if (course) {
      exportCoursePdf(course, i18n.language, t);
    }
  };

  const handleSendEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) {
      setIsOpen(false);
      onLockedClick?.();
      return;
    }
    setIsOpen(false);
    const fullUrl = getFullUrl();
    const cleanTitle = title || "Document PDF";
    const subject = `[Embryologie App] Document PDF : ${cleanTitle}`;
    const bodyLines = [
      `Bonjour,`,
      ``,
      `Voici le document PDF d'étude : "${cleanTitle}"${courseTitle ? ` (${courseTitle})` : ""}${author ? ` par ${author}` : ""}.`,
      ``,
      `🔗 Lien direct de consultation :`,
      fullUrl,
      ``,
      `Bonne lecture,`,
      `Embryologie App • FeelProd`
    ];
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailtoUrl;
  };

  const handleCopyLink = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isLocked) {
      setIsOpen(false);
      onLockedClick?.();
      return;
    }
    const fullUrl = getFullUrl();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) {
      setIsOpen(false);
      onLockedClick?.();
      return;
    }
    setIsOpen(false);
    if (course) {
      exportCoursePdf(course, i18n.language, t);
      return;
    }
    const fullUrl = getFullUrl();
    const printWindow = window.open(fullUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  };

  return (
    <>
      {variant === "viewer-bar" && (
        <button
          ref={buttonRef}
          type="button"
          onClick={handleTriggerClick}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all border border-[#E2D8CC] shadow-xs active:scale-98 cursor-pointer ${buttonClassName}`}
          title={isLocked ? "Recueil Intégral réservé aux membres" : labels.shareBtn}
        >
          {isLocked ? (
            <Lock className="w-3.5 h-3.5 text-amber-600" strokeWidth={2.5} />
          ) : (
            <Share2 className="w-3.5 h-3.5" style={{ color: accentColor }} strokeWidth={2.5} />
          )}
          <span>{labels.shareBtn}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {variant === "header" && (
        <button
          ref={buttonRef}
          type="button"
          onClick={handleTriggerClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF6ED] text-slate-800 text-xs font-bold shadow-xs border border-[#E2D8CC] transition-all active:scale-98 cursor-pointer ${buttonClassName}`}
          title={isLocked ? "Recueil Intégral réservé aux membres" : "Support PDF"}
        >
          {isLocked ? (
            <Lock className="w-3.5 h-3.5 text-amber-600" strokeWidth={2.5} />
          ) : (
            <Share2 className="w-3.5 h-3.5" style={{ color: accentColor }} strokeWidth={2.5} />
          )}
          <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider">{course?.isGlobalPdf ? 'RECUEIL PDF' : 'PDF'}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {variant === "pill" && (
        <button
          ref={buttonRef}
          type="button"
          onClick={handleTriggerClick}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#FAF6ED] text-slate-700 hover:text-slate-900 font-sans font-bold text-[10px] sm:text-[11px] tracking-wider border border-[#E2D8CC] shadow-2xs transition-all active:scale-95 cursor-pointer ${buttonClassName}`}
          title={isLocked ? "Recueil Intégral réservé aux membres" : "Support PDF"}
        >
          {isLocked ? (
            <Lock className="w-3 h-3 text-amber-600" strokeWidth={2.5} />
          ) : (
            <Share2 className="w-3 h-3" style={{ color: accentColor }} strokeWidth={2.5} />
          )}
          <span>PDF</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {variant === "icon" && (
        <button
          ref={buttonRef}
          type="button"
          onClick={handleTriggerClick}
          className={`p-2 rounded-xl bg-white hover:bg-[#FAF6ED] text-slate-700 border border-[#E2D8CC] shadow-xs transition-colors flex-shrink-0 cursor-pointer ${buttonClassName}`}
          title={isLocked ? "Recueil Intégral réservé aux membres" : labels.shareBtn}
        >
          {isLocked ? (
            <Lock className="w-4 h-4 text-amber-600" strokeWidth={2.2} />
          ) : (
            <Share2 className="w-4 h-4" style={{ color: accentColor }} strokeWidth={2.2} />
          )}
        </button>
      )}

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
              zIndex: 999999,
              textShadow: "none",
            }}
            className="rounded-2xl bg-[#FFFFFF] border border-[#E2D8CC] shadow-[0_20px_50px_rgba(0,0,0,0.18)] overflow-hidden p-1.5 animate-in fade-in zoom-in-95 duration-150 text-left max-h-[85vh] overflow-y-auto"
          >
            <div className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#EFE8DE] mb-1.5 relative">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                    {labels.docTitle}
                  </span>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  A4
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 truncate mt-1" title={title}>
                {title}
              </div>
            </div>

            {/* Si nous sommes sur un cours individuel (leçon normale) */}
            {course && !course.isGlobalPdf ? (
              <>
                {/* SECTION 1 : LE CHAPITRE */}
                <div className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-slate-400 flex items-center justify-between">
                  <span>{labels.chapterSection}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">LEÇON</span>
                </div>

                {/* 1.1 Ouvrir la Fiche en Plein Écran (Onglet séparé) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    const chapterUrl = resolvedPdfUrl || getFullUrl();
                    if (chapterUrl) {
                      window.open(chapterUrl, '_blank');
                    } else if (course) {
                      exportCoursePdf(course, i18n.language, t);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center flex-shrink-0 text-amber-600 transition-all group-hover:scale-105">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                      {labels.openChapterTab}
                    </div>
                    <div className="text-[10.5px] text-slate-500 truncate">
                      {labels.openChapterTabSub}
                    </div>
                  </div>
                </button>

                {/* 1.2 Générer la Fiche A4 */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    exportCoursePdf(course, i18n.language, t);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-105"
                    style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}40`, color: accentColor }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                      {labels.exportChapter}
                    </div>
                    <div className="text-[10.5px] text-slate-500 truncate">
                      {labels.exportChapterSub}
                    </div>
                  </div>
                </button>

                {/* 1.3 Télécharger la Fiche */}
                <button
                  type="button"
                  onClick={() => handleSaveToDisk(resolvedPdfUrl || pdfUrl)}
                  disabled={isDownloading}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer disabled:opacity-50"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center flex-shrink-0 text-emerald-600 transition-all group-hover:scale-105">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                      {labels.downloadChapter}
                    </div>
                    <div className="text-[10.5px] text-slate-500 truncate">
                      {labels.downloadChapterSub}
                    </div>
                  </div>
                </button>

                {/* SECTION 2 : RECUEIL INTÉGRAL */}
                <div className="px-2.5 pt-2.5 pb-1 text-[10px] font-bold tracking-wider uppercase text-slate-400 flex items-center justify-between border-t border-[#EFE8DE] mt-1.5">
                  <span>{labels.integralSection}</span>
                  {isGlobalLocked ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> PREMIUM
                    </span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">INTÉGRAL</span>
                  )}
                </div>

                {/* 2.1 Ouvrir le Recueil Intégral en Plein Écran (Onglet séparé) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (isGlobalLocked) {
                      onLockedClick?.();
                      return;
                    }
                    if (globalPdfUrl) {
                      window.open(globalPdfUrl, '_blank');
                    } else if (globalCourse) {
                      exportCoursePdf(globalCourse, i18n.language, t, hasFullAccess);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center flex-shrink-0 text-indigo-600 transition-all group-hover:scale-105">
                    {isGlobalLocked ? <Lock className="w-4 h-4 text-amber-600" /> : <ExternalLink className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors flex items-center gap-1.5">
                      <span>{labels.openIntegralTab}</span>
                      {isGlobalLocked && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">PREMIUM</span>}
                    </div>
                    <div className="text-[10.5px] text-slate-500 truncate">
                      {labels.openIntegralTabSub}
                    </div>
                  </div>
                </button>

                {/* 2.2 Générer le Recueil A4 */}
                {globalCourse && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      if (isGlobalLocked) {
                        onLockedClick?.();
                        return;
                      }
                      exportCoursePdf(globalCourse, i18n.language, t, hasFullAccess);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-105"
                      style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}40`, color: accentColor }}
                    >
                      {isGlobalLocked ? <Lock className="w-4 h-4 text-amber-600" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors flex items-center gap-1.5">
                        <span>{labels.exportIntegral}</span>
                        {isGlobalLocked && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">PREMIUM</span>}
                      </div>
                      <div className="text-[10.5px] text-slate-500 truncate">
                        {labels.exportIntegralSub}
                      </div>
                    </div>
                  </button>
                )}

                {/* 2.3 Télécharger le Recueil Complet */}
                <button
                  type="button"
                  onClick={() => {
                    if (isGlobalLocked) {
                      setIsOpen(false);
                      onLockedClick?.();
                      return;
                    }
                    handleSaveToDisk(globalPdfUrl);
                  }}
                  disabled={isDownloading}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer disabled:opacity-50"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center flex-shrink-0 text-emerald-600 transition-all group-hover:scale-105">
                    {isGlobalLocked ? <Lock className="w-4 h-4 text-amber-600" /> : <Download className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors flex items-center gap-1.5">
                      <span>{labels.downloadIntegral}</span>
                      {isGlobalLocked && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">PREMIUM</span>}
                    </div>
                    <div className="text-[10.5px] text-slate-500 truncate">
                      {labels.downloadIntegralSub}
                    </div>
                  </div>
                </button>
              </>
            ) : (
              <>
                {/* Options pour le Recueil Intégral standalone */}
                {/* Ouvrir en Plein Écran (Onglet séparé) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (isLocked) {
                      onLockedClick?.();
                      return;
                    }
                    if (course && !pdfUrl) {
                      exportCoursePdf(course, i18n.language, t, hasFullAccess);
                      return;
                    }
                    window.open(getFullUrl(), '_blank');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center flex-shrink-0 text-amber-600 transition-all group-hover:scale-105">
                    {isLocked ? <Lock className="w-4 h-4 text-amber-600" /> : <ExternalLink className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors flex items-center gap-1.5">
                      <span>{labels.openNewTab}</span>
                      {isLocked && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">PREMIUM</span>}
                    </div>
                    <div className="text-[10.5px] text-slate-500 truncate">
                      {labels.openNewTabSub}
                    </div>
                  </div>
                </button>

                {/* Générer A4 direct */}
                {course && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      if (isLocked) {
                        onLockedClick?.();
                        return;
                      }
                      exportCoursePdf(course, i18n.language, t, hasFullAccess);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-105"
                      style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}40`, color: accentColor }}
                    >
                      {isLocked ? <Lock className="w-4 h-4 text-amber-600" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors flex items-center gap-1.5">
                        <span>{labels.exportPdf}</span>
                        {isLocked && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">PREMIUM</span>}
                      </div>
                      <div className="text-[10.5px] text-slate-500 truncate">
                        {labels.exportPdfSub}
                      </div>
                    </div>
                  </button>
                )}

                {/* Télécharger sur l'appareil */}
                <button
                  type="button"
                  onClick={() => handleSaveToDisk()}
                  disabled={isDownloading}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer disabled:opacity-50"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center flex-shrink-0 text-emerald-600 transition-all group-hover:scale-105">
                    {isLocked ? <Lock className="w-4 h-4 text-amber-600" /> : <Download className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors flex items-center gap-1.5">
                      <span>{isDownloading ? "..." : labels.download}</span>
                      {isLocked && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">PREMIUM</span>}
                    </div>
                    <div className="text-[10.5px] text-slate-500 truncate">
                      {labels.downloadSub}
                    </div>
                  </div>
                </button>
              </>
            )}

            {/* SECTION 3 : PARTAGE & ACTIONS */}
            <div className="border-t border-[#EFE8DE] my-1 pt-1">
              {/* Partager nativement */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-105"
                  style={{ backgroundColor: `${accentColor}18`, border: `1px solid ${accentColor}30`, color: accentColor }}
                >
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-700 group-hover:text-slate-950 transition-colors">
                    {labels.nativeShare}
                  </div>
                </div>
              </button>

              {/* Envoyer par e-mail */}
              <button
                type="button"
                onClick={handleSendEmail}
                className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center flex-shrink-0 text-blue-600 transition-all group-hover:scale-105">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-700 group-hover:text-slate-950 transition-colors">
                    {labels.email}
                  </div>
                </div>
              </button>

              {/* Copier le lien direct */}
              <button
                type="button"
                onClick={() => handleCopyLink()}
                className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-700 transition-all group-hover:scale-105">
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-700 group-hover:text-slate-950 transition-colors">
                    {copied ? labels.copied : labels.copy}
                  </div>
                </div>
              </button>

              {/* Imprimer */}
              <button
                type="button"
                onClick={handlePrint}
                className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center flex-shrink-0 text-slate-500 transition-all group-hover:scale-105">
                  <Printer className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-700 group-hover:text-slate-950 transition-colors">
                    {labels.print}
                  </div>
                </div>
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
