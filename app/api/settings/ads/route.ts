import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [interstitialSetting, homepageSetting] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { key: "interstitialAdCode" } }),
      prisma.siteSettings.findUnique({ where: { key: "homepageBannerAdCode" } }),
    ]);

    return NextResponse.json({
      interstitialAdCode: interstitialSetting?.value || "",
      homepageBannerAdCode: homepageSetting?.value || "",
    });
  } catch {
    return NextResponse.json(
      { interstitialAdCode: "", homepageBannerAdCode: "" },
      { status: 500 }
    );
  }
}
