import { expect, test, type Page } from "@playwright/test"

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
] as const

const PUBLIC_ROUTES = [
  "/",
  "/services",
  "/professionals",
  "/professionals/pros/seed-pro-profile-1",
  "/book/seed-pro-profile-1/seed-service-plomberie-1",
  "/about",
  "/login",
  "/register",
  "/forgot-password",
  "/legal/cgu",
] as const

async function assertNoHorizontalOverflow(page: Page, route: string) {
  const metrics = await page.evaluate(() => {
    const offenders = Array.from(document.querySelectorAll("*"))
      .filter((el) => {
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.right > window.innerWidth + 1
      })
      .slice(0, 5)
      .map((el) => {
        const r = el.getBoundingClientRect()
        return {
          tag: el.tagName.toLowerCase(),
          cls: typeof el.className === "string" ? el.className.slice(0, 80) : "",
          right: Math.round(r.right),
          width: Math.round(r.width),
        }
      })
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      offenders,
    }
  })
  expect(
    metrics.scrollWidth,
    `Horizontal overflow on ${route}: scrollWidth=${metrics.scrollWidth} > innerWidth=${metrics.innerWidth}, offenders=${JSON.stringify(metrics.offenders)}`
  ).toBeLessThanOrEqual(metrics.innerWidth + 1)
}

async function signInAs(page: Page, email: string, password: string) {
  await page.context().clearCookies()
  await page.goto("/login", { waitUntil: "domcontentloaded" })
  const origin = new URL(page.url()).origin
  const res = await page.request.post(`${origin}/api/auth/sign-in/email`, {
    headers: { Origin: origin },
    data: { email, password },
  })
  expect(res.status(), `Failed Better-Auth signIn for ${email}`).toBe(200)
}

