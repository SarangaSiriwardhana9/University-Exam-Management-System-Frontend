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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown, BuildingIcon, UserIcon, FileTextIcon, InfoIcon } from 'lucide-react'
import { LoadingSpinner } from '@/components/common/loading-spinner'
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
        {/* Basic Information */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BuildingIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Department Information</CardTitle>
                <CardDescription>Basic details about the department</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="departmentCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4" />
                    Department Code *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., CS, EE, ME" 
                      {...field} 
                      disabled={isEditMode}
                      className="font-mono uppercase"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormDescription className="flex items-start gap-2">
                    <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Unique code for the department (uppercase letters and numbers only)</span>
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
                  <FormLabel className="flex items-center gap-2">
                    <BuildingIcon className="h-4 w-4" />
                    Department Name *
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          </CardContent>
        </Card>

        {/* Head of Department */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <UserIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle>Head of Department</CardTitle>
                <CardDescription>Assign a faculty member as department head</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="headOfDepartment"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Select Faculty Member
                  </FormLabel>
                  {isLoadingUsers ? (
                    <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                      <LoadingSpinner size="sm" />
                      <span className="text-sm text-muted-foreground">Loading faculty members...</span>
                    </div>
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
                  <FormDescription className="flex items-start gap-2">
                    <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Search and select a faculty member to be the head of this department</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FileTextIcon className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle>Description</CardTitle>
                <CardDescription>Additional information about the department</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., The Computer Science department focuses on software development, AI, and data science..." 
                      className="resize-none min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="flex items-start gap-2">
                    <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Brief description of the department's focus and activities</span>
                  </FormDescription>
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
              isEditMode ? 'Update Department' : 'Create Department'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}