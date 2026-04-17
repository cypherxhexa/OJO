"use client";

import { useState } from "react";
import { saveSettings } from "@/app/actions/adminSettings";
import { useRouter } from "next/navigation";

export default function SettingsForm({
  initialHeaderCode,
  initialInterstitialAdCode,
  initialSiteName,
  initialSiteTagline,
}: {
  initialHeaderCode: string;
  initialInterstitialAdCode: string;
  initialSiteName: string;
  initialSiteTagline: string;
}) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setIsLoading(true);
    setError("");
    setSuccess("");
    const res = await saveSettings(formData);
    if (res.success) {
      setSuccess("Settings saved successfully.");
      router.refresh();
    } else {
      setError(res.error || "Failed");
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} method="POST" className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 font-sans flex flex-col gap-6">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 p-3 rounded">{success}</div>}

      {/* Branding Section */}
      <div className="border-b border-stone-100 pb-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Branding</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              name="siteName"
              defaultValue={initialSiteName}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
              placeholder="Job Opp Jarrar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Tagline
            </label>
            <input
              type="text"
              name="siteTagline"
              defaultValue={initialSiteTagline}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
              placeholder="Curated opportunities for global professionals."
            />
          </div>
        </div>
      </div>

      {/* Ad Codes Section */}
      <div>
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Ad Codes</h2>
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Global Header Code (e.g., Google Analytics, AdSense auto-ads)
            </label>
            <textarea 
              name="headerCode" 
              defaultValue={initialHeaderCode} 
              rows={6}
              placeholder="<script>...</script>" 
              className="w-full border border-stone-300 rounded px-3 py-2 font-mono text-sm leading-relaxed" 
            />
            <p className="mt-1 text-xs text-stone-500">This code will be injected in the &lt;head&gt; of all site pages.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Interstitial Ad Code (Injected between job listings)
            </label>
            <textarea 
              name="interstitialAdCode" 
              defaultValue={initialInterstitialAdCode} 
              rows={6}
              placeholder="<ins class='adsbygoogle' ...></ins>" 
              className="w-full border border-stone-300 rounded px-3 py-2 font-mono text-sm leading-relaxed" 
            />
            <p className="mt-1 text-xs text-stone-500">This ad will be displayed between jobs in the main job list.</p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-stone-100 flex justify-end">
        <button 
          type="submit" 
          disabled={isLoading} 
          className="px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors"
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
