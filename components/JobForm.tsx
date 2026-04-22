"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createJob, updateJob } from "@/app/actions/adminJobs";
import { JOB_CATEGORIES, JOB_TYPES } from "@/lib/job-shared";
import { Job } from "@prisma/client";
import dynamic from "next/dynamic";

// Import the CSS for react-quill
import "react-quill/dist/quill.snow.css";

// We need to dynamically import ReactQuill to prevent SSR window errors in Next.js
const ReactQuill = dynamic(
  async () => {
    const mod = await import("react-quill");
    return mod.default;
  },
  {
    ssr: false,
    loading: () => <div className="h-40 bg-stone-50 border border-stone-200 animate-pulse rounded" />,
  }
);

// Define customized toolbar options similar to MS Word's basic formatting
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
];

const MAX_IMAGES = 8;

export default function JobForm({ initialData }: { initialData?: Partial<Job> | null }) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState(initialData?.description || "");
  const router = useRouter();

  // Parse initial jobImages from JSON string
  const parseImages = (raw: string | null | undefined): string[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((u) => typeof u === "string") : [];
    } catch {
      return [];
    }
  };

  const [images, setImages] = useState<string[]>(
    parseImages(initialData?.jobImages as string | null | undefined)
  );
  const [imageInput, setImageInput] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    if (images.length >= MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }
    setImages((prev) => [...prev, url]);
    setImageInput("");
    imageInputRef.current?.focus();
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Ensure the advanced rich-text description is appended to formData
    formData.set("description", description);

    // Encode images array as JSON string
    formData.set("jobImages", images.length > 0 ? JSON.stringify(images) : "");

    setIsLoading(true);
    setError("");
    let res;
    if (initialData?.id) {
      res = await updateJob(initialData.id, formData);
    } else {
      res = await createJob(formData);
    }

    if (res.success) {
      router.push("/admin/jobs");
      router.refresh();
    } else {
      setError(res.error || "Failed to save job");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} method="POST" className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 font-sans flex flex-col gap-5">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Job Title *</label>
          <input required type="text" name="title" defaultValue={initialData?.title} className="w-full border border-stone-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Company *</label>
          <input required type="text" name="company" defaultValue={initialData?.company} className="w-full border border-stone-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Location *</label>
          <input required type="text" name="location" defaultValue={initialData?.location} className="w-full border border-stone-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Salary (Optional)</label>
          <input type="text" name="salary" defaultValue={initialData?.salary || ""} placeholder="$120k - $150k" className="w-full border border-stone-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Category *</label>
          <select required name="category" defaultValue={initialData?.category || "Engineering"} className="w-full border border-stone-300 rounded px-3 py-2 bg-white">
            {JOB_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Job Type *</label>
          <select required name="jobType" defaultValue={initialData?.type || "Full Time"} className="w-full border border-stone-300 rounded px-3 py-2 bg-white">
            {JOB_TYPES.map((jobType) => (
              <option key={jobType} value={jobType}>
                {jobType}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">External URL (for redirect) *</label>
        <input required type="url" name="externalUrl" defaultValue={initialData?.externalUrl} placeholder="https://..." className="w-full border border-stone-300 rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Description *</label>
        <div className="bg-white [&_.ql-container]:min-h-[200px] [&_.ql-editor]:text-stone-800 [&_.ql-toolbar]:border-stone-300 [&_.ql-container]:border-stone-300 [&_.ql-container]:rounded-b [&_.ql-toolbar]:rounded-t [&_.ql-editor]:font-sans">
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={modules}
            formats={formats}
            placeholder="Write a professional job description here (bold, bullets, headings are supported)..."
          />
        </div>
      </div>

      {/* ── Image Gallery Section ─────────────────────────────────────────── */}
      <div className="border-t border-stone-100 pt-5">
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Image Gallery{" "}
          <span className="font-normal text-stone-400">(optional — max {MAX_IMAGES} images)</span>
        </label>
        <p className="text-xs text-stone-400 mb-3">
          Paste a direct image URL (ending in .jpg, .png, .webp, etc.) and click Add Image.
        </p>

        {/* URL input row */}
        <div className="flex gap-2 mb-4">
          <input
            ref={imageInputRef}
            type="url"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 border border-stone-300 rounded px-3 py-2 text-sm"
            disabled={images.length >= MAX_IMAGES}
          />
          <button
            type="button"
            onClick={addImage}
            disabled={images.length >= MAX_IMAGES || !imageInput.trim()}
            className="px-4 py-2 bg-stone-900 text-white text-sm rounded hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            Add Image
          </button>
        </div>

        {/* Thumbnail row */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((url, idx) => (
              <div key={idx} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Gallery image ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded border border-stone-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23e7e5e4' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2378716c' font-size='10'%3EInvalid%3C/text%3E%3C/svg%3E";
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove image ${idx + 1}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <p className="text-xs text-stone-400 italic">No images added yet.</p>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input type="checkbox" id="isActive" name="isActive" defaultChecked={initialData ? initialData.isActive : true} className="w-4 h-4" />
        <label htmlFor="isActive" className="text-sm font-medium text-stone-700">Active (Visible on site)</label>
      </div>

      <div className="pt-4 border-t border-stone-100 flex justify-end gap-3 mt-4">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-stone-300 text-stone-700 rounded hover:bg-stone-50 transition-colors font-medium">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors font-bold shadow-sm">
          {isLoading ? "Saving..." : "Save Job"}
        </button>
      </div>
    </form>
  );
}
