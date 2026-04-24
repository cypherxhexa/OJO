import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function generateUniqueBlogSlug(title: string, postId?: number) {
  const baseSlug = slugify(title);

  if (!baseSlug) {
    throw new Error("Unable to generate a slug for this post.");
  }

  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });

    if (!existing || existing.id === postId) {
      return slug;
    }

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
}
