import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { pageProjects } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/about", "/projects", "/contact", "/privacy"].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  const projects = pageProjects.map((p) => ({
    url: `${site.url}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p.status === "delivered" ? 0.5 : 0.9,
  }));
  return [...pages, ...projects];
}
