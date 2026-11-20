import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { requireSession } from "@/server/auth-guard"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await requireSession()

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 md:py-8 flex flex-col md:flex-row gap-6 md:gap-8 min-h-[calc(100vh-4rem)]">
      <DashboardSidebar
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          userType: user.userType,
        }}
      />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
