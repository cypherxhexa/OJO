import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobGrid } from "@/components/JobGrid";
import { AdSlot } from "@/components/AdSlot";
import { Suspense } from "react";
import { prisma } from "@/lib/db";

export default async function Home() {
  let interstitialAdCode = "";
  let homepageBannerAdCode = "";
  try {
    const [interstitialSetting, homepageSetting] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { key: "interstitialAdCode" } }),
      prisma.siteSettings.findUnique({ where: { key: "homepageBannerAdCode" } }),
    ]);
    if (interstitialSetting?.value) interstitialAdCode = interstitialSetting.value;
    if (homepageSetting?.value) homepageBannerAdCode = homepageSetting.value;
  } catch {}

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-16 border-b border-stone-200 bg-stone-50"></div>}>
        <Header />
      </Suspense>

      <main className="flex-1 flex flex-col">
        {/* Editorial Hero */}
        <section className="bg-stone-100 border-b border-stone-200 pt-20 pb-16 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-stone-900 tracking-tight">
                Curated opportunities for global professionals.
              </h1>
              <p className="mt-6 text-lg text-stone-600 max-w-xl leading-relaxed">
                We bridge the gap between world-class talent and leading international employers, providing vetted roles across borders.
              </p>
            </div>
            <div className="hidden md:block w-32 h-32 bg-amber-700/10 border-4 border-amber-700 rounded-full flex-shrink-0" />
          </div>
        </section>

        {/* Homepage Banner Ad Slot */}
        <section className="max-w-6xl w-full mx-auto px-4 pt-8">
          <AdSlot adCode={homepageBannerAdCode || null} format="banner" className="min-h-[90px]" />
        </section>

        {/* Directory Section */}
        <section className="flex-1 max-w-6xl w-full mx-auto px-4 py-12">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-stone-900 pb-4">
              <h2 className="font-serif text-2xl font-bold text-stone-900">Current Openings</h2>
              <span className="text-sm font-medium uppercase tracking-widest text-stone-500">Live Directory</span>
            </div>
            
            <Suspense fallback={
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-stone-300 border-t-amber-700 rounded-full animate-spin"></div>
              </div>
            }>
              <JobGrid interstitialAdCode={interstitialAdCode} />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
