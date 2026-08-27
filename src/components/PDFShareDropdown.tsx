import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Share2, Download, Mail, Copy, Check, ChevronDown, FileText, Printer, ExternalLink, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type VideoCourse } from "../data/videoCourses";
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
}

const DROPDOWN_TEXTS: Record<string, {
  shareBtn: string;
  docTitle: string;
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
    docTitle: "DOCUMENT PDF",
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
    docTitle: "PDF DOCUMENT",
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
    docTitle: "PDF DOKUMENT",
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
    docTitle: "DOCUMENTO PDF",
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
    docTitle: "DOCUMENTO PDF",
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
    exportPdf: "Genera Scheda A4",
    exportPdfSub: "Esportazione HD"
  },
  ja: {
    shareBtn: "共有",
    docTitle: "PDFドキュメント",
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
  course,
}: PDFShareDropdownProps) {
  const { t, i18n } = useTranslation();
  const langKey = getNormalizedLang(i18n.language);
  const labels = DROPDOWN_TEXTS[langKey] || DROPDOWN_TEXTS.fr;

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
      exportCoursePdf(course, i18n.language, t);
    }
  };

  // 3. Envoyer par e-mail
  const handleSendEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  // 4. Copier le lien
  const handleCopyLink = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const fullUrl = getFullUrl();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  // 5. Imprimer
  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
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
          title={labels.shareBtn}
        >
          <Share2 className="w-3.5 h-3.5" style={{ color: accentColor }} strokeWidth={2.5} />
          <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider">{labels.shareBtn}</span>
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
            className="rounded-2xl bg-[#FFFFFF] border border-[#E2D8CC] shadow-[0_20px_50px_rgba(0,0,0,0.18)] overflow-hidden p-1.5 animate-in fade-in zoom-in-95 duration-150 text-left"
          >
            {/* Header du menu */}
            <div className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EFE8DE] mb-1.5 relative">
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

            {/* Option Export A4 direct */}
            {course && (
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
                    {labels.exportPdf}
                  </div>
                  <div className="text-[10.5px] text-slate-500 truncate">
                    {labels.exportPdfSub}
                  </div>
                </div>
              </button>
            )}

            {/* Option 1 : Partager nativement */}
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

            {/* Option 2 : Télécharger / Enregistrer sur disque */}
            <button
              type="button"
              onClick={handleSaveToDisk}
              disabled={isDownloading}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center flex-shrink-0 text-emerald-600 transition-all group-hover:scale-105">
                <Download className="w-4 h-4" />
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

            {/* Option 3 : Ouvrir dans un nouvel onglet */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (course && !pdfUrl) {
                  exportCoursePdf(course, i18n.language, t);
                  return;
                }
                window.open(getFullUrl(), '_blank');
              }}
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

            {/* Option 4 : Envoyer par e-mail */}
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

            {/* Option 5 : Copier le lien */}
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

            {/* Option 6 : Imprimer */}
            <button
              type="button"
              onClick={handlePrint}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer border-t border-[#EFE8DE] mt-1"
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
          </div>,
          document.body
        )}
    </>
  );
}
