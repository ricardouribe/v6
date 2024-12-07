"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { BarChart3, Headphones, Calculator, Users, Check } from "lucide-react"
import { useDepartmentStore } from "@/lib/stores/department-store"

const departments = [
  {
    id: "sales",
    name: "Sales & Marketing",
    description: "AI-driven campaign management and lead generation",
    icon: "BarChart3",
    type: "sales" as const,
    taskCount: 0
  },
  {
    id: "customer-service",
    name: "Customer Service",
    description: "24/7 customer support and ticket management",
    icon: "Headphones",
    type: "customer-service" as const,
    taskCount: 0
  },
  {
    id: "finance",
    name: "Finance & Admin",
    description: "Automated bookkeeping and financial reporting",
    icon: "Calculator",
    type: "finance" as const,
    taskCount: 0
  },
  {
    id: "operations",
    name: "Project Management",
    description: "Task automation and progress tracking",
    icon: "Users",
    type: "operations" as const,
    taskCount: 0
  }
]

const iconMap = {
  'BarChart3': BarChart3,
  'Headphones': Headphones,
  'Calculator': Calculator,
  'Users': Users,
}

export function DepartmentSelection() {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { addDepartments } = useDepartmentStore()

  const toggleDepartment = (id: string) => {
    setSelectedDepartments(prev =>
      prev.includes(id)
        ? prev.filter(dep => dep !== id)
        : [...prev, id]
    )
  }

  const handleContinue = async () => {
    if (selectedDepartments.length === 0) {
      toast({
        title: "Please select departments",
        description: "You need to select at least one department to continue.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      const selectedDepts = departments
        .filter(dept => selectedDepartments.includes(dept.id))
        .map(dept => ({
          ...dept,
          status: 'active' as const,
          userId: '2' // Using default user ID
        }))
      
      await addDepartments(selectedDepts)
      
      toast({
        title: "Departments Created",
        description: `${selectedDepts.length} department${selectedDepts.length > 1 ? 's' : ''} added successfully.`
      })
      
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create departments",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((department) => {
          const Icon = iconMap[department.icon as keyof typeof iconMap]
          const isSelected = selectedDepartments.includes(department.id)
          
          return (
            <Card
              key={department.id}
              className={`cursor-pointer transition-all hover:border-primary/50 ${
                isSelected ? "border-primary ring-2 ring-primary ring-offset-2" : ""
              }`}
              onClick={() => toggleDepartment(department.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{department.name}</h3>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {department.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedDepartments.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">
              Selected Departments ({selectedDepartments.length})
            </h3>
            <div className="space-y-2">
              {selectedDepartments.map((id) => {
                const dept = departments.find(d => d.id === id)
                if (!dept) return null
                
                return (
                  <div key={id} className="flex items-center text-sm">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span>{dept.name}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => setSelectedDepartments(departments.map(d => d.id))}
        >
          Select All
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={selectedDepartments.length === 0 || isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Continue to Dashboard"}
        </Button>
      </div>
    </div>
  )
}