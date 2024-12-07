import { AISetupWizard } from "@/components/departments/ai-setup-wizard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function SetupPage() {
  return (
    <div>
      <DashboardHeader />
      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Set Up Your AI Department</h1>
          <p className="text-muted-foreground">
            Let our AI analyze your needs and create an optimized department structure
          </p>
        </div>
        <AISetupWizard />
      </main>
    </div>
  )
}