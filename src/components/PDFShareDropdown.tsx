import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Share2, 
  Download, 
  Mail, 
  Copy, 
  Check, 
  ChevronDown, 
  FileText, 
  Printer, 
  ExternalLink, 
  Sparkles, 
  X, 
  Eye 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { type VideoCourse } from "../data/videoCourses";
import { exportCoursePdf, getNormalizedLang, EXPORTER_TRANSLATIONS } from "../utils/exportCoursePdf";
import { getCoursePdfUrl, getCategoryMasterPdfUrl } from "../utils/getPdfUrl";

interface PDFShareDropdownProps {
  pdfUrl?: string;
  title?: string;
  courseTitle?: string;
  author?: string;
  variant?: "viewer-bar" | "toolbar" | "pill" | "icon" | "header";
  align?: "left" | "right";
  buttonClassName?: string;
  accentColor?: string;
  onViewInPlayer?: (targetUrl?: string) => void;
  course?: VideoCourse;
  label?: string;
}

const DROPDOWN_TEXTS: Record<string, {
  shareBtn: string;
  docTitle: string;
  tabChapter: string;
  tabIntegral: string;
  badgeA4: string;
  badgeGlobal: string;
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
  exportPdfChapter: string;
  exportPdfIntegral: string;
  exportPdfSubChapter: string;
  exportPdfSubIntegral: string;
  viewInReader: string;
  viewInReaderSub: string;
  integralRecueilTitle: string;
}> = {
  fr: {
    shareBtn: "Partager",
    docTitle: "DOCUMENT PDF",
    tabChapter: "Fiche Chapitre",
    tabIntegral: "Recueil Intégral",
    badgeA4: "A4",
    badgeGlobal: "GLOBAL",
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
    exportPdfChapter: "Générer la Fiche A4",
    exportPdfIntegral: "Générer le Recueil A4",
    exportPdfSubChapter: "Export HD de la leçon",
    exportPdfSubIntegral: "Export HD du recueil complet",
    viewInReader: "Consulter dans le lecteur",
    viewInReaderSub: "Afficher les pages du PDF directement",
    integralRecueilTitle: "Recueil Intégral"
  },
  en: {
    shareBtn: "Share",
    docTitle: "PDF DOCUMENT",
    tabChapter: "Lesson Sheet",
    tabIntegral: "Full Handbook",
    badgeA4: "A4",
    badgeGlobal: "GLOBAL",
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
    exportPdfChapter: "Generate Lesson Sheet A4",
    exportPdfIntegral: "Generate Full Handbook A4",
    exportPdfSubChapter: "HD export of current lesson",
    exportPdfSubIntegral: "Complete seminar compilation",
    viewInReader: "View in PDF Reader",
    viewInReaderSub: "Display PDF pages directly",
    integralRecueilTitle: "Complete Handbook"
  },
  de: {
    shareBtn: "Teilen",
    docTitle: "PDF DOKUMENT",
    tabChapter: "Lehrblatt",
    tabIntegral: "Gesamthandbuch",
    badgeA4: "A4",
    badgeGlobal: "GLOBAL",
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
    exportPdfChapter: "A4-Lehrblatt generieren",
    exportPdfIntegral: "Gesamthandbuch A4 generieren",
    exportPdfSubChapter: "HD-Export der Lektion",
    exportPdfSubIntegral: "Vollständiges Seminarhandbuch",
    viewInReader: "Im PDF-Reader öffnen",
    viewInReaderSub: "PDF-Seiten direkt anzeigen",
    integralRecueilTitle: "Gesamthandbuch"
  },
  es: {
    shareBtn: "Compartir",
    docTitle: "DOCUMENTO PDF",
    tabChapter: "Ficha Lección",
    tabIntegral: "Manual Integral",
    badgeA4: "A4",
    badgeGlobal: "GLOBAL",
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
    print: "Imprimer documento",
    printSub: "Formato A4 estándar",
    exportPdfChapter: "Generar Ficha A4",
    exportPdfIntegral: "Generar Manual Integral A4",
    exportPdfSubChapter: "Exportación HD de la lección",
    exportPdfSubIntegral: "Compilación completa del seminario",
    viewInReader: "Consultar en el visor",
    viewInReaderSub: "Mostrar páginas PDF directamente",
    integralRecueilTitle: "Manual Integral"
  },
  it: {
    shareBtn: "Condividi",
    docTitle: "DOCUMENTO PDF",
    tabChapter: "Scheda Lezione",
    tabIntegral: "Manuale Integrale",
    badgeA4: "A4",
    badgeGlobal: "GLOBAL",
    nativeShare: "Condividi",
    nativeShareSub: "AirDrop, Messaggi, Social",
    download: "Salva sul dispositivo",
    downloadSub: "Scarica file A4 (.pdf)",
    openNewTab: "Schermo intero / Nuova scheda",
    openNewTabSub: "Apri nel browser",
    email: "Invia per e-mail",
    emailSub: "Link precompilato in Mail",
    copy: "Copia link diretto",
    copySub: "Copia indirizzo URL",
    copied: "Link copiato!",
    copiedSub: "Pronto per essere incollato",
    print: "Stampa documento",
    printSub: "Formato A4 standard",
    exportPdfChapter: "Genera Scheda A4",
    exportPdfIntegral: "Genera Manuale Integrale A4",
    exportPdfSubChapter: "Esportazione HD della lezione",
    exportPdfSubIntegral: "Raccolta completa del seminario",
    viewInReader: "Apri nel lettore PDF",
    viewInReaderSub: "Visualizza direttamente le pagine PDF",
    integralRecueilTitle: "Manuale Integrale"
  },
  ja: {
    shareBtn: "共有",
    docTitle: "PDFドキュメント",
    tabChapter: "講義シート",
    tabIntegral: "完全講義録",
    badgeA4: "A4",
    badgeGlobal: "全局",
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
    exportPdfChapter: "A4シートを生成",
    exportPdfIntegral: "完全講義録A4を生成",
    exportPdfSubChapter: "高解像度エクスポート",
    exportPdfSubIntegral: "全セミナー収録ハンドブック",
    viewInReader: "PDFリーダーで開く",
    viewInReaderSub: "PDFページを直接表示",
    integralRecueilTitle: "完全講義録"
  },
  zh: {
    shareBtn: "分享",
    docTitle: "PDF 文档",
    tabChapter: "单课讲义",
    tabIntegral: "完整手册",
    badgeA4: "A4",
    badgeGlobal: "全集",
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
    exportPdfChapter: "生成 A4 学习单",
    exportPdfIntegral: "生成完整汇编 A4",
    exportPdfSubChapter: "单课高清导出",
    exportPdfSubIntegral: "全研讨会完整汇编",
    viewInReader: "在阅读器中打开",
    viewInReaderSub: "直接浏览 PDF 页面",
    integralRecueilTitle: "研讨会完整汇编"
  }
};

