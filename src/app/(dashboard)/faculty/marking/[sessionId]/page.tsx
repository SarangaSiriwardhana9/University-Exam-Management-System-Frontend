'use client'

import { use, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeftIcon, CheckCircle2Icon, ClockIcon, UserIcon, SearchIcon, ArrowUpDownIcon, MailIcon, EditIcon, EyeIcon, MoreVerticalIcon, XCircleIcon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSessionSubmissionsQuery, useMarkingStatsQuery, useUnmarkRegistration } from '@/features/marking/hooks/use-marking-query'
import { usePublishBulkResults } from '@/features/results/hooks/use-results-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { formatDistanceToNow } from 'date-fns'

type MarkingPageProps = {
  params: Promise<{ sessionId: string }>
}

export default function MarkingPage({ params }: MarkingPageProps) {
  const router = useRouter()
  const { sessionId } = use(params)
  const [filter, setFilter] = useState<'all' | 'marked' | 'unmarked'>('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'marks' | 'time'>('name')
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [showUnmarkDialog, setShowUnmarkDialog] = useState(false)
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<string | null>(null)

  const isMarked = filter === 'all' ? undefined : filter === 'marked'
  const { data: submissionsData, isLoading } = useSessionSubmissionsQuery(sessionId, isMarked)
  const { data: stats } = useMarkingStatsQuery(sessionId)
  const unmarkMutation = useUnmarkRegistration()
  const publishResultsMutation = usePublishBulkResults()

  const submissions = submissionsData?.submissions || []
  const sessionInfo = submissions[0]?.sessionId as any
  const paperInfo = sessionInfo?.paperId as any

  const filteredAndSortedSubmissions = useMemo(() => {
    let filtered = submissions.filter(sub => {
      const searchLower = search.toLowerCase()
      return (
        sub.studentId.fullName.toLowerCase().includes(searchLower) ||
        sub.studentId.email.toLowerCase().includes(searchLower) ||
        sub.studentId.studentId?.toLowerCase().includes(searchLower)
      )
    })

    // Sort submissions
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.studentId.fullName.localeCompare(b.studentId.fullName)
      } else if (sortBy === 'marks') {
        const marksA = a.totalMarksObtained ?? -1
        const marksB = b.totalMarksObtained ?? -1
        return marksB - marksA // Descending order
      } else if (sortBy === 'time') {
        const timeA = a.actualSubmitTime ? new Date(a.actualSubmitTime).getTime() : 0
        const timeB = b.actualSubmitTime ? new Date(b.actualSubmitTime).getTime() : 0
        return timeB - timeA // Most recent first
      }
      return 0
    })

    return filtered
  }, [submissions, search, sortBy])

  const handleUnmark = (registrationId: string) => {
    setSelectedRegistrationId(registrationId)
    setShowUnmarkDialog(true)
  }

  const confirmUnmark = async () => {
    if (selectedRegistrationId) {
      await unmarkMutation.mutateAsync(selectedRegistrationId)
      setShowUnmarkDialog(false)
      setSelectedRegistrationId(null)
    }
  }

  const handlePublishResults = () => {
    if (!stats || stats.unmarked > 0) {
      return
    }
    setShowPublishDialog(true)
  }

  const confirmPublish = async () => {
    await publishResultsMutation.mutateAsync(sessionId)
    setShowPublishDialog(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

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

      {sessionInfo && (
        <Card>
          <CardHeader>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Exam Session</p>
                <h2 className="text-xl font-semibold">{sessionInfo.examTitle || 'N/A'}</h2>
              </div>
              {paperInfo && (
                <div>
                  <p className="text-sm text-muted-foreground">Exam Paper</p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{paperInfo.paperTitle || 'N/A'}</h3>
                    <Badge variant="outline">{paperInfo.totalMarks || 0} marks</Badge>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>
      )}

      {stats && (
        <>
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
          
          {stats.unmarked === 0 && stats.marked > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-green-900">Ready to Publish Results</CardTitle>
                    <CardDescription className="text-green-700">
                      All {stats.marked} submissions have been marked. Publish results so students can view their marks.
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={handlePublishResults}
                    disabled={publishResultsMutation.isPending || (stats && stats.unmarked > 0)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2Icon className="h-4 w-4 mr-2" />
                    {publishResultsMutation.isPending ? 'Publishing...' : 'Publish Results'}
                  </Button>
                </div>
              </CardHeader>
            </Card>
          )}
        </>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Student Submissions</CardTitle>
                <CardDescription>Use the action buttons to mark or update student submissions</CardDescription>
              </div>
              <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unmarked">Unmarked</TabsTrigger>
                  <TabsTrigger value="marked">Marked</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or student ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-full sm:w-48">
                  <ArrowUpDownIcon className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="marks">Sort by Marks</SelectItem>
                  <SelectItem value="time">Sort by Submit Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-center">Marks</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <UserIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>{search ? 'No submissions match your search' : 'No submissions found'}</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedSubmissions.map((submission) => (
                    <TableRow key={submission._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <UserIcon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{submission.studentId.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MailIcon className="h-3 w-3" />
                          <span>{submission.studentId.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {submission.studentId.studentId || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ClockIcon className="h-3 w-3" />
                          <span>
                            {submission.actualSubmitTime 
                              ? formatDistanceToNow(new Date(submission.actualSubmitTime), { addSuffix: true }) 
                              : 'N/A'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {submission.isMarked && submission.totalMarksObtained !== undefined ? (
                          <span className="font-semibold text-green-600">
                            {submission.totalMarksObtained}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
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
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => router.push(`/faculty/marking/${sessionId}/${submission._id}`)}
                            >
                              <EyeIcon className="h-4 w-4 mr-2" />
                              {submission.isMarked ? 'View & Update' : 'Mark Answers'}
                            </DropdownMenuItem>
                            {submission.isMarked && (
                              <DropdownMenuItem
                                onClick={() => handleUnmark(submission._id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <XCircleIcon className="h-4 w-4 mr-2" />
                                Mark as Unmarked
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Results?</AlertDialogTitle>
            <AlertDialogDescription>
              Publish results for all {stats?.marked || 0} students? Students will be able to view their results immediately.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={publishResultsMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmPublish}
              disabled={publishResultsMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {publishResultsMutation.isPending ? 'Publishing...' : 'Publish Results'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showUnmarkDialog} onOpenChange={setShowUnmarkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unmark Submission?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unmark this submission? All marks will be reset and you'll need to mark it again.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={unmarkMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmUnmark}
              disabled={unmarkMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {unmarkMutation.isPending ? 'Unmarking...' : 'Unmark Submission'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
