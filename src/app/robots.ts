import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ).replace(/\/$/, "")

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/services", "/professionals", "/about", "/legal/"],
        disallow: ["/dashboard/", "/api/", "/book/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
