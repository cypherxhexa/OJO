import { Header } from "@/components/Header";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { LatestJobsWidget } from "@/components/LatestJobsWidget";
import { AdSlot } from "@/components/AdSlot";
import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { estimateReadTime } from "@/lib/blog-utils";

export const metadata: Metadata = {
  title: "Overseas Work Guides & OFW Tips | Job Opp Jarrar",
  description:
    "Helpful articles, country guides, and application tips for OFWs and overseas job seekers. Learn how to work abroad safely and successfully.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string };
}) {
  const category = searchParams.category;
  const page = parseInt(searchParams.page || "1");
  const limit = 9;
  const skip = (page - 1) * limit;

  const where = {
    isPublished: true,
    ...(category ? { category } : {}),
  };

  const [posts, total, featured, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
    !category
      ? prisma.blogPost.findFirst({
          where: { isPublished: true, isFeatured: true },
          orderBy: { createdAt: "desc" },
        })
      : null,
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Filter out featured post from grid if showing on page 1
  const gridPosts =
    featured && page === 1 && !category
      ? posts.filter((p) => p.id !== featured.id)
      : posts;

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-16 border-b border-stone-200 bg-stone-50" />}>
        <Header />
      </Suspense>

      <main className="flex-1">
        {/* Hero Header */}
        <section className="bg-stone-100 border-b border-stone-200 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <nav className="text-sm text-stone-500 font-sans mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
              <span className="mx-2 text-stone-300">/</span>
              <span className="text-stone-900">Blog</span>
            </nav>
            <p className="font-sans text-xs uppercase tracking-widest text-amber-700 mb-3">Blog</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
              Overseas Work Tips &amp; Guides
            </h1>
            <p className="mt-4 text-stone-600 font-sans text-lg max-w-2xl">
              Helpful articles for OFWs and overseas job seekers — country guides, application tips, and advice to help you work abroad safely.
            </p>
          </div>
        </section>

        {/* ── AD SLOT 1/1: Leaderboard below heading, above content ─────────── 
            Policy: Only 1 ad on this navigation page. Not placed immediately
            next to clickable filters.
        ────────────────────────────────────────────────────────────────────── */}
        <div className="max-w-6xl w-full mx-auto px-4 pt-8 pb-2">
          <AdSlot
            slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_LIST}
            format="leaderboard"
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-10 font-sans text-sm">
            <Link
              href="/blog"
              className={`px-4 py-2 border transition-colors ${
                !category
                  ? "bg-stone-900 text-white border-stone-900"
                  : "border-stone-300 text-stone-700 hover:border-stone-900"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${encodeURIComponent(cat.name)}`}
                className={`px-4 py-2 border transition-colors ${
                  category === cat.name
                    ? "bg-stone-900 text-white border-stone-900"
                    : "border-stone-300 text-stone-700 hover:border-stone-900"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <div className="flex-1">
              {/* Featured Post Hero */}
              {featured && page === 1 && !category && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="block mb-10 group border border-stone-200 bg-white hover:shadow-lg transition-shadow"
                >
                  {featured.coverImage ? (
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      <Image
                        src={featured.coverImage}
                        alt={featured.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 800px"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <span className="inline-block bg-amber-700 text-white text-xs font-semibold px-3 py-1 mb-3 uppercase tracking-wide">
                          {featured.category}
                        </span>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight">
                          {featured.title}
                        </h2>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-64 md:h-80 bg-gradient-to-br from-stone-800 to-stone-600 flex items-end">
                      <div className="p-6 md:p-8">
                        <span className="inline-block bg-amber-700 text-white text-xs font-semibold px-3 py-1 mb-3 uppercase tracking-wide">
                          {featured.category}
                        </span>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight">
                          {featured.title}
                        </h2>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-stone-600 font-sans leading-relaxed">{featured.excerpt}</p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-stone-400 font-sans">
                      <span>{new Date(featured.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                      <span>&bull;</span>
                      <span>{estimateReadTime(featured.content)} min read</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Blog Grid */}
              {gridPosts.length === 0 ? (
                <div className="text-center py-20 text-stone-400 font-sans">
                  <p className="text-5xl mb-4">📝</p>
                  <p>No articles found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group border border-stone-200 bg-white hover:shadow-md transition-shadow flex flex-col"
                    >
                      {post.coverImage ? (
                        <div className="relative h-44 overflow-hidden">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                        </div>
                      ) : (
                        <div className="h-44 bg-gradient-to-br from-stone-700 to-stone-500 flex items-center justify-center">
                          <span className="text-white/60 text-sm font-sans uppercase tracking-widest">
                            {post.category}
                          </span>
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-xs text-amber-700 font-semibold uppercase tracking-wide mb-2">
                          {post.category}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug mb-2 group-hover:text-amber-700 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-stone-600 text-sm font-sans leading-relaxed flex-1 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex items-center gap-3 text-xs text-stone-400 font-sans">
                          <span>
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span>&bull;</span>
                          <span>{estimateReadTime(post.content)} min read</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10 font-sans text-sm">
                  {page > 1 && (
                    <Link
                      href={`/blog?page=${page - 1}${category ? `&category=${encodeURIComponent(category)}` : ""}`}
                      className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
                    >
                      &larr; Previous
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/blog?page=${p}${category ? `&category=${encodeURIComponent(category)}` : ""}`}
                      className={`px-4 py-2 border transition-colors ${
                        p === page
                          ? "bg-stone-900 text-white border-stone-900"
                          : "border-stone-300 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link
                      href={`/blog?page=${page + 1}${category ? `&category=${encodeURIComponent(category)}` : ""}`}
                      className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
                    >
                      Next &rarr;
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
              <LatestJobsWidget />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
