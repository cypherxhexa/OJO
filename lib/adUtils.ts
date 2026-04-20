/**
 * Splits HTML article content at the 3rd closing </p> tag and inserts
 * an ad placeholder div. This utility is used for the mid-article AdSense slot
 * on blog post pages (Slot 2 of 3).
 *
 * AdSense policy: ads in article content must be between paragraphs —
 * never mid-sentence, never inside a heading or list.
 *
 * Returns [beforeAd, afterAd] — the caller renders an AdSlot between them.
 */
export function splitContentAtParagraph(html: string, afterParagraph = 3): [string, string] {
  let count = 0;
  let splitIndex = -1;

  // Find the Nth </p> tag using a simple index scan (no regex for safety)
  let searchFrom = 0;
  while (count < afterParagraph) {
    const idx = html.indexOf("</p>", searchFrom);
    if (idx === -1) break;         // fewer than N paragraphs — no split
    count++;
    if (count === afterParagraph) {
      splitIndex = idx + 4;        // point right after the closing </p>
    }
    searchFrom = idx + 4;
  }

  if (splitIndex === -1) {
    // Article too short — return full content, empty tail
    return [html, ""];
  }

  return [html.slice(0, splitIndex), html.slice(splitIndex)];
}
