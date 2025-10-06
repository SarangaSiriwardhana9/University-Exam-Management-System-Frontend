'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { ExamSessionForm } from '@/features/exam-sessions/components/exam-session-form'
import { useCreateExamSession } from '@/features/exam-sessions/hooks/use-exam-session-mutations'
import type { CreateExamSessionFormData } from '@/features/exam-sessions/validations/exam-session-schemas'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const CreateExamSessionPage = () => {
  const router = useRouter()
  const createMutation = useCreateExamSession()

  const handleCreate = (data: CreateExamSessionFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/exam-coordinator/exam-sessions')
      }
    })
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
            <h1 className="text-3xl font-bold text-gray-900">Schedule New Exam</h1>
            <p className="text-muted-foreground mt-1">
              Create a new exam session
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Exam Session Details</CardTitle>
            <CardDescription>
              Fill in the details below to schedule a new exam session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExamSessionForm
              onSubmit={handleCreate}
              onCancel={() => router.push('/exam-coordinator/exam-sessions')}
              isLoading={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default CreateExamSessionPage