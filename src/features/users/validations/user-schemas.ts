import { z } from 'zod'
import { USER_ROLES } from '@/constants/roles'

export const createUserSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  role: z.enum([
    USER_ROLES.ADMIN,
    USER_ROLES.FACULTY,
    USER_ROLES.STUDENT,
    USER_ROLES.EXAM_COORDINATOR,
    USER_ROLES.INVIGILATOR
  ]),
  contactPrimary: z.string().max(15).optional().or(z.literal('')),
  contactSecondary: z.string().max(15).optional().or(z.literal('')),
  addressLine1: z.string().max(255).optional().or(z.literal('')),
  addressLine2: z.string().max(255).optional().or(z.literal('')),
  city: z.string().max(50).optional().or(z.literal('')),
  state: z.string().max(50).optional().or(z.literal('')),
  postalCode: z.string().max(10).optional().or(z.literal('')),
  country: z.string().max(50).optional().or(z.literal('')),
  departmentId: z.string().optional().or(z.literal('')),
  year: z.number().int().min(1).max(4).optional(),
  semester: z.number().int().min(1).max(2).optional()
}).refine(
  (data) => {
    // If role is student, year and semester must be provided
    if (data.role === USER_ROLES.STUDENT) {
      return data.year !== undefined && data.semester !== undefined
    }
    return true
  },
  {
    message: "Year and semester are required for students",
    path: ["year"]
  }
)

export const updateUserSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters')
    .optional(),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .optional(),
  role: z.enum([
    USER_ROLES.ADMIN,
    USER_ROLES.FACULTY,
    USER_ROLES.STUDENT,
    USER_ROLES.EXAM_COORDINATOR,
    USER_ROLES.INVIGILATOR
  ]).optional(),
  contactPrimary: z.string().max(15).optional().or(z.literal('')),
  contactSecondary: z.string().max(15).optional().or(z.literal('')),
  addressLine1: z.string().max(255).optional().or(z.literal('')),
  addressLine2: z.string().max(255).optional().or(z.literal('')),
  city: z.string().max(50).optional().or(z.literal('')),
  state: z.string().max(50).optional().or(z.literal('')),
  postalCode: z.string().max(10).optional().or(z.literal('')),
  country: z.string().max(50).optional().or(z.literal('')),
  departmentId: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  year: z.number().int().min(1).max(4).optional(),
  semester: z.number().int().min(1).max(2).optional()
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>