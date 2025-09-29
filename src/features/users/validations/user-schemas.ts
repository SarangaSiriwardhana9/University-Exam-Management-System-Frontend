import { z } from 'zod'
import { USER_ROLES } from '@/constants/roles'

export const createUserSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum([
    USER_ROLES.ADMIN,
    USER_ROLES.FACULTY,
    USER_ROLES.STUDENT,
    USER_ROLES.EXAM_COORDINATOR,
    USER_ROLES.INVIGILATOR
  ]),
  contactPrimary: z.string().optional(),
  contactSecondary: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  departmentId: z.string().optional()
})

export const updateUserSchema = createUserSchema.partial().omit({ password: true })

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>