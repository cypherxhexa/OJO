import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { JobPostingJsonLd } from "@/components/JobPostingJsonLd";
import { JobImageGallery } from "@/components/JobImageGallery";
import { JobShareButtons } from "@/components/JobShareButtons";
import { prisma } from "@/lib/db";

// ─── ADSENSE PLACEMENT PLAN — JOB DETAIL PAGE ─────────────────────────────────
// Slot 1 (of 2): Rectangle (336×280) — desktop right sidebar, BELOW the job
//   summary/apply box. On mobile this slot moves to BELOW the job description.
//   Policy: NEVER above the fold on mobile, NEVER between title and Apply button.
//   Those positions cause accidental clicks and violate AdSense policy.
// Slot 2 (of 2): Leaderboard (728×90 / 320×50) — very BOTTOM of page, above footer.
//   Policy: No ad between job title and description. No ad above the job title.
// ──────────────────────────────────────────────────────────────────────────────

const SITE_NAME = "Job Opp Jarrar";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://joboppjarrar.com";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const job = await prisma.job.findUnique({ where: { slug: params.slug } });
  if (!job) return { title: "Job Not Found" };

  const title = `${job.title} at ${job.company} - ${job.location}`;
  const plainText = job.description.replace(/<[^>]+>/g, "");
  const description = plainText.slice(0, 160).trimEnd() + (plainText.length > 160 ? "..." : "");

  let ogImages: string[] = [];
  if (job.jobImages) {
    try {
      const parsed = JSON.parse(job.jobImages);
      if (Array.isArray(parsed) && parsed.length > 0) ogImages = [parsed[0]];
    } catch { /* ignore */ }
  }

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${BASE_URL}/job/${job.slug}`,
      siteName: SITE_NAME,
      ...(ogImages.length > 0 ? { images: ogImages } : {}),
    },
    twitter: {
      card: ogImages.length > 0 ? "summary_large_image" : "summary",
      title: `${title} | ${SITE_NAME}`,
      description,
      ...(ogImages.length > 0 ? { images: ogImages } : {}),
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const job = await prisma.job.findUnique({ where: { slug: params.slug } });
  if (!job || !job.isActive) notFound();

  const jobUrl = `${BASE_URL}/job/${job.slug}`;

  let images: string[] = [];
  if (job.jobImages) {
    try {
      const parsed = JSON.parse(job.jobImages);
      if (Array.isArray(parsed)) images = parsed.filter((u) => typeof u === "string");
    } catch { /* ignore */ }
  }

  return (
    <>
      <JobPostingJsonLd job={job} url={jobUrl} />

      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row gap-12">

        {/* ── Main article column ─────────────────────────────────────────── */}
        <div className="flex-1 max-w-3xl">
          <header className="mb-8">
            <div className="flex items-center gap-3 text-sm text-stone-500 font-sans mb-4">
              <span className="font-semibold text-stone-900">{job.company}</span>
              <span>&bull;</span>
              <span>{job.location}</span>
              <span>&bull;</span>
              <span className="bg-stone-100 px-2 py-1 rounded">{job.category}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif text-stone-900 leading-tight mb-6">
              {job.title}
            </h1>
            {job.salary && (
              <p className="text-lg font-sans text-stone-600">
                Salary: <span className="font-semibold text-stone-900">{job.salary}</span>
              </p>
            )}
          </header>

          {/* Description — uninterrupted reading flow on desktop */}
          <div className="border-t border-stone-200 pt-10">
            <h2 className="text-2xl font-serif text-stone-900 mb-6">About the Role</h2>
            <div
              className="prose prose-stone max-w-none text-stone-600 font-sans leading-relaxed"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>

          {/* Mobile gallery strip — horizontal scroll, shown only on mobile */}
          {images.length > 0 && (
            <div className="lg:hidden mt-10 border-t border-stone-200 pt-8">
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-stone-400 mb-4">
                Photos
              </p>
              <JobImageGallery images={images} variant="strip" />
            </div>
          )}

          {/* Social share */}
          <JobShareButtons url={jobUrl} title={job.title} company={job.company} />

          {/* Ad slot 1 — mobile only, below description */}
          <div className="mt-10 lg:hidden">
            <AdSlot
              slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_JOB_SIDEBAR}
              format="rectangle"
            />
          </div>
        </div>

        {/* ── Sidebar ────────────────────────────────────────────────────────── */}
        <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
          <div className="lg:sticky lg:top-24 flex flex-col gap-6">

            {/* Apply card */}
            <div className="bg-stone-50 border border-stone-200 p-6">
              <h3 className="font-serif text-xl text-stone-900 mb-2">Apply for this position</h3>
              <p className="text-sm font-sans text-stone-500 mb-6">
                You will be redirected securely to the employer&apos;s official portal.
              </p>
              <Link
                href={`/redirect/${job.id}`}
                className="block w-full bg-stone-900 text-white font-sans font-medium text-center py-3 px-4 hover:bg-stone-800 transition-colors"
              >
                Apply Now
              </Link>
            </div>

            {/* Desktop gallery — editorial sidebar panel, hidden on mobile */}
            {images.length > 0 && (
              <div className="hidden lg:block border border-stone-200 bg-white p-4">
                <p className="text-xs font-sans font-semibold uppercase tracking-widest text-stone-400 mb-4">
                  Photos
                </p>
                <JobImageGallery images={images} variant="sidebar" />
              </div>
            )}

            {/* Ad slot 1 — desktop position, below gallery */}
            <div className="hidden lg:block">
              <AdSlot
                slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_JOB_SIDEBAR}
                format="rectangle"
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Ad slot 2 — leaderboard at page bottom */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <AdSlot
          slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_JOB_BOTTOM}
          format="leaderboard"
        />
      </div>
    </>
  );
}
