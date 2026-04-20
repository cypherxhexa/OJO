import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about OJO — the free overseas job board that aggregates international job opportunities so you can find legitimate work abroad without the hassle.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-16 border-b border-stone-200 bg-stone-50" />}>
        <Header />
      </Suspense>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
          {/* Breadcrumb */}
          <nav className="text-sm text-stone-500 font-sans mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <span className="mx-2 text-stone-300">/</span>
            <span className="text-stone-900">About Us</span>
          </nav>

          {/* Page Header */}
          <header className="mb-12 border-b border-stone-900 pb-8">
            <p className="font-sans text-xs uppercase tracking-widest text-amber-700 mb-3">Our Story</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
              About OJO
            </h1>
            <p className="mt-4 text-stone-600 font-sans text-lg leading-relaxed">
              A free, curated directory of overseas and international job opportunities — built for job seekers, by people who know how hard it is to find legitimate work abroad.
            </p>
          </header>

          {/* Content */}
          <div className="font-sans text-stone-700 leading-relaxed space-y-10">
            
            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">What Is OJO?</h2>
              <p className="mb-4">
                OJO (Overseas Job Openings) is a <strong>free job board</strong> that aggregates international and overseas employment opportunities for job seekers across all industries. We collect listings from official company pages, licensed recruitment agencies, verified hiring sources, and community platforms — then publish them in one clean, searchable directory.
              </p>
              <p>
                We are <strong>not a recruitment agency</strong>. We are an information platform. Our job is to surface legitimate opportunities so you can spend less time searching and more time applying.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">How It Works</h2>
              <ol className="list-decimal list-inside space-y-3 text-stone-700">
                <li>Our team sources job listings from official company websites, LinkedIn, licensed recruiters, government overseas employment portals, and verified community groups.</li>
                <li>Each listing is reviewed before being published. We check for legitimacy, completeness, and clarity before it goes live.</li>
                <li>You browse listings on OJO — for free, with no account required.</li>
                <li>When you click <strong>&quot;Apply Now&quot;</strong>, you are redirected to the original source of the listing — the employer&apos;s website, recruiter page, or hiring portal. OJO does not handle your application.</li>
              </ol>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">Always Free for Job Seekers</h2>
              <p>
                Browsing and applying through OJO is <strong>100% free</strong>. We do not charge job seekers any fees — ever. We earn revenue through display advertising on the site, which allows us to keep the platform free for everyone.
              </p>
              <p className="mt-4">
                If anyone claims to represent OJO and asks you for money to access a job listing or &quot;process&quot; your application — <strong>that is a scam</strong>. Report it to us immediately.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">Our Mission</h2>
              <p>
                Finding a legitimate overseas job is genuinely difficult. There are dozens of platforms, hundreds of agencies, and no shortage of fraudulent listings designed to exploit job seekers. OJO exists to give you a single, trustworthy starting point — a curated, verified directory that respects your time and protects your safety.
              </p>
            </section>

            <section className="bg-stone-100 border border-stone-200 p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">Why Trust Us</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-amber-700 font-bold mt-0.5">✓</span>
                  <span><strong>Manual verification:</strong> Every job is reviewed by our team before being published. We do not auto-import or bulk-publish unvetted listings.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-700 font-bold mt-0.5">✓</span>
                  <span><strong>Active maintenance:</strong> Expired or filled positions are removed regularly. We keep the directory current so you are not wasting time on dead listings.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-700 font-bold mt-0.5">✓</span>
                  <span><strong>Source transparency:</strong> We only post jobs from identifiable, verifiable sources. We do not post from anonymous or suspicious origins.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-700 font-bold mt-0.5">✓</span>
                  <span><strong>No fees, ever:</strong> We never charge job seekers. If something feels off, trust your instincts and report it.</span>
                </li>
              </ul>
            </section>

            {/* CTA */}
            <section className="text-center pt-4">
              <p className="text-stone-600 mb-6">Ready to explore opportunities?</p>
              <Link
                href="/"
                className="inline-block bg-stone-900 text-white font-sans font-semibold px-8 py-3 hover:bg-stone-700 transition-colors"
              >
                Browse Open Positions →
              </Link>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
