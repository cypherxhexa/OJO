import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { generateUniqueBlogSlug } from "@/lib/blog";

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
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const body = await request.json();
    const { title, excerpt, content, coverImage, category, authorName, isPublished, isFeatured } = body;

    const slug = await generateUniqueBlogSlug(title, id);

    if (isFeatured) {
      await prisma.blogPost.updateMany({
        where: { isFeatured: true, NOT: { id } },
        data: { isFeatured: false },
      });
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content: content || "",
        coverImage: coverImage || null,
        category,
        authorName: authorName || "Editorial Team",
        isPublished: isPublished ?? false,
        isFeatured: isFeatured ?? false,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Update blog post error:", error);
    if (error && typeof error === "object" && "code" in error && (error as Record<string, unknown>).code === "P2025") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update post" },
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
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete blog post error:", error);
    if (error && typeof error === "object" && "code" in error && (error as Record<string, unknown>).code === "P2025") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
