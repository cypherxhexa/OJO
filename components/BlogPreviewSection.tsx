"use client";

import Link from "next/link";
import { useState } from "react";
import { estimateReadTime, stripHtml } from "@/lib/blog-utils";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  category: string;
  createdAt: Date;
  content: string;
}

interface BlogPreviewSectionProps {
  posts: BlogPost[];
}

/** Safe image: falls back to gradient placeholder if src fails to load */
function CoverImage({ src, alt, category }: { src: string | null; alt: string; category: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="h-44 bg-gradient-to-br from-stone-700 to-amber-800 flex items-center justify-center flex-shrink-0">
        <span className="text-white/40 text-xs uppercase tracking-widest font-sans">
          {category}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-44 overflow-hidden flex-shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </div>
  );
}

export function BlogPreviewSection({ posts }: BlogPreviewSectionProps) {
  if (!posts || posts.length === 0) return null;

  /**
   * Grid column strategy:
   *   1 post  → 1 col (centred, max-w-sm)
   *   2 posts → 2 cols
   *   3+      → 3 cols
   * This prevents the ugly "1 card + huge empty gap" look.
   */
  const gridCols =
    posts.length === 1
      ? "grid-cols-1 max-w-sm"
      : posts.length === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="bg-stone-50 border-t border-stone-200 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="mb-10">
          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">
            Overseas Work Tips &amp; Guides
          </h2>
          <p className="text-stone-500 font-sans text-base">
            Helpful articles for OFWs and job seekers abroad
          </p>
        </div>

        {/* Cards */}
        <div className={`grid ${gridCols} gap-6 mb-10`}>
          {posts.map((post) => {
            const readTime = estimateReadTime(post.content);
            const excerpt = stripHtml(post.excerpt).slice(0, 120);

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all duration-200"
              >
                <CoverImage src={post.coverImage} alt={post.title} category={post.category} />

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  {/* Category badge */}
                  <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 uppercase tracking-wide mb-3 self-start">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-stone-500 font-sans text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
                    {excerpt}
                    {excerpt.length >= 120 ? "..." : ""}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-stone-400 text-xs font-sans">
                      {readTime} min read
                    </span>
                    <span className="text-amber-700 text-xs font-semibold font-sans group-hover:underline">
                      Read Article →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Browse all button */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-block w-full md:w-auto px-8 py-3 border-2 border-stone-900 text-stone-900 font-sans font-semibold hover:bg-stone-900 hover:text-white transition-colors duration-200"
          >
            Browse All Articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
