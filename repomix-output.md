 

## File: next.config.ts
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

## File: postcss.config.mjs
```
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
```

## File: src/app/(auth)/login/page.tsx
```typescript
import { LoginForm } from '@/features/auth/components/login-form'

export default function LoginPage() {
  return <LoginForm />
}
```

## File: src/app/(auth)/register/page.tsx
```typescript
import { RegisterForm } from '@/features/auth/components/register-form'

export default function RegisterPage() {
  return <RegisterForm />
}
```

## File: src/constants/roles.ts
```typescript
export const USER_ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty', 
  STUDENT: 'student',
  EXAM_COORDINATOR: 'exam_coordinator',
  INVIGILATOR: 'invigilator'
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

export const QUESTION_TYPES = {
  MCQ: 'mcq',
  SHORT_ANSWER: 'short_answer',
  LONG_ANSWER: 'long_answer',
  FILL_BLANK: 'fill_blank',
  TRUE_FALSE: 'true_false'
} as const

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES]

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS]

export const BLOOMS_TAXONOMY = {
  REMEMBER: 'remember',
  UNDERSTAND: 'understand',
  APPLY: 'apply',
  ANALYZE: 'analyze',
  EVALUATE: 'evaluate',
  CREATE: 'create'
} as const

export type BloomsTaxonomy = typeof BLOOMS_TAXONOMY[keyof typeof BLOOMS_TAXONOMY]
```

## File: src/features/auth/hooks/use-api.ts
```typescript
import { apiClient } from '@/lib/api/client'
import type { LoginDto, RegisterDto, LoginResponse } from '../types/auth'
import { ApiResponse } from '@/types/common'

export const authService = {
  login: (data: LoginDto): Promise<LoginResponse> =>   
    apiClient.post('/api/v1/auth/login', data),

  register: (data: RegisterDto): Promise<LoginResponse> =>
    apiClient.post('/api/v1/auth/register', data),

  logout: (): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/api/v1/auth/logout'),

  refreshToken: (): Promise<ApiResponse<{ accessToken: string }>> =>
    apiClient.post('/api/v1/auth/refresh'),

  forgotPassword: (email: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/api/v1/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/api/v1/auth/reset-password', { token, password }),

  setToken: (token: string | null): void => {
    apiClient.setToken(token)
  }
}
```

## File: src/features/users/components/user-columns.tsx
```typescript
'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon } from 'lucide-react'
import type { User } from '../types/users'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/constants/roles'

const getRoleBadgeClass = (role: UserRole) => {
  const roleClasses = {
    admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    faculty: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    student: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    exam_coordinator: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    invigilator: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
  } as const

  return roleClasses[role] || 'bg-muted'
}

const formatRole = (role: string) => {
  return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

type UserColumnsProps = {
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onView: (user: User) => void
}

export const getUserColumns = ({ onEdit, onDelete, onView }: UserColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: 'fullName',
    header: 'Full Name',
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
            {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <div className="font-medium">{user.fullName}</div>
            <div className="text-sm text-muted-foreground">@{user.username}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.original.role
      return (
        <Badge variant="outline" className={cn('font-medium', getRoleBadgeClass(role))}>
          {formatRole(role)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'contactPrimary',
    header: 'Phone',
    cell: ({ row }) => row.original.contactPrimary || '—',
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return date.toLocaleDateString()
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(user)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(user)}
              className="text-destructive focus:text-destructive"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
```

## File: src/features/users/hooks/use-user-mutations.ts
```typescript
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersService } from './use-users'
import type { CreateUserDto, UpdateUserDto } from '../types/users'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserDto) => usersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User Created', {
        description: 'User has been created successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create User', {
        description: error.message || 'An error occurred while creating the user.'
      })
    }
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      usersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User Updated', {
        description: 'User has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update User', {
        description: error.message || 'An error occurred while updating the user.'
      })
    }
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User Deleted', {
        description: 'User has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete User', {
        description: error.message || 'An error occurred while deleting the user.'
      })
    }
  })
}
```

## File: src/features/users/hooks/use-users-query.ts
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { usersService } from './use-users'
import type { GetUsersParams } from '../types/users'

export const useUsersQuery = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersService.getAll(params),
    staleTime: 30000,  
  })
}

