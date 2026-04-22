import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/adminAuth";
import { generateUniqueJobSlug, validateJobInput } from "@/lib/job";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const jobData = validateJobInput({
      title: body.title,
      company: body.company,
      location: body.location,
      salary: body.salary,
      description: body.description,
      category: body.category,
      type: body.type || body.jobType,
      externalUrl: body.externalUrl,
      isActive: body.isActive ?? true,
    });
    const slug = await generateUniqueJobSlug(jobData.title, id);

    const job = await prisma.job.update({
      where: { id },
      data: { ...jobData, slug },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Update job error:", error);
    if (error && typeof error === "object" && "code" in error && (error as Record<string, unknown>).code === "P2025") {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update job" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete job error:", error);
    if (error && typeof error === "object" && "code" in error && (error as Record<string, unknown>).code === "P2025") {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
