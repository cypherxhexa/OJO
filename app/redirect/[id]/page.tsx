"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";

export default function RedirectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [company, setCompany] = useState<string>("the employer");
  const [adCode, setAdCode] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job data and ad code in parallel
        const [jobRes, adsRes] = await Promise.all([
          fetch(`/api/jobs/${params.id}`),
          fetch("/api/settings/ads"),
        ]);

        if (!jobRes.ok) {
          setError(true);
          return;
        }

        const jobData = await jobRes.json();
        setTargetUrl(jobData.externalUrl);
        setCompany(jobData.company);

        if (adsRes.ok) {
          const adsData = await adsRes.json();
          setAdCode(adsData.interstitialAdCode || "");
        }

        // Log the click
        await fetch(`/api/jobs/${params.id}/click`, { method: "POST" });
      } catch (err) {
        console.error("Failed to route", err);
        setError(true);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && targetUrl) {
      window.location.href = targetUrl;
    }
  }, [countdown, targetUrl]);

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-stone-900 mb-2">Job Not Found</h1>
          <p className="text-stone-500 font-sans mb-6">This job listing may have been removed or the link is invalid.</p>
          <button onClick={() => router.push("/")} className="bg-stone-900 text-white px-6 py-2 rounded">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24 text-center">
      <h1 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-4">
        You are being redirected to <span className="font-semibold">{company}</span>
      </h1>
      
      <p className="text-stone-500 font-sans mb-12">
        We are securely routing you to the official portal in{" "}
        <span className="font-semibold text-stone-900">{countdown} seconds</span>.
      </p>

      {/* Primary Ad Revenue Slot */}
      <div className="mb-12">
        <AdSlot adCode={adCode || null} format="banner" className="h-[250px] shadow-sm max-w-2xl mx-auto" />
      </div>

      <button
        disabled={countdown > 2}
        onClick={() => {
          if (targetUrl) window.location.href = targetUrl;
        }}
        className={`px-8 py-3 rounded font-sans font-medium transition-all ${
          countdown > 2
            ? "bg-stone-200 text-stone-400 cursor-not-allowed"
            : "bg-stone-900 text-white hover:bg-stone-800"
        }`}
      >
        {countdown > 2 ? `Skip and Continue (${countdown - 2})` : "Skip and Continue"}
      </button>
    </div>
  );
}
