'use client'

import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QuestionForm } from '@/features/questions/components/question-form'
import { useQuestionQuery } from '@/features/questions/hooks/use-questions-query'
import { useUpdateQuestion } from '@/features/questions/hooks/use-question-mutations'
import type { CreateQuestionFormData } from '@/features/questions/validations/question-schemas'
import { Skeleton } from '@/components/ui/skeleton'

export default function EditQuestionPage() {
  const params = useParams()
  const router = useRouter()
  const questionId = params.id as string

  const { data, isLoading } = useQuestionQuery(questionId)
  const updateMutation = useUpdateQuestion()

  const handleUpdate = async (formData: CreateQuestionFormData) => {
    await updateMutation.mutateAsync({
      id: questionId,
      data: formData,
    })
    router.push('/faculty/questions')
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data?.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Question Not Found</CardTitle>
          <CardDescription>The question you&lsquo;re looking for doesn&lsquo;t exist.</CardDescription>
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