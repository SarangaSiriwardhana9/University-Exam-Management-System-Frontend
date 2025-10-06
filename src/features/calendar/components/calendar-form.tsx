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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createCalendarSchema, updateCalendarSchema, type CreateCalendarFormData, type UpdateCalendarFormData } from '../validations/calendar-schemas'
import type { AcademicCalendar } from '../types/calendar'

type CreateCalendarFormProps = {
  calendar?: never
  onSubmit: (data: CreateCalendarFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateCalendarFormProps = {
  calendar: AcademicCalendar
  onSubmit: (data: UpdateCalendarFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type CalendarFormProps = CreateCalendarFormProps | UpdateCalendarFormProps

// Helper function to generate academic year in YYYY/YYYY format
const generateAcademicYear = (startYear: number): string => {
  return `${startYear}/${startYear + 1}`
}

type AcademicYearOption = {
  value: string
  label: string
}

export const CalendarForm = ({ calendar, onSubmit, onCancel, isLoading }: CalendarFormProps) => {
  const isEditMode = !!calendar
  const currentYear = new Date().getFullYear()

  const form = useForm<CreateCalendarFormData | UpdateCalendarFormData>({
    resolver: zodResolver(isEditMode ? updateCalendarSchema : createCalendarSchema),
    defaultValues: {
      academicYear: generateAcademicYear(currentYear),
      semester: 1,
      semesterStart: '',
      semesterEnd: '',
      examStart: '',
      examEnd: '',
      resultPublishDate: '',
      isCurrent: false,
      description: ''
    }
  })

  useEffect(() => {
    if (calendar) {
      // Format dates for input
      const formatDateForInput = (dateString: string) => {
        return dateString ? new Date(dateString).toISOString().slice(0, 10) : ''
      }
      
      form.reset({
        academicYear: calendar.academicYear,
        semester: calendar.semester,
        semesterStart: formatDateForInput(calendar.semesterStart),
        semesterEnd: formatDateForInput(calendar.semesterEnd),
        examStart: formatDateForInput(calendar.examStart),
        examEnd: formatDateForInput(calendar.examEnd),
        resultPublishDate: calendar.resultPublishDate ? formatDateForInput(calendar.resultPublishDate) : '',
        isCurrent: calendar.isCurrent,
        description: calendar.description || ''
      })
    }
  }, [calendar, form])

  const handleSubmit = (data: CreateCalendarFormData | UpdateCalendarFormData) => {
    // Convert dates to ISO strings
    const formattedData = {
      ...data,
      semesterStart: new Date(data.semesterStart!).toISOString(),
      semesterEnd: new Date(data.semesterEnd!).toISOString(),
      examStart: new Date(data.examStart!).toISOString(),
      examEnd: new Date(data.examEnd!).toISOString(),
      resultPublishDate: data.resultPublishDate ? new Date(data.resultPublishDate).toISOString() : undefined
    }

    if (isEditMode) {
      (onSubmit as (data: UpdateCalendarFormData) => void)(formattedData as UpdateCalendarFormData)
    } else {
      (onSubmit as (data: CreateCalendarFormData) => void)(formattedData as CreateCalendarFormData)
    }
  }

  // Generate academic year options with proper typing
  const academicYearOptions: AcademicYearOption[] = []
  for (let i = currentYear - 2; i <= currentYear + 5; i++) {
    academicYearOptions.push({
      value: generateAcademicYear(i),
      label: generateAcademicYear(i)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Academic Year and Semester */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="academicYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Year *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {academicYearOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
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
                <FormLabel>Semester *</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Semester Dates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Semester Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="semesterStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester Start Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="semesterEnd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester End Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Exam Dates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Exam Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="examStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Start Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="examEnd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam End Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Result Date */}
        <FormField
          control={form.control}
          name="resultPublishDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Result Publish Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter calendar description..."
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Set as Current */}
        <FormField
          control={form.control}
          name="isCurrent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Set as Current Calendar
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  This will make this calendar the active academic calendar for the system.
                </p>
              </div>
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Calendar' : 'Create Calendar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}