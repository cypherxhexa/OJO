import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with OJO — for job submissions, reporting fake listings, advertising inquiries, or general questions.",
};

export default function ContactPage() {
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
            <span className="text-stone-900">Contact Us</span>
          </nav>

          <header className="mb-12 border-b border-stone-900 pb-8">
            <p className="font-sans text-xs uppercase tracking-widest text-amber-700 mb-3">Get In Touch</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
              Contact Us
            </h1>
            <p className="mt-4 text-stone-600 font-sans text-lg leading-relaxed">
              Have a question, want to report a job listing, or interested in advertising? We&apos;d love to hear from you.
            </p>
          </header>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 font-sans text-sm">
            <div className="border border-stone-200 p-5 bg-stone-50">
              <p className="font-bold text-stone-900 mb-1">For Job Seekers</p>
              <p className="text-stone-600">
                We cannot process applications directly. Use the <strong>Apply Now</strong> button on each listing to be redirected to the employer&apos;s official page.
              </p>
            </div>
            <div className="border border-stone-200 p-5 bg-stone-50">
              <p className="font-bold text-stone-900 mb-1">Post a Job Listing</p>
              <p className="text-stone-600">
                Recruiters and employers: email us at{" "}
                <a href={`mailto:${contactEmail}`} className="text-amber-700 underline">{contactEmail}</a>{" "}
                with your job details. We will review and post it for free.
              </p>
            </div>
            <div className="border border-stone-200 p-5 bg-stone-50">
              <p className="font-bold text-stone-900 mb-1">Report a Fake or Expired Job</p>
              <p className="text-stone-600">
                Email us at{" "}
                <a href={`mailto:${contactEmail}`} className="text-amber-700 underline">{contactEmail}</a>{" "}
                with the job title. We will investigate and remove it within 24 hours.
              </p>
            </div>
            <div className="border border-stone-200 p-5 bg-stone-50">
              <p className="font-bold text-stone-900 mb-1">Advertising Inquiries</p>
              <p className="text-stone-600">
                For banner ads and sponsored listings, contact us at{" "}
                <a href={`mailto:${contactEmail}`} className="text-amber-700 underline">{contactEmail}</a>.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
