/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { createSubjectSchema, updateSubjectSchema, type CreateSubjectFormData, type UpdateSubjectFormData } from '../validations/subject-schemas'
import type { Subject } from '../types/subjects'
import { useDepartmentsQuery } from '@/features/departments/hooks/use-departments-query'

type CreateSubjectFormProps = {
  subject?: never
  onSubmit: (data: CreateSubjectFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateSubjectFormProps = {
  subject: Subject
  onSubmit: (data: UpdateSubjectFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type SubjectFormProps = CreateSubjectFormProps | UpdateSubjectFormProps

export const SubjectForm = ({ subject, onSubmit, onCancel, isLoading }: SubjectFormProps) => {
  const isEditMode = !!subject

  // Fetch departments for dropdown
  const { data: departmentsData } = useDepartmentsQuery({ isActive: true })

  const form = useForm<CreateSubjectFormData | UpdateSubjectFormData>({
    resolver: zodResolver(isEditMode ? updateSubjectSchema : createSubjectSchema) as any,
    defaultValues: isEditMode ? {
      subjectName: '',
      departmentId: '',
      year: 1,
      credits: 3,
      description: ''
    } : {
      subjectCode: '',
      subjectName: '',
      departmentId: '',
      year: 1,
      credits: 3,
      description: ''
    }
  })

  useEffect(() => {
    if (subject) {
      form.reset({
        subjectName: subject.subjectName,
        departmentId: subject.departmentId,
        year: subject.year,
        credits: subject.credits,
        description: subject.description || ''
      })
    }
  }, [subject, form])

  const handleSubmit = (data: CreateSubjectFormData | UpdateSubjectFormData) => {
    if (isEditMode) {
      (onSubmit as (data: UpdateSubjectFormData) => void)(data as UpdateSubjectFormData)
    } else {
      (onSubmit as (data: CreateSubjectFormData) => void)(data as CreateSubjectFormData)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Subject Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isEditMode && (
              <FormField
                control={form.control}
                name="subjectCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Code *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., CS101, MATH201" 
                        {...field} 
                        className="font-mono uppercase"
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormDescription>
                      Unique code for the subject (uppercase)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="subjectName"
              render={({ field }) => (
                <FormItem className={!isEditMode ? '' : 'md:col-span-2'}>
                  <FormLabel>Subject Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Data Structures and Algorithms" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departmentsData?.data && departmentsData.data.length > 0 ? (
                      departmentsData.data.map((department) => (
                        <SelectItem key={department._id} value={department._id}>
                          {department.departmentCode} - {department.departmentName}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No departments available
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the department this subject belongs to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year *</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          Year {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Which year is this subject offered in
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="credits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credits *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="3" 
                      min="0" 
                      max="10" 
                      step="0.5"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Credit hours for this subject
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter subject description (optional)" 
                    className="resize-none"
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Brief description of the subject content and objectives
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
            {isLoading ? 'Saving...' : isEditMode ? 'Update Subject' : 'Create Subject'}
          </Button>
        </div>
      </form>
    </Form>
  )
}