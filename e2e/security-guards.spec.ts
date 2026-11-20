import { expect, test } from "@playwright/test"

test.describe("HomeServices - Controles Defensifs & Securite Applicative", () => {
  test("1. En-tetes HTTP de securite et suppression X-Powered-By", async ({
    request,
  }) => {
    const res = await request.get("/")
    expect(res.status()).toBe(200)

    const headers = res.headers()
    expect(headers["content-security-policy"]).toContain("default-src 'self'")
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'")
    expect(headers["x-frame-options"]).toBe("DENY")
    expect(headers["x-content-type-options"]).toBe("nosniff")
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin")
    expect(headers["strict-transport-security"]).toContain("max-age=")
    expect(headers["permissions-policy"]).toContain("camera=()")
    expect(headers["x-powered-by"]).toBeUndefined()
  })

  test("2. Protection RBAC non authentifiee sur tous les espaces /dashboard", async ({
    request,
  }) => {
    for (const route of [
      "/dashboard",
      "/dashboard/client",
      "/dashboard/pro",
      "/dashboard/admin",
    ]) {
      const res = await request.get(route, { maxRedirects: 0 })
      expect([307, 308]).toContain(res.status())
      expect(res.headers()["location"]).toContain("/login")
    }
  })

  test("3. Rejet cryptographique des webhooks Paystack et QStash sans/fausse signature", async ({
    request,
  }) => {
    const paystackUnsigned = await request.post("/api/webhooks/paystack", {
      data: { event: "charge.success", data: {} },
    })
    expect(paystackUnsigned.status()).toBe(401)

    const paystackForged = await request.post("/api/webhooks/paystack", {
      headers: { "x-paystack-signature": "0000deadbeef" },
      data: { event: "charge.success", data: {} },
    })
    expect(paystackForged.status()).toBe(401)

    const qstashUnsigned = await request.post("/api/queues/follow-up", {
      data: {
        type: "STORAGE_CLEANUP",
        objectKey: "portfolio/p1/test.jpg",
        proId: "p1",
        requestedAt: new Date().toISOString(),
      },
    })
    expect(qstashUnsigned.status()).toBe(401)

    // Faux JWT alg: none
    const noneJwt =
      "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJleHAiOjk5OTk5OTk5OTl9."
    const qstashAlgNone = await request.post("/api/queues/follow-up", {
      headers: { "upstash-signature": noneJwt },
      data: {
        type: "STORAGE_CLEANUP",
        objectKey: "portfolio/p1/test.jpg",
        proId: "p1",
        requestedAt: new Date().toISOString(),
      },
    })
    expect(qstashAlgNone.status()).toBe(401)
  })

  test("4. Protection CSRF Origin sur l'authentification Better-Auth", async ({
    request,
  }) => {
    const res = await request.post("/api/auth/sign-in/email", {
      headers: { Origin: "https://evil.example" },
      data: {
        email: "client@homeservices.ci",
        password: process.env.SEED_CLIENT_PASSWORD || "ClientServ2026!",
      },
    })
    expect(res.status()).toBe(403)
  })

  test("5. Resistance a l'escalation de privileges Client -> Admin", async ({
    request,
  }) => {
    const homeRes = await request.get("/")
    const appOrigin = new URL(homeRes.url()).origin

    const signInRes = await request.post("/api/auth/sign-in/email", {
      headers: { Origin: appOrigin },
      data: {
        email: "client@homeservices.ci",
        password: process.env.SEED_CLIENT_PASSWORD || "ClientServ2026!",
      },
    })
    expect(signInRes.status()).toBe(200)

    const escalateRes = await request.post("/api/auth/update-user", {
      headers: { Origin: appOrigin },
      data: { userType: "admin", emailVerified: false },
    })
    expect([400, 403]).toContain(escalateRes.status())

    const sessionRes = await request.get("/api/auth/get-session")
    expect(sessionRes.status()).toBe(200)
    const sessionJson = (await sessionRes.json()) as {
      user?: { userType?: string }
    }
    expect(sessionJson.user?.userType).toBe("client")

    const adminRes = await request.get("/dashboard/admin", { maxRedirects: 0 })
    expect([307, 308]).toContain(adminRes.status())
    expect(adminRes.headers()["location"]).toContain("/dashboard/client")
  })

  test("6. Neutralisation des Open Redirects sur /login", async ({ page }) => {
    await page.goto("/login?callbackUrl=https://evil.example")
    await expect(page.locator("form")).toBeVisible()
    await page.goto("/login?callbackUrl=//evil.example")
    await expect(page.locator("form")).toBeVisible()
    await expect(page).toHaveURL(/\/login/)
  })

  test("7. Absence de faux positif 429 sur les lectures repetees GET /api/auth/get-session", async ({
    request,
  }) => {
    for (let i = 0; i < 15; i += 1) {
      const res = await request.get("/api/auth/get-session")
      expect(res.status()).toBe(200)
    }
  })
})
