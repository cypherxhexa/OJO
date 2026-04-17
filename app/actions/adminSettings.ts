"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveSettings(formData: FormData) {
  try {
    const headerCode = formData.get("headerCode") as string;
    const interstitialAdCode = formData.get("interstitialAdCode") as string;
    const siteName = formData.get("siteName") as string;
    const siteTagline = formData.get("siteTagline") as string;

    const upserts = [
      prisma.siteSettings.upsert({
        where: { key: "headerCode" },
        update: { value: headerCode },
        create: { key: "headerCode", value: headerCode },
      }),
      prisma.siteSettings.upsert({
        where: { key: "interstitialAdCode" },
        update: { value: interstitialAdCode },
        create: { key: "interstitialAdCode", value: interstitialAdCode },
      }),
    ];

    if (siteName !== undefined && siteName !== null) {
      upserts.push(
        prisma.siteSettings.upsert({
          where: { key: "siteName" },
          update: { value: siteName },
          create: { key: "siteName", value: siteName },
        })
      );
    }

    if (siteTagline !== undefined && siteTagline !== null) {
      upserts.push(
        prisma.siteSettings.upsert({
          where: { key: "siteTagline" },
          update: { value: siteTagline },
          create: { key: "siteTagline", value: siteTagline },
        })
      );
    }

    await Promise.all(upserts);

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to save settings:", error);
    return { success: false, error: "Failed to save settings." };
  }
}