test.describe("HomeServices - Audit Geometrique Multi-Viewports", () => {
  test("1. Routes publiques & auth sans overflow (375 / 768 / 1440)", async ({
    page,
  }) => {
    test.setTimeout(120000)

    let checkedCount = 0
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height })

      for (const route of PUBLIC_ROUTES) {
        const resp = await page.goto(route, { waitUntil: "domcontentloaded" })
        expect(resp?.status(), `Unexpected status for ${route}`).toBe(200)
        await page.waitForTimeout(150)
        await assertNoHorizontalOverflow(page, `${vp.name} ${route}`)
        checkedCount += 1
      }
    }
    console.log(`[GEO-T1] Verified ${checkedCount} public/auth route-viewport checks without horizontal overflow`)
  })

  test("2. Alignement Header / Footer & Grilles iso-hauteur en Desktop (1440px)", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/", { waitUntil: "load" })

    const alignment = await page.evaluate(() => {
      const headerBox = document
        .querySelector("header > div.max-w-7xl")
        ?.getBoundingClientRect()
      const footerBox = document
        .querySelector("footer > div.max-w-7xl")
        ?.getBoundingClientRect()

      const categoryCards = Array.from(
        document.querySelectorAll('[class*="xl:grid-cols-6"] [data-slot="card"]')
      )
      const categoryBottoms = categoryCards.map((c) => c.getBoundingClientRect().bottom)
      const categoryDelta =
        categoryBottoms.length >= 2
          ? Math.max(...categoryBottoms) - Math.min(...categoryBottoms)
          : -1

      return {
        headerLeft: Math.round((headerBox?.left ?? -1) * 100) / 100,
        headerRight: Math.round((headerBox?.right ?? -1) * 100) / 100,
        footerLeft: Math.round((footerBox?.left ?? -1) * 100) / 100,
        footerRight: Math.round((footerBox?.right ?? -1) * 100) / 100,
        categoryCount: categoryCards.length,
        categoryDelta: Math.round(categoryDelta * 100) / 100,
      }
    })

    console.log(`[GEO-T2] Desktop 1440px alignment=${JSON.stringify(alignment)}`)
    expect(alignment.headerLeft).toBeGreaterThanOrEqual(16)
    expect(Math.abs(alignment.headerLeft - alignment.footerLeft)).toBeLessThanOrEqual(2)
    expect(Math.abs(alignment.headerRight - alignment.footerRight)).toBeLessThanOrEqual(2)
    expect(alignment.categoryCount).toBeGreaterThanOrEqual(2)
    expect(alignment.categoryDelta).toBeLessThanOrEqual(2)
  })

  test("3. Marges Auth Card & Padding Drawer Menu sur Mobile (375px)", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/login", { waitUntil: "load" })

    await expect(page.getByRole("button", { name: "Se connecter" })).toBeVisible()
    const card = page.locator('[data-slot="card"]').first()
    await expect(card).toBeVisible()
    const cardRect = await card.boundingBox()
    expect(cardRect).not.toBeNull()
    const cardRightMargin = 375 - (cardRect!.x + cardRect!.width)
    expect(cardRect!.x).toBeGreaterThanOrEqual(12)
    expect(cardRightMargin).toBeGreaterThanOrEqual(12)

    // Ouvrir le menu hamburger apres hydratation et verifier le padding horizontal du drawer
    const menuBtn = page.getByRole("button", { name: "Menu" })
    const sheet = page.locator('[data-slot="sheet-content"]')
    await expect(async () => {
      if (!(await sheet.isVisible())) {
        await menuBtn.click()
      }
      await expect(sheet).toBeVisible({ timeout: 1500 })
    }).toPass({ timeout: 12000 })

    const drawerNavLink = sheet.locator("nav a").first()
    await expect(drawerNavLink).toBeVisible()
    let settledLinkX = -1
    let settledSheetRight = -1
    await expect(async () => {
      const linkBox = await drawerNavLink.boundingBox()
      const sheetBox = await sheet.boundingBox()
      expect(linkBox).not.toBeNull()
      expect(sheetBox).not.toBeNull()
      expect(linkBox!.x).toBeGreaterThanOrEqual(16)
      expect(linkBox!.x - sheetBox!.x).toBeGreaterThanOrEqual(16)
      settledLinkX = linkBox!.x
      settledSheetRight = sheetBox!.x + sheetBox!.width
    }).toPass({ timeout: 3000 })
    console.log(
      `[GEO-T3] Mobile 375px cardLeft=${Math.round(cardRect!.x * 100) / 100}, cardRightMargin=${Math.round(cardRightMargin * 100) / 100}, drawerLinkX=${Math.round(settledLinkX * 100) / 100}, drawerRight=${Math.round(settledSheetRight * 100) / 100}`
    )
  })

  test("4. Dashboards Client, Pro (Calendrier) & Admin conformes sur 3 viewports", async ({
    page,
  }) => {
    test.setTimeout(120000)
    const clientPassword = process.env.SEED_CLIENT_PASSWORD || "ClientServ2026!"
    const proPassword = process.env.SEED_PRO_PASSWORD || "ProServ2026!"
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || "AdminServ2026!"

    const clientRoutes = [
      "/dashboard/client",
      "/dashboard/client/bookings",
      "/dashboard/client/settings",
    ]
    const proRoutes = [
      "/dashboard/pro",
      "/dashboard/pro/schedule",
      "/dashboard/pro/services",
      "/dashboard/pro/profile",
      "/dashboard/pro/availability",
      "/dashboard/pro/settings",
    ]
    const adminRoutes = ["/dashboard/admin"]

    let checkedCount = 0

    await signInAs(page, "client@homeservices.ci", clientPassword)
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      for (const route of clientRoutes) {
        await page.goto(route, { waitUntil: "domcontentloaded" })
        await page.waitForTimeout(150)
        await assertNoHorizontalOverflow(page, `client ${vp.name} ${route}`)
        checkedCount += 1
      }
    }

    await signInAs(page, "amadou.kouassi@homeservices.ci", proPassword)
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      for (const route of proRoutes) {
        await page.goto(route, { waitUntil: "domcontentloaded" })
        await page.waitForTimeout(150)
        await assertNoHorizontalOverflow(page, `pro ${vp.name} ${route}`)
        checkedCount += 1

        if (route === "/dashboard/pro/schedule") {
          await page.locator('[data-slot="calendar"]').first().waitFor({ state: "visible" })
          const calCheck = await page.evaluate(() => {
            const cal = document.querySelector('[data-slot="calendar"]')
            const card = cal?.closest('[data-slot="card"]')
            if (!cal || !card) return null
            const cr = cal.getBoundingClientRect()
            const pr = card.getBoundingClientRect()
            return {
              calRight: Math.round(cr.right * 100) / 100,
              cardRight: Math.round(pr.right * 100) / 100,
            }
          })
          expect(calCheck).not.toBeNull()
          console.log(`[GEO-T4-CAL] ${vp.name} calRight=${calCheck!.calRight} <= cardRight=${calCheck!.cardRight}`)
          expect(calCheck!.calRight).toBeLessThanOrEqual(calCheck!.cardRight + 2)
        }
      }
    }

    await signInAs(page, "admin@homeservices.ci", adminPassword)
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      for (const route of adminRoutes) {
        await page.goto(route, { waitUntil: "domcontentloaded" })
        await page.waitForTimeout(150)
        await assertNoHorizontalOverflow(page, `admin ${vp.name} ${route}`)
        checkedCount += 1
      }
    }

    console.log(`[GEO-T4] Verified ${checkedCount} dashboard route-viewport checks without horizontal overflow`)
  })
})
