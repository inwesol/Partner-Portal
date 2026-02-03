'use client'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

const SIDEBAR_HIDDEN_PATHS = ['/sign-in', '/forgot-password']

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isSignedIn, isLoaded } = useUser()

  const isAuthRoute = SIDEBAR_HIDDEN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  )

  // On auth routes (sign-in, forgot-password), never show sidebar so it doesn't flash on refresh.
  // On app routes: wrap with SidebarProvider and show sidebar when loaded and signed in,
  // or when Clerk hasn't loaded yet (avoids collapse-then-open flash during client navigation).
  const showSidebar =
    !isAuthRoute && (!isLoaded || isSignedIn)

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