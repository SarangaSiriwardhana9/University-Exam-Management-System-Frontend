import { z } from 'zod'

export const createDepartmentSchema = z.object({
  departmentCode: z.string()
    .min(2, 'Department code must be at least 2 characters')
    .max(10, 'Department code must be less than 10 characters')
    .regex(/^[A-Z0-9]+$/, 'Department code must contain only uppercase letters and numbers'),
  departmentName: z.string()
    .min(3, 'Department name must be at least 3 characters')
    .max(100, 'Department name must be less than 100 characters'),
  headOfDepartment: z.string().optional(),
  description: z.string().optional()
})

export const updateDepartmentSchema = createDepartmentSchema.partial().omit({ departmentCode: true }).extend({
  isActive: z.boolean().optional()
})

export type CreateDepartmentFormData = z.infer<typeof createDepartmentSchema>
export type UpdateDepartmentFormData = z.infer<typeof updateDepartmentSchema>