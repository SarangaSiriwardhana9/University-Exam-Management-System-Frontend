 
'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, EditIcon, TrashIcon, CopyIcon, LockIcon, PrinterIcon } from 'lucide-react'
import { useExamPaperQuery } from '@/features/exam-papers/hooks/use-exam-papers-query'
import { useDeleteExamPaper, useDuplicateExamPaper, useFinalizeExamPaper } from '@/features/exam-papers/hooks/use-exam-paper-mutations'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'

type ViewExamPaperPageProps = {
  params: Promise<{ id: string }>
}

const getExamTypeBadge = (type: string) => {
  const typeStyles = {
    midterm: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    final: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    quiz: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    assignment: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
  } as const
  return typeStyles[type as keyof typeof typeStyles] || 'bg-muted'
}

const formatExamType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0 && mins > 0) return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins > 1 ? 's' : ''}`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`
  return `${mins} minute${mins > 1 ? 's' : ''}`
}

const ViewExamPaperPage = ({ params }: ViewExamPaperPageProps) => {
  const router = useRouter()
  const { id: paperId } = use(params)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showFinalizeDialog, setShowFinalizeDialog] = useState(false)

  const { data: paperResponse, isLoading, error } = useExamPaperQuery(paperId, true)
  const deleteMutation = useDeleteExamPaper()
  const duplicateMutation = useDuplicateExamPaper()
  const finalizeMutation = useFinalizeExamPaper()

  const handleDelete = () => {
    deleteMutation.mutate(paperId, {
      onSuccess: () => {
        router.push('/faculty/exam-papers')
      }
    })
  }

  const handleDuplicate = () => {
    if (!paperResponse?.data) return
    duplicateMutation.mutate(
      { 
        id: paperId, 
        newTitle: `${paperResponse.data.paperTitle} (Copy)` 
      },
      {
        onSuccess: (response) => {
          router.push(`/faculty/exam-papers/${response.data._id}/edit`)
        }
      }
    )
  }

  const handleFinalize = () => {
    finalizeMutation.mutate(paperId, {
      onSuccess: () => {
        setShowFinalizeDialog(false)
      }
    })
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

  return (
    <RoleGuard allowedRoles={[USER_ROLES.FACULTY, USER_ROLES.ADMIN]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Exam Paper Details</h1>
              <p className="text-muted-foreground mt-1">
                View complete exam paper information
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => window.print()}>
              <PrinterIcon className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDuplicate} disabled={duplicateMutation.isPending}>
              <CopyIcon className="mr-2 h-4 w-4" />
              {duplicateMutation.isPending ? 'Duplicating...' : 'Duplicate'}
            </Button>
            {!paper.isFinalized && (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/faculty/exam-papers/${paperId}/edit`)}
                >
                  <EditIcon className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="default" onClick={() => setShowFinalizeDialog(true)}>
                  <LockIcon className="mr-2 h-4 w-4" />
                  Finalize
                </Button>
              </>
            )}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={paper.isFinalized}>
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the exam paper &#34;{paper.paperTitle}&#34;.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive hover:bg-destructive/90"
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overview Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Exam Type</p>
                <Badge
                  variant="outline"
                  className={cn('mt-1', getExamTypeBadge(paper.paperType))}
                >
                  {formatExamType(paper.paperType)}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Marks</p>
                <p className="mt-1 text-2xl font-bold">{paper.totalMarks}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p className="mt-1 text-lg">{formatDuration(paper.durationMinutes)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Questions</p>
                <p className="mt-1 text-lg">{paper.questionCount || 0}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="flex gap-2 mt-1">
                  {paper.isFinalized ? (
                    <Badge variant="default" className="bg-purple-100 text-purple-700">
                      <LockIcon className="h-3 w-3 mr-1" />
                      Finalized
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                  <Badge variant={paper.isActive ? 'default' : 'secondary'}>
                    {paper.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paper Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subject Information */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subject Code</p>
                    <p className="mt-1">{paper.subjectCode || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subject Name</p>
                    <p className="mt-1">{paper.subjectName || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Paper Details */}
            <Card>
              <CardHeader>
                <CardTitle>Paper Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Title</p>
                  <p className="mt-1 text-lg font-semibold">{paper.paperTitle}</p>
                </div>

                {paper.instructions && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Instructions</p>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="whitespace-pre-wrap text-sm">{paper.instructions}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Questions by Parts */}
            {paper.parts && paper.parts.length > 0 && (
              <div className="space-y-6">
                {paper.parts
                  .sort((a, b) => a.partOrder - b.partOrder)
                  .map((part) => {
                    const partQuestions = paper.questions
                      ?.filter(q => q.partLabel === part.partLabel)
                      .sort((a, b) => a.questionOrder - b.questionOrder) || []

                    if (partQuestions.length === 0) return null

                    return (
                      <Card key={part.partLabel}>
                        <CardHeader className="bg-muted/50">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-xl">
                                Part {part.partLabel}: {part.partTitle}
                              </CardTitle>
                              {part.partInstructions && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {part.partInstructions}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {part.questionCount} question{part.questionCount !== 1 ? 's' : ''}
                              </p>
                              <p className="text-lg font-bold">{part.totalMarks} marks</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-6">
                            {partQuestions.map((question, qIdx) => {
                              const questionData = typeof question.questionId === 'object' ? question.questionId : null
                              const questionText = questionData?.questionText || question.questionText
                              const questionType = questionData?.questionType || question.questionType
                              const options = questionData?.options || []
                              const allowMultiple = questionData?.allowMultipleAnswers || false
                              const isMCQ = questionType === 'mcq' || questionType === 'true_false'
                              const hasSubQuestions = question.subQuestions && question.subQuestions.length > 0

                              return (
                                <div key={question._id} className="border-l-4 border-primary/20 pl-4">
                                  <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg font-bold">{qIdx + 1}.</span>
                                        {question.isOptional && (
                                          <Badge variant="secondary" className="text-xs">Optional</Badge>
                                        )}
                                        <Badge variant="outline" className="text-xs">
                                          {questionType.replace('_', ' ')}
                                        </Badge>
                                        {isMCQ && allowMultiple && (
                                          <Badge variant="default" className="text-xs bg-blue-100 text-blue-700">
                                            Multiple Answers
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-base font-medium whitespace-pre-wrap">{questionText}</p>
                                    </div>
                                    <Badge variant="outline" className="text-sm font-semibold">
                                      {question.marksAllocated} marks
                                    </Badge>
                                  </div>

                                  {isMCQ && options.length > 0 && (
                                    <div className="mt-3 ml-6 space-y-2">
                                      {options
                                        .sort((a: any, b: any) => a.optionOrder - b.optionOrder)
                                        .map((option: any, optIdx: number) => (
                                          <div
                                            key={option._id}
                                            className={cn(
                                              "flex items-start gap-3 p-3 rounded-lg border",
                                              option.isCorrect && "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                                            )}
                                          >
                                            <span className={cn(
                                              "font-semibold min-w-[28px]",
                                              option.isCorrect ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                                            )}>
                                              {String.fromCharCode(65 + optIdx)}.
                                            </span>
                                            <span className={cn(
                                              option.isCorrect && "text-green-700 dark:text-green-300 font-medium"
                                            )}>
                                              {option.optionText}
                                              {option.isCorrect && (
                                                <span className="ml-2 text-xs font-semibold text-green-600 dark:text-green-400">
                                                  ✓ Correct Answer
                                                </span>
                                              )}
                                            </span>
                                          </div>
                                        ))}
                                    </div>
                                  )}

                                  {hasSubQuestions && (
                                    <div className="mt-4 ml-6 space-y-4 border-l-2 border-muted pl-4">
                                      {question.subQuestions?.map((subQ) => {
                                        const subQData = typeof subQ.questionId === 'object' ? subQ.questionId : null
                                        const subQText = subQData?.questionText || subQ.questionText
                                        const subQType = subQData?.questionType || subQ.questionType

                                        return (
                                          <div key={subQ._id} className="space-y-2">
                                            <div className="flex items-start justify-between gap-4">
                                              <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                  <span className="font-semibold text-primary">
                                                    ({subQ.subQuestionLabel})
                                                  </span>
                                                  <Badge variant="outline" className="text-xs">
                                                    {subQType?.replace('_', ' ')}
                                                  </Badge>
                                                </div>
                                                <p className="text-sm whitespace-pre-wrap">{subQText}</p>
                                              </div>
                                              <Badge variant="secondary" className="text-xs">
                                                {subQ.marksAllocated}m
                                              </Badge>
                                            </div>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            )}

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created By</p>
                    <p className="mt-1">{paper.createdByName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p className="mt-1">{new Date(paper.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="mt-1">{new Date(paper.updatedAt).toLocaleString()}</p>
                  </div>
                  {paper.isFinalized && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Finalized At</p>
                        <p className="mt-1">
                          {paper.finalizedAt ? new Date(paper.finalizedAt).toLocaleString() : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Finalized By</p>
                        <p className="mt-1">{paper.finalizedBy || '—'}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Version</p>
                    <p className="mt-1">v{paper.versionNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Finalize Confirmation */}
        <AlertDialog open={showFinalizeDialog} onOpenChange={setShowFinalizeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Finalize Exam Paper?</AlertDialogTitle>
              <AlertDialogDescription>
                This will lock the exam paper and prevent any further edits. Once finalized, the paper cannot be modified.
                Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleFinalize}
                disabled={finalizeMutation.isPending}
              >
                {finalizeMutation.isPending ? 'Finalizing...' : 'Finalize Paper'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </RoleGuard>
  )
}

export default ViewExamPaperPage