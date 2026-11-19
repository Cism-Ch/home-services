import { prisma } from "@/lib/prisma"
import { requireRole } from "@/server/auth-guard"
import { getProDashboardData } from "@/server/queries/dashboard"
import { ProProfileView } from "./pro-profile-view"

export const dynamic = "force-dynamic"

export default async function ProProfilePage() {
  const { user } = await requireRole(["pro", "admin"])
  let data = await getProDashboardData(user.id)

  if (!data) {
    // Provisionnement securise si le profil n'existe pas encore (ex: Admin visitant la vue Pro)
    await prisma.proProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        headline: "Prestataire HomeServices",
        bio: "Profil professionnel en cours de configuration.",
        phoneNumber: user.phoneNumber || "",
        whatsappNumber: user.phoneNumber || "",
        availabilityStatus: "AVAILABLE",
        kycStatus: "NOT_SUBMITTED",
      },
    })
    data = await getProDashboardData(user.id)
  }

  return <ProProfileView profile={data!.proProfile} />
}
