import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { generateUniqueBlogSlug } from "@/lib/blog";

function isAdminAuthorized() {
  const token = cookies().get("admin_token")?.value;
  return token === "authenticated";
}

export async function POST(request: Request) {
  if (!isAdminAuthorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, excerpt, content, coverImage, category, authorName, isPublished, isFeatured } = body;

    if (!title || !excerpt || !category) {
      return NextResponse.json({ error: "Title, excerpt, and category are required" }, { status: 400 });
    }

    const slug = await generateUniqueBlogSlug(title);

    // If setting as featured, unfeatured all others
    if (isFeatured) {
      await prisma.blogPost.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false },
      });
    }

    const post = await prisma.blogPost.create({
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

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Create blog post error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create post" },
      { status: 400 }
    );
  }
}
