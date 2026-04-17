import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

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
    const job = await prisma.job.update({
      where: { id },
      data: {
        title: body.title,
        company: body.company,
        location: body.location,
        salary: body.salary || null,
        description: body.description,
        category: body.category,
        type: body.type || body.jobType || "FULL_TIME",
        externalUrl: body.externalUrl,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
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
