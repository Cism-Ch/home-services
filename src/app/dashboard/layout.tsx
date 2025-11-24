import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-4rem)]">
            <DashboardSidebar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
