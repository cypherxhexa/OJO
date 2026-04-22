/**
 * Validates that a header code string contains ONLY <script> tags
 * from approved advertising/analytics domains.
 *
 * This prevents stored XSS if an attacker ever gains access to the
 * admin panel — arbitrary JS cannot be injected via the Settings page.
 */

const ALLOWED_SCRIPT_DOMAINS = [
  "pagead2.googlesyndication.com",
  "googletagservices.com",
  "www.googletagservices.com",
  "connect.facebook.net",
  "static.ads-twitter.com",
  "www.googletagmanager.com",
  "ssl.google-analytics.com",
  "www.google-analytics.com",
];

const SCRIPT_SRC_PATTERN = /src=["']([^"']+)["']/gi;
const TAG_PATTERN = /<(\w+)/g;

/**
 * Validate a headerCode string.
 * Returns `null` if the code is safe, or an error message string if not.
 */
export function validateHeaderCode(code: string): string | null {
  if (!code || code.trim() === "") return null;

  // Must contain at least one <script> tag
  const tagMatches = Array.from(code.matchAll(TAG_PATTERN));
  const tags = tagMatches.map((m) => m[1].toLowerCase());

  // Only <script> and <noscript> tags allowed — no <div>, <img>, <iframe>, etc.
  const disallowedTags = tags.filter(
    (t) => t !== "script" && t !== "noscript"
  );
  if (disallowedTags.length > 0) {
    return `Only <script> tags are allowed. Found disallowed tag(s): ${Array.from(new Set(disallowedTags)).join(", ")}`;
  }

  // All src attributes must point to approved domains
  const srcMatches = Array.from(code.matchAll(SCRIPT_SRC_PATTERN));
  for (const match of srcMatches) {
    const src = match[1];
    try {
      const url = new URL(src);
      const isAllowed = ALLOWED_SCRIPT_DOMAINS.some(
        (domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`)
      );
      if (!isAllowed) {
        return `Script source not allowed: ${url.hostname}. Only approved ad network domains are permitted.`;
      }
    } catch {
      return `Invalid script src URL: ${src}`;
    }
  }

  return null; // valid
}