export const useUserQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      if (!id) throw new Error('User ID is required')
      console.log('Fetching user with ID:', id)
      const result = await usersService.getById(id)
      console.log('User fetch result:', result)
      return result
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}
```

## File: src/lib/api/client.ts
```typescript
import type { ApiError } from '@/types/common'

type RequestConfig = {
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getHeaders = (customHeaders?: Record<string, string>): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  private buildURL = (url: string, params?: Record<string, unknown>): string => {
    const fullURL = new URL(url, this.baseURL)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          fullURL.searchParams.append(key, String(value))
        }
      })
    }
    
    return fullURL.toString()
  }

  private handleResponse = async <T>(response: Response): Promise<T> => {
    if (response.status === 401) {
      this.handleUnauthorized()
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const error: ApiError = {
        message: errorData.message || 'Request failed',
        error: errorData.error || 'HTTP Error',
        statusCode: response.status
      }
      throw error
    }

    return response.json()
  }

  private handleUnauthorized = () => {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
  }

  setToken = (token: string | null): void => {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  getToken = (): string | null => {
    if (this.token) return this.token
    
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        this.token = storedToken
        return storedToken
      }
    }
    
    return null
  }

  get = async <T = unknown>(url: string, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'GET',
      headers: this.getHeaders(config?.headers)
    })
    return this.handleResponse<T>(response)
  }

  post = async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'POST',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data)
    })
    return this.handleResponse<T>(response)
  }

  patch = async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'PATCH',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data)
    })
    return this.handleResponse<T>(response)
  }

  put = async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'PUT',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data)
    })
    return this.handleResponse<T>(response)
  }

  delete = async <T = unknown>(url: string, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'DELETE',
      headers: this.getHeaders(config?.headers)
    })
    return this.handleResponse<T>(response)
  }

  upload = async <T = unknown>(url: string, formData: FormData, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const headers = { ...config?.headers }
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }
    
    // Don't set Content-Type for FormData, let browser set it with boundary
    delete headers['Content-Type']
    
    const response = await fetch(fullURL, {
      method: 'POST',
      headers,
      body: formData
    })
    return this.handleResponse<T>(response)
  }
}

// Create and export the API client instance
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
export const apiClient = new ApiClient(API_BASE_URL)

// Initialize token from localStorage on client side
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token')
  if (token) {
    apiClient.setToken(token)
  }
}
```

## File: src/lib/api/index.ts
```typescript
import { invigilatorAssignmentsService } from '@/features/assignments/hooks/use-assignments'
import { authService } from '@/features/auth/hooks/use-api'
import { academicCalendarService } from '@/features/calendar/hooks/use-calendar'
import { dashboardService } from '@/features/dashboard/hooks/use-dashboard'
import { departmentsService } from '@/features/departments/hooks/use-departments'
import { studentEnrollmentsService } from '@/features/enrollments/hooks/use-enrollments'
import { examPapersService } from '@/features/exam-papers/hooks/use-exam-papers'
import { examSessionsService } from '@/features/exam-sessions/hooks/use-exam-sessions'
import { fileUploadsService } from '@/features/file-uploads/hooks/use-file-uploads'
import { notificationsService } from '@/features/notifications/hooks/use-notifications'
import { questionsService } from '@/features/questions/hooks/use-questions'
import { examRegistrationsService } from '@/features/registrations/hooks/use-registrations'
import { reportsService } from '@/features/reports/hooks/use-reports'
import { resultsService } from '@/features/results/hooks/use-results'
import { roomsService } from '@/features/rooms/hooks/use-rooms'
import { subjectsService } from '@/features/subjects/hooks/use-subjects'
import { usersService } from '@/features/users/hooks/use-users'

 
 
 
 

// Combined API object
export const api = {
  auth: authService,
  users: usersService,
  departments: departmentsService,
  subjects: subjectsService,
  questions: questionsService,
  rooms: roomsService,
  examPapers: examPapersService,
  examSessions: examSessionsService,
  studentEnrollments: studentEnrollmentsService,
  examRegistrations: examRegistrationsService,
  invigilatorAssignments: invigilatorAssignmentsService,
  results: resultsService,
  academicCalendar: academicCalendarService,
  notifications: notificationsService,
  fileUploads: fileUploadsService,
  reports: reportsService,
  dashboard: dashboardService
}

export default api
```

## File: src/lib/providers/query-provider.tsx
```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

## File: src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
```

## File: src/types/auth.ts
```typescript
import type { UserRole } from '@/constants/roles'

export type LoginDto = {
  usernameOrEmail: string
  password: string
}

