"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface JobImageGalleryProps {
  images: string[];
  /**
   * 'default'  – original block grid (used nowhere currently, kept for compat)
   * 'sidebar'  – stacked 2-col grid for desktop sidebar panel
   * 'strip'    – horizontal scroll row for mobile
   */
  variant?: "default" | "sidebar" | "strip";
}

export function JobImageGallery({ images, variant = "default" }: JobImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goNext = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null)),
    [images.length]
  );
  const goPrev = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null)),
    [images.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  if (!images || images.length === 0) return null;

  // ── SIDEBAR VARIANT ─────────────────────────────────────────────────────────
  // Compact 2-column grid. First image is full-width if odd count.
  if (variant === "sidebar") {
    return (
      <>
        <div className="grid grid-cols-2 gap-1.5">
          {images.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setLightboxIndex(idx)}
              className={`relative block overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-700 ${
                // First image full-width when there's an odd number
                idx === 0 && images.length % 2 !== 0 ? "col-span-2" : ""
              }`}
              aria-label={`View photo ${idx + 1}`}
            >
              <div className={`relative w-full ${idx === 0 && images.length % 2 !== 0 ? "h-36" : "h-24"}`}>
                <Image
                  src={url}
                  alt={`Job photo ${idx + 1}`}
                  fill
                  className="object-cover hover:brightness-90 transition-all duration-300"
                  sizes="160px"
                  loading="lazy"
                />
                {/* Show "+X more" overlay on the last visible thumbnail if there are extras */}
                {idx === 5 && images.length > 6 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-sm font-serif font-bold">
                      +{images.length - 6}
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        {images.length > 1 && (
          <button
            onClick={() => setLightboxIndex(0)}
            className="mt-2 w-full text-center text-xs text-stone-400 hover:text-stone-600 font-sans transition-colors"
          >
            View all {images.length} photos →
          </button>
        )}
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNext={goNext}
          onPrev={goPrev}
        />
      </>
    );
  }

  // ── STRIP VARIANT ───────────────────────────────────────────────────────────
  // Horizontal scrolling thumbnail row for mobile placement
  if (variant === "strip") {
    return (
      <>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scroll-smooth">
          {images.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setLightboxIndex(idx)}
              className="relative flex-shrink-0 w-28 h-20 overflow-hidden snap-start focus:outline-none focus:ring-2 focus:ring-amber-700"
              aria-label={`View photo ${idx + 1}`}
            >
              <Image
                src={url}
                alt={`Job photo ${idx + 1}`}
                fill
                className="object-cover hover:brightness-90 transition-all duration-300"
                sizes="112px"
                loading="lazy"
              />
            </button>
          ))}
        </div>
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNext={goNext}
          onPrev={goPrev}
        />
      </>
    );
  }

  // ── DEFAULT VARIANT (block grid) ────────────────────────────────────────────
  const displayImages = images.slice(0, 4);
  const extraCount = images.length - 4;
  const isSingle = images.length === 1;

  return (
    <>
      <div className="mb-8">
        {isSingle ? (
          <button
            onClick={() => setLightboxIndex(0)}
            className="block w-full relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-700"
            aria-label="View image"
          >
            <div className="relative h-80 md:h-96 w-full">
              <Image
                src={images[0]}
                alt="Job location photo"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 800px"
                loading="lazy"
              />
            </div>
          </button>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {displayImages.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="relative block overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-700"
                aria-label={`View image ${idx + 1}`}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={url}
                    alt={`Job photo ${idx + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 400px"
                    loading="lazy"
                  />
                  {idx === 3 && extraCount > 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-2xl font-serif font-bold">
                        +{extraCount} more
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={closeLightbox}
        onNext={goNext}
        onPrev={goPrev}
      />
    </>
  );
}

// ── Shared lightbox overlay component ─────────────────────────────────────────
function Lightbox({
  images,
  index,
  onClose,
  onNext,
  onPrev,
}: {
  images: string[];
  index: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  if (index === null) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <div
        className="relative w-full max-w-4xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white text-3xl leading-none focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>

        {/* Image */}
        <div className="relative w-full" style={{ paddingBottom: "60%" }}>
          <Image
            src={images[index]}
            alt={`Job photo ${index + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
        </div>

        {/* Counter */}
        <p className="text-center text-white/60 text-sm mt-3 font-sans">
          {index + 1} / {images.length}
        </p>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white/70 hover:text-white text-4xl leading-none p-2 focus:outline-none"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={onNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white/70 hover:text-white text-4xl leading-none p-2 focus:outline-none"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
