/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ── Allowlisted image hosts ────────────────────────────────────────────────
    // Only HTTPS. HTTP removed entirely.
    // The admin pastes image URLs from these sources in the job/blog forms.
    // To support a new image host, add it here manually — do NOT restore "**".
    remotePatterns: [
      // Unsplash — used for job images and blog cover photos
      { protocol: "https", hostname: "images.unsplash.com" },
      // Unsplash CDN (plus.unsplash.com, cdn.unsplash.com)
      { protocol: "https", hostname: "*.unsplash.com" },
      // Wikimedia Commons — used for some blog images
      { protocol: "https", hostname: "upload.wikimedia.org" },
      // Common image CDNs admins may use
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "imgur.com" },
    ],
  },

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: [
          // Prevents the page from being embedded in an iframe (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Prevents MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Sends referrer only to same-origin and secure cross-origin requests
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disables sensitive browser features not needed on this site
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // NOTE: Content-Security-Policy is intentionally NOT set here.
          // Google AdSense requires loading scripts from googlesyndication.com
          // and creating iframes — a CSP must be carefully crafted after AdSense
          // is live and tested to avoid breaking ads. Add CSP here at that point.
        ],
      },
    ];
  },
};

export default nextConfig;
