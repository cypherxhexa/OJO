import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

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

  if (category && category !== "All") {
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
