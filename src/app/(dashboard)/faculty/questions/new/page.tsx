'use client'

import { useRouter } from 'next/navigation'
import { QuestionForm } from '@/features/questions/components/question-form'
import { useCreateQuestion } from '@/features/questions/hooks/use-question-mutations'
import type { CreateQuestionFormData } from '@/features/questions/validations/question-schemas'

export default function NewQuestionPage() {
  const router = useRouter()
  const createMutation = useCreateQuestion()

  const handleCreate = async (data: CreateQuestionFormData) => {
    await createMutation.mutateAsync(data)
    router.push('/faculty/questions')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Question</h1>
        <p className="text-muted-foreground">
          Add a new question to your question bank
        </p>
      </div>

      <QuestionForm
        onSubmit={handleCreate}
        onCancel={() => router.push('/faculty/questions')}
        isLoading={createMutation.isPending}
      />
    </div>
  )
}