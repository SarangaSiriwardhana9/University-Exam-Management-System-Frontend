'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  SearchIcon,
  DownloadIcon,
  MoreVerticalIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  FileTextIcon,
  RefreshCwIcon,
  TrashIcon,
} from 'lucide-react'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { format } from 'date-fns'
import { useRegistrationsQuery, useRegistrationStatsQuery, useMarkAsAbsent, useDeleteRegistration, useExportRegistrations } from '@/features/exam-registrations/hooks/use-registrations-query'
import { useExamSessionsQuery } from '@/features/exam-sessions/hooks/use-exam-sessions-query'

export default function ExamCoordinatorRegistrationsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sessionFilter, setSessionFilter] = useState<string>('all')
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [registrationToDelete, setRegistrationToDelete] = useState<any>(null)

  const { data: registrationsData, isLoading } = useRegistrationsQuery({ limit: 100 })
  const { data: statsData } = useRegistrationStatsQuery()
  const { data: sessionsData } = useExamSessionsQuery({ limit: 100 })
  const markAsAbsent = useMarkAsAbsent()
  const deleteRegistration = useDeleteRegistration()
  const exportData = useExportRegistrations()

  const registrations = registrationsData?.data || []
  const sessions = sessionsData?.data || []

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(reg => {
      const matchesSearch = search === '' || (
        reg.studentName?.toLowerCase().includes(search.toLowerCase()) ||
        reg.studentUsername?.toLowerCase().includes(search.toLowerCase()) ||
        reg.studentEmail?.toLowerCase().includes(search.toLowerCase())
      )
      
      const matchesStatus = statusFilter === 'all' || reg.status === statusFilter
      const matchesSession = sessionFilter === 'all' || reg.sessionId === sessionFilter

      return matchesSearch && matchesStatus && matchesSession
    })
  }, [registrations, search, statusFilter, sessionFilter])

  const stats = useMemo(() => {
    const data = statsData?.data
    return {
      total: data?.total || registrations.length,
      registered: data?.registered || registrations.filter(r => r.status === 'registered').length,
      inProgress: data?.inProgress || registrations.filter(r => r.status === 'in_progress').length,
      completed: data?.completed || registrations.filter(r => r.status === 'completed').length,
      absent: data?.absent || registrations.filter(r => r.status === 'absent').length,
    }
  }, [statsData, registrations])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string; icon: any }> = {
      registered: { variant: 'secondary', label: 'Registered', icon: ClockIcon },
      in_progress: { variant: 'default', label: 'In Progress', icon: RefreshCwIcon },
      completed: { variant: 'default', label: 'Completed', icon: CheckCircle2Icon },
      auto_submitted: { variant: 'default', label: 'Auto Submitted', icon: CheckCircle2Icon },
      absent: { variant: 'destructive', label: 'Absent', icon: XCircleIcon },
    }

    const config = variants[status] || variants.registered
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const handleViewDetails = (registration: any) => {
    setSelectedRegistration(registration)
    setShowDetailsDialog(true)
  }

  const handleMarkAbsent = async (id: string) => {
    await markAsAbsent.mutateAsync(id)
  }

  const handleDeleteClick = (registration: any) => {
    setRegistrationToDelete(registration)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (registrationToDelete) {
      await deleteRegistration.mutateAsync(registrationToDelete._id)
      setShowDeleteDialog(false)
      setRegistrationToDelete(null)
    }
  }

  const handleExportData = async () => {
    await exportData.mutateAsync({ 
      sessionId: sessionFilter !== 'all' ? sessionFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter as any : undefined 
    })
  }

  const formatDate = (dateString: string | undefined, formatStr: string) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid Date'
      return format(date, formatStr)
    } catch {
      return 'Invalid Date'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Registrations</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor student exam registrations
          </p>
        </div>
        <Button onClick={handleExportData}>
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Students</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">All exam registrations</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Awaiting Exam</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.registered}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Not yet started</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Taking Exam</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{stats.inProgress}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Currently in progress</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Finished</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Exam submitted</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Absent</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.absent}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Did not attend</p>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, student ID, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sessionFilter} onValueChange={setSessionFilter}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Filter by session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                {sessions.map(session => (
                  <SelectItem key={session._id} value={session._id}>
                    {session.examTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Exam Session</TableHead>
                <TableHead>Exam Date</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <LoadingSpinner size="lg" />
                  </TableCell>
                </TableRow>
              ) : filteredRegistrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <FileTextIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No registrations found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRegistrations.map((registration) => (
                  <TableRow key={registration._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{registration.studentName || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{registration.studentEmail || 'N/A'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{registration.studentUsername || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{registration.examTitle || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{registration.paperTitle || 'N/A'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {formatDate(registration.examDateTime, 'PP')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(registration.registrationDate, 'PP')}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(registration.status)}
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetails(registration)}>
                            View Details
                          </DropdownMenuItem>
                          {registration.status === 'completed' && (
                            <DropdownMenuItem onClick={() => router.push(`/exam-coordinator/registrations/${registration._id}/results`)}>
                              View Results
                            </DropdownMenuItem>
                          )}
                          {registration.status === 'registered' && (
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleMarkAbsent(registration._id)}
                            >
                              Mark as Absent
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteClick(registration)}
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Delete Registration
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>
              Detailed information about the exam registration
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Student Name</p>
                  <p className="text-base font-semibold">{selectedRegistration.studentName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Student ID</p>
                  <p className="text-base font-semibold">{selectedRegistration.studentUsername || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{selectedRegistration.studentEmail || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedRegistration.status)}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Exam Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Exam Title</p>
                    <p className="text-base">{selectedRegistration.examTitle || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Paper</p>
                    <p className="text-base">{selectedRegistration.paperTitle || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Exam Date</p>
                    <p className="text-base">{formatDate(selectedRegistration.examDateTime, 'PPP')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <p className="text-base">{selectedRegistration.formattedDuration || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Registration Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Registered: {formatDate(selectedRegistration.registrationDate, 'PPp')}</span>
                  </div>
                  {selectedRegistration.actualStartTime && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2Icon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Started: {formatDate(selectedRegistration.actualStartTime, 'PPp')}</span>
                    </div>
                  )}
                  {selectedRegistration.actualSubmitTime && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Submitted: {formatDate(selectedRegistration.actualSubmitTime, 'PPp')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Registration</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this registration? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {registrationToDelete && (
            <div className="py-4">
              <p className="text-sm">
                <span className="font-medium">Student:</span> {registrationToDelete.studentName}
              </p>
              <p className="text-sm">
                <span className="font-medium">Exam:</span> {registrationToDelete.examTitle}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleteRegistration.isPending}
            >
              {deleteRegistration.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
