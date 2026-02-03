'use client'
import { useUser } from '@clerk/nextjs'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser()

  // Always wrap with SidebarProvider so pages that use SidebarTrigger/useSidebar
  // (dashboard, students, student detail) never throw "useSidebar must be used within SidebarProvider"
  // during SSR or before Clerk has loaded.
  // When !isLoaded, keep showing sidebar to avoid collapse-then-open flash during client navigation
  // (Clerk can briefly report isLoaded: false when switching routes).
  const showSidebar = !isLoaded || isSignedIn

  return (
    <SidebarProvider>
      {showSidebar ? (
        <div className="flex h-screen w-full">
          <div className="border-r border-gray-200 shadow-sm">
            <AppSidebar />
          </div>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      ) : (
        <>{children}</>
      )}
    </SidebarProvider>
  )
}