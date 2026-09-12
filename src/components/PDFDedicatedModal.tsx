import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import PDFCanvasViewer from "./PDFCanvasViewer";

interface PDFDedicatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  courseTitle?: string;
  author?: string;
  accentColor?: string;
  hasFullAccess?: boolean;
  onLockedClick?: () => void;
}

export default function PDFDedicatedModal({
  isOpen,
  onClose,
  url,
  title,
  courseTitle,
  author = "Marc Damoiseaux",
  accentColor = "#5A9C51",
  hasFullAccess = true,
  onLockedClick,
}: PDFDedicatedModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Lock body scroll while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl h-[94vh] max-h-[960px] bg-[#FAF8F5] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E2D8CC] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <PDFCanvasViewer
          url={url}
          title={title}
          courseTitle={courseTitle || title}
          author={author}
          accentColor={accentColor}
          hasFullAccess={hasFullAccess}
          onLockedClick={onLockedClick}
          onClose={onClose}
        />
      </div>
    </div>,
    document.body
  );
}
