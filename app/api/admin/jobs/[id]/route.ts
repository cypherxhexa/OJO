import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { generateUniqueJobSlug, validateJobInput } from "@/lib/job";

function isAuthorized() {
  const token = cookies().get("admin_token")?.value;
  return token === "authenticated";
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized()) {
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
  if (!isAuthorized()) {
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
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
