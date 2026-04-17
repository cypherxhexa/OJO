"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q")?.toString() || "";
    
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-stone-50/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold tracking-tight text-stone-900 border-2 border-stone-900 px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(28,27,26,1)]">
            OJO.
          </span>
          <span className="hidden md:inline text-sm font-medium text-stone-600 uppercase tracking-widest ml-2">
            Professional Network
          </span>
        </Link>
        
        <form onSubmit={handleSearch} className="flex-1 max-w-sm ml-4 flex">
          <input
            type="text"
            name="q"
            placeholder="Search roles, cities..."
            defaultValue={searchParams.get("q") || ""}
            className="w-full px-4 py-2 border border-stone-300 rounded-none bg-white text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-stone-900 text-stone-50 text-sm font-semibold hover:bg-stone-800 transition-colors border border-stone-900"
          >
            Find
          </button>
        </form>
      </div>
    </header>
  );
}
