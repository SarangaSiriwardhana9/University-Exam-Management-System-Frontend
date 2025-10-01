'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { SubjectForm } from '@/features/subjects/components/subject-form'
import { useSubjectQuery } from '@/features/subjects/hooks/use-subjects-query'
import { useUpdateSubject } from '@/features/subjects/hooks/use-subject-mutations'
import type { UpdateSubjectFormData } from '@/features/subjects/validations/subject-schemas'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

type EditSubjectPageProps = {
  params: Promise<{ id: string }>
}

const EditSubjectPage = ({ params }: EditSubjectPageProps) => {
  const router = useRouter()
  const { id: subjectId } = use(params)

  const { data: subjectResponse, isLoading, error } = useSubjectQuery(subjectId)
  const updateMutation = useUpdateSubject()

  const handleUpdate = (data: UpdateSubjectFormData) => {
    updateMutation.mutate(
      { id: subjectId, data },
      {
        onSuccess: () => {
          router.push('/admin/subjects')
        }
      }
    )
  }

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

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Subject</h1>
            <p className="text-muted-foreground mt-1">
              Update subject information for {subjectResponse.data.subjectName}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subject Information</CardTitle>
            <CardDescription>
              Update the subject details below and click save.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubjectForm
              subject={subjectResponse.data}
              onSubmit={handleUpdate}
              onCancel={() => router.push('/admin/subjects')}
              isLoading={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default EditSubjectPage