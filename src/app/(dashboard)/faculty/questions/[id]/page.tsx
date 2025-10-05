// src/app/(dashboard)/faculty/questions/[id]/page.tsx
'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, EditIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'
import { useQuestionQuery } from '@/features/questions/hooks/use-questions-query'
import { useDeleteQuestion } from '@/features/questions/hooks/use-question-mutations'
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

type ViewQuestionPageProps = {
  params: Promise<{ id: string }>
}

const getQuestionTypeBadge = (type: string) => {
  const typeStyles = {
    mcq: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    short_answer: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    long_answer: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    fill_blank: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    true_false: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
  } as const
  return typeStyles[type as keyof typeof typeStyles] || 'bg-muted'
}

const getDifficultyBadge = (level: string) => {
  const difficultyStyles = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  } as const
  return difficultyStyles[level as keyof typeof difficultyStyles] || 'bg-muted'
}

const formatQuestionType = (type: string) => {
  return type.replace('_', ' ').toUpperCase()
}

const formatDifficulty = (level: string) => {
  return level.charAt(0).toUpperCase() + level.slice(1)
}

const formatBloomsTaxonomy = (level: string) => {
  return level.charAt(0).toUpperCase() + level.slice(1)
}

const ViewQuestionPage = ({ params }: ViewQuestionPageProps) => {
  const router = useRouter()
  const { id: questionId } = use(params)

  const { data: questionResponse, isLoading, error } = useQuestionQuery(questionId)
  const deleteMutation = useDeleteQuestion()

  const handleDelete = () => {
    deleteMutation.mutate(questionId, {
      onSuccess: () => {
        router.push('/faculty/questions')
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
    console.error('Error fetching question:', error)
  }

  if (!questionResponse?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Question Not Found</h2>
          <p className="text-muted-foreground">
            The question you&apos;re looking for doesn&apos;t exist.
          </p>
          {error && (
            <p className="text-sm text-red-500">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          )}
          <Button onClick={() => router.push('/faculty/questions')} className="mt-4">
            Back to Questions
          </Button>
        </div>
      </div>
    )
  }

  const question = questionResponse.data

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
              <h1 className="text-3xl font-bold text-gray-900">Question Details</h1>
              <p className="text-muted-foreground mt-1">
                View complete question information
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/faculty/questions/${questionId}/edit`)}
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this question from the question bank.
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
          {/* Question Overview Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Question Type</p>
                <Badge
                  variant="outline"
                  className={cn('mt-1', getQuestionTypeBadge(question.questionType))}
                >
                  {formatQuestionType(question.questionType)}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Difficulty Level</p>
                <Badge
                  variant="outline"
                  className={cn('mt-1', getDifficultyBadge(question.difficultyLevel))}
                >
                  {formatDifficulty(question.difficultyLevel)}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Marks</p>
                <p className="mt-1 text-2xl font-bold">{question.marks}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Usage Count</p>
                <p className="mt-1 text-lg">{question.usageCount} times</p>
              </div>

              <div className="flex gap-2">
                <Badge variant={question.isPublic ? 'default' : 'secondary'}>
                  {question.isPublic ? 'Public' : 'Private'}
                </Badge>
                <Badge variant={question.isActive ? 'default' : 'secondary'}>
                  {question.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Question Details */}
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
                    <p className="mt-1">{question.subjectCode || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subject Name</p>
                    <p className="mt-1">{question.subjectName || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question Content */}
            <Card>
              <CardHeader>
                <CardTitle>Question Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Question Text</p>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap">{question.questionText}</p>
                  </div>
                </div>

                {question.questionDescription && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="whitespace-pre-wrap text-sm">{question.questionDescription}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Answer Options (for MCQ/True-False) */}
            {question.options && question.options.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Answer Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {question.options
                      .sort((a, b) => a.optionOrder - b.optionOrder)
                      .map((option, index) => (
                        <div
                          key={option._id}
                          className={cn(
                            'p-4 rounded-lg border-2 flex items-start gap-3',
                            option.isCorrect
                              ? 'border-green-500 bg-green-50 dark:bg-green-950'
                              : 'border-border'
                          )}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{option.optionText}</p>
                          </div>
                          {option.isCorrect && (
                            <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Categorization */}
            <Card>
              <CardHeader>
                <CardTitle>Categorization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Topic</p>
                    <p className="mt-1">{question.topic || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subtopic</p>
                    <p className="mt-1">{question.subtopic || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bloom&lsquo;s Taxonomy</p>
                    <p className="mt-1">
                      {question.bloomsTaxonomy ? formatBloomsTaxonomy(question.bloomsTaxonomy) : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Keywords</p>
                    <p className="mt-1">{question.keywords || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created By</p>
                    <p className="mt-1">{question.createdByName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p className="mt-1">{new Date(question.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="mt-1">{new Date(question.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}

export default ViewQuestionPage