export type RegisterDto = {
  email: string
  username?: string
  password: string
  fullName: string
  contactPrimary?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
}

export type LoginResponse = {
  user: {
    id: string
    username: string
    email: string
    fullName: string
    role: string
    isActive: boolean
  }
  accessToken: string
}

export type ForgotPasswordDto = {
  email: string
}

export type ResetPasswordDto = {
  token: string
  password: string
  confirmPassword: string
}
```

## File: src/types/common.ts
```typescript
export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type ApiResponse<T> = {
  data: T
  message?: string
}

export type ApiError = {
  message: string
  error?: string
  statusCode?: number
}

export type BaseQueryParams = {
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
```

## File: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## File: src/app/(auth)/layout.tsx
```typescript
type AuthLayoutProps = {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="  w-full space-y-8">
        {children}
      </div>
    </div>
  )
}
```

## File: src/app/globals.css
```css
@import "tailwindcss";

 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;

    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;

    --primary: 194 27% 6%;
    --primary-foreground: 0 0% 98%;

    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;

    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;

    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;

    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;

    --radius: 0.5rem;

    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;

    /* font variables */
    --font-unbounded: '';
    --font-inter: '';
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;

    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;

    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;

    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;

    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;

    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;

    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;

    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;

    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

 
@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));

  --color-chart-1: hsl(var(--chart-1));
  --color-chart-2: hsl(var(--chart-2));
  --color-chart-3: hsl(var(--chart-3));
  --color-chart-4: hsl(var(--chart-4));
  --color-chart-5: hsl(var(--chart-5));

  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

 
