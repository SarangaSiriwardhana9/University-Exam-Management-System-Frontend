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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createDepartmentSchema, updateDepartmentSchema, type CreateDepartmentFormData, type UpdateDepartmentFormData } from '../validations/department-schemas'
import type { Department } from '../types/departments'
import { useUsersQuery } from '@/features/users/hooks/use-users-query'
import { USER_ROLES } from '@/constants/roles'

type CreateDepartmentFormProps = {
  department?: never
  onSubmit: (data: CreateDepartmentFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateDepartmentFormProps = {
  department: Department
  onSubmit: (data: UpdateDepartmentFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type DepartmentFormProps = CreateDepartmentFormProps | UpdateDepartmentFormProps

// Helper function to extract the ID from headOfDepartment
const getHeadOfDepartmentId = (headOfDepartment: Department['headOfDepartment']): string => {
  if (!headOfDepartment) return ''
  
  if (typeof headOfDepartment === 'string') {
    return headOfDepartment
  }
  
  if (typeof headOfDepartment === 'object' && '_id' in headOfDepartment) {
    return headOfDepartment._id
  }
  
  return ''
}

export const DepartmentForm = ({ department, onSubmit, onCancel, isLoading }: DepartmentFormProps) => {
  const isEditMode = !!department

  // Fetch faculty members for head of department dropdown
  const { data: usersData, isLoading: isLoadingUsers } = useUsersQuery({ 
    role: USER_ROLES.FACULTY, 
    isActive: true 
  })

  const form = useForm<CreateDepartmentFormData | UpdateDepartmentFormData>({
    resolver: zodResolver(isEditMode ? updateDepartmentSchema : createDepartmentSchema),
    defaultValues: {
      departmentCode: '',
      departmentName: '',
      headOfDepartment: '',
      description: ''
    }
  })

  // Update form when department data is loaded
  useEffect(() => {
    if (department) {
      const hodId = getHeadOfDepartmentId(department.headOfDepartment)
      
      console.log('Department data:', department)
      console.log('Extracted HOD ID:', hodId)
      console.log('HOD Name:', department.headOfDepartmentName)
      
      form.reset({
        departmentName: department.departmentName,
        headOfDepartment: hodId,
        description: department.description || ''
      })
    }
  }, [department, form])

  // Debug: Log when users data changes
  useEffect(() => {
    if (usersData?.data) {
      console.log('Faculty members loaded:', usersData.data.length)
      console.log('Faculty IDs:', usersData.data.map(f => f._id))
    }
  }, [usersData])

  const handleSubmit = (data: CreateDepartmentFormData | UpdateDepartmentFormData) => {
    if (isEditMode) {
      (onSubmit as (data: UpdateDepartmentFormData) => void)(data as UpdateDepartmentFormData)
    } else {
      (onSubmit as (data: CreateDepartmentFormData) => void)(data as CreateDepartmentFormData)
    }
  }

  const currentHeadId = form.watch('headOfDepartment')
  console.log('Current form HOD value:', currentHeadId)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Department Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="departmentCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Code *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., CS, EE, ME" 
                      {...field} 
                      disabled={isEditMode}
                      className="font-mono uppercase"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormDescription>
                    Unique code for the department (uppercase letters and numbers only)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="departmentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="headOfDepartment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Head of Department</FormLabel>
                {isLoadingUsers ? (
                  <div className="text-sm text-muted-foreground">Loading faculty members...</div>
                ) : (
                  <>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || undefined}
                      disabled={isLoadingUsers}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select head of department (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {usersData?.data && usersData.data.length > 0 ? (
                          usersData.data.map((faculty) => (
                            <SelectItem key={faculty._id} value={faculty._id}>
                              {faculty.fullName} ({faculty.email})
                            </SelectItem>
                          ))
                        ) : (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            No faculty members available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => field.onChange('')}
                        className="mt-2"
                      >
                        Clear selection
                      </Button>
                    )}
                  </>
                )}
                <FormDescription>
                  Select a faculty member to be the head of this department
                  
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter department description (optional)" 
                    className="resize-none"
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Brief description of the department
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Department' : 'Create Department'}
          </Button>
        </div>
      </form>
    </Form>
  )
}