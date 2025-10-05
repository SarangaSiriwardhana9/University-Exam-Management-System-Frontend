 
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { ExamPaperForm } from '@/features/exam-papers/components/exam-paper-form'
import { useCreateExamPaper } from '@/features/exam-papers/hooks/use-exam-paper-mutations'
import type { CreateExamPaperFormData } from '@/features/exam-papers/validations/exam-paper-schemas'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const CreateExamPaperPage = () => {
  const router = useRouter()
  const createMutation = useCreateExamPaper()

  const handleCreate = (data: CreateExamPaperFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/faculty/exam-papers')
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
            <h1 className="text-3xl font-bold text-gray-900">Create Exam Paper</h1>
            <p className="text-muted-foreground mt-1">
              Manually select questions from the question bank
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Exam Paper Information</CardTitle>
            <CardDescription>
              Fill in the details below and add questions to create an exam paper.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExamPaperForm
              onSubmit={handleCreate}
              onCancel={() => router.push('/faculty/exam-papers')}
              isLoading={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default CreateExamPaperPage