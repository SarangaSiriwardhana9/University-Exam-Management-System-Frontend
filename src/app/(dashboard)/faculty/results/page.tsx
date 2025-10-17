'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SearchIcon,
  DownloadIcon,
  MoreVerticalIcon,
  CheckCircle2Icon,
  XCircleIcon,
  EyeIcon,
  FileTextIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AwardIcon,
  UsersIcon,
  BarChart3Icon,
} from 'lucide-react'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { format } from 'date-fns'
import { useResultsQuery, useResultStatsQuery } from '@/features/results/hooks/use-results-query'
import { useExamSessionsQuery } from '@/features/exam-sessions/hooks/use-exam-sessions-query'

export default function FacultyResultsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [sessionFilter, setSessionFilter] = useState<string>('all')
  const [publishedFilter, setPublishedFilter] = useState<string>('all')

  const { data: resultsData, isLoading: resultsLoading } = useResultsQuery({ limit: 1000 })
  const { data: sessionsData } = useExamSessionsQuery({ limit: 100 })
  const { data: statsData } = useResultStatsQuery(
    sessionFilter !== 'all' ? { sessionId: sessionFilter } : undefined
  )

  const results = resultsData?.data || []
  const sessions = sessionsData?.data || []
  const stats = statsData?.data

  const filteredResults = useMemo(() => {
    return results.filter(result => {
      const matchesSearch = search === '' || (
        result.studentName?.toLowerCase().includes(search.toLowerCase()) ||
        result.studentEmail?.toLowerCase().includes(search.toLowerCase()) ||
        result.examTitle?.toLowerCase().includes(search.toLowerCase()) ||
        result.subjectCode?.toLowerCase().includes(search.toLowerCase())
      )
      const matchesSession = sessionFilter === 'all' || result.sessionId === sessionFilter
      const matchesPublished = publishedFilter === 'all' || 
        (publishedFilter === 'published' ? result.isPublished : !result.isPublished)
      
      return matchesSearch && matchesSession && matchesPublished
    })
  }, [results, search, sessionFilter, publishedFilter])

  const getGradeColor = (grade?: string) => {
    if (!grade) return 'default'
    const gradeUpper = grade.toUpperCase()
    if (gradeUpper === 'A+' || gradeUpper === 'A') return 'default'
    if (gradeUpper === 'B+' || gradeUpper === 'B') return 'secondary'
    if (gradeUpper === 'C+' || gradeUpper === 'C') return 'outline'
    return 'destructive'
  }

  const getPassRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600'
    if (rate >= 60) return 'text-blue-600'
    if (rate >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  if (resultsLoading) {
    return (
      <RoleGuard allowedRoles={[USER_ROLES.FACULTY]}>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </RoleGuard>
    )
  }

  return (
    <RoleGuard allowedRoles={[USER_ROLES.FACULTY]}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Results</h1>
          <p className="text-muted-foreground mt-1">
            View and manage student exam results across different papers
          </p>
        </div>

        {/* No Results Message */}
        {results.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileTextIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Results Available</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                There are no exam results available yet. Results will appear here once exams are completed and graded.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push('/faculty/marking')}>
                  Go to Marking
                </Button>
                <Button variant="outline" onClick={() => router.push('/faculty/sessions')}>
                  View Exam Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        {stats && stats.totalResults > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Total Results</CardDescription>
                  <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-3xl">{stats.totalResults}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {sessionFilter === 'all' ? 'All sessions' : 'Selected session'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Average Score</CardDescription>
                  <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-3xl">{stats.averagePercentage.toFixed(1)}%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {stats.averagePercentage >= 60 ? (
                    <TrendingUpIcon className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDownIcon className="h-3 w-3 text-red-600" />
                  )}
                  <span>Class average</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Pass Rate</CardDescription>
                  <AwardIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className={`text-3xl ${getPassRateColor(stats.passRate)}`}>
                  {stats.passRate.toFixed(1)}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Students passed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Grade Distribution</CardDescription>
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl">
                  {Object.keys(stats.gradeDistribution).length} Grades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1">
                  {Object.entries(stats.gradeDistribution).slice(0, 4).map(([grade, count]) => (
                    <Badge key={grade} variant="outline" className="text-xs">
                      {grade}: {count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Results List</CardTitle>
                <CardDescription>
                  {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative w-full sm:w-64">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={sessionFilter} onValueChange={setSessionFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    {sessions.map((session) => (
                      <SelectItem key={session._id} value={session._id}>
                        {session.examTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={publishedFilter} onValueChange={setPublishedFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="unpublished">Unpublished</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Exam / Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Marks</TableHead>
                    <TableHead className="text-center">Percentage</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        <FileTextIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No results found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredResults.map((result) => (
                      <TableRow key={result._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{result.studentName}</p>
                            <p className="text-xs text-muted-foreground">{result.studentEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{result.examTitle}</p>
                            <p className="text-xs text-muted-foreground">
                              {result.subjectCode && `${result.subjectCode} - `}{result.subjectName}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {result.examDate ? format(new Date(result.examDate), 'MMM dd, yyyy') : 'N/A'}
                          </p>
                        </TableCell>
                        <TableCell className="text-center">
                          <p className="font-medium">
                            {result.marksObtained} / {result.totalMarks}
                          </p>
                        </TableCell>
                        <TableCell className="text-center">
                          <p className="font-semibold">{result.percentage.toFixed(1)}%</p>
                        </TableCell>
                        <TableCell className="text-center">
                          {result.grade && (
                            <Badge variant={getGradeColor(result.grade)}>
                              {result.grade}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Badge variant={result.isPublished ? 'default' : 'secondary'}>
                              {result.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                            {result.isPass ? (
                              <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircleIcon className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVerticalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <FileTextIcon className="mr-2 h-4 w-4" />
                                Download Report
                              </DropdownMenuItem>
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
        )}
      </div>
    </RoleGuard>
  )
}
