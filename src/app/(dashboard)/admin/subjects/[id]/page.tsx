'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, EditIcon, TrashIcon, BookOpenIcon } from 'lucide-react'
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
          {/* Subject Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
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

          {/* Subject Information Cards */}
          <div className="md:col-span-2 space-y-6">
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

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p className="mt-1">{new Date(subject.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="mt-1">{new Date(subject.updatedAt).toLocaleString()}</p>
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