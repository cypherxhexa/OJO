"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { slugify } from "@/lib/utils";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return function ForwardedQuill(props: Record<string, unknown>) { return <RQ {...props} />; };
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-64 border border-stone-300 bg-stone-50 animate-pulse flex items-center justify-center text-stone-400 text-sm">
        Loading editor...
      </div>
    ),
  }
);

import "react-quill/dist/quill.snow.css";

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

interface BlogPostFormProps {
  mode: "create" | "edit";
  postId?: number;
  initialData?: {
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    category: string;
    authorName: string;
    isPublished: boolean;
    isFeatured: boolean;
  };
}

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

export default function BlogPostForm({ mode, postId, initialData }: BlogPostFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [authorName, setAuthorName] = useState(initialData?.authorName || "Editorial Team");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished || false);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newCat, setNewCat] = useState("");
  const [showNewCat, setShowNewCat] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blog/categories");
      if (!res.ok) return; // silently skip — admin is not logged in or API is down
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function addCategory() {
    if (!newCat.trim()) return;
    try {
      const res = await fetch("/api/admin/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCat.trim() }),
      });
      if (res.ok) {
        const cat = await res.json();
        setCategories((prev) => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)));
        setCategory(cat.name);
        setNewCat("");
        setShowNewCat(false);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSubmit(e: FormEvent, publish?: boolean) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const pub = publish !== undefined ? publish : isPublished;
    if (publish !== undefined) setIsPublished(pub);

    const body = {
      title,
      excerpt,
      content,
      coverImage,
      category,
      authorName,
      isPublished: pub,
      isFeatured,
    };

    try {
      const url = mode === "create" ? "/api/admin/blog" : `/api/admin/blog/${postId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const slugPreview = slugify(title);

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6 font-sans">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 text-sm">{error}</div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2 uppercase tracking-wide">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter blog post title"
          className="w-full px-4 py-3 border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
        />
        {slugPreview && (
          <p className="text-xs text-stone-400 mt-1.5">
            Slug: <code className="bg-stone-100 px-1.5 py-0.5">/blog/{slugPreview}</code>
          </p>
        )}
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2 uppercase tracking-wide">
          Excerpt * <span className="normal-case text-stone-400 font-normal">({excerpt.length}/300)</span>
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value.slice(0, 300))}
          required
          rows={3}
          maxLength={300}
          placeholder="Short 2-3 sentence summary shown on blog listing cards"
          className="w-full px-4 py-3 border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors resize-y"
        />
      </div>

      {/* Category + Author Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2 uppercase tracking-wide">
            Category *
          </label>
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="flex-1 px-4 py-3 border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewCat(!showNewCat)}
              className="px-3 py-2 border border-stone-300 text-stone-700 text-sm hover:bg-stone-100 transition-colors flex-shrink-0"
              title="Add new category"
            >
              +
            </button>
          </div>
          {showNewCat && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="New category name"
                className="flex-1 px-3 py-2 border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
              />
              <button
                type="button"
                onClick={addCategory}
                className="px-3 py-2 bg-stone-900 text-white text-sm hover:bg-stone-700 transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2 uppercase tracking-wide">
            Author Name
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Editorial Team"
            className="w-full px-4 py-3 border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
          />
        </div>
      </div>

      {/* Cover Image URL */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2 uppercase tracking-wide">
          Cover Image URL <span className="normal-case text-stone-400 font-normal">(optional)</span>
        </label>
        <input
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="w-full px-4 py-3 border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
        />
        {coverImage && (
          <div className="mt-3 h-40 border border-stone-200 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2 uppercase tracking-wide">
          Content
        </label>
        <div className="border border-stone-300 bg-white blog-editor">
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={QUILL_MODULES}
            theme="snow"
            placeholder="Write your article content..."
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6 py-4 border-t border-stone-200">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 accent-stone-900"
          />
          <span className="text-sm font-semibold text-stone-700">Published</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 accent-amber-700"
          />
          <span className="text-sm font-semibold text-stone-700">Featured Post</span>
          <span className="text-xs text-stone-400">(only one at a time)</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-stone-200">
        <button
          type="button"
          onClick={(e) => handleSubmit(e as unknown as FormEvent, false)}
          disabled={saving}
          className="px-6 py-3 border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-100 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save as Draft"}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e as unknown as FormEvent, true)}
          disabled={saving}
          className="px-6 py-3 bg-stone-900 text-white font-semibold text-sm hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Publishing..." : "Publish"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="px-6 py-3 text-stone-500 text-sm hover:text-stone-700 transition-colors ml-auto"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
