import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100 py-12 mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          
          {/* Brand */}
          <div className="max-w-xs">
            <div className="font-serif text-lg font-bold tracking-tight text-stone-900 mb-3">
              Overseas Job Openings
            </div>
            <p className="text-stone-600 text-sm leading-relaxed">
              A free directory of curated international job opportunities. We bridge the gap between talented professionals and verified overseas employers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col text-sm gap-2">
            <p className="font-semibold text-stone-900 mb-1 uppercase tracking-wide text-xs">Explore</p>
            <Link href="/" className="text-stone-600 hover:text-stone-900 transition-colors">Browse Jobs</Link>
            <Link href="/about" className="text-stone-600 hover:text-stone-900 transition-colors">About Us</Link>
            <Link href="/blog" className="text-stone-600 hover:text-stone-900 transition-colors">Blog</Link>
            <Link href="/contact" className="text-stone-600 hover:text-stone-900 transition-colors">Contact Us</Link>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col text-sm gap-2">
            <p className="font-semibold text-stone-900 mb-1 uppercase tracking-wide text-xs">Legal</p>
            <Link href="/privacy" className="text-stone-600 hover:text-stone-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-stone-600 hover:text-stone-900 transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="text-stone-600 hover:text-stone-900 transition-colors">Disclaimer</Link>
          </div>

          {/* Disclaimer blurb */}
          <div className="max-w-xs text-sm text-stone-600">
            <p className="font-semibold text-stone-900 mb-1">Notice</p>
            <p className="leading-relaxed">
              OJO is a job search directory. Clicking &quot;Apply Now&quot; redirects you to the employer&apos;s official page. We never charge job seekers any fees.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-200 text-xs text-stone-400 font-sans text-center">
          © {new Date().getFullYear()} Overseas Job Openings. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
