import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  // Rate limit: 3 submissions per IP per hour
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const rl = rateLimit(`contact:${ip}`, 3, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const validSubjects = ["General Inquiry", "Report a Job", "Advertise", "Job Submission"];
    if (!validSubjects.includes(subject)) {
      return NextResponse.json(
        { error: "Invalid subject selection." },
        { status: 400 }
      );
    }

    await prisma.contactMessage.create({
      data: {
        name: String(name).slice(0, 200),
        email: String(email).slice(0, 200),
        subject: String(subject),
        message: String(message).slice(0, 5000),
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
