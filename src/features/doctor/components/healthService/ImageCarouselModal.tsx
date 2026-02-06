"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import useClickOutside from "@/lib/hooks/useClickOutside";

interface ImageCarouselModalProps {
  images: string[];
  open: boolean;
  onClose: () => void;
  startIndex?: number;
}

const TRANSITION: Transition = {
  type: "spring",
  bounce: 0.1,
  duration: 0.4,
};

export const ImageCarouselModal = ({
  images,
  open,
  onClose,
  startIndex = 0,
}: ImageCarouselModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const modalRef = useRef<HTMLDivElement>(null);

  // Use the click outside hook like in MorphingPopover
  useClickOutside(modalRef as React.RefObject<HTMLElement>, onClose);

  useEffect(() => {
    if (open) {
      setCurrentIndex(startIndex);
    }
  }, [open, startIndex]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, goNext, goPrev]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={TRANSITION}
          role="dialog"
          aria-modal="true"
        >
          {/* Improved Backdrop with animation */}
          <motion.div
            className="absolute inset-0 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITION}
          />

          {/* Modal Content Container */}
          <motion.div
            ref={modalRef}
            className="relative z-10 w-full h-full flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={TRANSITION}
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Counter */}
            <motion.div
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-white text-sm font-body font-medium">
                {currentIndex + 1} / {images.length}
              </span>
            </motion.div>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <motion.button
                  onClick={goPrev}
                  className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </motion.button>
                <motion.button
                  onClick={goNext}
                  className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </motion.button>
              </>
            )}

            {/* Main image */}
            <motion.div
              className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={TRANSITION}
            >
              <img
                src={images[currentIndex]}
                alt={`Imagen ${currentIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm max-w-[90vw] overflow-x-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all duration-200 ${
                      i === currentIndex
                        ? "ring-2 ring-white scale-110 opacity-100"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
