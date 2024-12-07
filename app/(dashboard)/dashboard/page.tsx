import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DepartmentList } from "@/components/departments/department-list"

export default function DashboardPage() {
  return (
    <div>
      <DashboardHeader />
      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your AI Departments</h1>
          <p className="text-muted-foreground">
            Manage and monitor your virtual departments
          </p>
        </div>
        <DepartmentList />
      </main>
    </div>
  )
}