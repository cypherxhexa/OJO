"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/app/actions/auth";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await loginAdmin(formData);
    if (res.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(res.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="bg-white border border-stone-200 p-8 rounded-lg shadow-sm w-full max-w-sm">
        <h1 className="font-serif text-2xl text-stone-900 mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit} method="POST" className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-sans text-stone-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full border border-stone-300 rounded px-3 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter password"
            />
          </div>
          {error && <p className="text-red-500 text-sm font-sans">{error}</p>}
          <button
            type="submit"
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-sans py-2 rounded transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
