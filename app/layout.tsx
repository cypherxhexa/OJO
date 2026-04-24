import type { Metadata } from "next";
import { Lora, DM_Sans } from "next/font/google";
import Script from "next/script";
import { prisma } from "@/lib/db";
import { AdsenseScript } from "@/components/AdsenseScript";
import { validateHeaderCode } from "@/lib/headerCodeValidator";
import "./globals.css";

const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://joboppjarrar.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Job Opp Jarrar - Overseas Job Opportunities",
    template: "%s | Job Opp Jarrar",
  },
  description:
    "Find curated international job opportunities across construction, healthcare, hospitality, engineering, and more. Your bridge to global careers.",
  openGraph: {
    type: "website",
    siteName: "Job Opp Jarrar",
    title: "Job Opp Jarrar - Overseas Job Opportunities",
    description:
      "Find curated international job opportunities across construction, healthcare, hospitality, engineering, and more.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Opp Jarrar - Overseas Job Opportunities",
    description:
      "Curated international job opportunities for global professionals.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let headerCode = "";

  try {
    const headerSetting = await prisma.siteSettings.findUnique({
      where: { key: "headerCode" },
    });

    if (headerSetting?.value) {
      // Only inject if the code passes domain validation — prevents stored XSS
      const validationError = validateHeaderCode(headerSetting.value);
      if (!validationError) {
        headerCode = headerSetting.value;
      } else {
        console.warn("[layout] headerCode blocked by validator:", validationError);
      }
    }
  } catch {
    // Ignore DB errors during build/startup and render without custom head code.
  }

  return (
    <html lang="en" className={`${lora.variable} ${dmSans.variable} scroll-smooth`}>
      <head>
        {/* AdSense script — only renders when NEXT_PUBLIC_ADSENSE_CLIENT is set */}
        <AdsenseScript />
      </head>
      <body className="bg-stone-50 text-stone-900 font-sans antialiased selection:bg-amber-700 selection:text-white">
        {children}
        {headerCode && (
          <Script
            id="dynamic-header-code"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: headerCode }}
          />
        )}
      </body>
    </html>
  );
}
