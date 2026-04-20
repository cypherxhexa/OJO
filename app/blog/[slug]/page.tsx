import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LatestJobsWidget } from "@/components/LatestJobsWidget";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import ShareButtons from "@/components/ShareButtons";
import { AdSlot } from "@/components/AdSlot";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { estimateReadTime, stripHtml } from "@/lib/blog";
import { splitContentAtParagraph } from "@/lib/adUtils";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://joboppjarrar.com";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: "Post Not Found" };

  const description = stripHtml(post.excerpt).slice(0, 160);

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `${BASE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `${BASE_URL}/blog/${post.slug}`,
      siteName: "Job Opp Jarrar",
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.authorName],
    },
    twitter: {
      card: post.coverImage ? "summary_large_image" : "summary",
      title: post.title,
      description,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  // Increment views server-side
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  // Related posts (same category, excluding current)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      category: post.category,
      NOT: { id: post.id },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  // Latest jobs for CTA
  const latestJobs = await prisma.job.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: { id: true, title: true, company: true, location: true, slug: true, category: true },
  });

  const readTime = estimateReadTime(post.content);
  const postUrl = `${BASE_URL}/blog/${post.slug}`;
  const parts = splitContentAtParagraph(post.content, 3);
  const contentPart1 = DOMPurify.sanitize(parts[0]);
  const contentPart2 = DOMPurify.sanitize(parts[1]);

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-16 border-b border-stone-200 bg-stone-50" />}>
        <Header />
      </Suspense>

      <ArticleJsonLd
        title={post.title}
        description={stripHtml(post.excerpt)}
        url={postUrl}
        datePublished={post.createdAt.toISOString()}
        dateModified={post.updatedAt.toISOString()}
        authorName={post.authorName}
        image={post.coverImage}
      />

      <main className="flex-1">
        {/* Cover Image Hero */}
        {post.coverImage && (
          <div className="relative h-64 md:h-96 w-full overflow-hidden">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 1200px" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
              <span className="inline-block bg-amber-700 text-white text-xs font-semibold px-3 py-1 mb-3 uppercase tracking-wide">
                {post.category}
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Breadcrumb */}
          <nav className="text-sm text-stone-500 font-sans mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <span className="mx-2 text-stone-300">/</span>
            <Link href="/blog" className="hover:text-stone-900 transition-colors">Blog</Link>
            <span className="mx-2 text-stone-300">/</span>
            <span className="text-stone-900 truncate max-w-[200px] inline-block align-bottom">{post.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Article */}
            <article className="flex-1 max-w-3xl">
              {/* Title (shown if no cover image) */}
              {!post.coverImage && (
                <header className="mb-8">
                  <span className="inline-block bg-stone-100 text-amber-700 text-xs font-semibold px-3 py-1 mb-4 uppercase tracking-wide border border-stone-200">
                    {post.category}
                  </span>
                  <h1 className="font-serif text-3xl md:text-5xl font-bold text-stone-900 leading-tight">
                    {post.title}
                  </h1>
                </header>
              )}

              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 font-sans mb-8 pb-6 border-b border-stone-200">
                <span>By <strong className="text-stone-900">{post.authorName}</strong></span>
                <span>&bull;</span>
                <span>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>&bull;</span>
                <span>{readTime} min read</span>
                <span>&bull;</span>
                <span>{post.views + 1} views</span>
              </div>

              {/* ── AD SLOT 1/3: Leaderboard below meta, above paragraph 1 ────
                  Policy: standard editorial placement, explicitly permitted.
              ────────────────────────────────────────────────────────────── */}
              <div className="mb-10">
                <AdSlot
                  slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_TOP}
                  format="leaderboard"
                />
              </div>

              {/* Article content (Part 1 - First 3 paragraphs) */}
              <div
                className="prose prose-stone prose-lg max-w-none font-sans leading-relaxed
                  prose-headings:font-serif prose-headings:text-stone-900
                  prose-a:text-amber-700 prose-a:underline
                  prose-strong:text-stone-900
                  prose-li:marker:text-amber-700"
                dangerouslySetInnerHTML={{ __html: contentPart1 }}
              />

              {contentPart2 && (
                <>
                  {/* ── AD SLOT 2/3: Rectangle injected after 3rd paragraph ─────
                      Policy: Ad sits between paragraphs, never mid-sentence.
                      Doesn't push too far down the page (max-w limit).
                  ──────────────────────────────────────────────────────────── */}
                  <div className="my-10 text-center flex justify-center">
                    <AdSlot
                      slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_MID}
                      format="rectangle"
                    />
                  </div>
                  
                  {/* Article content (Part 2 - Remainder) */}
                  <div
                    className="prose prose-stone prose-lg max-w-none font-sans leading-relaxed
                      prose-headings:font-serif prose-headings:text-stone-900
                      prose-a:text-amber-700 prose-a:underline
                      prose-strong:text-stone-900
                      prose-li:marker:text-amber-700 mt-6"
                    dangerouslySetInnerHTML={{ __html: contentPart2 }}
                  />
                </>
              )}

              {/* ── AD SLOT 3/3: Leaderboard below article, above related ─────
                  Policy: clear of content, acts as end-of-article marker.
                  On mobile: all 3 ads are allowed since they won't stack on screen.
              ────────────────────────────────────────────────────────────── */}
              <div className="mt-12 mb-4">
                <AdSlot
                  slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_BOTTOM}
                  format="leaderboard"
                />
              </div>

              {/* Share */}
              <div className="mt-12 pt-6 border-t border-stone-200">
                <ShareButtons url={postUrl} title={post.title} />
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <section className="mt-14">
                  <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6 pb-3 border-b border-stone-900">
                    Related Articles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {relatedPosts.map((rp) => (
                      <Link
                        key={rp.id}
                        href={`/blog/${rp.slug}`}
                        className="group border border-stone-200 bg-white hover:shadow-md transition-shadow"
                      >
                        {rp.coverImage ? (
                          <div className="relative h-32 overflow-hidden">
                            <Image src={rp.coverImage} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 300px" />
                          </div>
                        ) : (
                          <div className="h-32 bg-gradient-to-br from-stone-700 to-stone-500 flex items-center justify-center">
                            <span className="text-white/50 text-xs uppercase tracking-widest">{rp.category}</span>
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-serif text-sm font-bold text-stone-900 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
                            {rp.title}
                          </h3>
                          <p className="text-xs text-stone-400 mt-2">
                            {new Date(rp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Browse Latest Jobs CTA */}
              {latestJobs.length > 0 && (
                <section className="mt-14">
                  <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6 pb-3 border-b border-stone-900">
                    Browse Latest Jobs
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {latestJobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/job/${job.slug}`}
                        className="flex items-start justify-between p-4 border border-stone-200 bg-white hover:border-amber-300 hover:shadow-sm transition-all group"
                      >
                        <div>
                          <p className="font-sans text-sm font-bold text-stone-900 group-hover:text-amber-700 transition-colors">{job.title}</p>
                          <p className="text-xs text-stone-500 mt-1">{job.company} &bull; {job.location}</p>
                        </div>
                        <span className="text-xs text-amber-700 font-semibold flex-shrink-0 ml-3 mt-0.5">View &rarr;</span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/"
                    className="mt-6 block w-full text-center py-3 bg-stone-900 text-white font-sans font-semibold hover:bg-stone-700 transition-colors"
                  >
                    See All Open Positions
                  </Link>
                </section>
              )}
            </article>

            {/* Sidebar */}
            <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
              <div className="lg:sticky lg:top-24 space-y-6">
                <LatestJobsWidget />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
