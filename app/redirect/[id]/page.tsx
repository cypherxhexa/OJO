"use client";

// ─── ADSENSE PLACEMENT PLAN — REDIRECT / INTERSTITIAL PAGE ────────────────────
// Slot 1 (of 1 — MAXIMUM for this page): Rectangle (336×280) centered inside
//   the content card. This is a captive audience (5-second wait) making it the
//   highest-earning slot on the site.
// Policy compliance:
//   • Ad is inside the content card, NOT fullscreen, NOT blocking the page.
//   • User can always see the countdown AND skip button without scrolling.
//   • "Advertisement" label appears above the ad unit (AdSlot component adds it).
//   • Skip button is enabled after 2s extra buffer (countdown reaches 0 at 5s).
//   • 5-second timer is well within AdSense interstitial policy limits.
//   • Only 1 ad on this page — 2 would look spammy and risk policy violation.
// ──────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { isValidHttpUrl } from "@/lib/job-shared";

export default function RedirectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [company, setCompany] = useState<string>("the employer");
  const [error, setError] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes] = await Promise.all([
          fetch(`/api/jobs/${params.id}`),
        ]);

        if (!jobRes.ok) { setError(true); return; }

        const jobData = await jobRes.json();
        if (!jobData.isActive || !isValidHttpUrl(jobData.externalUrl)) {
          setError(true);
          return;
        }

        setTargetUrl(jobData.externalUrl);
        setCompany(jobData.company);

        // Log the click
        await fetch(`/api/jobs/${params.id}/click`, { method: "POST" });
      } catch (err) {
        console.error("Redirect error:", err);
        setError(true);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    } else if (countdown === 0 && targetUrl) {
      window.location.href = targetUrl;
    }
  }, [countdown, targetUrl]);

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-stone-900 mb-2">Job Not Found</h1>
          <p className="text-stone-500 font-sans mb-6">
            This job listing may have been removed or the link is invalid.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-stone-900 text-white px-6 py-2 rounded font-sans"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 lg:py-24 text-center">
      {/* Heading — always visible above the ad */}
      <h1 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-3">
        You are being redirected to{" "}
        <span className="font-semibold">{company}</span>
      </h1>

      <p className="text-stone-500 font-sans mb-10 text-base">
        We are securely routing you to the official portal in{" "}
        <span className="font-semibold text-stone-900">{countdown} second{countdown !== 1 ? "s" : ""}</span>.
      </p>

      {/* ── AD SLOT 1/1: Rectangle (336×280) — PRIMARY REVENUE SLOT ─────────────
          Policy: inside the content card, centered, NOT fullscreen, NOT blocking.
          User can always see countdown and skip button without scrolling.
          "Advertisement" label is rendered inside <AdSlot> automatically.
          This is the only ad on this page — adding a second would violate policy.
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="mb-10 flex justify-center">
        <AdSlot
          slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_REDIRECT}
          format="rectangle"
          className="max-w-[336px]"
        />
      </div>

      {/* Skip button — always visible below the ad, no scrolling required */}
      <button
        disabled={countdown > 2}
        onClick={() => { 
          if (targetUrl) {
            if (timerRef.current) clearTimeout(timerRef.current);
            window.location.href = targetUrl; 
          }
        }}
        className={`px-8 py-3 rounded font-sans font-medium transition-all ${
          countdown > 2
            ? "bg-stone-200 text-stone-400 cursor-not-allowed"
            : "bg-stone-900 text-white hover:bg-stone-800"
        }`}
      >
        {countdown > 2
          ? `Skip and Continue (${countdown - 2})`
          : "Skip and Continue →"}
      </button>

      <p className="mt-6 text-xs text-stone-400 font-sans">
        You will be automatically redirected when the timer ends.
      </p>
    </div>
  );
}
