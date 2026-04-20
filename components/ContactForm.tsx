"use client";

import { useState, FormEvent } from "react";

const SUBJECTS = [
  "General Inquiry",
  "Report a Job",
  "Advertise",
  "Job Submission",
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 p-8 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">Message Sent!</h3>
        <p className="text-stone-600 font-sans mb-6">
          Thank you for reaching out. We will get back to you as soon as possible.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-amber-700 font-sans font-semibold underline hover:text-amber-900"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 text-sm font-sans">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-semibold text-stone-700 mb-2 font-sans uppercase tracking-wide">
            Your Name *
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            placeholder="e.g. Ahmad Khan"
            className="w-full px-4 py-3 border border-stone-300 bg-white font-sans text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold text-stone-700 mb-2 font-sans uppercase tracking-wide">
            Email Address *
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-stone-300 bg-white font-sans text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-sm font-semibold text-stone-700 mb-2 font-sans uppercase tracking-wide">
          Subject *
        </label>
        <select
          id="contact-subject"
          name="subject"
          required
          className="w-full px-4 py-3 border border-stone-300 bg-white font-sans text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
        >
          <option value="">Select a subject...</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-stone-700 mb-2 font-sans uppercase tracking-wide">
          Message *
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="Write your message here..."
          className="w-full px-4 py-3 border border-stone-300 bg-white font-sans text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full md:w-auto bg-stone-900 text-white font-sans font-semibold px-8 py-3 hover:bg-stone-700 transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
