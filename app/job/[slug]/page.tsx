import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { JobPostingJsonLd } from "@/components/JobPostingJsonLd";
import { prisma } from "@/lib/db";

const SITE_NAME = "Job Opp Jarrar";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://joboppjarrar.com";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const job = await prisma.job.findUnique({ where: { slug: params.slug } });

  if (!job) {
    return { title: "Job Not Found" };
  }

  const title = `${job.title} at ${job.company} - ${job.location}`;
  const plainTextDescription = job.description.replace(/<[^>]+>/g, "");
  const description =
    plainTextDescription.slice(0, 160).trimEnd() + (plainTextDescription.length > 160 ? "..." : "");

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
  const job = await prisma.job.findUnique({
    where: { slug: params.slug },
  });

  if (!job || !job.isActive) {
    notFound();
  }

  let adCode = "";

  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key: "interstitialAdCode" },
    });

    if (setting?.value) adCode = setting.value;
  } catch {}

  const jobUrl = `${BASE_URL}/job/${job.slug}`;

  return (
    <>
      <JobPostingJsonLd job={job} url={jobUrl} />

      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row gap-12">
        <div className="flex-1 max-w-3xl">
          <header className="mb-10">
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

          <div className="border-t border-stone-200 pt-10">
            <h2 className="text-2xl font-serif text-stone-900 mb-6">About the Role</h2>
            <div 
              className="prose prose-stone max-w-none text-stone-600 font-sans leading-relaxed"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>

          <div className="mt-12 lg:hidden">
            <AdSlot adCode={adCode || null} format="banner" />
          </div>
        </div>

        <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-8">
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

          <div className="hidden lg:block sticky top-[300px]">
            <AdSlot adCode={adCode || null} format="sidebar" />
          </div>
        </aside>
      </div>
    </>
  );
}
