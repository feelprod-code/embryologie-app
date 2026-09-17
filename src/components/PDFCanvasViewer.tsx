import React, { useEffect, useState, useRef } from "react";
import { Loader2, X, ZoomIn, ZoomOut, Lock, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import PDFShareDropdown from "./PDFShareDropdown";

interface PDFCanvasViewerProps {
  url: string;
  title?: string;
  courseTitle?: string;
  author?: string;
  accentColor?: string;
  onClose?: () => void;
  hasFullAccess?: boolean;
  onLockedClick?: () => void;
}

export default function PDFCanvasViewer({
  url,
  title = "Document PDF",
  courseTitle,
  author = "Marc Damoiseaux",
  accentColor = "#5A9C51",
  onClose,
  hasFullAccess = false,
  onLockedClick,
}: PDFCanvasViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const encodedUrl = url ? encodeURI(url) : "";
  const isIntegral = Boolean(
    url && (url.includes('cours_complets') || url.toLowerCase().includes('integral') || url.toLowerCase().includes('recueil'))
  );
  const isLocked = isIntegral && !hasFullAccess;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [reloadKey, setReloadKey] = useState<number>(0);

  useEffect(() => {
    if (isLocked || !encodedUrl) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    const renderPDF = async () => {
      try {
        let pdfjsLib: any = (window as any).pdfjsLib;

        if (!pdfjsLib) {
          try {
            const pdfjsModule = await import("pdfjs-dist");
            pdfjsLib = pdfjsModule;
            const workerModule = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default || workerModule;
          } catch (importErr) {
            console.warn("Local worker load failed, falling back to CDN worker:", importErr);
            const pdfjsModule = await import("pdfjs-dist");
            pdfjsLib = pdfjsModule;
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || "5.5.207"}/pdf.worker.min.js`;
          }
        }

        const loadingTask = pdfjsLib.getDocument({
          url: encodedUrl,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true,
        });
        const pdf = await loadingTask.promise;

        if (!active) return;
        setTotalPages(pdf.numPages);
        setLoading(false);

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        // Render all pages sequentially with high definition
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (!active) return;
          const page = await pdf.getPage(pageNum);
          if (!active) return;

          const containerWidth =
            containerRef.current?.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 440);
          const padding = containerWidth <= 480 ? 16 : 32;
          const availableWidth = Math.max(containerWidth - padding, 280);
          const targetWidth = Math.min(availableWidth, 820) * zoomScale;

          const viewport = page.getViewport({ scale: 1.0 });
          const baseScale = targetWidth / viewport.width;

          // Retina DPR multiplier (capped at 2.5 for mobile memory safety)
          const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 2, 2.5) : 2;
          const renderViewport = page.getViewport({ scale: baseScale * dpr });
          const displayWidth = Math.round(viewport.width * baseScale);

          const pageWrapper = document.createElement("div");
          pageWrapper.style.position = "relative";
          pageWrapper.style.margin = "0 auto 16px auto";
          pageWrapper.style.width = `${displayWidth}px`;
          pageWrapper.style.maxWidth = "100%";

          const canvas = document.createElement("canvas");
          canvas.style.display = "block";
          canvas.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.08)";
          canvas.style.borderRadius = "8px";
          canvas.style.border = "1px solid #E2D8CC";
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.backgroundColor = "#FFFFFF";

          const context = canvas.getContext("2d");
          canvas.width = renderViewport.width;
          canvas.height = renderViewport.height;

          const renderContext = {
            canvasContext: context,
            viewport: renderViewport,
          };

          pageWrapper.appendChild(canvas);
          containerRef.current?.appendChild(pageWrapper);
          await page.render(renderContext).promise;
        }
      } catch (err: any) {
        console.error("PDF rendering error:", err);
        if (active) {
          setError(err?.message || "Impossible de charger le document PDF.");
          setLoading(false);
        }
      }
    };

    renderPDF();

    return () => {
      active = false;
    };
  }, [encodedUrl, zoomScale, isLocked, reloadKey]);

  return (
    <div className="w-full max-w-full flex-1 flex flex-col h-full bg-[#F5ECE0] text-slate-800 overflow-x-hidden overflow-y-hidden relative">
      {/* TDT PLAYER HEADER BAR FOR PDF — LIGHT THEME */}
      <div className="flex items-center justify-between px-2.5 sm:px-4 py-2 sm:py-2.5 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E2D8CC] z-20 shrink-0 shadow-2xs gap-2 w-full max-w-full">
        {/* Left: Close Button */}
        <div className="flex items-center gap-2 shrink-0">
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF6ED] text-slate-800 transition-all text-xs font-bold shadow-xs border border-[#E2D8CC] active:scale-95 cursor-pointer shrink-0"
              title="Fermer le PDF"
            >
              <X className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Fermer</span>
            </button>
          )}
        </div>

        {/* Center: Title & Page Count */}
        <div className="flex flex-col items-center justify-center flex-1 min-w-0 px-1 text-center">
          <span className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-full font-bebas tracking-wide flex items-center gap-1.5">
            {isLocked && <Lock className="w-3.5 h-3.5 text-amber-600 inline shrink-0" />}
            <span className="truncate">{title}</span>
          </span>
          <span className="text-[10px] text-slate-500 font-medium truncate max-w-full">
            {isLocked
              ? "Recueil Intégral • Réservé aux membres"
              : totalPages > 0
              ? `${totalPages} page${totalPages > 1 ? "s" : ""} • Format A4`
              : loading
              ? "Chargement du document..."
              : "Support pédagogique A4"}
          </span>
        </div>

        {/* Right: Zoom Controls (Tablet/Desktop) & PDFShareDropdown Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom controls for canvas mode (hidden on small mobile) */}
          {!isLocked && (
            <div className="hidden md:flex items-center gap-1 bg-white rounded-xl p-0.5 border border-[#E2D8CC] shadow-xs">
              <button
                onClick={() => setZoomScale((prev) => Math.max(0.7, prev - 0.15))}
                className="p-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 cursor-pointer"
                title="Dézoomer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono px-1 text-slate-600 font-bold">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((prev) => Math.min(1.6, prev + 0.15))}
                className="p-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 cursor-pointer"
                title="Zoomer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* PDFShareDropdown (Includes "Partager", "Ouvrir dans un onglet séparé", "Enregistrer", etc.) */}
          <PDFShareDropdown
            pdfUrl={url}
            title={title}
            courseTitle={courseTitle}
            author={author}
            variant="viewer-bar"
            accentColor={accentColor}
            hasFullAccess={hasFullAccess}
            onLockedClick={onLockedClick}
          />
        </div>
      </div>

      {/* PDF CONTENT BODY */}
      <div className="w-full flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4 md:p-6 flex flex-col items-center scroll-smooth overscroll-contain bg-[#ECE5D8] relative">
        {isLocked ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-lg mx-auto my-auto animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-5 shadow-xs border border-amber-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bebas tracking-wide text-slate-800 mb-2 uppercase">
              Recueil Intégral — Version Complète
            </h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed font-sans font-medium">
              Ce manuel de cours intégral réunissant l'ensemble des leçons, synthèses et planches cliniques haute définition est réservé aux membres de la formation.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onLockedClick}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm tracking-wide shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Débloquer l'accès complet</span>
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-[#E2D8CC] transition-all active:scale-95 cursor-pointer"
                >
                  Retour
                </button>
              )}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto my-auto animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Erreur de chargement</h3>
            <p className="text-xs text-slate-500 mb-4">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Réessayer</span>
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: accentColor }} />
                <span className="text-sm font-medium">Génération des pages haute définition...</span>
              </div>
            )}

            <div ref={containerRef} className="w-full max-w-[850px] flex flex-col items-center"></div>

            {!loading && onClose && (
              <button
                onClick={onClose}
                className="mt-6 mb-12 px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition-all border border-[#E2D8CC] hover:scale-102 active:scale-98 flex items-center gap-2 cursor-pointer shadow-md"
              >
                <X className="w-3.5 h-3.5 text-slate-500" />
                <span>Fermer le document & Retour</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
