/**
 * Endpoint API de supervision de la sante du stack (reserve aux administrateurs).
 */

import { NextResponse } from "next/server"
import { runStackHealthChecks } from "@/lib/stack-health"
import { requireActionSession } from "@/server/auth-guard"

export const dynamic = "force-dynamic"

export async function GET() {
  const authRes = await requireActionSession(["admin"])
  if (authRes.error !== null) {
    return NextResponse.json({ data: null, error: authRes.error }, { status: 403 })
  }

  const report = await runStackHealthChecks()
  return NextResponse.json({ data: report, error: null })
}