body {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: Arial, Helvetica, sans-serif;
}
```

## File: src/features/auth/components/login-form.tsx
```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { EyeIcon, EyeOffIcon, LogInIcon, AlertCircleIcon } from 'lucide-react'
import { useLogin } from '../hooks/use-auth-mutations'
import { loginSchema, type LoginFormData } from '../validations/auth-schemas'

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useLogin()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: ''
    }
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="mx-auto w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <LogInIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mt-2">Sign in to your university account</p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {loginMutation.isError && (
              <Alert className="mb-6 border-destructive/20 bg-destructive/5">
                <AlertCircleIcon className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  {loginMutation.error?.message || 'Login failed. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="usernameOrEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Username or Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your username or email"
                          className="h-12 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="h-12 pr-12 focus:ring-primary"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeOffIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 gradient-primary text-primary-foreground font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link 
                  href="/register" 
                  className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

## File: src/features/users/components/user-form.tsx
```typescript
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { USER_ROLES } from '@/constants/roles'
import { createUserSchema, updateUserSchema, type CreateUserFormData, type UpdateUserFormData } from '../validations/user-schemas'
import type { User } from '../types/users'


type CreateUserFormProps = {
  user?: never
  onSubmit: (data: CreateUserFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateUserFormProps = {
  user: User
  onSubmit: (data: UpdateUserFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UserFormProps = CreateUserFormProps | UpdateUserFormProps

export const UserForm = ({ user, onSubmit, onCancel, isLoading }: UserFormProps) => {
  const isEditMode = !!user

  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEditMode ? updateUserSchema : createUserSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      fullName: '',
      role: USER_ROLES.STUDENT,
      contactPrimary: '',
      contactSecondary: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      departmentId: '',
      year: undefined
    }
  })

  useEffect(() => {
    if (user) {

      const resetData = {
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        contactPrimary: user.contactPrimary || '',
        contactSecondary: user.contactSecondary || '',
        addressLine1: user.addressLine1 || '',
        addressLine2: user.addressLine2 || '',
        city: user.city || '',
        state: user.state || '',
        postalCode: user.postalCode || '',
        country: user.country || '',
        departmentId: user.departmentId || '',

        year: user.role === USER_ROLES.STUDENT ? user.year : undefined
      }
      form.reset(resetData)
    }
  }, [user, form])

  const handleSubmit = (data: CreateUserFormData | UpdateUserFormData) => {

    const submissionData = { ...data };
    if (submissionData.role !== USER_ROLES.STUDENT) {
      delete submissionData.year;
    }
    
    if (isEditMode) {
      (onSubmit as (data: UpdateUserFormData) => void)(submissionData as UpdateUserFormData)
    } else {
      (onSubmit as (data: CreateUserFormData) => void)(submissionData as CreateUserFormData)
    }
  }


  const selectedRole = form.watch('role')
  const isStudent = selectedRole === USER_ROLES.STUDENT

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter username" 
                      {...field} 
                      disabled={isEditMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={USER_ROLES.ADMIN}>Admin</SelectItem>
                      <SelectItem value={USER_ROLES.FACULTY}>Faculty</SelectItem>
                      <SelectItem value={USER_ROLES.STUDENT}>Student</SelectItem>
                      <SelectItem value={USER_ROLES.EXAM_COORDINATOR}>Exam Coordinator</SelectItem>
                      <SelectItem value={USER_ROLES.INVIGILATOR}>Invigilator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          {isStudent && (
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year {isStudent && '*'}</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : undefined)} 
                    value={field.value?.toString() || ''}

                    defaultValue={field.value?.toString() || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Year 1</SelectItem>
                      <SelectItem value="2">Year 2</SelectItem>
                      <SelectItem value="3">Year 3</SelectItem>
                      <SelectItem value="4">Year 4</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the student&apos;s current academic year (required for enrollment)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {!isEditMode && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Rest of the form remains the same... */}
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contactPrimary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter primary phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactSecondary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter secondary phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Address Information</h3>
          
          <FormField
            control={form.control}
            name="addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input placeholder="Street address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2</FormLabel>
                <FormControl>
                  <Input placeholder="Apartment, suite, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="ZIP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

## File: src/features/users/hooks/use-users.ts
```typescript
import { apiClient } from '@/lib/api/client'
import type { 
  User, 
  CreateUserDto, 
  UpdateUserDto, 
  ChangePasswordDto, 
  UserStats, 
  GetUsersParams,
  BackendUsersListResponse
} from '../types/users'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const usersService = {
  getAll: async (params?: GetUsersParams): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<BackendUsersListResponse>('/api/v1/users', { params })
    return {
      data: response.users || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    const user = await apiClient.get<User>(`/api/v1/users/${id}`)
    // If backend returns user directly, wrap it
    return {
      data: user
    }
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const user = await apiClient.get<User>('/api/v1/users/profile')
    return {
      data: user
    }
  },

  getStats: (): Promise<ApiResponse<UserStats>> =>
    apiClient.get('/api/v1/users/stats'),

  create: async (data: CreateUserDto): Promise<ApiResponse<User>> => {
    const user = await apiClient.post<User>('/api/v1/users', data)
    return {
      data: user
    }
  },

  update: async (id: string, data: UpdateUserDto): Promise<ApiResponse<User>> => {
    const user = await apiClient.patch<User>(`/api/v1/users/${id}`, data)
    return {
      data: user
    }
  },

  updateProfile: async (data: UpdateUserDto): Promise<ApiResponse<User>> => {
    const user = await apiClient.patch<User>('/api/v1/users/profile', data)
    return {
      data: user
    }
  },

  changePassword: (data: ChangePasswordDto): Promise<ApiResponse<{ message: string }>> =>
    apiClient.patch('/api/v1/users/profile/change-password', data),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/users/${id}`)
}
```

## File: src/features/users/validations/user-schemas.ts
```typescript
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
  year: z.number().int().min(1).max(4).optional()
}).refine(
  (data) => {
    // If role is student, year must be provided
    if (data.role === USER_ROLES.STUDENT) {
      return data.year !== undefined
    }
    return true
  },
  {
    message: "Year is required for students",
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
  year: z.number().int().min(1).max(4).optional()
}).refine(
  (data) => {
    // If role is being updated to student, year must be provided
    if (data.role === USER_ROLES.STUDENT) {
      return data.year !== undefined
    }
    return true
  },
  {
    message: "Year is required for students",
    path: ["year"]
  }
)

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>
```

## File: src/lib/auth/auth-guard.tsx
```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-provider'
import { LoadingSpinner } from '@/components/common/loading-spinner'

type AuthGuardProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
```

## File: src/lib/auth/role-guard.tsx
```typescript
'use client'

import { useAuth } from './auth-provider'
import type { UserRole } from '@/constants/roles'

type RoleGuardProps = {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const RoleGuard = ({ allowedRoles, children, fallback }: RoleGuardProps) => {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don&rsquo;t have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
```

## File: src/app/layout.tsx
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { AuthProvider } from '@/lib/auth/auth-provider'
import { QueryProvider } from '@/lib/providers/query-provider'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "University Management System",
  description: "Comprehensive university exam management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <NuqsAdapter>
              {children}
              <Toaster position="top-right" />
            </NuqsAdapter>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

## File: src/constants/routes.ts
```typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    DEPARTMENTS: '/admin/departments',
    SUBJECTS: '/admin/subjects',
    ROOMS: '/admin/rooms',
    REPORTS: '/admin/reports',
    CALENDAR: '/admin/calendar',
    ENROLLMENTS: '/admin/enrollments',

    GENERATE_REPORT: '/admin/reports/generate',
  },
  
  FACULTY: {
    ROOT: '/faculty',
    DASHBOARD: '/faculty/dashboard',
    SUBJECTS: '/faculty/subjects',
    QUESTIONS: '/faculty/questions',
    EXAM_PAPERS: '/faculty/exam-papers',
    RESULTS: '/faculty/results',
    ASSIGNMENTS: '/faculty/assignments'
  },
  
  STUDENT: {
    ROOT: '/student',
    DASHBOARD: '/student/dashboard',
    ENROLLMENTS: '/student/enrollments',
    EXAMS: '/student/exams',
    RESULTS: '/student/results',
    NOTIFICATIONS: '/student/notifications'
  },
  
  EXAM_COORDINATOR: {
    ROOT: '/exam-coordinator',
    DASHBOARD: '/exam-coordinator/dashboard',
    EXAM_SESSIONS: '/exam-coordinator/exam-sessions',
    REGISTRATIONS: '/exam-coordinator/registrations',
    ROOMS: '/exam-coordinator/rooms',
    ASSIGNMENTS: '/exam-coordinator/assignments'
  },
  
  INVIGILATOR: {
    ROOT: '/invigilator',
    DASHBOARD: '/invigilator/dashboard',
    ASSIGNMENTS: '/invigilator/assignments'
  }
} as const
```

## File: src/features/auth/components/register-form.tsx
```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EyeIcon, EyeOffIcon, UserPlusIcon, AlertCircleIcon } from 'lucide-react'
import { useRegister } from '../hooks/use-auth-mutations'
import { registerSchema, type RegisterFormData } from '../validations/auth-schemas'

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const registerMutation = useRegister()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      contactPrimary: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      year: 1  // Default to Year 1
    }
  })

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/5 via-background to-accent/5 p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <UserPlusIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Student Registration
            </h1>
            <p className="text-muted-foreground mt-2">Create your university account</p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {registerMutation.isError && (
              <Alert className="mb-6 border-destructive/20 bg-destructive/5">
                <AlertCircleIcon className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  {registerMutation.error?.message || 'Registration failed. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="h-11 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* University Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        University Email *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="SE12345678@alfa.uni.lk"
                          className="h-11 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Use your university email (e.g., SE12345678@alfa.uni.lk)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Username & Year Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Username <span className="text-muted-foreground text-sm">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Choose username"
                            className="h-11 focus:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Leave empty to auto-generate from email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Academic Year Selection - REQUIRED */}
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Academic Year *
                        </FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(Number(value))} 
                          value={field.value?.toString()}
                          defaultValue="1"
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Year 1</SelectItem>
                            <SelectItem value="2">Year 2</SelectItem>
                            <SelectItem value="3">Year 3</SelectItem>
                            <SelectItem value="4">Year 4</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          Select your current academic year
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Password *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create password"
                              className="h-11 pr-12 focus:ring-primary"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? (
                                <EyeOffIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Confirm Password *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm password"
                              className="h-11 pr-12 focus:ring-primary"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOffIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="contactPrimary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Phone Number <span className="text-muted-foreground text-sm">(Optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+94771234567"
                          className="h-11 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address Fields - Optional */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-sm font-medium text-muted-foreground border-b border-border pb-2">
                    Address Information (Optional)
                  </h4>
                  
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Street address"
                            className="h-10 focus:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="City"
                              className="h-10 focus:ring-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="State"
                              className="h-10 focus:ring-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="ZIP"
                              className="h-10 focus:ring-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

## File: src/features/auth/types/auth.ts
```typescript
import type { UserRole } from '@/constants/roles'

export type LoginDto = {
  usernameOrEmail: string
  password: string
}

export type RegisterDto = {
  email: string
  username?: string
  password: string
  fullName: string
  contactPrimary?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  year?: number 
}

export type LoginUser = {
  id: string
  username: string
  email: string
  fullName: string
  role: UserRole
  isActive: boolean
  profileImage?: string
  year?: number   
}

export type LoginResponse = {
  user: LoginUser
  accessToken: string
}

export type ForgotPasswordDto = {
  email: string
}

export type ResetPasswordDto = {
  token: string
  password: string
  confirmPassword: string
}
```

## File: src/features/auth/validations/auth-schemas.ts
```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required')
})


export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters'),
  contactPrimary: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  year: z.union([
    z.number().int().min(1).max(4),
    z.undefined()
  ]).optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
```

## File: src/features/users/types/users.ts
```typescript
import type { UserRole } from '@/constants/roles'

export type User = {
  _id: string
  username: string
  email: string
  fullName: string
  role: UserRole
  isActive: boolean
  contactPrimary?: string
  contactSecondary?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  profileImage?: string
  departmentId?: string
  year?: number   
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export type CreateUserDto = {
  username: string
  password: string
  email: string
  fullName: string
  role: UserRole
  contactPrimary?: string
  contactSecondary?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  departmentId?: string
  year?: number 
}

export type UpdateUserDto = Partial<Omit<CreateUserDto, 'username' | 'password'>> & {
  isActive?: boolean
}

export type ChangePasswordDto = {
  currentPassword: string
  newPassword: string
}

export type UserStats = {
  totalUsers: number
  activeUsers: number
  usersByRole: Record<string, number>
}

export type GetUsersParams = {
  role?: UserRole
  isActive?: boolean
  departmentId?: string
  year?: number   
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type BackendUsersListResponse = {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type BackendUserResponse = {
  user: User
}
```

## File: src/features/auth/hooks/use-auth-mutations.ts
```typescript
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from './use-api'
import { useAuth } from '@/lib/auth/auth-provider'
import { ROUTES } from '@/constants/routes'
import { USER_ROLES } from '@/constants/roles'
import type { LoginFormData, RegisterFormData } from '../validations/auth-schemas'
import type { LoginUser, RegisterDto } from '../types/auth'
import type { User } from '@/features/users/types/users'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

const convertLoginUserToUser = (loginUser: LoginUser): User => ({
  _id: loginUser.id,
  username: loginUser.username,
  email: loginUser.email,
  fullName: loginUser.fullName,
  role: loginUser.role,
  isActive: loginUser.isActive,
  profileImage: loginUser.profileImage,
  year: loginUser.year,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

const DASHBOARD_ROUTES = {
  [USER_ROLES.ADMIN]: ROUTES.ADMIN.DASHBOARD,
  [USER_ROLES.FACULTY]: ROUTES.FACULTY.DASHBOARD,
  [USER_ROLES.STUDENT]: ROUTES.STUDENT.DASHBOARD,
  [USER_ROLES.EXAM_COORDINATOR]: ROUTES.EXAM_COORDINATOR.DASHBOARD,
  [USER_ROLES.INVIGILATOR]: ROUTES.INVIGILATOR.DASHBOARD
} as const

export const useLogin = () => {
  const { login } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await authService.login(data)
      return response
    },
    onSuccess: (response) => {
      const user = convertLoginUserToUser(response.user)
      login(response.accessToken, user)
      
      queryClient.clear()
      
      const redirectRoute = DASHBOARD_ROUTES[response.user.role as keyof typeof DASHBOARD_ROUTES] || ROUTES.HOME
      
      toast.success(`Welcome back, ${response.user.fullName}!`, {
        description: 'You have been successfully logged in.'
      })
      
      setTimeout(() => {
        router.replace(redirectRoute)
      }, 100)
    },
    onError: (error: ApiError) => {
      const errorMessage = error.message || 'Login failed. Please check your credentials.'
      toast.error('Login Failed', {
        description: errorMessage
      })
    }
  })
}

export const useRegister = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // Remove confirmPassword and prepare the registration data
      const { confirmPassword, ...restData } = data
      
      const registerData: RegisterDto = {
        email: restData.email,
        fullName: restData.fullName,
        password: restData.password,
        year: restData.year,
        username: restData.username && restData.username.trim() !== '' ? restData.username : undefined,
        contactPrimary: restData.contactPrimary && restData.contactPrimary.trim() !== '' ? restData.contactPrimary : undefined,
        addressLine1: restData.addressLine1 && restData.addressLine1.trim() !== '' ? restData.addressLine1 : undefined,
        addressLine2: restData.addressLine2 && restData.addressLine2.trim() !== '' ? restData.addressLine2 : undefined,
        city: restData.city && restData.city.trim() !== '' ? restData.city : undefined,
        state: restData.state && restData.state.trim() !== '' ? restData.state : undefined,
        postalCode: restData.postalCode && restData.postalCode.trim() !== '' ? restData.postalCode : undefined,
      }
      
      return authService.register(registerData)
    },
    onSuccess: () => {
      toast.success('Account Created Successfully!', {
        description: 'Please sign in with your new account.'
      })
      router.push('/login')
    },
    onError: (error: ApiError) => {
      const errorMessage = error.message || 'Registration failed. Please try again.'
      toast.error('Registration Failed', {
        description: errorMessage
      })
    }
  })
}

