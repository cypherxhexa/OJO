"use client";

import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs text-stone-400 uppercase tracking-widest font-semibold">Share</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 flex items-center justify-center border border-stone-200 text-stone-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors text-sm"
        aria-label="Share on Facebook"
      >
        f
      </a>
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 flex items-center justify-center border border-stone-200 text-stone-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors text-sm"
        aria-label="Share on WhatsApp"
      >
        W
      </a>
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 flex items-center justify-center border border-stone-200 text-stone-600 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-colors text-sm"
        aria-label="Share on Telegram"
      >
        T
      </a>
      <button
        onClick={copyLink}
        className="h-9 px-3 flex items-center justify-center border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors text-xs font-medium"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
