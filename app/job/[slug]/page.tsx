import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { AdSlot } from "@/components/AdSlot";
import { JobPostingJsonLd } from "@/components/JobPostingJsonLd";
import { JobImageGallery } from "@/components/JobImageGallery";
import { JobShareButtons } from "@/components/JobShareButtons";
import { prisma } from "@/lib/db";

const ALLOWED_HTML = {
  allowedTags: ["p", "br", "strong", "em", "ul", "ol", "li", "h2", "h3", "a"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["https", "http", "mailto"],
};

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
  const description =
    plainText.slice(0, 160).trimEnd() + (plainText.length > 160 ? "..." : "");

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
      if (Array.isArray(parsed))
        images = parsed.filter((u) => typeof u === "string");
    } catch { /* ignore */ }
  }

  return (
    <>
      <JobPostingJsonLd job={job} url={jobUrl} />

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 lg:py-16">

        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <nav className="text-xs text-stone-400 font-sans mb-8 flex items-center gap-1.5">
          <Link href="/" className="hover:text-stone-700 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/" className="hover:text-stone-700 transition-colors">Jobs</Link>
          <span>/</span>
          <span className="text-stone-600 truncate max-w-[200px]">{job.title}</span>
        </nav>

        {/* ── Two-column layout: Left 60% · Right 40% ────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-12 items-start">

          {/* ════════════════════════════════════════════════════════════════
              LEFT COLUMN — Article content
          ════════════════════════════════════════════════════════════════ */}
          <article>

            {/* Header — Company · Location · Category · Title · Salary */}
            <header className="mb-6">
              <div className="flex flex-wrap items-center gap-2 text-sm font-sans mb-3">
                <span className="font-semibold text-stone-900">{job.company}</span>
                <span className="text-stone-300">·</span>
                <span className="text-stone-500">{job.location}</span>
                <span className="text-stone-300">·</span>
                <span className="inline-block bg-stone-100 text-stone-600 px-2.5 py-0.5 text-xs font-medium rounded-full">
                  {job.category}
                </span>
                <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 text-xs font-medium rounded-full">
                  {job.type}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-serif text-stone-900 leading-tight mb-3">
                {job.title}
              </h1>

              {job.salary && (
                <p className="text-base font-sans text-stone-500">
                  Salary:{" "}
                  <span className="font-semibold text-stone-800">{job.salary}</span>
                </p>
              )}
            </header>

            {/* ── Mobile gallery — after header, before description ──────────
                Max 1 image at 200px height with "View all" link.
                Hidden on desktop where gallery lives in the right column.
            ─────────────────────────────────────────────────────────────── */}
            {images.length > 0 && (
              <div className="lg:hidden mb-6">
                <JobImageGallery images={images} variant="mobile" />
              </div>
            )}

            {/* Description */}
            <div className="border-t border-stone-200 pt-6">
              <h2 className="text-xl font-serif text-stone-900 mb-5">About the Role</h2>
              <div
                className="prose prose-stone max-w-none text-stone-600 font-sans leading-relaxed prose-headings:font-serif prose-a:text-amber-700"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description, ALLOWED_HTML) }}
              />
            </div>

            {/* Share buttons */}
            <JobShareButtons url={jobUrl} title={job.title} company={job.company} />

            {/* ── Mobile: Apply button + Ad ──────────────────────────────── */}
            <div className="lg:hidden mt-8 flex flex-col gap-5">
              <Link
                href={`/redirect/${job.id}`}
                className="block w-full bg-stone-900 text-white font-sans font-semibold text-center py-3.5 px-4 rounded-lg hover:bg-stone-800 transition-colors"
              >
                Apply Now
              </Link>
              <AdSlot
                slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_JOB_SIDEBAR}
                format="rectangle"
              />
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              RIGHT COLUMN — Sticky sidebar (desktop only)
          ════════════════════════════════════════════════════════════════ */}
          <aside className="hidden lg:flex flex-col gap-5 lg:sticky lg:top-24">

            {/* Compact image gallery card — only when images exist */}
            {images.length > 0 && (
              <div className="rounded-xl shadow-md overflow-hidden">
                <JobImageGallery images={images} variant="compact" />
              </div>
            )}

            {/* Apply card */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
              <h3 className="font-serif text-lg text-stone-900 mb-1">
                Apply for this position
              </h3>
              <p className="text-xs font-sans text-stone-400 mb-5 leading-relaxed">
                You will be redirected to the employer&apos;s official portal.
              </p>
              <Link
                href={`/redirect/${job.id}`}
                className="block w-full bg-stone-900 text-white font-sans font-semibold text-center py-3 px-4 rounded-lg hover:bg-stone-800 transition-colors"
              >
                Apply Now
              </Link>
            </div>

            {/* Ad slot below apply card */}
            <AdSlot
              slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_JOB_SIDEBAR}
              format="rectangle"
            />
          </aside>
        </div>
      </div>

      {/* ── Full-width bottom ad ───────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-12">
        <AdSlot
          slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_JOB_BOTTOM}
          format="leaderboard"
        />
      </div>
    </>
  );
}
