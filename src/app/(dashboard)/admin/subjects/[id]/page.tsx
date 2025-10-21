'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, EditIcon, TrashIcon, BookOpenIcon, BuildingIcon, UserIcon, FileTextIcon, GraduationCapIcon, CalendarIcon, ClockIcon, CheckCircle2Icon } from 'lucide-react'
import { useSubjectQuery } from '@/features/subjects/hooks/use-subjects-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

type ViewSubjectPageProps = {
  params: Promise<{ id: string }>
}

const ViewSubjectPage = ({ params }: ViewSubjectPageProps) => {
  const router = useRouter()
  const { id: subjectId } = use(params)

  const { data: subjectResponse, isLoading, error } = useSubjectQuery(subjectId)

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
            The subject you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push('/admin/subjects')} className="mt-4">
            Back to Subjects
          </Button>
        </div>
      </div>
    )
  }

  const subject = subjectResponse.data

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
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
                View information for {subject.subjectName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/subjects/${subjectId}/edit`)}
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive">
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpenIcon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-4 border-primary/20">
                  <BookOpenIcon className="w-12 h-12 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-xl">{subject.subjectName}</h3>
                <p className="text-sm text-muted-foreground font-mono font-semibold mt-1">
                  {subject.subjectCode}
                </p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <GraduationCapIcon className="h-3 w-3 mr-1" />
                    Year {subject.year}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Sem {subject.semester}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <FileTextIcon className="h-3 w-3 mr-1" />
                    {subject.credits} Credits
                  </Badge>
                </div>
                <Badge variant={subject.isActive ? 'default' : 'secondary'} className="mt-3 justify-center">
                  <CheckCircle2Icon className="h-3 w-3 mr-1" />
                  {subject.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <BookOpenIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Subject details and academic information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileTextIcon className="h-4 w-4" />
                      <span>Subject Code</span>
                    </div>
                    <p className="font-mono font-semibold text-lg">{subject.subjectCode}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpenIcon className="h-4 w-4" />
                      <span>Subject Name</span>
                    </div>
                    <p className="font-medium text-lg">{subject.subjectName}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BuildingIcon className="h-4 w-4" />
                      <span>Department</span>
                    </div>
                    <p className="font-medium">{subject.departmentName || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserIcon className="h-4 w-4" />
                      <span>Lecturer In Charge</span>
                    </div>
                    <p className="font-medium">{subject.licName || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCapIcon className="h-4 w-4" />
                      <span>Academic Year</span>
                    </div>
                    <p className="font-medium">Year {subject.year}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Semester</span>
                    </div>
                    <p className="font-medium">Semester {subject.semester}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileTextIcon className="h-4 w-4" />
                      <span>Credits</span>
                    </div>
                    <p className="font-medium">{subject.credits}</p>
                  </div>
                  {subject.lecturers && subject.lecturers.length > 0 && (
                    <div className="col-span-full space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UserIcon className="h-4 w-4" />
                        <span>Lecturers</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {subject.lecturers.map((l, idx) => (
                          <Badge key={idx} variant="outline" className="font-normal">
                            {l.fullName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {subject.description && (
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <FileTextIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle>Description</CardTitle>
                      <CardDescription>About this subject</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm leading-relaxed">{subject.description}</p>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="border-l-4 border-l-gray-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-500/10 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <CardTitle>System Information</CardTitle>
                    <CardDescription>Creation and update timestamps</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ClockIcon className="h-4 w-4" />
                      <span>Created At</span>
                    </div>
                    <p className="font-medium">{new Date(subject.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ClockIcon className="h-4 w-4" />
                      <span>Last Updated</span>
                    </div>
                    <p className="font-medium">{new Date(subject.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}

export default ViewSubjectPage