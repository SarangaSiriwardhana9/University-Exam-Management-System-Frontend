'use client'

import { useEffect, useState } from 'react'
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
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
  const [open, setOpen] = useState(false)

  const { data: usersData, isLoading: isLoadingUsers } = useUsersQuery({ 
    role: USER_ROLES.FACULTY, 
    isActive: true,
    limit: 1000
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

 
  useEffect(() => {
    if (department) {
      const hodId = getHeadOfDepartmentId(department.headOfDepartment)
      
      form.reset({
        departmentCode: department.departmentCode,
        departmentName: department.departmentName,
        headOfDepartment: hodId,
        description: department.description || ''
      })
    }
  }, [department, form])

  const handleSubmit = (data: CreateDepartmentFormData | UpdateDepartmentFormData) => {
    if (isEditMode) {
      (onSubmit as (data: UpdateDepartmentFormData) => void)(data as UpdateDepartmentFormData)
    } else {
      (onSubmit as (data: CreateDepartmentFormData) => void)(data as CreateDepartmentFormData)
    }
  }

  const currentHeadId = form.watch('headOfDepartment')

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
              <FormItem className="flex flex-col">
                <FormLabel>Head of Department</FormLabel>
                {isLoadingUsers ? (
                  <div className="text-sm text-muted-foreground">Loading faculty members...</div>
                ) : (
                  <>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? usersData?.data?.find((faculty) => faculty._id === field.value)?.fullName
                              : "Select head of department (optional)"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search faculty..." />
                          <CommandEmpty>No faculty member found.</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {usersData?.data?.map((faculty) => (
                              <CommandItem
                                key={faculty._id}
                                value={`${faculty.fullName} ${faculty.email}`}
                                onSelect={() => {
                                  field.onChange(faculty._id)
                                  setOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === faculty._id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{faculty.fullName}</span>
                                  <span className="text-xs text-muted-foreground">{faculty.email}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          field.onChange('')
                          setOpen(false)
                        }}
                        className="mt-2"
                      >
                        Clear selection
                      </Button>
                    )}
                  </>
                )}
                <FormDescription>
                  Search and select a faculty member to be the head of this department
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