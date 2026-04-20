import Link from "next/link";
import { prisma } from "@/lib/db";

export async function LatestJobsWidget() {
  let jobs: { id: number; title: string; company: string; slug: string }[] = [];

  try {
    jobs = await prisma.job.findMany({
      where: { isActive: true },
      select: { id: true, title: true, company: true, slug: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  } catch {
    // Silently fail — widget is optional
  }

  if (jobs.length === 0) return null;

  return (
    <div className="border border-stone-200 bg-white p-5">
      <h3 className="font-serif text-lg font-bold text-stone-900 mb-4 pb-3 border-b border-stone-200">
        Latest Jobs
      </h3>
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="group">
            <Link href={`/job/${job.slug}`} className="block">
              <p className="text-sm font-semibold text-stone-800 group-hover:text-amber-700 transition-colors leading-snug">
                {job.title}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">{job.company}</p>
            </Link>
          </div>
        ))}
      </div>
      <Link
        href="/"
        className="mt-4 block w-full text-center py-2 bg-stone-900 text-white text-sm font-semibold hover:bg-stone-700 transition-colors"
      >
        Browse All Jobs
      </Link>
    </div>
  );
}
