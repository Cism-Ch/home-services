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

  test("2. Alignement Full-Width (1440px & 1920px), Lueur Hero & Grilles iso-hauteur", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })

    for (const width of [1440, 1920] as const) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto("/", { waitUntil: "load" })

      const alignment = await page.evaluate((vw) => {
        const innerEdges = (el: Element | null) => {
          if (!el) return { left: -1, right: -1, outerWidth: 0 }
          const r = el.getBoundingClientRect()
          const cs = window.getComputedStyle(el)
          return {
            left: Math.round((r.left + parseFloat(cs.paddingLeft || "0")) * 100) / 100,
            right: Math.round((r.right - parseFloat(cs.paddingRight || "0")) * 100) / 100,
            outerWidth: Math.round(r.width),
          }
        }
        const headerEdges = innerEdges(
          document.querySelector('header [data-layout-container="page"]')
        )
        const footerEdges = innerEdges(
          document.querySelector('footer [data-layout-container="page"]')
        )

        const heroSection = document.querySelector("section")?.getBoundingClientRect()
        const glowEl = document
          .querySelector('[data-hero-glow="true"]')
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
          vw,
          headerOuterWidth: headerEdges.outerWidth,
          headerLeft: headerEdges.left,
          headerRight: headerEdges.right,
          footerLeft: footerEdges.left,
          footerRight: footerEdges.right,
          glowContained: Boolean(
            glowEl &&
              heroSection &&
              glowEl.top >= heroSection.top - 1 &&
              glowEl.bottom <= heroSection.bottom + 1
          ),
          categoryCount: categoryCards.length,
          categoryDelta: Math.round(categoryDelta * 100) / 100,
        }
      }, width)

      console.log(`[GEO-T2] Desktop ${width}px alignment=${JSON.stringify(alignment)}`)
      expect(alignment.headerOuterWidth).toBe(width)
      expect(alignment.headerLeft).toBeGreaterThanOrEqual(16)
      expect(alignment.headerLeft).toBeLessThanOrEqual(64)
      expect(width - alignment.headerRight).toBeLessThanOrEqual(64)
      expect(Math.abs(alignment.headerLeft - alignment.footerLeft)).toBeLessThanOrEqual(2)
      expect(Math.abs(alignment.headerRight - alignment.footerRight)).toBeLessThanOrEqual(2)
      expect(alignment.glowContained).toBe(true)
      expect(alignment.categoryCount).toBeGreaterThanOrEqual(2)
      expect(alignment.categoryDelta).toBeLessThanOrEqual(2)
    }

    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto("/professionals/pros/seed-pro-profile-7", { waitUntil: "load" })
    await page.locator('[data-layout-container="pro-page"]').waitFor({ state: "visible" })
    const proPageAlignment = await page.evaluate(() => {
      const innerEdges = (el: Element | null) => {
        if (!el) return { left: -1, right: -1 }
        const r = el.getBoundingClientRect()
        const cs = window.getComputedStyle(el)
        return {
          left: Math.round((r.left + parseFloat(cs.paddingLeft || "0")) * 100) / 100,
          right: Math.round((r.right - parseFloat(cs.paddingRight || "0")) * 100) / 100,
        }
      }
      const headerEdges = innerEdges(
        document.querySelector('header [data-layout-container="page"]')
      )
      const proEdges = innerEdges(
        document.querySelector('[data-layout-container="pro-page"]')
      )
      return {
        headerLeft: headerEdges.left,
        headerRight: headerEdges.right,
        proLeft: proEdges.left,
        proRight: proEdges.right,
      }
    })
    console.log(`[GEO-T2-PRO-1920] ${JSON.stringify(proPageAlignment)}`)
    expect(proPageAlignment.proLeft).toBeGreaterThanOrEqual(16)
    expect(proPageAlignment.proLeft).toBeLessThanOrEqual(64)
    expect(Math.abs(proPageAlignment.headerLeft - proPageAlignment.proLeft)).toBeLessThanOrEqual(2)
    expect(Math.abs(proPageAlignment.headerRight - proPageAlignment.proRight)).toBeLessThanOrEqual(2)
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

        if (route === "/dashboard/pro/availability" && vp.name === "desktop") {
          await expect(
            page.getByText("Capacité simultanée", { exact: false })
          ).toBeVisible()
        }

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

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/book/seed-pro-profile-7/seed-service-pro7-2", {
      waitUntil: "load",
    })
    await expect(
      page.getByText("PME • 4 places simultanées", { exact: false }).first()
    ).toBeVisible()
    await page.getByRole("button", { name: /Continuer/i }).click()
    await expect(page.getByText("Durée du projet", { exact: false })).toBeVisible()

    console.log(`[GEO-T4] Verified ${checkedCount} dashboard route-viewport checks without horizontal overflow`)
  })

  test("5. Hero Cover, Zero-CLS Slogan Rotator, Zero blur-3xl & Transitions Sprint 13", async ({
    page,
  }) => {
    test.setTimeout(90000)

    for (const vp of [
      { width: 1440, height: 900 },
      { width: 375, height: 812 },
    ] as const) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto("/", { waitUntil: "load" })
      await expect
        .poll(
          () =>
            page.evaluate(() => {
              const el = document.querySelector('[data-route-transition="true"]')
              return el ? window.getComputedStyle(el).transform : "none"
            }),
          { timeout: 3000 }
        )
        .toBe("none")

      const measureLayout = async () =>
        page.evaluate(() => {
          const hero = document.querySelector('[data-hero-cover="true"]')
          const box = document.querySelector('[data-hero-slogan-box="true"]')
          const heading = document.querySelector("[data-slogan-index]")
          const quickSearch = document.getElementById("quick-search")
          return {
            heroHeight: hero ? hero.getBoundingClientRect().height : -1,
            boxHeight: box ? box.getBoundingClientRect().height : -1,
            sloganIndex: heading?.getAttribute("data-slogan-index") ?? null,
            quickSearchY: quickSearch
              ? quickSearch.getBoundingClientRect().top + window.scrollY
              : -1,
            blur3xlCount: document.querySelectorAll(".blur-3xl").length,
            spinOrbCount: document.querySelectorAll('[class*="animate-[spin"]').length,
          }
        })

      const before = await measureLayout()
      expect(before.heroHeight).toBeGreaterThanOrEqual(vp.height - 64 - 2)
      expect(before.sloganIndex).toBe("0")
      expect(before.blur3xlCount).toBe(0)
      expect(before.spinOrbCount).toBe(0)

      await expect(page.locator("[data-slogan-index]")).not.toHaveAttribute(
        "data-slogan-index",
        "0",
        { timeout: 7000 }
      )
      await page.waitForTimeout(450)

      const after = await measureLayout()
      const boxDelta = Math.abs(after.boxHeight - before.boxHeight)
      const yDelta = Math.abs(after.quickSearchY - before.quickSearchY)
      console.log(
        `[MOTION-T5] ${vp.width}px hero=${Math.round(before.heroHeight)}px, box=${Math.round(before.boxHeight)}px, boxDelta=${boxDelta}px, quickSearchDelta=${yDelta}px`
      )
      expect(boxDelta).toBeLessThanOrEqual(0.5)
      expect(yDelta).toBeLessThanOrEqual(0.5)
    }

    await page.setViewportSize({ width: 1440, height: 900 })
    for (const route of ["/", "/services", "/professionals"] as const) {
      await page.goto(route, { waitUntil: "load" })
      await page.waitForTimeout(300)
      await assertNoHorizontalOverflow(page, `transition ${route}`)
      const routeTransform = await page.evaluate(() => {
        const el = document.querySelector('[data-route-transition="true"]')
        return el ? window.getComputedStyle(el).transform : "none"
      })
      expect(routeTransform).toBe("none")
    }

    await page.goto("/book/seed-pro-profile-7/seed-service-pro7-2", {
      waitUntil: "load",
    })
    await page.getByRole("button", { name: /Continuer/i }).click()
    await expect(page.getByText("Durée du projet", { exact: false })).toBeVisible()
    await page.waitForTimeout(250)
    await assertNoHorizontalOverflow(page, "booking-step-2")
    await page.getByRole("button", { name: /Retour/i }).click()
    await expect(
      page.getByText("Détails de la prestation", { exact: false })
    ).toBeVisible()
    await page.waitForTimeout(250)
    await assertNoHorizontalOverflow(page, "booking-step-1")

    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/", { waitUntil: "load" })
    const reducedState = await page.evaluate(() => {
      const heading = document.querySelector("[data-slogan-index]")
      return {
        opacity: heading ? window.getComputedStyle(heading).opacity : "0",
        progressCount: document.querySelectorAll('[data-scroll-progress="true"]').length,
      }
    })
    expect(reducedState.opacity).toBe("1")
    expect(reducedState.progressCount).toBe(0)
  })
})
