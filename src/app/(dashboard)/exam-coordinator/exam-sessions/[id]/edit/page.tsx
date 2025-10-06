'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { ExamSessionForm } from '@/features/exam-sessions/components/exam-session-form'
import { useExamSessionQuery } from '@/features/exam-sessions/hooks/use-exam-sessions-query'
import { useUpdateExamSession } from '@/features/exam-sessions/hooks/use-exam-session-mutations'
import type { UpdateExamSessionFormData } from '@/features/exam-sessions/validations/exam-session-schemas'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

type EditExamSessionPageProps = {
  params: Promise<{ id: string }>
}

const EditExamSessionPage = ({ params }: EditExamSessionPageProps) => {
  const router = useRouter()
  const { id: sessionId } = use(params)

  console.log('Edit page - Session ID from params:', sessionId)

  const { data: sessionResponse, isLoading, error } = useExamSessionQuery(sessionId)
  const updateMutation = useUpdateExamSession()

  const handleUpdate = (data: UpdateExamSessionFormData) => {
    updateMutation.mutate(
      { id: sessionId, data },
      {
        onSuccess: () => {
          router.push('/exam-coordinator/exam-sessions')
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

  if (error) {
    console.error('Error fetching exam session:', error)
  }

  if (!sessionResponse?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Exam Session Not Found</h2>
          <p className="text-muted-foreground">
            The exam session you&apos;re looking for doesn&apos;t exist.
          </p>
          {error && (
            <p className="text-sm text-red-500">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          )}
          <Button onClick={() => router.push('/exam-coordinator/exam-sessions')} className="mt-4">
            Back to Exam Sessions
          </Button>
        </div>
      </div>
    )
  }

  return (
    <RoleGuard allowedRoles={[USER_ROLES.EXAM_COORDINATOR, USER_ROLES.ADMIN]}>
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Exam Session</h1>
            <p className="text-muted-foreground mt-1">
              Update exam session details for {sessionResponse.data.examTitle}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Exam Session Information</CardTitle>
            <CardDescription>
              Update the exam session details below and click save.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExamSessionForm
              session={sessionResponse.data}
              onSubmit={handleUpdate}
              onCancel={() => router.push('/exam-coordinator/exam-sessions')}
              isLoading={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default EditExamSessionPage