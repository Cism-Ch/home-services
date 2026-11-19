import { expect, test } from "@playwright/test"

test.describe("HomeServices - Parcours Critiques Production", () => {
  test("1. Catalogue public, services et artisans accessibles", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("header")).toBeVisible()
    await expect(page.locator("footer")).toBeVisible()

    await page.goto("/services")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()

    await page.goto("/professionals")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  })

  test("2. Protection RBAC : redirection /login sans session authentifiee", async ({
    page,
  }) => {
    for (const protectedRoute of [
      "/dashboard/client",
      "/dashboard/pro",
      "/dashboard/admin",
    ]) {
      await page.goto(protectedRoute)
      await expect(page).toHaveURL(/\/login/)
    }
  })

  test("3. Contrats de securite API : rejet des webhooks non signes (401)", async ({
    request,
  }) => {
    const paystackRes = await request.post("/api/webhooks/paystack", {
      data: { event: "charge.success", data: {} },
    })
    expect(paystackRes.status()).toBe(401)

    const qstashRes = await request.post("/api/queues/follow-up", {
      data: { type: "STORAGE_CLEANUP", objectKey: "test", proId: "test" },
    })
    expect(qstashRes.status()).toBe(401)
  })

  test("4. Conformite legale, SEO (robots/sitemap) et page 404", async ({
    page,
    request,
  }) => {
    for (const legalRoute of [
      "/legal/cgu",
      "/legal/confidentialite",
      "/legal/mentions-legales",
    ]) {
      const res = await page.goto(legalRoute)
      expect(res?.status()).toBe(200)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    }

    const robotsRes = await request.get("/robots.txt")
    expect(robotsRes.status()).toBe(200)
    expect(await robotsRes.text()).toContain("Sitemap:")

    const sitemapRes = await request.get("/sitemap.xml")
    expect(sitemapRes.status()).toBe(200)
    expect(await sitemapRes.text()).toContain("/professionals")

    const notFoundRes = await page.goto("/route-inexistante-e2e-check")
    expect(notFoundRes?.status()).toBe(404)
  })
})
