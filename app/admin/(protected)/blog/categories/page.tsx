"use client";

import { useState, useEffect, useCallback } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminBlogCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog/categories");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function addCategory() {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/admin/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        const cat = await res.json();
        setCategories((prev) => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)));
        setNewName("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  }

  async function deleteCategory(id: number) {
    if (!confirm("Delete this category? Posts using it will keep their category text.")) return;
    await fetch(`/api/admin/blog/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-stone-900">Blog Categories</h1>
        <p className="text-stone-500 font-sans text-sm mt-1">
          Manage categories used for blog posts
        </p>
      </div>

      {/* Add Category */}
      <div className="flex gap-3 mb-8 font-sans">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
          className="flex-1 max-w-sm px-4 py-3 border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
        />
        <button
          onClick={addCategory}
          disabled={adding || !newName.trim()}
          className="px-5 py-3 bg-stone-900 text-white font-semibold text-sm hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add Category"}
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-stone-100 animate-pulse rounded" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-stone-400 font-sans">
          <p>No categories yet. Add one above.</p>
        </div>
      ) : (
        <div className="border border-stone-200 rounded overflow-hidden">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between px-5 py-3 border-b border-stone-200 last:border-b-0 hover:bg-stone-50 font-sans"
            >
              <div>
                <span className="font-semibold text-stone-900">{cat.name}</span>
                <span className="ml-3 text-xs text-stone-400">/{cat.slug}</span>
              </div>
              <button
                onClick={() => deleteCategory(cat.id)}
                className="px-3 py-1 text-xs border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
