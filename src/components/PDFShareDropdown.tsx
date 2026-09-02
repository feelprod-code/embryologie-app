import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Share2, Download, ChevronDown, FileText, Printer, Sparkles, Lock, ExternalLink, X } from "lucide-react";
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
  course?: VideoCourse;
  hasFullAccess?: boolean;
  onLockedClick?: () => void;
}

const DROPDOWN_TEXTS: Record<string, {
  shareBtn: string;
  docTitle: string;
  tabChapter: string;
  tabIntegral: string;
  openNewTab: string;
  openNewTabSub: string;
  generateA4Chapter: string;
  generateA4Integral: string;
  generateA4Sub: string;
  share: string;
  shareSub: string;
  saveToDevice: string;
  saveToDeviceSubChapter: string;
  saveToDeviceSubIntegral: string;
  email: string;
  emailSub: string;
  copy: string;
  copySub: string;
  copied: string;
  copiedSub: string;
  print: string;
  printSub: string;
}> = {
  fr: {
    shareBtn: "Partager",
    docTitle: "DOCUMENT PDF",
    tabChapter: "Fiche Chapitre",
    tabIntegral: "Recueil Intégral",
    openNewTab: "Ouvrir dans un onglet séparé",
    openNewTabSub: "Plein écran dans le navigateur",
    generateA4Chapter: "Générer la Fiche A4 (Chapitre)",
    generateA4Integral: "Générer le Recueil A4 (Intégral)",
    generateA4Sub: "Export HD épuré et personnalisé",
    share: "Partager",
    shareSub: "AirDrop, Messages, Réseaux",
    saveToDevice: "Enregistrer sur l'appareil",
    saveToDeviceSubChapter: "Télécharger le fichier A4 (.pdf)",
    saveToDeviceSubIntegral: "Télécharger le recueil complet (.pdf)",
    email: "Envoyer par e-mail",
    emailSub: "Lien pré-rempli dans Mail",
    copy: "Copier le lien",
    copySub: "Copier l'adresse URL du document",
    copied: "Lien copié !",
    copiedSub: "Prêt à être collé",
    print: "Imprimer",
    printSub: "Format A4 standard",
  },
  en: {
    shareBtn: "Share",
    docTitle: "PDF DOCUMENT",
    tabChapter: "Chapter Sheet",
    tabIntegral: "Integral Book",
    openNewTab: "Open in a new tab",
    openNewTabSub: "Full screen in browser",
    generateA4Chapter: "Generate A4 Sheet (Chapter)",
    generateA4Integral: "Generate A4 Book (Integral)",
    generateA4Sub: "Clean custom HD export",
    share: "Share",
    shareSub: "AirDrop, Messages, Socials",
    saveToDevice: "Save to device",
    saveToDeviceSubChapter: "Download A4 file (.pdf)",
    saveToDeviceSubIntegral: "Download complete manual (.pdf)",
    email: "Send by email",
    emailSub: "Pre-filled link in Mail",
    copy: "Copy link",
    copySub: "Copy document URL address",
    copied: "Link copied!",
    copiedSub: "Ready to paste",
    print: "Print",
    printSub: "Standard A4 format",
  },
  de: {
    shareBtn: "Teilen",
    docTitle: "PDF DOKUMENT",
    tabChapter: "Kapitelblatt",
    tabIntegral: "Gesamtwerk",
    openNewTab: "In neuem Tab öffnen",
    openNewTabSub: "Vollbild im Browser",
    generateA4Chapter: "A4-Blatt generieren (Kapitel)",
    generateA4Integral: "Gesamtwerk A4 generieren",
    generateA4Sub: "Hochauflösender Export",
    share: "Teilen",
    shareSub: "AirDrop, Nachrichten, Netzwerke",
    saveToDevice: "Auf Gerät speichern",
    saveToDeviceSubChapter: "A4-Datei herunterladen (.pdf)",
    saveToDeviceSubIntegral: "Gesamtwerk herunterladen (.pdf)",
    email: "Per E-Mail senden",
    emailSub: "Vorausgefüllter Link in Mail",
    copy: "Link kopieren",
    copySub: "Dokument-URL kopieren",
    copied: "Link kopiert!",
    copiedSub: "Bereit zum Einfügen",
    print: "Drucken",
    printSub: "Standard A4-Format",
  },
  es: {
    shareBtn: "Compartir",
    docTitle: "DOCUMENTO PDF",
    tabChapter: "Ficha Capítulo",
    tabIntegral: "Manual Integral",
    openNewTab: "Abrir en una pestaña separada",
    openNewTabSub: "Pantalla completa en el navegador",
    generateA4Chapter: "Generar Ficha A4 (Capítulo)",
    generateA4Integral: "Generar Manual A4 (Integral)",
    generateA4Sub: "Exportación HD personalizada",
    share: "Compartir",
    shareSub: "AirDrop, Mensajes, Redes",
    saveToDevice: "Guardar en el dispositivo",
    saveToDeviceSubChapter: "Descargar archivo A4 (.pdf)",
    saveToDeviceSubIntegral: "Descargar manual completo (.pdf)",
    email: "Enviar por correo",
    emailSub: "Enlace preparado en Mail",
    copy: "Copiar enlace",
    copySub: "Copiar dirección URL",
    copied: "¡Enlace copiado!",
    copiedSub: "Listo para pegar",
    print: "Imprimir",
    printSub: "Formato A4 estándar",
  },
  it: {
    shareBtn: "Condividi",
    docTitle: "DOCUMENTO PDF",
    tabChapter: "Scheda Capitolo",
    tabIntegral: "Raccolta Integrale",
    openNewTab: "Apri in una nuova scheda",
    openNewTabSub: "Schermo intero nel browser",
    generateA4Chapter: "Genera Scheda A4 (Capitolo)",
    generateA4Integral: "Genera Raccolta A4 (Integrale)",
    generateA4Sub: "Esportazione HD personalizzata",
    share: "Condividi",
    shareSub: "AirDrop, Messaggi, Social",
    saveToDevice: "Salva sul dispositivo",
    saveToDeviceSubChapter: "Scarica file A4 (.pdf)",
    saveToDeviceSubIntegral: "Scarica manuale completo (.pdf)",
    email: "Invia per e-mail",
    emailSub: "Link precompilato in Mail",
    copy: "Copia link",
    copySub: "Copia indirizzo URL",
    copied: "Link copiato!",
    copiedSub: "Pronto per essere incollato",
    print: "Stampa",
    printSub: "Formato A4 standard",
  },
  ja: {
    shareBtn: "共有",
    docTitle: "PDFドキュメント",
    tabChapter: "章のシート",
    tabIntegral: "完全版マニュアル",
    openNewTab: "新しいタブで開く",
    openNewTabSub: "ブラウザで全画面表示",
    generateA4Chapter: "A4シートを生成 (章)",
    generateA4Integral: "完全版A4を生成",
    generateA4Sub: "カスタム高解像度エクスポート",
    share: "共有",
    shareSub: "AirDrop、メッセージ、SNS",
    saveToDevice: "端末に保存",
    saveToDeviceSubChapter: "A4ファイルをダウンロード (.pdf)",
    saveToDeviceSubIntegral: "完全版をダウンロード (.pdf)",
    email: "メールで送信",
    emailSub: "メールでリンクを送信",
    copy: "リンクをコピー",
    copySub: "ドキュメントURLをコピー",
    copied: "コピーしました！",
    copiedSub: "貼り付け可能です",
    print: "印刷",
    printSub: "標準A4フォーマット",
  },
  zh: {
    shareBtn: "分享",
    docTitle: "PDF 文档",
    tabChapter: "章节学习单",
    tabIntegral: "完整全书",
    openNewTab: "在新标签页中打开",
    openNewTabSub: "在浏览器中全屏查看",
    generateA4Chapter: "生成 A4 学习单 (课时)",
    generateA4Integral: "生成完整 A4 教材 (全套)",
    generateA4Sub: "高清个性化导出",
    share: "分享",
    shareSub: "隔空投送、信息、社交应用",
    saveToDevice: "保存到设备",
    saveToDeviceSubChapter: "下载 A4 文件 (.pdf)",
    saveToDeviceSubIntegral: "下载完整全书 (.pdf)",
    email: "通过邮件发送",
    emailSub: "在邮件中打开预填链接",
    copy: "复制链接",
    copySub: "复制文档网址",
    copied: "链接已复制！",
    copiedSub: "已准备好粘贴",
    print: "打印",
    printSub: "标准 A4 格式",
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
  hasFullAccess = false,
  onLockedClick,
}: PDFShareDropdownProps) {
  const { t, i18n } = useTranslation();
  const langKey = getNormalizedLang(i18n.language);
  const labels = DROPDOWN_TEXTS[langKey] || DROPDOWN_TEXTS.fr;

  const [activeTab, setActiveTab] = useState<'chapter' | 'integral'>(
    course?.isGlobalPdf ? 'integral' : 'chapter'
  );

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
    width: 340,
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

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 1000;

    const menuWidth = Math.min(340, windowWidth - 24);
    const menuHeight = 440;

    let left = align === "right" ? rect.right - menuWidth : rect.left;
    if (left + menuWidth > windowWidth - 12) {
      left = windowWidth - menuWidth - 12;
    }
    if (left < 12) {
      left = 12;
    }

    let top = rect.bottom + 6;
    if (rect.bottom + menuHeight > windowHeight - 16 && rect.top > menuHeight) {
      top = rect.top - menuHeight - 6;
    }

    if (top < 12) top = 12;

    setPosition({ top, left, width: menuWidth });
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleScrollOrResize = () => updatePosition();
      const handleClickOutside = (e: MouseEvent | TouchEvent) => {
        const target = e.target as Node;
        if (buttonRef.current && !buttonRef.current.contains(target) && menuRef.current && !menuRef.current.contains(target)) {
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

  const getFullUrl = () => {
    const targetUrl = resolvedPdfUrl || pdfUrl;
    if (!targetUrl) return "";
    if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) return targetUrl;
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
    if (!rawName.toLowerCase().endsWith(".pdf")) rawName = `${title || "document"}.pdf`;
    return rawName;
  };

  const handleNativeShare = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeTab === 'integral' && isGlobalLocked) {
      setIsOpen(false);
      onLockedClick?.();
      return;
    }
    setIsOpen(false);
    const shareUrl = activeTab === 'integral' ? globalPdfUrl : getFullUrl();
    const shareTitle = activeTab === 'integral' ? (globalCourse?.title || "Recueil Intégral") : (title || course?.title || "Fiche de cours");

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        let fileToShare: File | null = null;
        try {
          if (shareUrl) {
            const res = await fetch(shareUrl);
            const blob = await res.blob();
            fileToShare = new File([blob], getCleanFileName(), { type: "application/pdf" });
          }
        } catch {}
        if (fileToShare && navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
          await navigator.share({ title: `[Embryologie App] ${shareTitle}`, text: `Support PDF : ${shareTitle}`, files: [fileToShare] });
          return;
        }
        await navigator.share({ title: `[Embryologie App] ${shareTitle}`, text: `Support PDF : ${shareTitle}`, url: shareUrl });
      } catch (err) {
        if ((err as Error).name !== "AbortError") handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSaveToDisk = async (urlToUse?: string) => {
    const isTargetLocked = (urlToUse?.includes('cours_complets') || urlToUse?.toLowerCase().includes('integral')) && !hasFullAccess;
    if (isTargetLocked) {
      setIsOpen(false);
      onLockedClick?.();
      return;
    }
    setIsOpen(false);
    const fileName = (urlToUse ? urlToUse.split("/").pop() : undefined) || getCleanFileName();
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
    if (course) exportCoursePdf(course, i18n.language, t);
  };

  const handleCopyLink = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeTab === 'integral' && isGlobalLocked) {
      setIsOpen(false);
      onLockedClick?.();
      return;
    }
    const fullUrl = activeTab === 'integral' ? globalPdfUrl : getFullUrl();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTab === 'integral' && isGlobalLocked) {
      setIsOpen(false);
      onLockedClick?.();
      return;
    }
    setIsOpen(false);
    if (activeTab === 'chapter' && course) {
      exportCoursePdf(course, i18n.language, t);
      return;
    }
    if (activeTab === 'integral' && globalCourse) {
      exportCoursePdf(globalCourse, i18n.language, t, hasFullAccess);
      return;
    }
    const fullUrl = activeTab === 'integral' ? globalPdfUrl : getFullUrl();
    const printWindow = window.open(fullUrl, '_blank');
    if (printWindow) printWindow.focus();
  };

  return (
    <>
      {/* 1. VARIANT HEADER (Under video controls bar & transcript header) */}
      {(variant === "header" || (!variant && variant !== "viewer-bar" && variant !== "pill" && variant !== "icon")) && (
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
          <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider">
            {course?.isGlobalPdf ? 'RECUEIL PDF' : 'PDF'}
          </span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {/* 2. VARIANT PILL (Library list course details) */}
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

      {/* 3. VARIANT VIEWER-BAR */}
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

      {/* 4. VARIANT ICON */}
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
            className="rounded-3xl bg-[#FFFFFF] border border-[#E2D8CC] shadow-[0_20px_50px_rgba(0,0,0,0.18)] overflow-hidden p-3 animate-in fade-in zoom-in-95 duration-150 text-left max-h-[88vh] overflow-y-auto"
          >
            <div className="px-3.5 py-3 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DE] mb-2.5 relative">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#D47A3A]" />
                  <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#D47A3A]">
                    {labels.docTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider text-white bg-[#334E43]">
                    A4
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 -mr-1 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm font-bold text-slate-900 truncate mt-1.5" title={course?.title || title}>
                {course?.title || title || "Sélectionnez un chapitre"}
              </div>
            </div>

            {course && !course.isGlobalPdf && (
              <div className="bg-[#EFEBE3] p-1 rounded-2xl flex items-center gap-1 mb-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('chapter')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'chapter'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${activeTab === 'chapter' ? 'text-[#D47A3A]' : 'text-slate-500'}`} />
                  <span>{labels.tabChapter}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('integral')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'integral'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  {isGlobalLocked ? (
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'integral' ? 'text-[#D47A3A]' : 'text-slate-500'}`} />
                  )}
                  <span>{labels.tabIntegral}</span>
                </button>
              </div>
            )}

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (activeTab === 'integral' && isGlobalLocked) {
                    onLockedClick?.();
                    return;
                  }
                  const targetUrl = activeTab === 'integral' ? globalPdfUrl : (resolvedPdfUrl || getFullUrl());
                  if (targetUrl) {
                    window.open(targetUrl, '_blank');
                  } else if (activeTab === 'chapter' && course) {
                    exportCoursePdf(course, i18n.language, t);
                  } else if (activeTab === 'integral' && globalCourse) {
                    exportCoursePdf(globalCourse, i18n.language, t, hasFullAccess);
                  }
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#E6EFF5] border border-[#D0E2ED] flex items-center justify-center flex-shrink-0 text-[#3B7293] transition-all group-hover:scale-105">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-slate-950 transition-colors flex items-center gap-1.5">
                    <span>{labels.openNewTab}</span>
                    {activeTab === 'integral' && isGlobalLocked && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">PREMIUM</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {labels.openNewTabSub}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (activeTab === 'integral' && isGlobalLocked) {
                    onLockedClick?.();
                    return;
                  }
                  if (activeTab === 'chapter' && course) {
                    exportCoursePdf(course, i18n.language, t);
                  } else if (activeTab === 'integral' && globalCourse) {
                    exportCoursePdf(globalCourse, i18n.language, t, hasFullAccess);
                  }
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#FCEFE3] border border-[#F5DCBE] flex items-center justify-center flex-shrink-0 text-[#D47A3A] transition-all group-hover:scale-105">
                  {activeTab === 'integral' && isGlobalLocked ? (
                    <Lock className="w-5 h-5 text-amber-600" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-slate-950 transition-colors flex items-center gap-1.5">
                    <span>{activeTab === 'chapter' ? labels.generateA4Chapter : labels.generateA4Integral}</span>
                    {activeTab === 'integral' && isGlobalLocked && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">PREMIUM</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {labels.generateA4Sub}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#FDEEEA] border border-[#F8D5CE] flex items-center justify-center flex-shrink-0 text-[#DE6A52] transition-all group-hover:scale-105">
                  <Share2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                    {labels.share}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {labels.shareSub}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'integral' && isGlobalLocked) {
                    setIsOpen(false);
                    onLockedClick?.();
                    return;
                  }
                  const targetUrl = activeTab === 'integral' ? globalPdfUrl : (resolvedPdfUrl || pdfUrl);
                  handleSaveToDisk(targetUrl);
                }}
                disabled={isDownloading}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#EAF5EC] border border-[#CFE8D3] flex items-center justify-center flex-shrink-0 text-[#488B59] transition-all group-hover:scale-105">
                  {activeTab === 'integral' && isGlobalLocked ? (
                    <Lock className="w-5 h-5 text-amber-600" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-slate-950 transition-colors flex items-center gap-1.5">
                    <span>{isDownloading ? "..." : labels.saveToDevice}</span>
                    {activeTab === 'integral' && isGlobalLocked && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">PREMIUM</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {activeTab === 'chapter' ? labels.saveToDeviceSubChapter : labels.saveToDeviceSubIntegral}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#F0EEF8] border border-[#DDD8EF] flex items-center justify-center flex-shrink-0 text-[#63589F] transition-all group-hover:scale-105">
                  {activeTab === 'integral' && isGlobalLocked ? (
                    <Lock className="w-5 h-5 text-amber-600" />
                  ) : (
                    <Printer className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-slate-950 transition-colors flex items-center gap-1.5">
                    <span>{labels.print}</span>
                    {activeTab === 'integral' && isGlobalLocked && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">PREMIUM</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
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
