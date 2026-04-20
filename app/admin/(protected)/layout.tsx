import Link from "next/link";
import { logoutAdmin } from "@/app/actions/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 md:flex">
      <aside className="w-full md:w-64 bg-stone-900 text-stone-100 flex-shrink-0 flex flex-col">
        <div className="p-6">
          <Link href="/admin">
            <span className="font-serif text-2xl tracking-tight">Admin<span className="text-amber-500">.</span></span>
          </Link>
        </div>
        <nav className="flex flex-col gap-2 px-4 py-2 font-sans text-sm flex-1">
          <Link href="/admin" className="px-4 py-2 hover:bg-stone-800 rounded transition-colors">Dashboard</Link>
          <Link href="/admin/jobs" className="px-4 py-2 hover:bg-stone-800 rounded transition-colors">Manage Jobs</Link>
          <Link href="/admin/messages" className="px-4 py-2 hover:bg-stone-800 rounded transition-colors">Messages</Link>
          <Link href="/admin/blog" className="px-4 py-2 hover:bg-stone-800 rounded transition-colors">Blog</Link>
          <Link href="/admin/settings" className="px-4 py-2 hover:bg-stone-800 rounded transition-colors">Settings</Link>
        </nav>
        <div className="p-4 border-t border-stone-800 text-sm font-sans flex flex-col gap-2">
          <a href="/" className="px-4 py-2 text-stone-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
            View Live Site &rarr;
          </a>
          <form action={logoutAdmin}>
            <button type="submit" className="w-full text-left px-4 py-2 text-stone-400 hover:text-white transition-colors">
              Log Out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 font-sans text-stone-900">
        {children}
      </main>
    </div>
  );
}
