 
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
    duplicateMutation.mutate(paperId, {
      onSuccess: (response) => {
        router.push(`/faculty/exam-papers/${response.data._id}/edit`)
      }
    })
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

            {/* Questions */}
            {paper.questions && paper.questions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Questions ({paper.questions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paper.questions
                      .sort((a, b) => a.questionOrder - b.questionOrder)
                      .map((question, index) => (
                        <div
                          key={question._id}
                          className="p-4 border rounded-lg"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">Q{index + 1}.</span>
                                {question.section && (
                                  <Badge variant="outline" className="text-xs">
                                    Section {question.section}
                                  </Badge>
                                )}
                                {question.isOptional && (
                                  <Badge variant="secondary" className="text-xs">
                                    Optional
                                  </Badge>
                                )}
                              </div>
                              <p className="font-medium mb-2">{question.questionText}</p>
                              <div className="flex gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {question.questionType.replace('_', ' ').toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {question.difficultyLevel}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold">{question.marksAllocated} marks</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
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