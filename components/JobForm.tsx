"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJob, updateJob } from "@/app/actions/adminJobs";
import { JOB_CATEGORIES, JOB_TYPES } from "@/lib/job-shared";

import { Job } from "@prisma/client";

export default function JobForm({ initialData }: { initialData?: Partial<Job> | null }) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
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
      router.refresh(); // Ensure the table updates
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
        <textarea required name="description" defaultValue={initialData?.description} rows={8} className="w-full border border-stone-300 rounded px-3 py-2" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" name="isActive" defaultChecked={initialData ? initialData.isActive : true} className="w-4 h-4" />
        <label htmlFor="isActive" className="text-sm font-medium text-stone-700">Active (Visible on site)</label>
      </div>

      <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-stone-300 text-stone-700 rounded hover:bg-stone-50 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors">
          {isLoading ? "Saving..." : "Save Job"}
        </button>
      </div>
    </form>
  );
}
