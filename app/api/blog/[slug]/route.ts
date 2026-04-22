import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug: params.slug, isPublished: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // View count is incremented in the page server component (app/blog/[slug]/page.tsx).
    // This API route returns data only — no side effects.
    return NextResponse.json(post);
  } catch (error) {
    console.error("Blog post error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
