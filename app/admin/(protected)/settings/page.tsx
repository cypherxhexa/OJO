import { prisma } from "@/lib/db";
import SettingsForm from "@/components/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [headerCodeSettings, interstitialAdSettings, siteNameSettings, siteTaglineSettings] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { key: "headerCode" } }),
    prisma.siteSettings.findUnique({ where: { key: "interstitialAdCode" } }),
    prisma.siteSettings.findUnique({ where: { key: "siteName" } }),
    prisma.siteSettings.findUnique({ where: { key: "siteTagline" } }),
  ]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2 text-stone-900">Site Settings</h1>
        <p className="text-stone-500 font-sans">Manage branding, global scripts, and ad codes.</p>
      </div>

      <SettingsForm 
        initialHeaderCode={headerCodeSettings?.value || ""} 
        initialInterstitialAdCode={interstitialAdSettings?.value || ""} 
        initialSiteName={siteNameSettings?.value || "Job Opp Jarrar"}
        initialSiteTagline={siteTaglineSettings?.value || "Curated opportunities for global professionals."}
      />
    </div>
  );
}
