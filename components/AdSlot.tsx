"use client";

// ─── GOOGLE ADSENSE PLACEMENT RULES (enforced in code) ───────────────────────
// • Max 3 display ad units per page
// • Never place ads where users might accidentally click (next to buttons, below nav)
// • Never place ads in popups or overlays blocking all content
// • Never place ads on empty/error/admin pages
// • Interstitial countdown pages (5s) ARE allowed — user must always see skip button
// • In-article ads must be between paragraphs, never mid-sentence
// • Mobile: ads must not be stacked (2+ visible simultaneously on screen)
// • "Advertisement" label appears above every slot (AdSense also adds its own)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";

export type AdFormat = "leaderboard" | "rectangle" | "mobile-banner" | "infeed";

interface AdSlotProps {
  /** AdSense data-ad-slot ID from env var */
  slotId?: string;
  /** Visual format determines dimensions and placeholder size */
  format: AdFormat;
  className?: string;
}

const FORMAT_DIMENSIONS: Record<AdFormat, { label: string; minH: string; maxW: string }> = {
  leaderboard:    { label: "728×90 / 320×50",  minH: "min-h-[90px]",  maxW: "max-w-full" },
  rectangle:      { label: "336×280",           minH: "min-h-[280px]", maxW: "max-w-[336px]" },
  "mobile-banner":{ label: "320×50",            minH: "min-h-[50px]",  maxW: "max-w-[320px]" },
  infeed:         { label: "In-Feed Native",    minH: "min-h-[120px]", maxW: "max-w-full" },
};

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export function AdSlot({ slotId, format, className = "" }: AdSlotProps) {
  useEffect(() => {
    // Only push ads if client ID and slot ID are both configured
    if (!CLIENT || !slotId) return;

    try {
      // AdSense pushes an empty object to the adsbygoogle array to init each slot
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error("[AdSlot] adsbygoogle push error:", err);
    }
  }, [slotId]);

  const { label, minH, maxW } = FORMAT_DIMENSIONS[format];

  // ── Placeholder mode (no client ID or no slot ID) ──────────────────────────
  // Shows a dashed placeholder so the client can see ad positions during
  // testing, before AdSense account is approved and IDs are entered.
  if (!CLIENT || !slotId) {
    return (
      <div className={`w-full ${className}`}>
        {/* "Advertisement" label — shown above every real slot too */}
        <p className="text-[10px] text-stone-400 text-center uppercase tracking-widest mb-1 font-sans select-none">
          Advertisement
        </p>
        <div
          className={`${minH} ${maxW} mx-auto border border-dashed border-stone-300 bg-stone-50 
            flex items-center justify-center text-stone-300 font-sans text-[11px] uppercase tracking-widest`}
        >
          Ad Slot — {label}
        </div>
      </div>
    );
  }

  // ── Live AdSense mode ───────────────────────────────────────────────────────
  return (
    <div className={`w-full ${className}`}>
      {/* "Advertisement" label — good-faith compliance label above every slot */}
      <p className="text-[10px] text-stone-400 text-center uppercase tracking-widest mb-1 font-sans select-none">
        Advertisement
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT}
        data-ad-slot={slotId}
        data-ad-format={format === "infeed" ? "fluid" : "auto"}
        data-full-width-responsive="true"
      />
    </div>
  );
}

