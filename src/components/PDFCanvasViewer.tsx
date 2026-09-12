import React, { useEffect, useState, useRef } from "react";
import { Loader2, X, Download, Share2, ZoomIn, ZoomOut, Lock, Sparkles, Layers, ExternalLink } from "lucide-react";
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

  const [viewMode, setViewMode] = useState<"native" | "hd-canvas">("native");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [zoomScale, setZoomScale] = useState<number>(1.0);

  useEffect(() => {
    if (isLocked || viewMode !== "hd-canvas" || !encodedUrl) {
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
            console.warn("Local worker load failed, falling back to CDN worker with matching version:", importErr);
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

        // Render all pages sequentially with high quality
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          if (!active) return;

          const containerWidth =
            containerRef.current?.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 800);
          const viewport = page.getViewport({ scale: 1.0 });

          const baseScale = Math.min((containerWidth - 32) / viewport.width, 2.0) * zoomScale;
          const devicePixelRatio = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
          const scaleMultiplier = Math.max(devicePixelRatio, 2.0);

          const renderViewport = page.getViewport({ scale: baseScale * scaleMultiplier });
          const displayViewport = page.getViewport({ scale: baseScale });

          const pageWrapper = document.createElement("div");
          pageWrapper.style.position = "relative";
          pageWrapper.style.margin = "0 auto 24px auto";
          pageWrapper.style.width = "100%";
          pageWrapper.style.maxWidth = `${displayViewport.width}px`;

          const canvas = document.createElement("canvas");
          canvas.style.display = "block";
          canvas.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
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
        console.warn("Canvas HD rendering failed, graceful fallback to Native Vector:", err);
        if (active) {
          setViewMode("native");
          setLoading(false);
        }
      }
    };

    renderPDF();

    return () => {
      active = false;
    };
  }, [encodedUrl, zoomScale, isLocked, viewMode]);

  return (
    <div className="w-full flex-1 flex flex-col h-full bg-[#F5ECE0] text-slate-800 overflow-hidden relative">
      {/* TDT PLAYER HEADER BAR FOR PDF — LIGHT THEME */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-2.5 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E2D8CC] z-20 shrink-0 shadow-2xs gap-2">
        {/* Left: Close Button & Mode Switcher */}
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF6ED] text-slate-800 transition-all text-xs font-bold shadow-xs border border-[#E2D8CC] active:scale-98 cursor-pointer shrink-0"
              title="Fermer le PDF"
            >
              <X className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Fermer</span>
            </button>
          )}

          {/* Mode Switcher */}
          {!isLocked && (
            <div className="flex items-center bg-[#EFEBE3] p-0.5 rounded-xl border border-[#E2D8CC]">
              <button
                type="button"
                onClick={() => setViewMode("native")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  viewMode === "native"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Affichage Vectoriel Natif (Ultra-net, zoom & recherche intégrés)"
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: viewMode === "native" ? accentColor : undefined }} />
                <span className="hidden sm:inline">Vectoriel HD</span>
                <span className="sm:hidden">HD</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("hd-canvas")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  viewMode === "hd-canvas"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Pages Défilantes Haute Résolution"
              >
                <Layers className="w-3.5 h-3.5" style={{ color: viewMode === "hd-canvas" ? accentColor : undefined }} />
                <span className="hidden sm:inline">Pages</span>
                <span className="sm:hidden">Pages</span>
              </button>
            </div>
          )}
        </div>

        {/* Center: Title & Page Count */}
        <div className="flex flex-col items-center max-w-[40%] sm:max-w-[50%] text-center">
          <span className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-full font-bebas tracking-wide flex items-center gap-1.5">
            {isLocked && <Lock className="w-3.5 h-3.5 text-amber-600 inline shrink-0" />}
            <span>{title}</span>
          </span>
          <span className="text-[10px] text-slate-500 font-medium truncate max-w-full">
            {isLocked
              ? "Recueil Intégral • Réservé aux membres"
              : viewMode === "hd-canvas" && totalPages > 0
              ? `${totalPages} page${totalPages > 1 ? "s" : ""} • Format A4`
              : "Support pédagogique A4"}
          </span>
        </div>

        {/* Right: Actions & Share */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom controls for canvas mode */}
          {!isLocked && viewMode === "hd-canvas" && (
            <div className="hidden lg:flex items-center gap-1 bg-white rounded-xl p-0.5 border border-[#E2D8CC] shadow-xs">
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

          <a
            href={encodedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF6ED] text-slate-700 text-xs font-bold border border-[#E2D8CC] shadow-xs cursor-pointer"
            title="Ouvrir dans un nouvel onglet"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Plein Écran</span>
          </a>

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
      <div className="w-full flex-1 overflow-hidden flex flex-col items-center bg-[#ECE5D8] relative">
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
        ) : viewMode === "native" ? (
          /* NATIVE VECTOR HD MODE (Instant, crisp vector, built-in zoom & search) */
          <div className="w-full h-full flex flex-col items-center p-1 sm:p-3 md:p-4">
            <iframe
              src={`${encodedUrl}#view=FitH&toolbar=1`}
              className="w-full h-full rounded-xl sm:rounded-2xl border border-[#E2D8CC] shadow-md bg-white"
              title={title}
            />
          </div>
        ) : (
          /* HD CANVAS MODE (Flowing pages) */
          <div className="w-full flex-1 overflow-y-auto p-3 sm:p-6 flex flex-col items-center scroll-smooth">
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 text-slate-500">
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
