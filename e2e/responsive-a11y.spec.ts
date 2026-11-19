import { expect, test } from "@playwright/test"

const PUBLIC_ROUTES = [
  "/",
  "/services",
  "/professionals",
  "/about",
  "/legal/cgu",
  "/login",
  "/register",
] as const

const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 667 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 800 },
] as const

test.describe("HomeServices - Responsivite Mobile-First & Conformite DOM", () => {
  for (const vp of VIEWPORTS) {
    test(`Aucun debordement horizontal ni imbrication interactive (${vp.name})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })

      for (const route of PUBLIC_ROUTES) {
        await page.goto(route)
        await expect(page.locator("header")).toBeVisible()
        await expect(page.locator("footer")).toBeVisible()

        const overflowCheck = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        }))

        expect(
          overflowCheck.scrollWidth,
          `Horizontal overflow detecte sur ${route} (${vp.name})`
        ).toBeLessThanOrEqual(overflowCheck.innerWidth + 1)

        const nestedInteractiveCount = await page
          .locator('a button, button [role="button"]')
          .count()
        expect(
          nestedInteractiveCount,
          `Elements interactifs imbriques detectes sur ${route} (${vp.name})`
        ).toBe(0)
      }
    })
  }
})
