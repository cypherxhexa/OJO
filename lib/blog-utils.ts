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
    // Strip HTML from innerText for the slug and ToC text
    const plainText = innerText.replace(/<[^>]+>/g, "").trim();
    
    // Generate a slug-like ID
    const id = plainText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    // Ensure unique ID
    let counter = 1;
    let uniqueId = id;
    while (toc.some(t => t.id === uniqueId)) {
      uniqueId = `${id}-${counter}`;
      counter++;
    }
    
    const level = parseInt(tagName.substring(1), 10);
    
    toc.push({
      id: uniqueId,
      text: plainText,
      level
    });

    // Reconstruct the tag with the ID
    // If it already had an ID, we'd ideally preserve it or replace it, but this assumes it didn't
    return `<${tagName} id="${uniqueId}"${attributes}>${innerText}</${tagName}>`;
  });

  return { toc, html: newHtml };
}
