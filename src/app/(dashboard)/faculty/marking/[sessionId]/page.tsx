'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeftIcon, CheckCircle2Icon, ClockIcon, UserIcon } from 'lucide-react'
import { useSessionSubmissionsQuery, useMarkingStatsQuery } from '@/features/marking/hooks/use-marking-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { formatDistanceToNow } from 'date-fns'

type MarkingPageProps = {
  params: Promise<{ sessionId: string }>
}

export default function MarkingPage({ params }: MarkingPageProps) {
  const router = useRouter()
  const { sessionId } = use(params)
  const [filter, setFilter] = useState<'all' | 'marked' | 'unmarked'>('all')

  const isMarked = filter === 'all' ? undefined : filter === 'marked'
  const { data: submissionsData, isLoading } = useSessionSubmissionsQuery(sessionId, isMarked)
  const { data: stats } = useMarkingStatsQuery(sessionId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const submissions = submissionsData?.submissions || []

  return (
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
            <h1 className="text-3xl font-bold text-gray-900">Mark Student Answers</h1>
            <p className="text-muted-foreground mt-1">
              Review and mark student submissions
            </p>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Submissions</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Marked</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.marked}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl text-orange-600">{stats.unmarked}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Submissions</CardTitle>
              <CardDescription>Click on a submission to start marking</CardDescription>
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unmarked">Unmarked</TabsTrigger>
                <TabsTrigger value="marked">Marked</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No submissions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission) => (
                <Card
                  key={submission._id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => router.push(`/faculty/marking/${sessionId}/${submission._id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{submission.studentId.fullName}</h3>
                            <Badge variant="outline" className="text-xs">
                              {submission.studentId.studentId}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <ClockIcon className="h-3 w-3" />
                              Submitted {submission.actualSubmitTime ? formatDistanceToNow(new Date(submission.actualSubmitTime), { addSuffix: true }) : 'N/A'}
                            </span>
                            {submission.isMarked && submission.totalMarksObtained !== undefined && (
                              <span className="font-medium text-green-600">
                                Marks: {submission.totalMarksObtained}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {submission.isMarked ? (
                          <Badge className="bg-green-600">
                            <CheckCircle2Icon className="h-3 w-3 mr-1" />
                            Marked
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Pending
                          </Badge>
                        )}
                        <ChevronLeftIcon className="h-5 w-5 rotate-180 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
