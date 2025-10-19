'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { format, isPast, isFuture, isToday, parseISO } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CalendarIcon, ClockIcon, MapPinIcon, CheckCircle2Icon, XCircleIcon, AlertCircleIcon, BookOpenIcon, MonitorIcon, BuildingIcon, HistoryIcon } from 'lucide-react'
import { useMyExamRegistrationsQuery } from '@/features/exam-registrations/hooks/use-exam-registrations-query'
import { useExamSessionsQuery } from '@/features/exam-sessions/hooks/use-exam-sessions-query'
import { useCreateExamRegistrationMutation, useCancelExamRegistrationMutation } from '@/features/exam-registrations/hooks/use-exam-registration-mutations'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { cn } from '@/lib/utils'
import type { ExamSession } from '@/features/exam-sessions/types/exam-sessions'
import type { ExamRegistration } from '@/features/exam-registrations/types/exam-registrations'
import { DataTable } from '@/components/data-display/data-table'
import { ColumnDef } from '@tanstack/react-table'

export default function StudentExamsPage() {
  const router = useRouter()
  const [selectedSession, setSelectedSession] = useState<ExamSession | null>(null)
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<ExamRegistration | null>(null)
  const [specialRequirements, setSpecialRequirements] = useState('')
  const [cancellationReason, setCancellationReason] = useState('')

  const { data: registrationsData, isLoading: isLoadingRegistrations } = useMyExamRegistrationsQuery()
  const { data: sessionsData, isLoading: isLoadingSessions } = useExamSessionsQuery({ status: 'scheduled' })

  const createMutation = useCreateExamRegistrationMutation()
  const cancelMutation = useCancelExamRegistrationMutation()

  const registrations = registrationsData?.data || []
  const allSessions = sessionsData?.data || []

  const registeredSessionIds = useMemo(() => new Set(registrations.map(r => r.sessionId)), [registrations])
  const availableSessions = useMemo(() => allSessions.filter(s => !registeredSessionIds.has(s._id)), [allSessions, registeredSessionIds])

  const sortedRegistrations = useMemo(() => {
    return [...registrations]
      .filter(r => r.status !== 'cancelled')
      .sort((a, b) => {
        const dateA = a.examDateTime ? new Date(a.examDateTime).getTime() : 0
        const dateB = b.examDateTime ? new Date(b.examDateTime).getTime() : 0
        const now = Date.now()
        
        const isOngoingA = a.examStartTime && !a.actualSubmitTime
        const isOngoingB = b.examStartTime && !b.actualSubmitTime
        
        if (isOngoingA && !isOngoingB) return -1
        if (!isOngoingA && isOngoingB) return 1
        
        const isTodayA = a.examDateTime && isToday(new Date(a.examDateTime))
        const isTodayB = b.examDateTime && isToday(new Date(b.examDateTime))
        
        if (isTodayA && !isTodayB) return -1
        if (!isTodayA && isTodayB) return 1
        
        const isFutureA = dateA > now
        const isFutureB = dateB > now
        
        if (isFutureA && !isFutureB) return -1
        if (!isFutureA && isFutureB) return 1
        
        return dateB - dateA
      })
  }, [registrations])

  const examHistory = useMemo(() => {
    return registrations.map(reg => {
      const examDate = reg.examDateTime ? new Date(reg.examDateTime) : null
      const hasStarted = !!reg.examStartTime
      const isExpired = reg.examEndTime ? isPast(new Date(reg.examEndTime)) : false
      const isSubmitted = !!(reg.actualSubmitTime || hasStarted && isExpired)
      
      return {
        ...reg,
        participated: isSubmitted,
        isPast: examDate ? isPast(examDate) : false
      }
    }).filter(r => r.isPast)
  }, [registrations])

  const historyColumns: ColumnDef<typeof examHistory[0]>[] = [
    {
      accessorKey: 'examTitle',
      header: 'Exam',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.examTitle}</div>
          <div className="text-xs text-muted-foreground">{row.original.subjectCode}</div>
        </div>
      ),
    },
    {
      accessorKey: 'examDateTime',
      header: 'Date',
      cell: ({ row }) => row.original.examDateTime ? format(new Date(row.original.examDateTime), 'PP') : 'N/A',
    },
    {
      accessorKey: 'participated',
      header: 'Status',
      cell: ({ row }) => {
        const { participated, status } = row.original
        if (status === 'cancelled') {
          return <Badge variant="destructive">Cancelled</Badge>
        }
        return participated ? (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle2Icon className="h-3 w-3 mr-1" />
            Participated
          </Badge>
        ) : (
          <Badge variant="secondary">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Not Participated
          </Badge>
        )
      },
    },
    {
      accessorKey: 'deliveryMode',
      header: 'Mode',
      cell: ({ row }) => <span className="capitalize">{row.original.deliveryMode}</span>,
    },
  ]

  const handleRegister = () => {
    if (!selectedSession) return
    createMutation.mutate(
      { sessionId: selectedSession._id, specialRequirements: specialRequirements || undefined },
      {
        onSuccess: () => {
          setIsRegisterDialogOpen(false)
          setSelectedSession(null)
          setSpecialRequirements('')
        },
      }
    )
  }

  const handleCancelRegistration = () => {
    if (!selectedRegistration) return
    cancelMutation.mutate(
      { id: selectedRegistration._id, reason: cancellationReason || undefined },
      {
        onSuccess: () => {
          setIsCancelDialogOpen(false)
          setSelectedRegistration(null)
          setCancellationReason('')
        },
      }
    )
  }

  const canRegisterForSession = (session: ExamSession) => {
    return session.status === 'scheduled' && session.registeredStudents < session.maxStudents && isFuture(new Date(session.endTime))
  }

  if (isLoadingRegistrations || isLoadingSessions) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Exams</h1>
        <p className="text-muted-foreground mt-1">View and manage your exam registrations</p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Exams ({sortedRegistrations.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({availableSessions.length})</TabsTrigger>
          <TabsTrigger value="history">
            <HistoryIcon className="h-4 w-4 mr-2" />
            History ({examHistory.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3">
          {sortedRegistrations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpenIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Exams</h3>
                <p className="text-sm text-muted-foreground">Check the available tab to register for exams.</p>
              </CardContent>
            </Card>
          ) : (
            sortedRegistrations.map((registration) => (
              <CompactExamCard
                key={registration._id}
                registration={registration}
                onCancel={(reg) => {
                  setSelectedRegistration(reg)
                  setIsCancelDialogOpen(true)
                }}
                onStart={() => router.push(`/student/exam-paper/${registration.paperId}?session=${registration._id}`)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-3">
          {availableSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Available Sessions</h3>
                <p className="text-sm text-muted-foreground">There are no exam sessions available for registration.</p>
              </CardContent>
            </Card>
          ) : (
            availableSessions.map((session) => (
              <CompactSessionCard
                key={session._id}
                session={session}
                canRegister={canRegisterForSession(session)}
                onRegister={(s) => {
                  setSelectedSession(s)
                  setIsRegisterDialogOpen(true)
                }}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="history">
          {examHistory.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <HistoryIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Exam History</h3>
                <p className="text-sm text-muted-foreground">Your past exams will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Exam History</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={historyColumns} data={examHistory} searchKey="examTitle" />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for Exam</DialogTitle>
            <DialogDescription>Confirm your registration for this exam session</DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="p-3 border rounded-lg space-y-2 bg-muted/50">
                <h4 className="font-semibold">{selectedSession.examTitle}</h4>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{format(new Date(selectedSession.examDateTime), 'PPP p')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {selectedSession.deliveryMode === 'online' ? <MonitorIcon className="h-4 w-4" /> : <BuildingIcon className="h-4 w-4" />}
                  <span className="capitalize">{selectedSession.deliveryMode}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="special-requirements">Special Requirements (Optional)</Label>
                <Textarea
                  id="special-requirements"
                  placeholder="e.g., Extra time, specific seating..."
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRegister} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Registering...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Registration</DialogTitle>
            <DialogDescription>Are you sure you want to cancel this exam registration?</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="cancellation-reason">Reason (Optional)</Label>
            <Textarea
              id="cancellation-reason"
              placeholder="Reason for cancellation..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>Keep Registration</Button>
            <Button variant="destructive" onClick={handleCancelRegistration} disabled={cancelMutation.isPending}>
              {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Registration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CompactExamCard({ registration, onCancel, onStart }: { registration: ExamRegistration; onCancel: (reg: ExamRegistration) => void; onStart: () => void }) {
  const examDate = registration.examDateTime ? new Date(registration.examDateTime) : null
  const hasStarted = !!registration.examStartTime
  const isExpired = registration.examEndTime ? isPast(new Date(registration.examEndTime)) : false
  const isSubmitted = !!(registration.actualSubmitTime || hasStarted && isExpired)
  const isCancelled = registration.sessionStatus === 'cancelled'
  const isTodayExam = examDate && isToday(examDate)
  const canStart = registration.canEnroll && !hasStarted && !isExpired

  return (
    <Card className={cn('transition-all hover:shadow-md', isTodayExam && 'border-primary border-2', isCancelled && 'opacity-60')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{registration.examTitle}</CardTitle>
            <p className="text-xs text-muted-foreground truncate">{registration.subjectCode} - {registration.subjectName}</p>
          </div>
          <div className="flex flex-col gap-1 items-end flex-shrink-0">
            {isCancelled && <Badge variant="destructive" className="text-xs">Cancelled</Badge>}
            {isSubmitted && <Badge variant="default" className="bg-green-600 text-xs"><CheckCircle2Icon className="h-3 w-3 mr-1" />Submitted</Badge>}
            {hasStarted && !isExpired && !isSubmitted && <Badge variant="default" className="bg-blue-600 text-xs">In Progress</Badge>}
            {isTodayExam && !isSubmitted && <Badge variant="destructive" className="text-xs">Today</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs">{examDate ? format(examDate, 'PP') : 'TBD'}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs">{examDate ? format(examDate, 'p') : 'TBD'}</span>
          </div>
          <div className="flex items-center gap-2">
            {registration.deliveryMode === 'online' ? <MonitorIcon className="h-3.5 w-3.5 text-muted-foreground" /> : <BuildingIcon className="h-3.5 w-3.5 text-muted-foreground" />}
            <span className="text-xs capitalize">{registration.deliveryMode}</span>
          </div>
          {registration.roomNumber && (
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs">{registration.roomNumber}</span>
            </div>
          )}
        </div>

        {isCancelled && (
          <Alert variant="destructive" className="py-2">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription className="text-xs">This exam session has been cancelled.</AlertDescription>
          </Alert>
        )}

        {!isCancelled && !isSubmitted && registration.deliveryMode === 'online' && (
          <div className="flex gap-2">
            {hasStarted && !isExpired ? (
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700" onClick={onStart}>
                <MonitorIcon className="h-4 w-4 mr-2" />Continue Exam
              </Button>
            ) : canStart ? (
              <Button size="sm" className="w-full" onClick={onStart}>
                <MonitorIcon className="h-4 w-4 mr-2" />Start Exam
              </Button>
            ) : isExpired && !hasStarted ? (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">Exam time has expired</AlertDescription>
              </Alert>
            ) : null}
            {!hasStarted && !isExpired && isFuture(examDate!) && (
              <Button size="sm" variant="destructive" onClick={() => onCancel(registration)}>
                <XCircleIcon className="h-4 w-4 mr-2" />Cancel
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CompactSessionCard({ session, canRegister, onRegister }: { session: ExamSession; canRegister: boolean; onRegister: (s: ExamSession) => void }) {
  const examDate = new Date(session.examDateTime)
  const availableSeats = session.maxStudents - session.registeredStudents
  const isFull = availableSeats <= 0

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{session.examTitle}</CardTitle>
            <p className="text-xs text-muted-foreground truncate">{session.subjectCode} - {session.subjectName}</p>
          </div>
          <Badge variant={isFull ? 'destructive' : 'secondary'} className="text-xs flex-shrink-0">
            {isFull ? 'Full' : `${availableSeats} seats`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs">{format(examDate, 'PP')}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs">{format(examDate, 'p')}</span>
          </div>
          <div className="flex items-center gap-2">
            {session.deliveryMode === 'online' ? <MonitorIcon className="h-3.5 w-3.5 text-muted-foreground" /> : <BuildingIcon className="h-3.5 w-3.5 text-muted-foreground" />}
            <span className="text-xs capitalize">{session.deliveryMode}</span>
          </div>
          {session.roomNumber && (
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs">{session.roomNumber}</span>
            </div>
          )}
        </div>
        <Button size="sm" className="w-full" onClick={() => onRegister(session)} disabled={!canRegister || isFull}>
          <CheckCircle2Icon className="h-4 w-4 mr-2" />
          {isFull ? 'Session Full' : 'Register'}
        </Button>
      </CardContent>
    </Card>
  )
}
