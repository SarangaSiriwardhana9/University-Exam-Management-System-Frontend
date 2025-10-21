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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { BookOpenIcon, BuildingIcon, UserIcon, FileTextIcon, GraduationCapIcon, CalendarIcon, InfoIcon } from 'lucide-react'
import { LoadingSpinner } from '@/components/common/loading-spinner'
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
  const [licOpen, setLicOpen] = useState(false)
  const [lecturerQuery, setLecturerQuery] = useState('')

  const form = useForm<CreateSubjectFormData | UpdateSubjectFormData>({
    resolver: zodResolver(isEditMode ? updateSubjectSchema : createSubjectSchema) as unknown as Resolver<
      CreateSubjectFormData | UpdateSubjectFormData
    >,
    defaultValues: isEditMode
      ? {
          subjectName: '',
          departmentId: '',
          year: 1,
          semester: 1,
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
          semester: 1,
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
        semester: subject.semester,
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
        {/* Basic Information */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpenIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Subject Information</CardTitle>
                <CardDescription>Basic details about the subject</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingInitialData && (
              <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-muted-foreground">Loading subject data...</span>
              </div>
            )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isEditMode && (
              <FormField
                control={form.control}
                name="subjectCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4" />
                      Subject Code *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., CS101, MATH201"
                        {...field}
                        className="font-mono uppercase"
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormDescription className="flex items-start gap-2">
                      <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Unique code for the subject (uppercase)</span>
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
                  <FormLabel className="flex items-center gap-2">
                    <BookOpenIcon className="h-4 w-4" />
                    Subject Name *
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Data Structures and Algorithms" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          </CardContent>
        </Card>

        {/* Faculty Assignment */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <UserIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle>Faculty Assignment</CardTitle>
                <CardDescription>Assign lecturers to this subject</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="licId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Lecturer In Charge (LIC)
                  </FormLabel>
                  <Popover open={licOpen} onOpenChange={setLicOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between" disabled={Boolean(isFacultyLoading || (isEditMode && subjectLicId && isLicLoading))}>
                        {field.value ? (facultyOptions.find((u) => u._id === field.value)?.fullName || 'Select LIC (optional)') : 'Select LIC (optional)'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search lecturers..." />
                        <CommandEmpty>No lecturer found.</CommandEmpty>
                        <CommandList>
                          {facultyOptions.map((u) => (
                            <CommandItem
                              key={u._id}
                              value={`${u.fullName} ${u.email}`}
                              onSelect={() => {
                                field.onChange(u._id)
                                setLicOpen(false)
                              }}
                            >
                              {u.fullName} ({u.email})
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="flex items-start gap-2">
                    <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Optional lecturer in charge for this subject</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Lecturers
              </FormLabel>
              <div className="mb-2">
                <Input placeholder="Search lecturers..." value={lecturerQuery} onChange={(e) => setLecturerQuery(e.target.value)} />
              </div>
              <div className="max-h-40 overflow-auto rounded border p-2">
                {isFacultyLoading || isLoadingExtraLecturers ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">Loading lecturers...</div>
                ) : facultyOptions.length > 0 ? (
                  facultyOptions
                    .filter((u) => {
                      const q = lecturerQuery.trim().toLowerCase()
                      if (!q) return true
                      return (
                        u.fullName.toLowerCase().includes(q) ||
                        (u.email || '').toLowerCase().includes(q)
                      )
                    })
                    .map((u) => (
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
              <FormDescription className="flex items-start gap-2">
                <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Assign multiple lecturers to this subject</span>
              </FormDescription>
            </FormItem>
          </div>
          </CardContent>
        </Card>

        {/* Academic Details */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <GraduationCapIcon className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <CardTitle>Academic Details</CardTitle>
                <CardDescription>Department, year, semester, and credits</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <BuildingIcon className="h-4 w-4" />
                  Department *
                </FormLabel>
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
                <FormDescription className="flex items-start gap-2">
                  <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Select the department this subject belongs to</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <GraduationCapIcon className="h-4 w-4" />
                    Year *
                  </FormLabel>
                  <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString() ?? undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          Year {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="flex items-start gap-2">
                    <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Year level (1-4)</span>
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
                  <FormLabel className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Semester *
                  </FormLabel>
                  <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString() ?? undefined}>
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
                  <FormDescription className="flex items-start gap-2">
                    <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Semester (1 or 2)</span>
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
                  <FormLabel className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4" />
                    Credits *
                  </FormLabel>
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
                  <FormDescription className="flex items-start gap-2">
                    <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Credit hours</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                <CardDescription>Additional information about the subject</CardDescription>
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
                  <Textarea placeholder="e.g., This subject covers fundamental concepts of data structures..." className="resize-none min-h-[120px]" {...field} />
                </FormControl>
                <FormDescription className="flex items-start gap-2">
                  <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Brief description of the subject content and objectives</span>
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
          <Button type="submit" disabled={isLoading || isLoadingInitialData} size="lg" className="min-w-[150px]">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Saving...</span>
              </div>
            ) : (
              isEditMode ? 'Update Subject' : 'Create Subject'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
