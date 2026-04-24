import { Header } from "@/components/Header";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { LatestJobsWidget } from "@/components/LatestJobsWidget";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { estimateReadTime } from "@/lib/blog-utils";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await prisma.blogCategory.findUnique({ where: { slug: params.slug } });
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} — Blog`,
    description: `Browse articles about ${category.name} — overseas work guides, tips, and advice for job seekers.`,
  };
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const category = await prisma.blogCategory.findUnique({
    where: { slug: params.slug },
  });

  if (!category) notFound();

  const page = parseInt(searchParams.page || "1");
  const limit = 9;
  const skip = (page - 1) * limit;

  const where = { isPublished: true, category: category.name };

  const [posts, total, allCategories] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-16 border-b border-stone-200 bg-stone-50" />}>
        <Header />
      </Suspense>

      <main className="flex-1">
        <section className="bg-stone-100 border-b border-stone-200 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <nav className="text-sm text-stone-500 font-sans mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
              <span className="mx-2 text-stone-300">/</span>
              <Link href="/blog" className="hover:text-stone-900 transition-colors">Blog</Link>
              <span className="mx-2 text-stone-300">/</span>
              <span className="text-stone-900">{category.name}</span>
            </nav>
            <p className="font-sans text-xs uppercase tracking-widest text-amber-700 mb-3">Category</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
              {category.name}
            </h1>
            <p className="mt-3 text-stone-600 font-sans text-lg">
              {total} article{total !== 1 ? "s" : ""} in this category
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-10 font-sans text-sm">
            <Link href="/blog" className="px-4 py-2 border border-stone-300 text-stone-700 hover:border-stone-900 transition-colors">
              All
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog/category/${cat.slug}`}
                className={`px-4 py-2 border transition-colors ${
                  cat.slug === params.slug
                    ? "bg-stone-900 text-white border-stone-900"
                    : "border-stone-300 text-stone-700 hover:border-stone-900"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1">
              {posts.length === 0 ? (
                <div className="text-center py-20 text-stone-400 font-sans">
                  <p className="text-5xl mb-4">📝</p>
                  <p>No articles in this category yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group border border-stone-200 bg-white hover:shadow-md transition-shadow flex flex-col"
                    >
                      {post.coverImage ? (
                        <div className="relative h-44 overflow-hidden">
                          <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 400px" />
                        </div>
                      ) : (
                        <div className="h-44 bg-gradient-to-br from-stone-700 to-stone-500 flex items-center justify-center">
                          <span className="text-white/60 text-sm font-sans uppercase tracking-widest">{post.category}</span>
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-xs text-amber-700 font-semibold uppercase tracking-wide mb-2">{post.category}</span>
                        <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug mb-2 group-hover:text-amber-700 transition-colors">{post.title}</h3>
                        <p className="text-stone-600 text-sm font-sans leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
                        <div className="mt-4 flex items-center gap-3 text-xs text-stone-400 font-sans">
                          <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span>&bull;</span>
                          <span>{estimateReadTime(post.content)} min read</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10 font-sans text-sm">
                  {page > 1 && (
                    <Link href={`/blog/category/${params.slug}?page=${page - 1}`} className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors">
                      &larr; Previous
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/blog/category/${params.slug}?page=${p}`}
                      className={`px-4 py-2 border transition-colors ${p === page ? "bg-stone-900 text-white border-stone-900" : "border-stone-300 text-stone-700 hover:bg-stone-100"}`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link href={`/blog/category/${params.slug}?page=${page + 1}`} className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors">
                      Next &rarr;
                    </Link>
                  )}
                </div>
              )}
            </div>

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
