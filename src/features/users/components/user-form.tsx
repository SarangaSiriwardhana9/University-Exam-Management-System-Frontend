
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { UserIcon, MailIcon, KeyIcon, ShieldIcon, BuildingIcon, GraduationCapIcon, PhoneIcon, MapPinIcon, CalendarIcon } from 'lucide-react'
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

  const extractId = (v?: string | { _id?: string } | null): string | undefined => {
    if (!v) return undefined
    return typeof v === 'string' ? v : v._id
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

    const readyToReset = 
      !isDepartmentsLoading &&
      (!userDepartmentId || !isUserDepartmentLoading)

    if (readyToReset) {
      form.reset({
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
      })
    }
  }, [isEditMode, user, isDepartmentsLoading, isUserDepartmentLoading, userDepartmentId, form])

  const handleSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
    const submissionData = { ...data }
    
    if (submissionData.role !== USER_ROLES.STUDENT) {
      delete submissionData.year
      delete submissionData.semester
    }
    
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
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Personal details and account credentials</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingInitialData && (
              <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-muted-foreground">Loading user data...</span>
              </div>
            )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Full Name *
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Username *
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4" />
                    Email *
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    <ShieldIcon className="h-4 w-4" />
                    Role *
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    <BuildingIcon className="h-4 w-4" />
                    Department {requiresDepartment && '*'}
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || undefined}
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
                    <FormLabel className="flex items-center gap-2">
                      <GraduationCapIcon className="h-4 w-4" />
                      Year *
                    </FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : undefined)} 
                      value={field.value?.toString() || undefined}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Semester *
                    </FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : undefined)} 
                      value={field.value?.toString() || undefined}
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
                  <FormLabel className="flex items-center gap-2">
                    <KeyIcon className="h-4 w-4" />
                    Password *
                  </FormLabel>
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
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <PhoneIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Phone numbers for communication</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contactPrimary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />
                    Primary Phone
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />
                    Secondary Phone
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter secondary phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <MapPinIcon className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle>Address Information</CardTitle>
                <CardDescription>Residential address details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
          
          <FormField
            control={form.control}
            name="addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Address Line 1
                </FormLabel>
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
                <FormLabel className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Address Line 2
                </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    City
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    State
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    Postal Code
                  </FormLabel>
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
                <FormLabel className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Country
                </FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} size="lg">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} size="lg" className="min-w-[150px]">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Saving...</span>
              </div>
            ) : (
              isEditMode ? 'Update User' : 'Create User'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}