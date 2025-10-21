 'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeftIcon, LayoutListIcon } from 'lucide-react'
import { ExamPaperForm } from '@/features/exam-papers/components/exam-paper-form'
import { useCreateExamPaper } from '@/features/exam-papers/hooks/use-exam-paper-mutations'
import type { CreateExamPaperFormData, UpdateExamPaperFormData } from '@/features/exam-papers/validations/exam-paper-schemas'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const CreateExamPaperPage = () => {
  const router = useRouter()
  const createMutation = useCreateExamPaper()

  const handleCreate = (data: CreateExamPaperFormData | UpdateExamPaperFormData) => {
     
    if ('subjectId' in data && data.subjectId) {
      createMutation.mutate(data as CreateExamPaperFormData, {
        onSuccess: () => {
          router.push('/faculty/exam-papers')
        }
      })
    }
  }

  return (
    <RoleGuard allowedRoles={[USER_ROLES.FACULTY, USER_ROLES.ADMIN]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/faculty/exam-papers')}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create Exam Paper</h1>
              <p className="text-muted-foreground mt-1">
                Build your exam paper step by step
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/faculty/exam-papers/generate')}
          >
            <LayoutListIcon className="h-4 w-4 mr-2" />
            Auto-Generate Instead
          </Button>
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="p-6">
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