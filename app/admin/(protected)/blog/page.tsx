"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog/list");
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error("Failed to fetch posts", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function deletePost(id: number) {
    if (!confirm("Delete this blog post permanently?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Blog Posts</h1>
          <p className="text-stone-500 font-sans text-sm mt-1">{posts.length} total posts</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-stone-900 text-white font-sans font-semibold px-5 py-2.5 text-sm hover:bg-stone-700 transition-colors"
        >
          + New Post
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-stone-100 animate-pulse rounded" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-stone-400 font-sans">
          <p className="text-5xl mb-4">📝</p>
          <p>No blog posts yet.</p>
          <Link href="/admin/blog/new" className="text-amber-700 underline mt-2 inline-block">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="border border-stone-200 rounded overflow-hidden">
          <table className="w-full font-sans text-sm">
            <thead>
              <tr className="bg-stone-100 text-left text-xs uppercase tracking-wide text-stone-500">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 hidden md:table-cell">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden md:table-cell">Views</th>
                <th className="px-4 py-3 hidden md:table-cell">Featured</th>
                <th className="px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-stone-200 hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-stone-900 block truncate max-w-[250px]">
                      {post.title}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-stone-600">{post.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${
                        post.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {post.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-stone-600">{post.views}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {post.isFeatured && (
                      <span className="text-amber-700 font-semibold text-xs">★ Featured</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-stone-500 text-xs">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="px-3 py-1 text-xs border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="px-3 py-1 text-xs border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="px-3 py-1 text-xs border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick link to manage categories */}
      <div className="mt-6 text-sm font-sans">
        <Link href="/admin/blog/categories" className="text-amber-700 hover:text-amber-900 underline">
          Manage Blog Categories →
        </Link>
      </div>
    </div>
  );
}
