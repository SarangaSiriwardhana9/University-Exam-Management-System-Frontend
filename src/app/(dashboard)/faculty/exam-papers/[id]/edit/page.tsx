 
'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { ExamPaperForm } from '@/features/exam-papers/components/exam-paper-form'
import { useExamPaperQuery } from '@/features/exam-papers/hooks/use-exam-papers-query'
import { useUpdateExamPaper } from '@/features/exam-papers/hooks/use-exam-paper-mutations'
import type { UpdateExamPaperFormData } from '@/features/exam-papers/validations/exam-paper-schemas'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'

type EditExamPaperPageProps = {
  params: Promise<{ id: string }>
}

const EditExamPaperPage = ({ params }: EditExamPaperPageProps) => {
  const router = useRouter()
  const { id: paperId } = use(params)

  const { data: paperResponse, isLoading, error } = useExamPaperQuery(paperId, true)
  const updateMutation = useUpdateExamPaper()

  const handleUpdate = (data: UpdateExamPaperFormData) => {
    updateMutation.mutate(
      { id: paperId, data },
      {
        onSuccess: () => {
          router.push('/faculty/exam-papers')
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
    console.error('Error fetching exam paper:', error)
  }

  if (!paperResponse?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Exam Paper Not Found</h2>
          <p className="text-muted-foreground">
            The exam paper you&apos;re looking for doesn&apos;t exist.
          </p>
          {error && (
            <p className="text-sm text-red-500">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          )}
          <Button onClick={() => router.push('/faculty/exam-papers')} className="mt-4">
            Back to Exam Papers
          </Button>
        </div>
      </div>
    )
  }

  const paper = paperResponse.data

  if (paper.isFinalized) {
    return (
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Exam Paper</h1>
            <p className="text-muted-foreground mt-1">
              Cannot edit finalized paper
            </p>
          </div>
        </div>

        <Alert>
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>
            This exam paper has been finalized and cannot be edited. You can duplicate it to create a new version.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button onClick={() => router.push(`/faculty/exam-papers/${paperId}`)}>
            View Paper
          </Button>
          <Button variant="outline" onClick={() => router.push('/faculty/exam-papers')}>
            Back to List
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Exam Paper</h1>
            <p className="text-muted-foreground mt-1">
              Update exam paper information
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Exam Paper Information</CardTitle>
            <CardDescription>
              Update the exam paper details below and click save.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExamPaperForm
              paper={paper}
              onSubmit={handleUpdate}
              onCancel={() => router.push('/faculty/exam-papers')}
              isLoading={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default EditExamPaperPage