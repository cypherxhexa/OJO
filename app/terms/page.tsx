import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "OJO Terms of Service — understand your rights and obligations when using our free overseas job board.",
};

const LAST_UPDATED = "April 18, 2025";

export default function TermsPage() {
  const contactEmail = process.env.CONTACT_EMAIL || "admin@joboppjarrar.com";

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
            <span className="text-stone-900">Terms of Service</span>
          </nav>

          <header className="mb-12 border-b border-stone-900 pb-8">
            <p className="font-sans text-xs uppercase tracking-widest text-amber-700 mb-3">Legal</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
              Terms of Service
            </h1>
            <p className="mt-4 text-stone-500 font-sans text-sm">Last updated: {LAST_UPDATED}</p>
          </header>

          <div className="font-sans text-stone-700 leading-relaxed space-y-10">

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the OJO website (the &quot;Site&quot;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use this Site. We reserve the right to modify these terms at any time, and continued use of the Site after changes constitutes your acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">2. Nature of the Service</h2>
              <p className="mb-4">
                OJO is a <strong>job listing aggregator and information platform</strong>. We are not a recruitment agency, staffing firm, or employment consultancy. We do not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-700">
                <li>Process job applications on behalf of employers or job seekers</li>
                <li>Guarantee employment, placement, or job interviews</li>
                <li>Represent or act as an agent for any employer or recruiter</li>
                <li>Collect or store your CV or application documents</li>
              </ul>
            </section>

            <section className="bg-stone-100 border-l-4 border-amber-700 p-6">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">3. No Fees — Ever</h2>
              <p>
                OJO is <strong>completely free</strong> for job seekers. We do not charge any fees to browse listings or click through to applications. If anyone claiming to represent OJO contacts you requesting payment for a job, subscription, or application processing — that is a fraudulent act. Report it to us immediately at{" "}
                <a href={`mailto:${contactEmail}`} className="text-amber-700 underline">{contactEmail}</a>.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">4. Accuracy of Job Listings</h2>
              <p>
                We make reasonable efforts to verify job listings before publishing. However, we <strong>cannot guarantee</strong> the accuracy, completeness, currency, or legitimacy of all listings on the Site. Job details — including salary, requirements, and availability — may change after we publish them. You are encouraged to verify all information directly with the hiring employer or recruiter before applying. Apply at your own discretion.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">5. External Links &amp; Third-Party Sites</h2>
              <p>
                When you click &quot;Apply Now,&quot; you are redirected to a third-party website — the employer&apos;s page, a recruiter portal, or another external source. OJO is not responsible for the content, accuracy, privacy practices, or hiring decisions of any external site. We strongly recommend reading the terms and privacy policy of any external website you visit.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">6. Prohibited Use</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-stone-700">
                <li>Scrape, crawl, or systematically download content from this Site without prior written permission</li>
                <li>Submit false or malicious job reports with the intent to harm listings or disrupt the platform</li>
                <li>Use the Site in any way that violates applicable local, national, or international laws</li>
                <li>Transmit any harmful, offensive, or misleading content via our contact form</li>
                <li>Attempt to gain unauthorized access to any part of the Site or its infrastructure</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">7. Advertising</h2>
              <p>
                This Site displays third-party advertisements through Google AdSense and may display sponsored content. The presence of an advertisement does not constitute an endorsement of the advertised product, service, or company by OJO. We are not responsible for the accuracy or content of any advertisement.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">8. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, OJO and its operators shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of this Site, reliance on any job listing, or your dealings with any employer, recruiter, or third party found through the Site. Use of this Site is at your sole risk.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">9. Changes to Terms</h2>
              <p>
                We reserve the right to update or modify these Terms of Service at any time without prior notice. Changes will be indicated by the updated &quot;Last Updated&quot; date. It is your responsibility to review these terms periodically.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">10. Governing Law</h2>
              <p>
                These terms are governed by the laws of Pakistan. Any disputes arising from these terms or your use of the Site shall be subject to the exclusive jurisdiction of the courts of Pakistan.
              </p>
            </section>

            <section className="border-t border-stone-200 pt-8">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">11. Contact</h2>
              <p>
                Questions about these Terms? Contact us at{" "}
                <a href={`mailto:${contactEmail}`} className="text-amber-700 underline">{contactEmail}</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
