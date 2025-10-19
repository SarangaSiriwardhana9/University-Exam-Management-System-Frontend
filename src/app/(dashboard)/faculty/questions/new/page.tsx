'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionForm } from '@/features/questions/components/question-form'
import { useCreateQuestion } from '@/features/questions/hooks/use-question-mutations'
import type { CreateQuestionFormData } from '@/features/questions/validations/question-schemas'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function NewQuestionPage() {
  const router = useRouter()
  const createMutation = useCreateQuestion()
  const [lastCreatedData, setLastCreatedData] = useState<Partial<CreateQuestionFormData> | null>(null)
  const [key, setKey] = useState(0)

  const handleCreate = async (data: CreateQuestionFormData) => {
    try {
      await createMutation.mutateAsync(data)
      setLastCreatedData({ subjectId: data.subjectId, questionType: data.questionType })
      setKey(prev => prev + 1)
      toast.success('Question created successfully! Create another or go to question bank.')
    } catch (error) {
      toast.error('Failed to create question')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Question</h1>
          <p className="text-muted-foreground">
            Add a new question to your question bank
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/faculty/questions')}>
          View Question Bank
        </Button>
      </div>

      <QuestionForm
        key={key}
        onSubmit={handleCreate}
        onCancel={() => router.push('/faculty/questions')}
        isLoading={createMutation.isPending}
        initialData={lastCreatedData}
      />
    </div>
  )
}