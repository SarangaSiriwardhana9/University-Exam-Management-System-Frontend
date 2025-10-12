'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QuestionDetails } from '@/features/questions/components/question-details'
import { useQuestionQuery } from '@/features/questions/hooks/use-questions-query'
import { ArrowLeftIcon, EditIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const questionId = params.id as string

  const { data, isLoading } = useQuestionQuery(questionId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data?.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Question Not Found</CardTitle>
          <CardDescription>The question you&lsquo;re looking for doesn&lsquo;t exist.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/faculty/questions')}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Question Details</h1>
            <p className="text-muted-foreground">View complete question information</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/faculty/questions/${questionId}/edit`)}>
          <EditIcon className="mr-2 h-4 w-4" />
          Edit Question
        </Button>
      </div>

      <QuestionDetails question={data.data} />
    </div>
  )
}