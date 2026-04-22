import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/adminAuth";

export async function GET() {
  if (!isAdminAuthorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [totalJobs, activeJobs, aggregateClicks] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { isActive: true } }),
      prisma.job.aggregate({ _sum: { clicks: true } }),
    ]);

    return NextResponse.json({
      totalJobs,
      activeJobs,
      inactiveJobs: totalJobs - activeJobs,
      totalClicks: aggregateClicks._sum.clicks || 0,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
