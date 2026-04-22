"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface JobImageGalleryProps {
  images: string[];
  /**
   * compact  – desktop right-sidebar card, max-height 280px, rounded-xl
   * mobile   – single image at 200px with "View all X photos" text link
   * default  – original block layout (not used on job detail page currently)
   */
  variant?: "default" | "compact" | "mobile";
}

export function JobImageGallery({
  images,
  variant = "default",
}: JobImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goNext = useCallback(
    () =>
      setLightboxIndex((i) =>
        i !== null ? (i + 1) % images.length : null
      ),
    [images.length]
  );
  const goPrev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i !== null ? (i - 1 + images.length) % images.length : null
      ),
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

  // ── COMPACT VARIANT — desktop right-column sidebar card ──────────────────
  // Max height 280px. 1 image → full cover. 2 → side by side. 3-4 → 2×2 grid.
  // 5+ → 2×2 grid with "+N" overlay on the 4th cell.
  if (variant === "compact") {
    const show = images.slice(0, 4);
    const extra = images.length - 4;
    const isSingle = images.length === 1;
    const isTwo = images.length === 2;

    return (
      <>
        {isSingle ? (
          <button
            onClick={() => setLightboxIndex(0)}
            className="block w-full relative focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2"
            aria-label="View photo"
          >
            <div className="relative h-[280px] w-full">
              <Image
                src={images[0]}
                alt="Job photo"
                fill
                className="object-cover hover:brightness-90 transition-all duration-300"
                sizes="340px"
                loading="lazy"
              />
            </div>
          </button>
        ) : isTwo ? (
          <div className="grid grid-cols-2 h-[280px]">
            {images.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className={`relative block overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-700 ${
                  idx === 0 ? "border-r border-white/20" : ""
                }`}
                aria-label={`View photo ${idx + 1}`}
              >
                <Image
                  src={url}
                  alt={`Job photo ${idx + 1}`}
                  fill
                  className="object-cover hover:brightness-90 transition-all duration-300"
                  sizes="170px"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        ) : (
          // 3-5 images: 2×2 grid, max 4 cells
          <div className="grid grid-cols-2 grid-rows-2 h-[280px]">
            {show.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="relative block overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-700 border-[1px] border-white/20"
                aria-label={`View photo ${idx + 1}`}
              >
                <Image
                  src={url}
                  alt={`Job photo ${idx + 1}`}
                  fill
                  className="object-cover hover:brightness-90 transition-all duration-300"
                  sizes="170px"
                  loading="lazy"
                />
                {/* "+N more" overlay on the 4th cell */}
                {idx === 3 && extra > 0 && (
                  <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                    <span className="text-white text-xl font-serif font-bold">
                      +{extra}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* "View all" hint when there are multiple images */}
        {images.length > 1 && (
          <button
            onClick={() => setLightboxIndex(0)}
            className="w-full text-center text-xs text-stone-400 hover:text-stone-600 font-sans py-2 bg-stone-50 transition-colors"
          >
            View all {images.length} photos
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

  // ── MOBILE VARIANT — single hero image at 200px with "View all" link ─────
  if (variant === "mobile") {
    return (
      <>
        <button
          onClick={() => setLightboxIndex(0)}
          className="block w-full relative overflow-hidden rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-700"
          aria-label="View photo"
        >
          <div className="relative h-[200px] w-full">
            <Image
              src={images[0]}
              alt="Job photo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              loading="lazy"
            />
          </div>
        </button>

        {images.length > 1 && (
          <button
            onClick={() => setLightboxIndex(0)}
            className="mt-2 text-xs text-amber-700 hover:underline font-sans font-medium"
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

  // ── DEFAULT VARIANT ───────────────────────────────────────────────────────
  const displayImages = images.slice(0, 5);
  const extraCount = images.length - 5;
  const isSingle = images.length === 1;
  const isTwo = images.length === 2;

  return (
    <>
      <div className="mb-6">
        {isSingle ? (
          <button
            onClick={() => setLightboxIndex(0)}
            className="block w-full relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-amber-700"
            aria-label="View photo"
          >
            <div className="relative h-72 md:h-96 w-full">
              <Image
                src={images[0]}
                alt="Job workplace photo"
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 800px"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 font-sans opacity-0 group-hover:opacity-100 transition-opacity">
                View photo →
              </span>
            </div>
          </button>
        ) : isTwo ? (
          <div className="grid grid-cols-2 gap-1.5">
            {images.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="relative block overflow-hidden group focus:outline-none focus:ring-2 focus:ring-amber-700"
                aria-label={`View photo ${idx + 1}`}
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={url}
                    alt={`Job photo ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 400px"
                    loading="lazy"
                  />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setLightboxIndex(0)}
              className="relative block w-full overflow-hidden group focus:outline-none focus:ring-2 focus:ring-amber-700"
              aria-label="View main photo"
            >
              <div className="relative h-72 md:h-80 w-full">
                <Image
                  src={displayImages[0]}
                  alt="Job main photo"
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>
            </button>
            {displayImages.length > 1 && (
              <div
                className={`grid gap-1.5 ${
                  displayImages.length === 3 ? "grid-cols-2" : "grid-cols-4"
                }`}
              >
                {displayImages.slice(1).map((url, idx) => {
                  const realIdx = idx + 1;
                  const isLast = realIdx === displayImages.length - 1;
                  return (
                    <button
                      key={realIdx}
                      onClick={() => setLightboxIndex(realIdx)}
                      className="relative block overflow-hidden group focus:outline-none focus:ring-2 focus:ring-amber-700"
                      aria-label={`View photo ${realIdx + 1}`}
                    >
                      <div className="relative h-32 w-full">
                        <Image
                          src={url}
                          alt={`Job photo ${realIdx + 1}`}
                          fill
                          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          sizes="(max-width: 768px) 25vw, 200px"
                          loading="lazy"
                        />
                        {isLast && extraCount > 0 && (
                          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                            <span className="text-white text-lg font-serif font-bold">
                              +{extraCount + 1}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {images.length > 1 && (
          <button
            onClick={() => setLightboxIndex(0)}
            className="mt-2 text-xs text-stone-400 hover:text-stone-600 font-sans transition-colors"
          >
            {images.length} photos — click to view full screen
          </button>
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

// ── Shared lightbox overlay ───────────────────────────────────────────────────
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
          aria-label="Close lightbox"
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
        <p className="text-center text-white/50 text-xs mt-3 font-sans tracking-widest">
          {index + 1} / {images.length}
        </p>

        {/* Navigation arrows */}
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
