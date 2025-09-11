import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://autoban.example.com";
  const routes = [
    "",
    "/signin",
    "/signup",
    "/forgot-password",
    "/home",
    "/vehicles",
    "/settings",
  ];

  const now = new Date().toISOString();

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