export default function PDFShareDropdown({
  pdfUrl = "",
  title = "Document PDF",
  courseTitle,
  author = "Marc Damoiseaux",
  variant = "viewer-bar",
  align = "right",
  buttonClassName = "",
  accentColor = "#5A9C51",
  onViewInPlayer,
  course,
  label,
}: PDFShareDropdownProps) {
  const { t, i18n } = useTranslation();
  const langKey = getNormalizedLang(i18n.language);
  const labels = DROPDOWN_TEXTS[langKey] || DROPDOWN_TEXTS.fr;

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chapter" | "integral">("chapter");
  const [position, setPosition] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 320,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Reset to chapter tab whenever course changes
  useEffect(() => {
    setActiveTab("chapter");
  }, [course?.id]);

  // Compute fixed position on open, resize, or scroll
  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 1000;

    const menuWidth = Math.min(320, windowWidth - 24);
    const menuHeight = 440; // Estimated height with tabs & actions

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

  const hasBothOptions = Boolean(course);

  // Chapter PDF URL
  const chapterPdfUrl = course 
    ? getCoursePdfUrl(course, i18n.language) 
    : (pdfUrl ? (pdfUrl.startsWith('/pdfs/') ? getCoursePdfUrl(pdfUrl, i18n.language) : pdfUrl) : '');

  // Master Integral PDF URL for category
  const categoryMasterPdfUrl = course?.categoryId
    ? getCategoryMasterPdfUrl(course.categoryId, i18n.language)
    : getCategoryMasterPdfUrl('ectoderme', i18n.language);

  // Active target PDF URL
  const currentTargetPdfUrl = activeTab === "integral"
    ? (categoryMasterPdfUrl || chapterPdfUrl)
    : (chapterPdfUrl || pdfUrl || "");

  // Titles & Labels
  const categoryLabel = EXPORTER_TRANSLATIONS[langKey]?.categories[course?.categoryId || 'ectoderme'] || courseTitle || "Séminaire";
  const formattedChapterTitle = (course?.title.match(/^(\d+)/) ? `${course.title.match(/^(\d+)/)?.[1].padStart(2, '0')}. ` : '') + (course?.title || title || "Leçon").replace(/^\d+[.\-\s_:]*/, '').replace(/\s*_\s*/g, ' : ');

  const currentDisplayedTitle = activeTab === "integral"
    ? `${labels.integralRecueilTitle} — ${categoryLabel}`
    : formattedChapterTitle;

  const currentBadge = activeTab === "integral" ? labels.badgeGlobal : labels.badgeA4;

  // Resolve absolute URL
  const getFullUrl = () => {
    if (!currentTargetPdfUrl) return "";
    if (currentTargetPdfUrl.startsWith("http://") || currentTargetPdfUrl.startsWith("https://")) {
      return currentTargetPdfUrl;
    }
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      return currentTargetPdfUrl.startsWith("/") ? `${origin}${currentTargetPdfUrl}` : `${origin}/${currentTargetPdfUrl}`;
    }
    return currentTargetPdfUrl;
  };

  const getCleanFileName = () => {
    if (currentTargetPdfUrl) {
      const parts = currentTargetPdfUrl.split("/");
      let rawName = decodeURIComponent(parts[parts.length - 1] || "");
      if (rawName.toLowerCase().endsWith(".pdf")) {
        return rawName;
      }
    }
    return `${currentDisplayedTitle.replace(/[^a-zA-Z0-9À-ÿ\-\s]/g, '_')}.pdf`;
  };

  // 1. Partager natif (Web Share API)
  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    const fullUrl = getFullUrl();
    const cleanTitle = currentDisplayedTitle;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        let fileToShare: File | null = null;
        try {
          if (fullUrl) {
            const res = await fetch(fullUrl);
            if (res.ok) {
              const blob = await res.blob();
              fileToShare = new File([blob], getCleanFileName(), { type: "application/pdf" });
            }
          }
        } catch {
          // Fallback to URL sharing if fetch/CORS fails
        }

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
          url: fullUrl || window.location.href,
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

  // 2. Enregistrer sur disque / Télécharger
  const handleSaveToDisk = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);

    const fullUrl = getFullUrl();
    const fileName = getCleanFileName();

    if (fullUrl) {
      setIsDownloading(true);
      try {
        const res = await fetch(fullUrl);
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
        a.href = fullUrl;
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
      exportCoursePdf(course, i18n.language, t, activeTab === "integral");
    }
  };

  // 3. Ouvrir dans un nouvel onglet
  const handleOpenNewTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    const fullUrl = getFullUrl();
    if (fullUrl) {
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    } else if (course) {
      exportCoursePdf(course, i18n.language, t, activeTab === "integral");
    }
  };

  // 4. Envoyer par e-mail
  const handleSendEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    const fullUrl = getFullUrl() || window.location.href;
    const cleanTitle = currentDisplayedTitle;
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

  // 5. Copier le lien
  const handleCopyLink = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const fullUrl = getFullUrl() || window.location.href;
    if (typeof navigator !== "undefined" && navigator.clipboard && fullUrl) {
      navigator.clipboard.writeText(fullUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  // 6. Imprimer
  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    const fullUrl = getFullUrl();
    if (fullUrl) {
      const printWindow = window.open(fullUrl, '_blank');
      if (printWindow) {
        printWindow.focus();
        setTimeout(() => printWindow.print(), 1000);
        return;
      }
    }
    if (course) {
      exportCoursePdf(course, i18n.language, t, activeTab === "integral");
    }
  };

  // 7. Consulter dans le lecteur PDF
  const handleViewInPlayer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    if (onViewInPlayer) {
      onViewInPlayer(currentTargetPdfUrl);
    } else {
      const fullUrl = getFullUrl();
      if (fullUrl) window.open(fullUrl, '_blank');
    }
  };

  return (
    <>
      {/* TRIGGER BUTTONS ACCORDING TO VARIANT */}
      {variant === "viewer-bar" && (
        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all border border-[#E2D8CC] shadow-xs active:scale-98 cursor-pointer ${buttonClassName}`}
          title={labels.shareBtn}
        >
          <Share2 className="w-3.5 h-3.5" style={{ color: accentColor }} strokeWidth={2.5} />
          <span>{labels.shareBtn}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {variant === "header" && (
        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF6ED] text-slate-800 text-xs font-bold shadow-xs border border-[#E2D8CC] transition-all active:scale-98 cursor-pointer ${buttonClassName}`}
          title={label || "PDF"}
        >
          <Share2 className="w-3.5 h-3.5" style={{ color: accentColor }} strokeWidth={2.5} />
          <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider">{label || "PDF"}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {variant === "pill" && (
        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#FAF6ED] text-slate-700 hover:text-slate-900 font-sans font-bold text-[10px] sm:text-[11px] tracking-wider border border-[#E2D8CC] shadow-2xs transition-all active:scale-95 cursor-pointer ${buttonClassName}`}
        >
          <Share2 className="w-3 h-3" style={{ color: accentColor }} strokeWidth={2.5} />
          <span>PDF</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {variant === "icon" && (
        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`p-2 rounded-xl bg-white hover:bg-[#FAF6ED] text-slate-700 border border-[#E2D8CC] shadow-xs transition-colors flex-shrink-0 cursor-pointer ${buttonClassName}`}
          title={labels.shareBtn}
        >
          <Share2 className="w-4 h-4" style={{ color: accentColor }} strokeWidth={2.2} />
        </button>
      )}

      {/* DROPDOWN MENU VIA PORTAL */}
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
            className="rounded-2xl bg-[#FFFFFF] border border-[#E2D8CC] shadow-[0_20px_50px_rgba(0,0,0,0.18)] overflow-hidden p-2 animate-in fade-in zoom-in-95 duration-150 text-left max-h-[92vh] overflow-y-auto"
          >
            {/* 1. Header du menu avec titre & badge */}
            <div className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EFE8DE] mb-2 relative">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                    {labels.docTitle}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {currentBadge}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0 -mr-1"
                    title="Fermer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="text-xs font-bold text-slate-800 truncate mt-1" title={currentDisplayedTitle}>
                {currentDisplayedTitle}
              </div>
            </div>

            {/* 2. SÉLECTEUR SOBRE À 2 BOUTONS : FICHE CHAPITRE | RECUEIL INTÉGRAL */}
            {hasBothOptions && (
              <div className="flex items-center p-1 bg-[#F0EBE1] rounded-xl mb-2 gap-1 border border-[#E2D8CC]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("chapter");
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "chapter"
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" style={{ color: activeTab === "chapter" ? accentColor : undefined }} />
                  <span>{labels.tabChapter}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("integral");
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "integral"
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" style={{ color: activeTab === "integral" ? accentColor : undefined }} />
                  <span>{labels.tabIntegral}</span>
                </button>
              </div>
            )}

            {/* 3. LISTE DES ACTIONS HARMONISÉES */}
            <div className="space-y-0.5">
              {/* Option 0 : Consulter dans le lecteur PDF (si callback présent) */}
              {onViewInPlayer && (
                <button
                  type="button"
                  onClick={handleViewInPlayer}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-105"
                    style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}30`, color: accentColor }}
                  >
                    <Eye className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                      {labels.viewInReader}
                    </div>
                    <div className="text-[10.5px] text-slate-500 truncate">
                      {labels.viewInReaderSub}
                    </div>
                  </div>
                </button>
              )}

              {/* Option 1 : Générer la Fiche A4 ou le Recueil A4 */}
              {course && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    exportCoursePdf(course, i18n.language, t, activeTab === "integral");
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
                      {activeTab === "chapter" ? labels.exportPdfChapter : labels.exportPdfIntegral}
                    </div>
                    <div className="text-[10.5px] text-slate-500 truncate">
                      {activeTab === "chapter" ? labels.exportPdfSubChapter : labels.exportPdfSubIntegral}
                    </div>
                  </div>
                </button>
              )}

              {/* Option 2 : Partager nativement */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-105"
                  style={{ backgroundColor: `${accentColor}18`, border: `1px solid ${accentColor}30`, color: accentColor }}
                >
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                    {labels.nativeShare}
                  </div>
                  <div className="text-[10.5px] text-slate-500 truncate">
                    {labels.nativeShareSub}
                  </div>
                </div>
              </button>

              {/* Option 3 : Enregistrer sur l'appareil / Télécharger */}
              <button
                type="button"
                onClick={handleSaveToDisk}
                disabled={isDownloading}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center flex-shrink-0 text-emerald-600 transition-all group-hover:scale-105">
                  <Download className={`w-4 h-4 ${isDownloading ? "animate-bounce" : ""}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                    {isDownloading ? "..." : labels.download}
                  </div>
                  <div className="text-[10.5px] text-slate-500 truncate">
                    {labels.downloadSub}
                  </div>
                </div>
              </button>

              {/* Option 4 : Plein écran / Onglet séparé */}
              <button
                type="button"
                onClick={handleOpenNewTab}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center flex-shrink-0 text-amber-600 transition-all group-hover:scale-105">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                    {labels.openNewTab}
                  </div>
                  <div className="text-[10.5px] text-slate-500 truncate">
                    {labels.openNewTabSub}
                  </div>
                </div>
              </button>

              {/* Option 5 : Envoyer par e-mail */}
              <button
                type="button"
                onClick={handleSendEmail}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center flex-shrink-0 text-blue-600 transition-all group-hover:scale-105">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                    {labels.email}
                  </div>
                  <div className="text-[10.5px] text-slate-500 truncate">
                    {labels.emailSub}
                  </div>
                </div>
              </button>

              {/* Option 6 : Copier le lien direct */}
              <button
                type="button"
                onClick={() => handleCopyLink()}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-700 transition-all group-hover:scale-105">
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                    {copied ? labels.copied : labels.copy}
                  </div>
                  <div className="text-[10.5px] text-slate-500 truncate">
                    {copied ? labels.copiedSub : labels.copySub}
                  </div>
                </div>
              </button>

              {/* Option 7 : Imprimer le document */}
              <button
                type="button"
                onClick={handlePrint}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer border-t border-[#EFE8DE] mt-1 pt-1.5"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center flex-shrink-0 text-slate-500 transition-all group-hover:scale-105">
                  <Printer className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                    {labels.print}
                  </div>
                  <div className="text-[10.5px] text-slate-500 truncate">
                    {labels.printSub}
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
