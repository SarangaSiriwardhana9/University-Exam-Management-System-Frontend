 
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
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  createEnrollmentSchema, 
  updateEnrollmentSchema, 
  type CreateEnrollmentFormData, 
  type UpdateEnrollmentFormData 
} from '../validations/enrollment-schemas'
import type { StudentEnrollment } from '../types/enrollments'
import { useUsersQuery } from '@/features/users/hooks/use-users-query'
import { useSubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { USER_ROLES } from '@/constants/roles'
import { ENROLLMENT_STATUS } from '../types/enrollments'

type CreateEnrollmentFormProps = {
  enrollment?: never
  onSubmit: (data: CreateEnrollmentFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateEnrollmentFormProps = {
  enrollment: StudentEnrollment
  onSubmit: (data: UpdateEnrollmentFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type EnrollmentFormProps = CreateEnrollmentFormProps | UpdateEnrollmentFormProps

export const EnrollmentForm = ({ enrollment, onSubmit, onCancel, isLoading }: EnrollmentFormProps) => {
  const isEditMode = !!enrollment

  // Fetch students and subjects for dropdowns
  const { data: studentsData } = useUsersQuery({ role: USER_ROLES.STUDENT, isActive: true })
  const { data: subjectsData } = useSubjectsQuery({ isActive: true })

  const form = useForm<CreateEnrollmentFormData | UpdateEnrollmentFormData>({
    resolver: zodResolver(isEditMode ? updateEnrollmentSchema : createEnrollmentSchema) as any,
    defaultValues: isEditMode ? {
      academicYear: '',
      semester: 1,
      enrollmentDate: new Date().toISOString().split('T')[0],
    } : {
      studentId: '',
      subjectId: '',
      academicYear: '',
      semester: 1,
      enrollmentDate: new Date().toISOString().split('T')[0],
    }
  })

  useEffect(() => {
    if (enrollment) {
      form.reset({
        academicYear: enrollment.academicYear,
        semester: enrollment.semester,
        enrollmentDate: new Date(enrollment.enrollmentDate).toISOString().split('T')[0],
        status: enrollment.status,
      })
    }
  }, [enrollment, form])

  const handleSubmit = (data: CreateEnrollmentFormData | UpdateEnrollmentFormData) => {
    if (isEditMode) {
      (onSubmit as (data: UpdateEnrollmentFormData) => void)(data as UpdateEnrollmentFormData)
    } else {
      (onSubmit as (data: CreateEnrollmentFormData) => void)(data as CreateEnrollmentFormData)
    }
  }

  // Get current academic year
  const currentYear = new Date().getFullYear()
  const academicYears = [
    `${currentYear}-${currentYear + 1}`,
    `${currentYear - 1}-${currentYear}`,
    `${currentYear + 1}-${currentYear + 2}`,
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Enrollment Information</h3>
          
          {!isEditMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {studentsData?.data && studentsData.data.length > 0 ? (
                          studentsData.data.map((student) => (
                            <SelectItem key={student._id} value={student._id}>
                              {student.fullName} ({student.email})
                            </SelectItem>
                          ))
                        ) : (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            No students available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the student to enroll
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjectsData?.data && subjectsData.data.length > 0 ? (
                          subjectsData.data.map((subject) => (
                            <SelectItem key={subject._id} value={subject._id}>
                              {subject.subjectCode} - {subject.subjectName}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            No subjects available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the subject to enroll in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="academicYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Academic year for enrollment
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
                    onValueChange={(value) => field.onChange(Number(value))} 
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Semester for enrollment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enrollmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrollment Date *</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Date of enrollment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isEditMode && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ENROLLMENT_STATUS.ACTIVE}>Active</SelectItem>
                      <SelectItem value={ENROLLMENT_STATUS.WITHDRAWN}>Withdrawn</SelectItem>
                      <SelectItem value={ENROLLMENT_STATUS.COMPLETED}>Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Update enrollment status
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Enrollment' : 'Create Enrollment'}
          </Button>
        </div>
      </form>
    </Form>
  )
}