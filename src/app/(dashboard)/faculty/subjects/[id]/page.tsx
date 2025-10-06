 
'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronLeftIcon, 
  BookOpenIcon, 
  HelpCircleIcon, 
  FileTextIcon,
  UsersIcon,
  ClipboardListIcon
} from 'lucide-react'
import { useSubjectQuery } from '@/features/subjects/hooks/use-subjects-query'
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
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-4"
                    onClick={() => router.push(`/faculty/questions?subjectId=${subjectId}`)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <HelpCircleIcon className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                      <div className="text-left">
                        <div className="font-semibold">Manage Questions</div>
                        <div className="text-xs text-muted-foreground">
                          Create and edit questions
                        </div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto py-4"
                    onClick={() => router.push(`/faculty/exam-papers?subjectId=${subjectId}`)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <FileTextIcon className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                      <div className="text-left">
                        <div className="font-semibold">Manage Exam Papers</div>
                        <div className="text-xs text-muted-foreground">
                          Create and review papers
                        </div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto py-4"
                    onClick={() => router.push(`/faculty/subjects/${subjectId}/students`)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <UsersIcon className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                      <div className="text-left">
                        <div className="font-semibold">View Students</div>
                        <div className="text-xs text-muted-foreground">
                          See enrolled students
                        </div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto py-4"
                    onClick={() => router.push(`/faculty/assignments?subjectId=${subjectId}`)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <ClipboardListIcon className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                      <div className="text-left">
                        <div className="font-semibold">Assignments</div>
                        <div className="text-xs text-muted-foreground">
                          View teaching assignments
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
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
                <CardContent>
                  <p className="text-muted-foreground">{subject.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}

export default FacultyViewSubjectPage