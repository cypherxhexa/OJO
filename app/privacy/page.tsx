import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "OJO Privacy Policy — how we collect, use, and protect your data. Includes Google AdSense disclosure and cookie information.",
};

const LAST_UPDATED = "April 18, 2025";

export default function PrivacyPage() {
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
            <span className="text-stone-900">Privacy Policy</span>
          </nav>

          <header className="mb-12 border-b border-stone-900 pb-8">
            <p className="font-sans text-xs uppercase tracking-widest text-amber-700 mb-3">Legal</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
              Privacy Policy
            </h1>
            <p className="mt-4 text-stone-500 font-sans text-sm">Last updated: {LAST_UPDATED}</p>
          </header>

          <div className="font-sans text-stone-700 leading-relaxed space-y-10">

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">1. Introduction</h2>
              <p>
                OJO (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates this website as a free overseas job listing directory. This Privacy Policy explains how we collect, use, and safeguard information when you visit our site. By using OJO, you agree to the practices described in this policy.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">2. Information We Collect</h2>
              <p className="mb-4">We collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-2 text-stone-700">
                <li><strong>Voluntarily submitted data:</strong> If you use our contact form, we collect your name, email address, and the message you submit. We do not collect CVs, payment information, or any other personal documents.</li>
                <li><strong>Automatically collected data:</strong> Like most websites, we automatically receive standard technical information including your IP address, browser type, referring URL, pages visited, and time of visit. This is collected through standard server logs and analytics tools.</li>
                <li><strong>Cookies:</strong> We use cookies for site functionality, analytics, and advertising. See Section 6 for details.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-stone-700">
                <li>To respond to inquiries submitted via our contact form</li>
                <li>To analyze site traffic and improve user experience</li>
                <li>To serve relevant advertisements through Google AdSense</li>
                <li>To detect and prevent fraudulent or abusive activity</li>
              </ul>
              <p className="mt-4">We do not sell, rent, or trade your personal information to third parties.</p>
            </section>

            <section className="bg-stone-100 border-l-4 border-amber-700 p-6">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">4. Google AdSense &amp; Third-Party Advertising</h2>
              <p className="mb-4">
                This site uses <strong>Google AdSense</strong>, a third-party advertising service provided by Google LLC. Google uses cookies — including the <strong>DoubleClick cookie</strong> — to serve ads based on your prior visits to this website or other websites across the internet.
              </p>
              <p className="mb-4">
                These cookies allow Google and its partners to serve ads to you based on your visit to our site and/or other sites. You may opt out of personalized advertising by visiting{" "}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline hover:text-amber-900">
                  Google&apos;s Ads Settings
                </a>.
              </p>
              <p>
                Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{" "}
                <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline hover:text-amber-900">
                  www.aboutads.info/choices
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">5. Third-Party Links</h2>
              <p>
                Our website contains links to third-party job sources, employer pages, and recruitment portals. When you click &quot;Apply Now,&quot; you are redirected to an external website. We are <strong>not responsible</strong> for the privacy practices or content of those external sites. We strongly encourage you to read the privacy policies of any external site you visit.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">6. Cookies</h2>
              <p className="mb-4">
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-700">
                <li><strong>Analytics:</strong> To understand how visitors use our site (e.g., pages visited, time spent)</li>
                <li><strong>Advertising:</strong> To serve relevant ads via Google AdSense</li>
                <li><strong>Functionality:</strong> To remember your session and preferences</li>
              </ul>
              <p className="mt-4">
                You may disable cookies in your browser settings. Please note that disabling cookies may affect certain functionality of this site.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">7. Data Retention</h2>
              <p>
                Contact form submissions are retained for <strong>90 days</strong> and then permanently deleted. Automatically collected analytics data follows the retention policies of our analytics providers.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">8. Your Rights</h2>
              <p>
                You may request the deletion of any personal data you have submitted to us (e.g., via the contact form) by emailing us at{" "}
                <a href={`mailto:${contactEmail}`} className="text-amber-700 underline">{contactEmail}</a>.
                We will process your request within 30 days.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be reflected with a new &quot;Last Updated&quot; date at the top of this page. Continued use of the site after changes constitutes your acceptance of the updated policy.
              </p>
            </section>

            <section className="border-t border-stone-200 pt-8">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">10. Contact</h2>
              <p>
                For privacy-related inquiries, email us at{" "}
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
