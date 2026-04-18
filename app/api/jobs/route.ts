import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { JOB_CATEGORIES } from "@/lib/job-shared";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || searchParams.get("search") || "").trim();
  const category = (searchParams.get("category") || "").trim();

  const whereClause: Prisma.JobWhereInput = {
    isActive: true,
  };

  if (q) {
    whereClause.OR = [
      { title: { contains: q } },
      { company: { contains: q } },
      { location: { contains: q } },
      { description: { contains: q } },
    ];
  }

  if (category && category !== "All" && JOB_CATEGORIES.includes(category as (typeof JOB_CATEGORIES)[number])) {
    whereClause.category = { equals: category };
  }

  try {
    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(jobs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
