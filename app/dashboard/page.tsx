"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, GraduationCap, Phone, Users } from "lucide-react"
import Link from "next/link"
import { StatCard } from "@/components/dashboard/stat-card"
import { SessionBreakdown } from "@/components/dashboard/session-breakdown"
import { MonthlyProgressChart } from "@/components/dashboard/monthly-progress-chart"
import { dashboardStats, monthlyProgressData } from "@/lib/data/mock-dashboard"

export default function Dashboard() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Registered Students"
            value={dashboardStats.totalRegistered}
            icon={Users}
            className="bg-[#EFF6FF] border-blue-200"
            iconClassName="text-blue-600"
          />
          <StatCard
            title="Preliminary Call Completed"
            value={dashboardStats.preliminaryCallCompleted}
            icon={Phone}
            className="bg-[#F0FDF4] border-green-200"
            iconClassName="text-green-600"
          />
          <StatCard
            title="Currently in Coaching"
            value={dashboardStats.inCoaching}
            icon={GraduationCap}
            className="bg-[#F5F3FF] border-violet-200"
            iconClassName="text-violet-600"
          />
          <StatCard
            title="Completed Coaching"
            value={dashboardStats.completedCoaching}
            icon={CheckCircle}
            className="bg-[#ECFDF5] border-emerald-200"
            iconClassName="text-emerald-600"
          />
        </section>

        {/* Session Breakdown */}
        <SessionBreakdown sessionBreakdown={dashboardStats.sessionBreakdown} />

        {/* Monthly Progress Chart */}
        <MonthlyProgressChart data={monthlyProgressData} />
      </main>
    </SidebarInset>
  )
}
