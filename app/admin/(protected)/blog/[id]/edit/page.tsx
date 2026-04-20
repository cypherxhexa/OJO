"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import BlogPostForm from "@/components/BlogPostForm";

interface BlogPostData {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  authorName: string;
  isPublished: boolean;
  isFeatured: boolean;
}

export default function AdminEditBlogPostPage() {
  const params = useParams();
  const postId = parseInt(params.id as string);
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/blog/${postId}/detail`);
      if (!res.ok) throw new Error("Failed to load post");
      const data = await res.json();
      setPost(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-1/3 bg-stone-100 animate-pulse rounded" />
        <div className="h-64 bg-stone-100 animate-pulse rounded" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-20 text-stone-400 font-sans">
        <p className="text-5xl mb-4">⚠️</p>
        <p>{error || "Post not found"}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-stone-900">Edit Blog Post</h1>
        <p className="text-stone-500 font-sans text-sm mt-1">
          Editing: {post.title}
        </p>
      </div>
      <BlogPostForm
        mode="edit"
        postId={post.id}
        initialData={{
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage || "",
          category: post.category,
          authorName: post.authorName,
          isPublished: post.isPublished,
          isFeatured: post.isFeatured,
        }}
      />
    </div>
  );
}
