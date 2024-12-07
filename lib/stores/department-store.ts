"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'

export interface Department {
  id: string
  name: string
  type: 'sales' | 'customer-service' | 'finance' | 'operations'
  description: string
  icon: string
  taskCount: number
  status: 'active' | 'archived'
  createdAt: string
}

interface DepartmentState {
  departments: Department[]
  selectedDepartments: string[]
  loading: boolean
  addDepartments: (departments: Omit<Department, 'id' | 'createdAt'>[]) => void
  removeDepartment: (id: string) => void
  getDepartment: (id: string) => Department | undefined
  updateDepartment: (id: string, updates: Partial<Department>) => void
  setSelectedDepartments: (ids: string[]) => void
  clearSelectedDepartments: () => void
  isDepartmentTypeSelected: (type: Department['type']) => boolean
}

export const useDepartmentStore = create<DepartmentState>()(
  persist(
    (set, get) => ({
      departments: [],
      selectedDepartments: [],
      loading: false,

      isDepartmentTypeSelected: (type) => {
        return get().departments.some(dept => dept.type === type && dept.status === 'active')
      },

      setSelectedDepartments: (ids) => {
        set({ selectedDepartments: ids })
      },

      clearSelectedDepartments: () => {
        set({ selectedDepartments: [] })
      },

      addDepartments: (departments) => {
        const newDepartments = departments.map(dept => ({
          ...dept,
          id: nanoid(),
          createdAt: new Date().toISOString()
        }))
        
        set(state => ({
          departments: [...state.departments, ...newDepartments],
          selectedDepartments: []
        }))
      },

      removeDepartment: (id) => {
        set(state => ({
          departments: state.departments.filter(dept => dept.id !== id)
        }))
      },

      updateDepartment: (id, updates) => {
        set(state => ({
          departments: state.departments.map(dept =>
            dept.id === id ? { ...dept, ...updates } : dept
          )
        }))
      },

      getDepartment: (id) => get().departments.find((dept) => dept.id === id),
    }),
    {
      name: 'department-store',
    }
  )
)