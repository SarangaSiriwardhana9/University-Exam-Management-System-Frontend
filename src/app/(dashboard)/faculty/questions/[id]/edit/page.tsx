'use client'

import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QuestionForm } from '@/features/questions/components/question-form'
import { useQuestionQuery } from '@/features/questions/hooks/use-questions-query'
import { useUpdateQuestion } from '@/features/questions/hooks/use-question-mutations'
import type { CreateQuestionFormData } from '@/features/questions/validations/question-schemas'
import { LoadingSpinner } from '@/components/common/loading-spinner'

export default function EditQuestionPage() {
  const params = useParams()
  const router = useRouter()
  const questionId = params.id as string

  const { data, isLoading } = useQuestionQuery(questionId)
  const updateMutation = useUpdateQuestion()

  const handleUpdate = async (formData: CreateQuestionFormData) => {
    await updateMutation.mutateAsync({ id: questionId, data: formData })
    router.push('/faculty/questions')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!data?.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Question Not Found</CardTitle>
          <CardDescription>The question you're looking for doesn't exist.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Question</h1>
        <p className="text-muted-foreground">Update question details and structure</p>
      </div>

      <QuestionForm
        question={data.data}
        onSubmit={handleUpdate}
        onCancel={() => router.push('/faculty/questions')}
        isLoading={updateMutation.isPending}
      />
    </div>
  )
}