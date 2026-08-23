import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Share2, Download, Mail, Copy, Check, ChevronDown, FileText, Printer, ExternalLink, X } from "lucide-react";

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
}

export default function PDFShareDropdown({
  pdfUrl,
  title = "Document PDF",
  courseTitle,
  author = "Marc Damoiseaux",
  variant = "viewer-bar",
  align = "right",
  buttonClassName = "",
  accentColor = "#5A9C51",
}: PDFShareDropdownProps) {
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
    const menuHeight = 360; // Estimated max height

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

  // Resolve absolute URL
  const getFullUrl = () => {
    if (!pdfUrl) return "";
    if (pdfUrl.startsWith("http://") || pdfUrl.startsWith("https://")) {
      return pdfUrl;
    }
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      return pdfUrl.startsWith("/") ? `${origin}${pdfUrl}` : `${origin}/${pdfUrl}`;
    }
    return pdfUrl;
  };

  const getCleanFileName = () => {
    if (!pdfUrl) return `${title || "document"}.pdf`;
    const parts = pdfUrl.split("/");
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
    setIsDownloading(true);
    const fullUrl = getFullUrl();
    const fileName = getCleanFileName();

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
      // Fallback direct link
      const a = document.createElement("a");
      a.href = fullUrl;
      a.download = fileName;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    setIsDownloading(false);
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
          title="Partager ou enregistrer le document PDF"
        >
          <Share2 className="w-3.5 h-3.5" style={{ color: accentColor }} strokeWidth={2.5} />
          <span>Partager</span>
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
          title="Partager le document PDF"
        >
          <Share2 className="w-3.5 h-3.5" style={{ color: accentColor }} strokeWidth={2.5} />
          <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider">Partager</span>
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
          title="Partager le PDF"
        >
          <Share2 className="w-4 h-4" style={{ color: accentColor }} strokeWidth={2.2} />
        </button>
      )}

      {/* DROPDOWN MENU VIA PORTAL — IMMUNE TO PARENT OVERFLOW HIDDEN */}
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
                    DOCUMENT PDF
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
                  Partager
                </div>
                <div className="text-[10.5px] text-slate-500 truncate">
                  AirDrop, Messages, Réseaux
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
                  {isDownloading ? "Téléchargement..." : "Enregistrer sur l'appareil"}
                </div>
                <div className="text-[10.5px] text-slate-500 truncate">
                  Télécharger le fichier A4 (.pdf)
                </div>
              </div>
            </button>

            {/* Option 3 : Ouvrir dans un nouvel onglet */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                window.open(getFullUrl(), '_blank');
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF6ED] transition-colors text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center flex-shrink-0 text-amber-600 transition-all group-hover:scale-105">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                  Plein écran / Onglet séparé
                </div>
                <div className="text-[10.5px] text-slate-500 truncate">
                  Ouvrir dans le navigateur
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
                  Envoyer par e-mail
                </div>
                <div className="text-[10.5px] text-slate-500 truncate">
                  Lien pré-rempli dans Mail
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
                  {copied ? "Lien copié !" : "Copier le lien direct"}
                </div>
                <div className="text-[10.5px] text-slate-500 truncate">
                  {copied ? "Prêt à être collé" : "Copier l'adresse URL du document"}
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
                  Imprimer le document
                </div>
                <div className="text-[10.5px] text-slate-500 truncate">
                  Format A4 standard
                </div>
              </div>
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
