'use client'

import { use, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
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

  const isMarked = filter === 'all' ? undefined : filter === 'marked'
  const { data: submissionsData, isLoading } = useSessionSubmissionsQuery(sessionId, isMarked)
  const { data: stats } = useMarkingStatsQuery(sessionId)
  const unmarkMutation = useUnmarkRegistration()

  const submissions = submissionsData?.submissions || []

  // Filter and sort submissions
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

  const handleUnmark = async (registrationId: string) => {
    if (confirm('Are you sure you want to unmark this submission? All marks will be reset.')) {
      await unmarkMutation.mutateAsync(registrationId)
    }
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
    </div>
  )
}
