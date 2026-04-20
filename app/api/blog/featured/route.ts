import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { isPublished: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Featured post error:", error);
    return NextResponse.json({ error: "Failed to fetch featured post" }, { status: 500 });
  }
}
