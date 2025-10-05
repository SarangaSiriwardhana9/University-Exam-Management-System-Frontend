 
'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { QuestionForm } from '@/features/questions/components/question-form'
import { useQuestionQuery } from '@/features/questions/hooks/use-questions-query'
import { useUpdateQuestion } from '@/features/questions/hooks/use-question-mutations'
import type { UpdateQuestionFormData } from '@/features/questions/validations/question-schemas'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

type EditQuestionPageProps = {
  params: Promise<{ id: string }>
}

const EditQuestionPage = ({ params }: EditQuestionPageProps) => {
  const router = useRouter()
  const { id: questionId } = use(params)

  const { data: questionResponse, isLoading, error } = useQuestionQuery(questionId)
  const updateMutation = useUpdateQuestion()

  const handleUpdate = (data: UpdateQuestionFormData) => {
    updateMutation.mutate(
      { id: questionId, data },
      {
        onSuccess: () => {
          router.push('/faculty/questions')
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
    console.error('Error fetching question:', error)
  }

  if (!questionResponse?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Question Not Found</h2>
          <p className="text-muted-foreground">
            The question you&apos;re looking for doesn&apos;t exist.
          </p>
          {error && (
            <p className="text-sm text-red-500">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          )}
          <Button onClick={() => router.push('/faculty/questions')} className="mt-4">
            Back to Questions
          </Button>
        </div>
      </div>
    )
  }

  return (
    <RoleGuard allowedRoles={[USER_ROLES.FACULTY, USER_ROLES.ADMIN]}>
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Question</h1>
            <p className="text-muted-foreground mt-1">
              Update question information
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question Information</CardTitle>
            <CardDescription>
              Update the question details below and click save.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionForm
              question={questionResponse.data}
              onSubmit={handleUpdate}
              onCancel={() => router.push('/faculty/questions')}
              isLoading={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default EditQuestionPage