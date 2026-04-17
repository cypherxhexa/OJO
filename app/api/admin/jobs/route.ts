import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

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
    const slug =
      body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
      "-" +
      Math.floor(Math.random() * 10000);

    const job = await prisma.job.create({
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
        slug,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
