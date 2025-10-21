'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable } from '@/components/data-display/data-table'
import { PlusIcon, Filter, XIcon } from 'lucide-react'
import { getQuestionColumns } from '@/features/questions/components/question-columns'
import { useQuestionsQuery } from '@/features/questions/hooks/use-questions-query'
import { useDeleteQuestion } from '@/features/questions/hooks/use-question-mutations'
import { useMySubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import type { Question } from '@/features/questions/types/questions'
import type { QuestionType } from '@/constants/roles'
import { QUESTION_TYPES } from '@/constants/roles'
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
  difficultyLevel: string
  isPublic: string
}

export default function QuestionsPage() {
  const router = useRouter()
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [filters, setFilters] = useState<QuestionFilters>({
    questionType: 'all',
    subjectId: 'all',
    difficultyLevel: 'all',
    isPublic: 'all',
  })
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null)

  const queryParams = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    questionType: filters.questionType !== 'all' ? (filters.questionType as QuestionType) : undefined,
    subjectId: filters.subjectId !== 'all' ? filters.subjectId : undefined,
    difficultyLevel: filters.difficultyLevel !== 'all' ? filters.difficultyLevel as any : undefined,
    isPublic: filters.isPublic === 'public' ? true : filters.isPublic === 'private' ? false : undefined,
    sortBy: 'createdAt',
    sortOrder,
  };

  const { data, isLoading } = useQuestionsQuery(queryParams)

  const { data: subjectsData } = useMySubjectsQuery()

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

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
            {(filters.subjectId !== 'all' || filters.questionType !== 'all' || filters.difficultyLevel !== 'all' || filters.isPublic !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ questionType: 'all', subjectId: 'all', difficultyLevel: 'all', isPublic: 'all' })}
                className="h-8 px-2"
              >
                <XIcon className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={filters.subjectId} onValueChange={(v) => setFilters(prev => ({ ...prev, subjectId: v }))}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjectsData?.data?.map((subject) => (
                  <SelectItem key={subject._id} value={subject._id}>
                    {subject.subjectCode} - {subject.subjectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.questionType} onValueChange={(v) => setFilters(prev => ({ ...prev, questionType: v }))}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={QUESTION_TYPES.MCQ}>MCQ</SelectItem>
                <SelectItem value={QUESTION_TYPES.STRUCTURED}>Structured</SelectItem>
                <SelectItem value={QUESTION_TYPES.ESSAY}>Essay</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.difficultyLevel} onValueChange={(v) => setFilters(prev => ({ ...prev, difficultyLevel: v }))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.isPublic} onValueChange={(v) => setFilters(prev => ({ ...prev, isPublic: v }))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Questions</SelectItem>
                <SelectItem value="public">Public Only</SelectItem>
                <SelectItem value="private">Private Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'asc' | 'desc')}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Questions</CardTitle>
            <CardDescription>
              {isLoading ? 'Loading questions...' : `${data?.total || 0} question(s) found`}
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