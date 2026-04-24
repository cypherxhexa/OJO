import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobGrid } from "@/components/JobGrid";
import { AdSlot } from "@/components/AdSlot";
import { BlogPreviewSection } from "@/components/BlogPreviewSection";
import { Suspense } from "react";
import { prisma } from "@/lib/db";

// ─── ADSENSE PLACEMENT PLAN — HOMEPAGE ────────────────────────────────────────
// Slot 1 (of 2): Leaderboard (728×90 / 320×50) — BELOW hero, ABOVE job grid.
//   High visibility, not intrusive. NOT placed next to nav or buttons.
// Slot 2 (of 2): In-feed native — rendered inside JobGrid after every 8 cards.
//   Blends naturally with listings. Explicitly allowed for directory/listing pages.
// NO further ads on this page. Two slots maximum.
// ──────────────────────────────────────────────────────────────────────────────

export default async function Home() {
  // Fetch 3 most recently published blog posts server-side
  let latestPosts: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string | null;
    category: string;
    createdAt: Date;
    content: string;
  }[] = [];

  try {
    latestPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        createdAt: true,
        content: true,
      },
    });
  } catch {
    // Blog table may not exist in dev — silently skip
    latestPosts = [];
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-16 border-b border-stone-200 bg-stone-50" />}>
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
                We bridge the gap between world-class talent and leading international employers,
                providing vetted roles across borders.
              </p>
            </div>
            <div className="hidden md:block w-32 h-32 bg-amber-700/10 border-4 border-amber-700 rounded-full flex-shrink-0" />
          </div>
        </section>

        {/* ── AD SLOT 1/2: Leaderboard below hero, above job grid ────────────
            Policy: placed BELOW hero section, not adjacent to any nav or CTA.
            Desktop: 728×90 | Mobile: 320×50  (data-full-width-responsive)
        ─────────────────────────────────────────────────────────────────── */}
        <div className="max-w-6xl w-full mx-auto px-4 pt-8 pb-2">
          <AdSlot
            slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_BANNER}
            format="leaderboard"
          />
        </div>

        {/* Directory Section */}
        <section className="flex-1 max-w-6xl w-full mx-auto px-4 py-10">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-stone-900 pb-4">
              <h2 className="font-serif text-2xl font-bold text-stone-900">Current Openings</h2>
              <span className="text-sm font-medium uppercase tracking-widest text-stone-500">
                Live Directory
              </span>
            </div>

            <Suspense
              fallback={
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-2 border-stone-300 border-t-amber-700 rounded-full animate-spin" />
                </div>
              }
            >
              {/* ── AD SLOT 2/2: In-feed native, rendered inside JobGrid after every 8 cards.
                  JobGrid receives the infeed slot ID and injects it between listings.
                  Policy: blends with content, not placed next to action buttons.
              ─────────────────────────────────────────────────────────────── */}
              <JobGrid />
            </Suspense>
          </div>
        </section>

        {/* ── BLOG PREVIEW SECTION — between job grid and footer ─────────── */}
        <BlogPreviewSection posts={latestPosts} />
      </main>

      <Footer />
    </div>
  );
}
