import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100 py-12 mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="max-w-md">
          <div className="font-serif text-lg font-bold tracking-tight text-stone-900 mb-4">
            Overseas Job Openings
          </div>
          <p className="text-stone-600 text-sm leading-relaxed">
            Curating premium professional opportunities across the globe. We bridge the gap between world-class talent and leading international employers.
          </p>
        </div>

        <div className="flex flex-col text-sm text-stone-600 gap-2 max-w-sm">
          <p className="font-semibold text-stone-900 mb-2">Disclaimer</p>
          <p>
            OJO operates as a job search directory. Clicking &quot;Apply Now&quot; safely redirects you to official employer or approved third-party application portals.
          </p>
          <div className="flex gap-4 mt-2">
            <Link href="/privacy" className="hover:text-stone-900 underline underline-offset-2">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-stone-900 underline underline-offset-2">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
