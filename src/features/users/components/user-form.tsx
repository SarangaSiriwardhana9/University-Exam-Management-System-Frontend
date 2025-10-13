
'use client'

import { useEffect, useMemo } from 'react'
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
import type { Department } from '@/features/departments/types/departments'
import { useDepartmentsQuery, useDepartmentQuery } from '@/features/departments/hooks/use-departments-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'

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

  const { data: departmentsResponse, isLoading: isDepartmentsLoading } = useDepartmentsQuery({
    page: 1,
    limit: 100,  
  })

  const extractId = (v?: string | { _id?: string; id?: string } | null): string | undefined => {
    if (!v) return undefined
    if (typeof v === 'string') return v
    return v._id ?? v.id ?? undefined
  }

  const userDepartmentId = extractId(user?.departmentId)
  const { data: userDepartmentResponse, isLoading: isUserDepartmentLoading } = useDepartmentQuery(
    isEditMode ? userDepartmentId : undefined
  )

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
      year: undefined,
      semester: undefined
    }
  })

  const departmentOptions = useMemo(() => {
    const map = new Map<string, Department>()
    ;(departmentsResponse?.data || []).forEach((d) => map.set(d._id, d))
    if (userDepartmentResponse?.data) map.set(userDepartmentResponse.data._id, userDepartmentResponse.data)
    if (user?.departmentId && typeof user.departmentId === 'object') {
      const deptObj = user.departmentId as Department
      if (deptObj._id) map.set(deptObj._id, deptObj)
    }
    return Array.from(map.values())
  }, [departmentsResponse?.data, userDepartmentResponse?.data, user?.departmentId])

  useEffect(() => {
    if (!isEditMode || !user) return

    console.log('User data received:', user)
    console.log('User department ID:', userDepartmentId)
    console.log('Departments loading:', isDepartmentsLoading)
    console.log('User department loading:', isUserDepartmentLoading)
    console.log('Department options:', departmentOptions)

    const readyToReset = 
      !isDepartmentsLoading &&
      (!userDepartmentId || !isUserDepartmentLoading)

    if (readyToReset) {
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
        departmentId: userDepartmentId || '',
        year: user.year,
        semester: user.semester
      }
      console.log('Resetting form with data:', resetData)
      form.reset(resetData)
    }
  }, [
    isEditMode,
    user,
    isDepartmentsLoading,
    isUserDepartmentLoading,
    userDepartmentId,
    departmentOptions,
    form
  ])

  const handleSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
    const submissionData = { ...data }
    
    // Remove year and semester if not a student
    if (submissionData.role !== USER_ROLES.STUDENT) {
      delete submissionData.year
      delete submissionData.semester
    }
    
    // Remove departmentId if empty string
    if (submissionData.departmentId === '') {
      delete submissionData.departmentId
    }
    
    if (isEditMode) {
      (onSubmit as (data: UpdateUserFormData) => void)(submissionData as UpdateUserFormData)
    } else {
      (onSubmit as (data: CreateUserFormData) => void)(submissionData as CreateUserFormData)
    }
  }

  const selectedRole = form.watch('role')
  const isStudent = selectedRole === USER_ROLES.STUDENT
  const isFaculty = selectedRole === USER_ROLES.FACULTY

  const requiresDepartment = isStudent || isFaculty

  const isLoadingInitialData = isEditMode && (
    isDepartmentsLoading ||
    (userDepartmentId && isUserDepartmentLoading)
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          {isLoadingInitialData && (
            <div className="text-sm text-muted-foreground">Loading user data...</div>
          )}
          
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

          {/* Department Selection - Show for Students and Faculty */}
          {requiresDepartment && (
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department {requiresDepartment && '*'}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ''}
                    defaultValue={field.value || ''}
                    disabled={isDepartmentsLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          isDepartmentsLoading 
                            ? "Loading departments..." 
                            : "Select department"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isDepartmentsLoading || (isEditMode && userDepartmentId && isUserDepartmentLoading) ? (
                        <div className="flex items-center justify-center py-4">
                          <LoadingSpinner size="sm" />
                        </div>
                      ) : departmentOptions.length > 0 ? (
                        departmentOptions.map((dept) => (
                          <SelectItem key={dept._id} value={dept._id}>
                            {dept.departmentName} ({dept.departmentCode})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="py-2 px-3 text-sm text-muted-foreground">
                          No departments available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {isStudent 
                      ? "Select the student's department" 
                      : "Select the faculty member's department"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Academic Year & Semester - Show only for Students */}
          {isStudent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year *</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : undefined)} 
                      value={field.value?.toString() || ''}
                      defaultValue={field.value?.toString() || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                    <FormDescription>
                      Student&apos;s current year level
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester *</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : undefined)} 
                      value={field.value?.toString() || ''}
                      defaultValue={field.value?.toString() || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Semester 1</SelectItem>
                        <SelectItem value="2">Semester 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Current semester
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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