export const useLogout = () => {
  const { logout } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout()
      queryClient.clear()
      toast.success('Logged Out', {
        description: 'You have been successfully logged out.'
      })
      router.replace('/login')
    },
    onError: () => {
      logout()
      queryClient.clear()
      router.replace('/login')
      toast.success('Logged Out', {
        description: 'You have been successfully logged out.'
      })
    }
  })
}
```

## File: src/lib/auth/auth-provider.tsx
```typescript
'use client'

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { usersService } from '@/features/users/hooks/use-users'
import type { User } from '@/features/users/types/users'

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  refetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useAuthStore()
  const [isHydrated, setIsHydrated] = useState(false)
  const [isFetchingUser, setIsFetchingUser] = useState(false)

  // Memoized values
  const isLoading = !store.isInitialized || isFetchingUser

  // useCallback for refetchUser to prevent dependency issues
  const refetchUser = useCallback(async () => {
    if (!store.isAuthenticated || !store.token) return
    
    setIsFetchingUser(true)
    try {
      const response = await usersService.getProfile()
      store.setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      store.logout()
    } finally {
      setIsFetchingUser(false)
    }
  }, [store.isAuthenticated, store.token, store.setUser, store.logout])

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Initialize auth state only once after hydration
  useEffect(() => {
    if (!isHydrated || store.isInitialized) return

    const initializeAuth = async () => {
      try {
        store.initialize()
        
        // If we have a token but no user data, fetch user profile
        if (store.isAuthenticated && !store.user) {
          await refetchUser()
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        store.logout()
      }
    }

    initializeAuth()
  }, [isHydrated, store.isInitialized, store.isAuthenticated, store.user, store.initialize, store.logout, refetchUser])

  /* -------------------------------------------------
   * TEMPORARY DEBUG – remove after verifying year/departmentId
   * ------------------------------------------------- */
  useEffect(() => {
    if (store.user) {
      console.log('🔍 CURRENT USER FROM AUTH PROVIDER:', JSON.stringify(store.user, null, 2))
    }
  }, [store.user])
  /* ------------------------------------------------- */

  const contextValue = useMemo(() => ({
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading,
    login: store.login,
    logout: store.logout,
    refetchUser
  }), [store.user, store.isAuthenticated, isLoading, store.login, store.logout, refetchUser])

  // Show loading screen during hydration or initialization
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse"></div>
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">University Management System</h2>
            <p className="text-muted-foreground">Initializing application...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
```

## File: src/lib/stores/auth-store.ts
```typescript
// src/lib/stores/auth-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { apiClient } from '@/lib/api/client'
import type { User } from '@/features/users/types/users'

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isInitialized: boolean
}

type AuthActions = {
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User) => void
  initialize: () => void
  setInitialized: (initialized: boolean) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,

      // Actions
      login: (token: string, user: User) => {
        apiClient.setToken(token)
        set({
          user,
          token,
          isAuthenticated: true,
          isInitialized: true
        })
      },

      logout: () => {
        apiClient.setToken(null)
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isInitialized: true
        })
      },

      setUser: (user: User) => {
        set({ user })
      },

      initialize: () => {
        const { token, isInitialized } = get()
        
        // Prevent multiple initializations
        if (isInitialized) return
        
        if (token) {
          apiClient.setToken(token)
          set({ 
            isAuthenticated: true,
            isInitialized: true 
          })
        } else {
          set({ 
            isInitialized: true 
          })
        }
      },

      setInitialized: (initialized: boolean) => {
        set({ isInitialized: initialized })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          apiClient.setToken(state.token)
        }
      }
    }
  )
)
```

 