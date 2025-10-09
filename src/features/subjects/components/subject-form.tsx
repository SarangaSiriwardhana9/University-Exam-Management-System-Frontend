'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
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

import {
  createSubjectSchema,
  updateSubjectSchema,
  type CreateSubjectFormData,
  type UpdateSubjectFormData,
} from '../validations/subject-schemas'

import type { Subject } from '../types/subjects'
import type { User } from '@/features/users/types/users'
import type { Department } from '@/features/departments/types/departments'
import { useDepartmentsQuery, useDepartmentQuery } from '@/features/departments/hooks/use-departments-query'
import { useUsersQuery, useUserQuery } from '@/features/users/hooks/use-users-query'
import { usersService } from '@/features/users/hooks/use-users'
import { USER_ROLES } from '@/constants/roles'

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

  const { data: departmentsData, isLoading: isDepartmentsLoading } = useDepartmentsQuery({ isActive: true })
  const { data: facultyData, isLoading: isFacultyLoading } = useUsersQuery({ role: USER_ROLES.FACULTY, isActive: true })

  const extractId = (v?: string | { _id?: string; id?: string } | null): string | undefined => {
    if (!v) return undefined
    if (typeof v === 'string') return v
    return v._id ?? v.id ?? undefined
  }

  const subjectDepartmentId = extractId(subject?.departmentId)
  const subjectLicId = extractId(subject?.licId)

  const { data: departmentResponse, isLoading: isDepartmentLoading } = useDepartmentQuery(subjectDepartmentId ?? undefined)
  const { data: licResponse, isLoading: isLicLoading } = useUserQuery(subjectLicId ?? undefined)

  const [extraLecturers, setExtraLecturers] = useState<User[]>([])
  const [isLoadingExtraLecturers, setIsLoadingExtraLecturers] = useState(false)

  const form = useForm<CreateSubjectFormData | UpdateSubjectFormData>({
    resolver: zodResolver(isEditMode ? updateSubjectSchema : createSubjectSchema) as unknown as Resolver<
      CreateSubjectFormData | UpdateSubjectFormData
    >,
    defaultValues: isEditMode
      ? {
          subjectName: '',
          departmentId: '',
          year: 1,
          credits: 3,
          description: '',
          licId: undefined,
          lecturerIds: [],
        }
      : {
          subjectCode: '',
          subjectName: '',
          departmentId: '',
          year: 1,
          credits: 3,
          description: '',
          licId: undefined,
          lecturerIds: [],
        },
  })

  const watchedLecturerIds = form.watch('lecturerIds')

  useEffect(() => {
    if (!subject || !subject.lecturerIds?.length) return

    const missingIds = subject.lecturerIds.map(extractId).filter(Boolean) as string[]
    const existing = new Set((facultyData?.data || []).map((u: User) => u._id))
    const toFetch = missingIds.filter((id) => !existing.has(id))

    if (toFetch.length > 0) {
      setIsLoadingExtraLecturers(true)
      Promise.all(
        toFetch.map((id) => usersService.getById(id).then((r) => r.data).catch(() => null))
      )
        .then((res) => {
          setExtraLecturers(res.filter(Boolean) as User[])
        })
        .finally(() => setIsLoadingExtraLecturers(false))
    }
  }, [subject, facultyData?.data])

  useEffect(() => {
    if (!isEditMode || !subject) return

    const readyToReset =
      !isDepartmentsLoading &&
      !isFacultyLoading &&
      (!subjectDepartmentId || !isDepartmentLoading) &&
      (!subjectLicId || !isLicLoading)

    if (readyToReset) {
      form.reset({
        subjectName: subject.subjectName,
        departmentId: subjectDepartmentId ?? '',
        year: subject.year,
        credits: subject.credits,
        description: subject.description || '',
        licId: subjectLicId ?? undefined,
        lecturerIds: subject.lecturerIds?.map(extractId).filter(Boolean) || [],
      })
    }
  }, [
    isEditMode,
    subject,
    isDepartmentsLoading,
    isFacultyLoading,
    isDepartmentLoading,
    isLicLoading,
    subjectDepartmentId,
    subjectLicId,
    form,
  ])

  const facultyOptions = useMemo(() => {
    const map = new Map<string, User>()
    ;(facultyData?.data || []).forEach((u) => map.set(u._id, u))
    if (licResponse?.data) map.set(licResponse.data._id, licResponse.data)
    extraLecturers.forEach((u) => map.set(u._id, u))
    return Array.from(map.values())
  }, [facultyData?.data, licResponse?.data, extraLecturers])

  const departmentOptions = useMemo(() => {
    const map = new Map<string, Department>()
    ;(departmentsData?.data || []).forEach((d) => map.set(d._id, d))
    if (departmentResponse?.data) map.set(departmentResponse.data._id, departmentResponse.data)
    if (subject?.departmentId && typeof subject.departmentId === 'object') {
      const deptObj = subject.departmentId as Department
      if (deptObj._id) map.set(deptObj._id, deptObj)
    }
    return Array.from(map.values())
  }, [departmentsData?.data, departmentResponse?.data, subject?.departmentId])

  const handleSubmit = (data: CreateSubjectFormData | UpdateSubjectFormData) => {
    isEditMode
      ? (onSubmit as (data: UpdateSubjectFormData) => void)(data as UpdateSubjectFormData)
      : (onSubmit as (data: CreateSubjectFormData) => void)(data as CreateSubjectFormData)
  }

  const isLoadingInitialData =
    isEditMode &&
    (isDepartmentsLoading ||
      isFacultyLoading ||
      (subjectDepartmentId && isDepartmentLoading) ||
      (subjectLicId && isLicLoading) ||
      isLoadingExtraLecturers)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Subject Information</h3>
          {isLoadingInitialData && (
            <div className="text-sm text-muted-foreground">Loading subject data...</div>
          )}

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
                    <FormDescription>Unique code for the subject (uppercase)</FormDescription>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="licId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lecturer In Charge (LIC)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? undefined}
                    disabled={Boolean(isFacultyLoading || (isEditMode && subjectLicId && isLicLoading))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select LIC (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {facultyOptions.length > 0 ? (
                        facultyOptions.map((u) => (
                          <SelectItem key={u._id} value={u._id}>
                            {u.fullName} ({u.email})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          {isFacultyLoading ? 'Loading faculty...' : 'No faculty available'}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>Optional lecturer in charge for this subject</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Lecturers</FormLabel>
              <div className="max-h-40 overflow-auto rounded border p-2">
                {isFacultyLoading || isLoadingExtraLecturers ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">Loading lecturers...</div>
                ) : facultyOptions.length > 0 ? (
                  facultyOptions.map((u) => (
                    <label
                      key={u._id}
                      className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-accent rounded px-2"
                    >
                      <input
                        type="checkbox"
                        checked={watchedLecturerIds?.includes(u._id) ?? false}
                        onChange={(e) => {
                          const current = form.getValues('lecturerIds') || []
                          if (e.target.checked) {
                            form.setValue('lecturerIds', [...current, u._id], { shouldDirty: true })
                          } else {
                            form.setValue(
                              'lecturerIds',
                              current.filter((id: string) => id !== u._id),
                              { shouldDirty: true }
                            )
                          }
                        }}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">
                        {u.fullName} ({u.email})
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">No faculty available</div>
                )}
              </div>
              <FormDescription>Assign multiple lecturers to this subject</FormDescription>
            </FormItem>
          </div>

          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                  disabled={Boolean(isDepartmentsLoading || (isEditMode && subjectDepartmentId && isDepartmentLoading))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departmentOptions.length > 0 ? (
                      departmentOptions.map((department) => (
                        <SelectItem key={department._id} value={department._id}>
                          {department.departmentCode} - {department.departmentName}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        {isDepartmentsLoading ? 'Loading departments...' : 'No departments available'}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>Select the department this subject belongs to</FormDescription>
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
                  <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString() ?? undefined}>
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
                  <FormDescription>Which year is this subject offered in</FormDescription>
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
                      min="0"
                      max="10"
                      step="0.5"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="3"
                    />
                  </FormControl>
                  <FormDescription>Credit hours for this subject</FormDescription>
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
                  <Textarea placeholder="Enter subject description (optional)" className="resize-none" rows={4} {...field} />
                </FormControl>
                <FormDescription>Brief description of the subject content and objectives</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isLoadingInitialData}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Subject' : 'Create Subject'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
