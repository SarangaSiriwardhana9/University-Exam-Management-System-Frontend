export type Department = {
  _id: string
  departmentCode: string
  departmentName: string
  headOfDepartment?: string
  headOfDepartmentName?: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CreateDepartmentDto = {
  departmentCode: string
  departmentName: string
  headOfDepartment?: string
  description?: string
}

export type UpdateDepartmentDto = Partial<Omit<CreateDepartmentDto, 'departmentCode'>> & {
  isActive?: boolean
}

export type DepartmentStats = {
  totalDepartments: number
  activeDepartments: number
  departmentsByFaculty: Record<string, number>
}

export type GetDepartmentsParams = {
  isActive?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}