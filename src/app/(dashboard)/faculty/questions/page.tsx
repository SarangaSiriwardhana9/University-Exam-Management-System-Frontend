'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/data-display/data-table'
import { PlusIcon } from 'lucide-react'
import { getQuestionColumns } from '@/features/questions/components/question-columns'
import { useQuestionsQuery } from '@/features/questions/hooks/use-questions-query'
import { useDeleteQuestion } from '@/features/questions/hooks/use-question-mutations'
import type { Question } from '@/features/questions/types/questions'
import type { QuestionType } from '@/constants/roles'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type QuestionFilters = {
  questionType: string
  subjectId: string
}

export default function QuestionsPage() {
  const router = useRouter()
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [filters, setFilters] = useState<QuestionFilters>({
    questionType: 'all',
    subjectId: 'all'
  })
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null)

  const { data, isLoading } = useQuestionsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    questionType: filters.questionType && filters.questionType !== 'all' 
      ? (filters.questionType as QuestionType) 
      : undefined,
    subjectId: filters.subjectId && filters.subjectId !== 'all' 
      ? filters.subjectId 
      : undefined,
  })

  const deleteMutation = useDeleteQuestion()

  const handleEdit = (question: Question) => {
    router.push(`/faculty/questions/${question._id}/edit`)
  }

  const handleView = (question: Question) => {
    router.push(`/faculty/questions/${question._id}`)
  }

  const handleDelete = (question: Question) => {
    setQuestionToDelete(question)
  }

  const confirmDelete = async () => {
    if (!questionToDelete) return
    await deleteMutation.mutateAsync(questionToDelete._id)
    setQuestionToDelete(null)
  }

  const columns = getQuestionColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onView: handleView,
  })

  const questions = data?.data || []
  const totalPages = data?.totalPages || 0

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
            <p className="text-muted-foreground">
              Manage your questions for exam papers
            </p>
          </div>
          <Button onClick={() => router.push('/faculty/questions/new')}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Question
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Questions</CardTitle>
            <CardDescription>
              {isLoading ? 'Loading questions...' : `${questions.length} question(s) found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading questions...</p>
                </div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={questions}
                pageCount={totalPages}
                pagination={pagination}
                onPaginationChange={setPagination}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!questionToDelete} onOpenChange={() => setQuestionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this question. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}