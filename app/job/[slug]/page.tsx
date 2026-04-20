import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { JobPostingJsonLd } from "@/components/JobPostingJsonLd";
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

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${BASE_URL}/job/${job.slug}`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary",
      title: `${title} | ${SITE_NAME}`,
      description,
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

  return (
    <>
      <JobPostingJsonLd job={job} url={jobUrl} />

      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row gap-12">
        {/* ── Main article column ───────────────────────────────────────────── */}
        <div className="flex-1 max-w-3xl">
          <header className="mb-10">
            <div className="flex items-center gap-3 text-sm text-stone-500 font-sans mb-4">
              <span className="font-semibold text-stone-900">{job.company}</span>
              <span>&bull;</span>
              <span>{job.location}</span>
              <span>&bull;</span>
              <span className="bg-stone-100 px-2 py-1 rounded">{job.category}</span>
            </div>
            {/* Policy: NO ad between company meta and job title */}
            <h1 className="text-4xl lg:text-5xl font-serif text-stone-900 leading-tight mb-6">
              {job.title}
            </h1>
            {job.salary && (
              <p className="text-lg font-sans text-stone-600">
                Salary: <span className="font-semibold text-stone-900">{job.salary}</span>
              </p>
            )}
          </header>

          <div className="border-t border-stone-200 pt-10">
            <h2 className="text-2xl font-serif text-stone-900 mb-6">About the Role</h2>
            <div
              className="prose prose-stone max-w-none text-stone-600 font-sans leading-relaxed"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>

          {/* ── AD SLOT 1/2 (mobile position): Rectangle below description ──────
              Policy: on mobile this slot is BELOW the job description, never above
              the fold. Hidden on desktop (desktop position is in sidebar below).
              16px margin-top ensures separation from description text.
          ──────────────────────────────────────────────────────────────────── */}
          <div className="mt-10 lg:hidden">
            <AdSlot
              slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_JOB_SIDEBAR}
              format="rectangle"
            />
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-8">
          {/* Apply box — NEVER has an ad adjacent to it at the top */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 sticky top-24">
            <h3 className="font-serif text-xl text-stone-900 mb-2">Apply for this position</h3>
            <p className="text-sm font-sans text-stone-500 mb-6">
              You will be redirected securely to the employer&apos;s official portal.
            </p>
            <Link
              href={`/redirect/${job.id}`}
              className="block w-full bg-stone-900 text-white font-sans font-medium text-center py-3 px-4 rounded hover:bg-stone-800 transition-colors"
            >
              Apply Now
            </Link>
          </div>

          {/* ── AD SLOT 1/2 (desktop position): Rectangle BELOW apply box ───────
              Policy: placed clearly BELOW the apply button, not adjacent to it.
              Sticky offset pushes it ~300px below top — well below apply card.
              Hidden on mobile where it renders in the main column above.
          ──────────────────────────────────────────────────────────────────── */}
          <div className="hidden lg:block">
            <AdSlot
              slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_JOB_SIDEBAR}
              format="rectangle"
            />
          </div>
        </aside>
      </div>

      {/* ── AD SLOT 2/2: Leaderboard at very bottom of page, above footer ────────
          Policy: maximum separation from job title, description, and Apply button.
          Full-width responsive: 728×90 desktop / 320×50 mobile.
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <AdSlot
          slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_JOB_BOTTOM}
          format="leaderboard"
        />
      </div>
    </>
  );
}
