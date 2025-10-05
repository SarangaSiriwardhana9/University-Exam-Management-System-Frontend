 
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { QuestionForm } from '@/features/questions/components/question-form'
import { useCreateQuestion } from '@/features/questions/hooks/use-question-mutations'
import type { CreateQuestionFormData } from '@/features/questions/validations/question-schemas'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const CreateQuestionPage = () => {
  const router = useRouter()
  const createMutation = useCreateQuestion()

  const handleCreate = (data: CreateQuestionFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/faculty/questions')
      }
    })
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
            <h1 className="text-3xl font-bold text-gray-900">Create New Question</h1>
            <p className="text-muted-foreground mt-1">
              Add a new question to the question bank
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question Information</CardTitle>
            <CardDescription>
              Fill in the details below to create a new question.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionForm
              onSubmit={handleCreate}
              onCancel={() => router.push('/faculty/questions')}
              isLoading={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default CreateQuestionPage