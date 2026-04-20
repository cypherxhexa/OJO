import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "OJO Disclaimer — important information about the nature of this job aggregator site and our relationship with employers, recruiters, and third-party listings.",
};

export default function DisclaimerPage() {
  const contactEmail = process.env.CONTACT_EMAIL;
  if (!contactEmail) throw new Error("CONTACT_EMAIL environment variable is missing");

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
            <span className="text-stone-900">Disclaimer</span>
          </nav>

          <header className="mb-12 border-b border-stone-900 pb-8">
            <p className="font-sans text-xs uppercase tracking-widest text-amber-700 mb-3">Legal</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
              Disclaimer
            </h1>
            <p className="mt-4 text-stone-600 font-sans text-lg leading-relaxed">
              Please read this disclaimer carefully before using OJO to search or apply for overseas employment.
            </p>
          </header>

          <div className="font-sans text-stone-700 leading-relaxed space-y-10">

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">We Are Not a Recruitment Agency</h2>
              <p>
                OJO is a <strong>job listing aggregator</strong> — not a licensed recruitment or placement agency. We collect and publish job listings sourced from official company pages, verified recruiters, overseas employment portals, and community hiring sources for the convenience of job seekers.
              </p>
              <p className="mt-4">
                We do not process applications, collect CVs, interview candidates, make hiring decisions, or represent any employer in any capacity. Our role is solely to help you discover opportunities in one place.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">We Redirect — We Do Not Hire</h2>
              <p>
                All jobs listed on OJO link to their original source. When you click &quot;Apply Now,&quot; you are redirected to the employer&apos;s website, a recruiter&apos;s page, a Facebook job post, or another external platform. OJO does not control, manage, or participate in the hiring process after that redirect.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">No Affiliation with Listed Companies</h2>
              <p>
                The companies, employers, and recruiters whose jobs appear on this site are <strong>not affiliated with OJO</strong> unless explicitly stated. Company names, logos, and trademarks belong to their respective owners. The presence of a listing does not indicate a partnership, endorsement, or formal relationship with OJO.
              </p>
            </section>

            <section className="bg-amber-50 border border-amber-200 p-6">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">⚠️ Placement Fees Warning</h2>
              <p className="mb-4">
                Exercise extreme caution before paying any fees to a recruiter or agency you discover through this site. Many overseas recruitment scams operate by charging upfront &quot;visa processing fees,&quot; &quot;placement fees,&quot; or &quot;training fees&quot; — none of which are legitimate in most jurisdictions.
              </p>
              <p className="mb-4">
                <strong>We strongly advise against paying any placement, visa, or processing fees</strong> to any recruiter or agency unless they are officially licensed by a government overseas employment authority in your country. Verify their license before paying anything.
              </p>
              <p>
                If you encounter a suspicious listing or a recruiter demanding payment, report it to us immediately at{" "}
                <a href={`mailto:${contactEmail}`} className="text-amber-700 underline font-semibold">{contactEmail}</a>.
                We will investigate and remove the listing within 24 hours if found to be fraudulent.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">Accuracy of Listings</h2>
              <p>
                While we review listings before publishing, we cannot guarantee that every listing is perfectly accurate, current, or still available. Job conditions, salaries, and requirements may change after we publish. Always verify the details directly with the employer or recruiter before making any decisions.
              </p>
            </section>

            <section className="border-t border-stone-200 pt-8">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">Report a Problem</h2>
              <p>
                Found a suspicious, expired, or misleading listing? Help us keep the platform clean. Email us at{" "}
                <a href={`mailto:${contactEmail}`} className="text-amber-700 underline">{contactEmail}</a>{" "}
                with the job title and we will investigate within 24 hours.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
