import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/redirect/"],
      },
    ],
    sitemap: "https://joboppjarrar.com/sitemap.xml",
  };
}
