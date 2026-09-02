import React, { useEffect, useState, useRef } from "react";
import { Loader2, X, Download, Share2, ZoomIn, ZoomOut, Lock, Sparkles } from "lucide-react";
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
  const isIntegral = Boolean(
    url && (url.includes('cours_complets') || url.toLowerCase().includes('integral') || url.toLowerCase().includes('recueil'))
  );
  const isLocked = isIntegral && !hasFullAccess;

  const [loading, setLoading] = useState(!isLocked);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [zoomScale, setZoomScale] = useState<number>(1.0);

  useEffect(() => {
    if (isLocked) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    const renderPDF = async () => {
      // Dynamic import of pdfjs-dist
      try {
        let pdfjsLib: any = (window as any).pdfjsLib;

        if (!pdfjsLib) {
          try {
            pdfjsLib = await import("pdfjs-dist");
          } catch {
            // CDN fallback
            await new Promise((resolve, reject) => {
              const script = document.createElement("script");
              script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
              script.onload = () => resolve((window as any).pdfjsLib);
              script.onerror = reject;
              document.head.appendChild(script);
            });
            pdfjsLib = (window as any).pdfjsLib;
          }
        }

        if (pdfjsLib?.GlobalWorkerOptions) {
          pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }

        const loadingTask = pdfjsLib.getDocument(url);
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
        console.error("Error rendering PDF:", err);
        setError(err.message || "Impossible de charger le document PDF");
        setLoading(false);
      }
    };

    renderPDF();

    return () => {
      active = false;
    };
  }, [url, zoomScale, isLocked]);

  return (
    <div className="w-full flex-1 flex flex-col h-full bg-[#F5ECE0] text-slate-800 overflow-hidden relative">
      {/* TDT PLAYER HEADER BAR FOR PDF — LIGHT THEME */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E2D8CC] z-20 shrink-0 shadow-2xs">
        {/* Left: Close Button */}
        {onClose ? (
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF6ED] text-slate-800 transition-all text-xs font-bold shadow-xs border border-[#E2D8CC] active:scale-98 cursor-pointer"
            title="Fermer le PDF et retourner à la vidéo"
          >
            <X className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Fermer le PDF</span>
          </button>
        ) : (
          <div className="w-8" />
        )}

        {/* Center: Title & Page Count */}
        <div className="flex flex-col items-center max-w-[50%] sm:max-w-[60%] text-center">
          <span className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-full font-bebas tracking-wide flex items-center gap-1.5">
            {isLocked && <Lock className="w-3.5 h-3.5 text-amber-600 inline shrink-0" />}
            <span>{title}</span>
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            {isLocked ? "Recueil Intégral • Réservé aux membres" : loading ? "Chargement du document..." : `${totalPages} page${totalPages > 1 ? "s" : ""} • Format A4`}
          </span>
        </div>

        {/* Right: Actions & Share */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
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

      {/* PDF CANVAS BODY */}
      <div className="w-full flex-1 overflow-y-auto p-3 sm:p-6 flex flex-col items-center scroll-smooth bg-[#ECE5D8]">
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
        ) : (
          <>
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: accentColor }} />
                <span className="text-sm font-medium">Génération des pages haute définition...</span>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="bg-white border border-red-200 text-red-700 p-6 rounded-2xl max-w-md shadow-md">
                  <p className="font-bold text-sm">Erreur de chargement du PDF</p>
                  <p className="text-xs mt-2 opacity-80">{error}</p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-sm"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Télécharger le PDF directement
                  </a>
                </div>
              </div>
            )}

            <div ref={containerRef} className="w-full max-w-[850px] flex flex-col items-center"></div>

            {!loading && !error && onClose && (
              <button
                onClick={onClose}
                className="mt-6 mb-12 px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition-all border border-[#E2D8CC] hover:scale-102 active:scale-98 flex items-center gap-2 cursor-pointer shadow-md"
              >
                <X className="w-3.5 h-3.5 text-slate-500" />
                <span>Fermer le document & Retour au lecteur</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
