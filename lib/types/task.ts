export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'pending' | 'in-progress' | 'completed'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  departmentId: string
  assignedTo: string | null
  createdAt: string
  updatedAt: string
}