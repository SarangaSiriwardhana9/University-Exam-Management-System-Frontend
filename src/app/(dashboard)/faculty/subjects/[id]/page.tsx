 
'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, BookOpenIcon } from 'lucide-react'
import { useSubjectQuery, useFacultyAssignmentsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { usersService } from '@/features/users/hooks/use-users'
import type { FacultyAssignment } from '@/features/subjects/types/subjects'
import type { User } from '@/features/users/types/users'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

type ViewSubjectPageProps = {
  params: Promise<{ id: string }>
}

const FacultyViewSubjectPage = ({ params }: ViewSubjectPageProps) => {
  const router = useRouter()
  const { id: subjectId } = use(params)

  const { data: subjectResponse, isLoading, error } = useSubjectQuery(subjectId)
  const { data: assignmentsResp } = useFacultyAssignmentsQuery(subjectId)

  // fetch fallback lecturer names by IDs if assignments don't provide names
  const [fetchedLecturerNames, setFetchedLecturerNames] = useState<string[] | null>(null)
  useEffect(() => {
    let mounted = true
    const subject = subjectResponse?.data
    const assignments = assignmentsResp?.data ?? []

    const otherLecturersFromAssignments = (assignments || []).filter((a: FacultyAssignment) => !a.isCoordinator).map((a: FacultyAssignment) => a.facultyName).filter(Boolean)
    if ((otherLecturersFromAssignments.length === 0) && subject && Array.isArray(subject.lecturerIds) && subject.lecturerIds.length > 0) {
      const ids = subject.lecturerIds
      Promise.all(ids.map((id) => usersService.getById(id).then((r) => r.data).catch(() => null)))
        .then((results) => {
          if (!mounted) return
          const names = (results.filter(Boolean) as User[]).map((u) => u.fullName)
          setFetchedLecturerNames(names)
        })
    }
    return () => { mounted = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectResponse?.data?._id, assignmentsResp?.data])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !subjectResponse?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Subject Not Found</h2>
          <p className="text-muted-foreground">
            The subject you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <Button onClick={() => router.push('/faculty/subjects')} className="mt-4">
            Back to My Subjects
          </Button>
        </div>
      </div>
    )
  }

  const subject = subjectResponse.data
  const assignments: FacultyAssignment[] = assignmentsResp?.data ?? []
  // LIC (lecturer-in-charge) is represented by isCoordinator in assignments
  const licAssignment = assignments.find((a) => a.isCoordinator)
  const otherLecturers = assignments.filter((a) => !a.isCoordinator)

  // Fallbacks: if assignments are empty or don't include other lecturers, use subject.lecturers
  const assignedCount = assignments.length > 0
    ? assignments.length
    : (subject.lecturers?.length ?? subject.lecturerIds?.length ?? (subject.licId ? 1 : 0))

  // derive other lecturer names from assignments first, then subject.lecturers, then fetchedLecturerNames
  const otherLecturerNamesFromAssignments = otherLecturers.map((l) => l.facultyName).filter(Boolean)
  const otherLecturerNamesFromSubject = subject.lecturers?.map((s) => s.fullName) ?? []
  // final string: prefer assignment names, then subject nested lecturer names, then fetched names
  let otherLecturerNamesStr = (otherLecturerNamesFromAssignments.length > 0
    ? otherLecturerNamesFromAssignments
    : (otherLecturerNamesFromSubject.length > 0 ? otherLecturerNamesFromSubject : (fetchedLecturerNames ?? []))
  ).filter(Boolean).join(', ')

  // If name resolution failed (e.g. 403 when calling users API) and we still have lecturerIds, show shortened IDs as fallback
  if (!otherLecturerNamesStr && Array.isArray(subject.lecturerIds) && subject.lecturerIds.length > 0) {
    const shortIds = subject.lecturerIds.map((id) => id.slice(-6)).join(', ')
    otherLecturerNamesStr = shortIds
  }

  return (
    <RoleGuard allowedRoles={[USER_ROLES.FACULTY]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Subject Details</h1>
              <p className="text-muted-foreground mt-1">
                {subject.subjectName}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Subject Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Subject Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpenIcon className="w-12 h-12 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{subject.subjectName}</h3>
                <p className="text-sm text-muted-foreground font-mono font-semibold mt-1">
                  {subject.subjectCode}
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline">
                    Year {subject.year}
                  </Badge>
                  <Badge variant="outline">
                    {subject.credits} Credits
                  </Badge>
                </div>
                <Badge variant={subject.isActive ? 'default' : 'secondary'} className="mt-2">
                  {subject.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Subject Information and Actions */}
          <div className="md:col-span-2 space-y-6">
            {/* Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>Teaching Assignments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assignments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No assignments found for this subject.</p>
                ) : (
                  <div className="space-y-2">
                    {assignments.map((a) => (
                      <div key={a._id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{a.facultyName}{a.isCoordinator ? ' (LIC)' : ''}</div>
                          <div className="text-xs text-muted-foreground">
                            {a.academicYear} • Semester {a.semester}
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <div>{new Date(a.assignedDate).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subject Code</p>
                    <p className="mt-1 font-mono font-semibold">{subject.subjectCode}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subject Name</p>
                    <p className="mt-1">{subject.subjectName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                    <p className="mt-1">{subject.departmentName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Lecturer-in-Charge (LIC)</p>
                    <p className="mt-1">{subject.licName ?? licAssignment?.facultyName ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assigned Lecturers</p>
                    <p className="mt-1">{assignedCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Other Lecturers</p>
                    <p className="mt-1">{otherLecturerNamesStr || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
                    <p className="mt-1">Year {subject.year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Credits</p>
                    <p className="mt-1">{subject.credits}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {subject.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">{subject.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="mt-1">{subject.departmentName || '—'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned Lecturers</p>
                  <p className="mt-1">{assignments.length}</p>
                </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Other Lecturers</p>
                        <p className="mt-1">{otherLecturerNamesStr || '—'}</p>
                      </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="mt-1">{new Date(subject.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="mt-1">{new Date(subject.updatedAt).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}

export default FacultyViewSubjectPage