"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Job } from "@prisma/client";
import { AdSlot } from "@/components/AdSlot";
import React from "react";
import { JOB_CATEGORIES } from "@/lib/job-shared";

const CATEGORIES = ["All", ...JOB_CATEGORIES];

function JobCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-stone-200 p-6 rounded-none animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-5 w-20 bg-stone-200 rounded" />
        <div className="h-4 w-16 bg-stone-100 rounded" />
      </div>
      <div className="h-6 w-3/4 bg-stone-200 rounded mb-2" />
      <div className="h-4 w-1/2 bg-stone-100 rounded mb-4" />
      <div className="mt-auto space-y-4">
        <div className="h-4 w-2/3 bg-stone-100 rounded" />
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <div className="h-4 w-24 bg-stone-200 rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-stone-100 rounded" />
            <div className="h-8 w-20 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function JobGrid({ interstitialAdCode, defaultCategory }: { interstitialAdCode?: string; defaultCategory?: string }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") || "";
  const category = defaultCategory || searchParams.get("category") || "All";

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (category && category !== "All") params.set("category", category);
        
        const res = await fetch(`/api/jobs?${params.toString()}`);
        const data = await res.json();

        if (!res.ok || !Array.isArray(data)) {
          throw new Error("Failed to fetch jobs");
        }

        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [q, category]);

  const handleCategoryClick = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  };

  return (
    <section className="w-full">
      {/* Only show category pills on homepage (not on /category/[name]) */}
      {!defaultCategory && (
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar border-b border-stone-200">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`whitespace-nowrap px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat 
                  ? "bg-amber-700 text-white" 
                  : "bg-white text-stone-600 border border-stone-300 hover:border-amber-700 hover:text-amber-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        /* Loading Skeletons */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 px-6">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-stone-100 border-2 border-dashed border-stone-300 flex items-center justify-center">
            <svg className="w-7 h-7 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="font-serif text-xl text-stone-900 mb-2">No jobs found</h3>
          <p className="text-stone-500 font-sans max-w-sm mx-auto mb-6">
            We couldn&apos;t find any openings matching your criteria. Try adjusting your search or explore a different category.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="text-sm font-medium text-amber-700 hover:text-amber-800 underline underline-offset-2"
          >
            View all positions
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, index) => (
            <React.Fragment key={job.id}>
              {index > 0 && index % 6 === 0 && (
                <div className="col-span-full my-6">
                  <AdSlot adCode={interstitialAdCode || null} format="banner" />
                </div>
              )}
            <div 
              className="group flex flex-col bg-white border border-stone-200 p-6 hover:border-amber-700 transition-colors rounded-none"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="px-2 py-0.5 bg-stone-100 text-xs font-semibold text-stone-600 uppercase tracking-widest border border-stone-200">
                  {job.type || "Full-Time"}
                </span>
                <span className="text-xs text-stone-400 font-medium font-sans">
                  {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-1 leading-tight group-hover:text-amber-800 transition-colors line-clamp-2">
                {job.title}
              </h3>
              
              <p className="text-sm font-medium text-stone-600 mb-4 line-clamp-1">
                {job.company}
              </p>

              <div className="mt-auto space-y-4">
                <div className="flex items-center text-sm text-stone-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {job.location}
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-900">{job.salary || "Competitive"}</span>
                  <div className="flex gap-2">
                    <Link 
                      href={`/job/${job.slug}`}
                      className="inline-flex items-center justify-center bg-stone-100 text-stone-900 px-3 py-2 text-xs font-semibold hover:bg-stone-200 transition-colors border border-stone-300"
                    >
                      Details
                    </Link>
                    <Link 
                      href={`/redirect/${job.id}`}
                      className="inline-flex items-center justify-center bg-stone-900 text-stone-50 px-4 py-2 text-xs font-semibold hover:bg-amber-700 transition-colors border border-stone-900"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </section>
  );
}
