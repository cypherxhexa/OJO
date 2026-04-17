import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://joboppjarrar.com";

  // Get all active jobs
  const jobs = await prisma.job.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const jobUrls: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${baseUrl}/job/${job.slug}`,
    lastModified: job.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...jobUrls,
  ];
}
