'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-display/data-table'
import { QuestionForm } from '@/features/questions/components/question-form'
import { QuestionViewDialog } from '@/features/questions/components/question-view-dialog'
import { getQuestionColumns } from '@/features/questions/components/question-columns'
import { useQuestionsQuery } from '@/features/questions/hooks/use-questions-query'
import {
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from '@/features/questions/hooks/use-question-mutations'
import type { Question } from '@/features/questions/types/questions'
import type { CreateQuestionFormData } from '@/features/questions/validations/question-schemas'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { PlusIcon } from 'lucide-react'
import type { PaginationState } from '@tanstack/react-table'

export default function QuestionsPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null)
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null)

  const { data, isLoading } = useQuestionsQuery({ 
    page: pagination.pageIndex + 1, 
    limit: pagination.pageSize 
  })
  
  const createMutation = useCreateQuestion()
  const updateMutation = useUpdateQuestion()
  const deleteMutation = useDeleteQuestion()

  const handleCreate = (formData: CreateQuestionFormData) => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false)
      },
    })
  }

  const handleUpdate = (formData: CreateQuestionFormData) => {
    if (!editingQuestion) return
    updateMutation.mutate(
      { id: editingQuestion._id, data: formData },
      {
        onSuccess: () => {
          setEditingQuestion(null)
        },
      }
    )
  }

  const handleDelete = () => {
    if (!deletingQuestion) return
    deleteMutation.mutate(deletingQuestion._id, {
      onSuccess: () => {
        setDeletingQuestion(null)
      },
    })
  }

  const columns = getQuestionColumns({
    onEdit: setEditingQuestion,
    onDelete: setDeletingQuestion,
    onView: setViewingQuestion,
  })

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Question Bank</h1>
          <p className="text-muted-foreground">
            Manage your questions for exam papers
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Question
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="questionText"
        searchPlaceholder="Search questions..."
        showColumnVisibility={true}
        pageCount={data?.totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Question</DialogTitle>
          </DialogHeader>
          <QuestionForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingQuestion} onOpenChange={(open) => !open && setEditingQuestion(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <QuestionForm
              question={editingQuestion}
              onSubmit={handleUpdate}
              onCancel={() => setEditingQuestion(null)}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <QuestionViewDialog
        question={viewingQuestion}
        open={!!viewingQuestion}
        onOpenChange={(open) => !open && setViewingQuestion(null)}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingQuestion} onOpenChange={(open) => !open && setDeletingQuestion(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}