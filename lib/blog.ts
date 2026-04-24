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

export function estimateReadTime(content: string): number {
  const text = content.replace(/<[^>]+>/g, "");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function generateTableOfContents(htmlContent: string): { toc: TocItem[], html: string } {
  const toc: TocItem[] = [];
  // Regex to match ONLY h2 tags, capturing the tag name, attributes, and inner text
  const headingRegex = /<(h2)([^>]*)>(.*?)<\/\1>/gi;

  let newHtml = htmlContent;

  // We need to build the new HTML with injected IDs, and collect the ToC data
  // Using string.replace with a replacer function is the cleanest way
  newHtml = htmlContent.replace(headingRegex, (fullMatch, tagName, attributes, innerText) => {
    // If the heading already has an ID, we might want to use it, but for simplicity, we'll generate one
    // Strip HTML from innerText for the slug and ToC text
    const plainText = innerText.replace(/<[^>]+>/g, "").trim();
    
    // Generate a slug-like ID
    const id = plainText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    // Ensure unique ID
    let counter = 1;
    let uniqueId = id;
    while (toc.find(item => item.id === uniqueId)) {
      uniqueId = `${id}-${counter}`;
      counter++;
    }
    
    // Add to ToC array
    toc.push({
      id: uniqueId,
      text: plainText,
      level: parseInt(tagName.substring(1), 10)
    });

    // Check if attributes already contain an ID. If so, replace it. If not, add it.
    let newAttributes = attributes;
    if (/id="[^"]*"/.test(attributes)) {
      newAttributes = attributes.replace(/id="[^"]*"/, `id="${uniqueId}"`);
    } else {
      newAttributes = `${attributes} id="${uniqueId}"`;
    }

    // Return the modified heading tag
    return `<${tagName}${newAttributes}>${innerText}</${tagName}>`;
  });

  return { toc, html: newHtml };
}
