import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { generateUniqueJobSlug, validateJobInput } from "@/lib/job";

function isAuthorized() {
  const token = cookies().get("admin_token")?.value;
  return token === "authenticated";
}

export async function POST(request: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
    const slug = await generateUniqueJobSlug(jobData.title);

    const job = await prisma.job.create({
      data: { ...jobData, slug },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create job" },
      { status: 400 }
    );
  }
}
