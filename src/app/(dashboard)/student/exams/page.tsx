'use client'

import { useState, useMemo } from 'react'
import { format, isPast, isFuture, isToday, addDays } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertCircleIcon,
  BookOpenIcon,
  InfoIcon,
  FileTextIcon,
  MonitorIcon,
  BuildingIcon,
} from 'lucide-react'
import { useMyExamRegistrationsQuery } from '@/features/exam-registrations/hooks/use-exam-registrations-query'
import { useExamSessionsQuery } from '@/features/exam-sessions/hooks/use-exam-sessions-query'
import {
  useCreateExamRegistrationMutation,
  useCancelExamRegistrationMutation,
} from '@/features/exam-registrations/hooks/use-exam-registration-mutations'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { cn } from '@/lib/utils'
import type { ExamSession } from '@/features/exam-sessions/types/exam-sessions'
import type { ExamRegistration } from '@/features/exam-registrations/types/exam-registrations'

export default function StudentExamsPage() {
  const [selectedSession, setSelectedSession] = useState<ExamSession | null>(null)
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<ExamRegistration | null>(null)
  const [specialRequirements, setSpecialRequirements] = useState('')
  const [cancellationReason, setCancellationReason] = useState('')

  const { data: registrationsData, isLoading: isLoadingRegistrations } = useMyExamRegistrationsQuery()
  const { data: sessionsData, isLoading: isLoadingSessions } = useExamSessionsQuery({
    status: 'scheduled',
  })

  const createMutation = useCreateExamRegistrationMutation()
  const cancelMutation = useCancelExamRegistrationMutation()

  const registrations = registrationsData?.data || []
  const allSessions = sessionsData?.data || []

  const registeredSessionIds = useMemo(
    () => new Set(registrations.map(r => r.sessionId)),
    [registrations]
  )

  const availableSessions = useMemo(
    () => allSessions.filter(s => !registeredSessionIds.has(s._id)),
    [allSessions, registeredSessionIds]
  )

  const { upcomingExams, pastExams, todayExams } = useMemo(() => {
    const now = new Date()
    const registered = registrations.filter(r => r.status !== 'cancelled')

    return {
      upcomingExams: registered.filter(r => r.examDateTime && isFuture(new Date(r.examDateTime))),
      pastExams: registered.filter(r => r.examDateTime && isPast(new Date(r.examDateTime))),
      todayExams: registered.filter(r => r.examDateTime && isToday(new Date(r.examDateTime))),
    }
  }, [registrations])

  const handleRegister = () => {
    if (!selectedSession) return

    createMutation.mutate(
      {
        sessionId: selectedSession._id,
        specialRequirements: specialRequirements || undefined,
      },
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
      {
        id: selectedRegistration._id,
        reason: cancellationReason || undefined,
      },
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
    const now = new Date()
    const endTime = new Date(session.endTime)

    return (
      session.status === 'scheduled' &&
      session.registeredStudents < session.maxStudents &&
      now < endTime
    )
  }

  if (isLoadingRegistrations || isLoadingSessions) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Exams</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your exam registrations
        </p>
      </div>

      {todayExams.length > 0 && (
        <Alert className="border-primary bg-primary/5">
          <AlertCircleIcon className="h-5 w-5 text-primary" />
          <AlertDescription className="text-primary font-medium">
            You have {todayExams.length} exam{todayExams.length > 1 ? 's' : ''} today!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Registered Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{registrations.filter(r => r.status !== 'cancelled').length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total registrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingExams.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered and scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Available Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{availableSessions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Open for registration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pastExams.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Past examinations
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="registered" className="space-y-4">
        <TabsList>
          <TabsTrigger value="registered">
            My Registrations ({registrations.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available Sessions ({availableSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registered" className="space-y-4">
          {registrations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileTextIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Exam Registrations</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  You haven't registered for any exams yet. Check the available sessions tab to register.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {registrations.map((registration) => (
                <ExamRegistrationCard
                  key={registration._id}
                  registration={registration}
                  onCancel={(reg) => {
                    setSelectedRegistration(reg)
                    setIsCancelDialogOpen(true)
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {availableSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Available Sessions</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  There are no exam sessions available for registration at this time.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {availableSessions.map((session) => {
                const isRegistered = registeredSessionIds.has(session._id)
                return (
                  <AvailableSessionCard
                    key={session._id}
                    session={session}
                    canRegister={canRegisterForSession(session)}
                    isRegistered={isRegistered}
                    onRegister={(s) => {
                      setSelectedSession(s)
                      setIsRegisterDialogOpen(true)
                    }}
                  />
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for Exam</DialogTitle>
            <DialogDescription>
              Confirm your registration for this exam session
            </DialogDescription>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg space-y-2 bg-muted/50">
                <h4 className="font-semibold">{selectedSession.examTitle}</h4>
                {selectedSession.paperTitle && (
                  <p className="text-sm font-medium text-muted-foreground">
                    Paper: {selectedSession.paperTitle}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpenIcon className="h-4 w-4" />
                  <span>{selectedSession.subjectCode} - {selectedSession.subjectName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{format(new Date(selectedSession.examDateTime), 'PPP')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ClockIcon className="h-4 w-4" />
                  <span>{format(new Date(selectedSession.examDateTime), 'p')} ({selectedSession.formattedDuration})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {selectedSession.deliveryMode === 'online' ? (
                    <MonitorIcon className="h-4 w-4" />
                  ) : (
                    <BuildingIcon className="h-4 w-4" />
                  )}
                  <span className="capitalize">{selectedSession.deliveryMode}</span>
                </div>
                {selectedSession.roomNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{selectedSession.roomNumber}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="special-requirements">Special Requirements (Optional)</Label>
                <Textarea
                  id="special-requirements"
                  placeholder="e.g., Extra time, specific seating, accessibility needs..."
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRegister} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Registering...' : 'Confirm Registration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Registration</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your registration for this exam?
            </DialogDescription>
          </DialogHeader>

          {selectedRegistration && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription>
                  This action cannot be undone. You will need to register again if you change your mind.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="cancellation-reason">Reason for Cancellation (Optional)</Label>
                <Textarea
                  id="cancellation-reason"
                  placeholder="Please provide a reason for cancellation..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Keep Registration
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelRegistration}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Registration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ExamRegistrationCard({
  registration,
  onCancel,
}: {
  registration: ExamRegistration
  onCancel: (reg: ExamRegistration) => void
}) {
  const examDate = registration.examDateTime ? new Date(registration.examDateTime) : null
  const isUpcoming = examDate && isFuture(examDate)
  const isPastExam = examDate && isPast(examDate)
  const isTodayExam = examDate && isToday(examDate)

  const isSessionCancelled = registration.sessionStatus === 'cancelled'

  return (
    <Card className={cn(
      'transition-all hover:shadow-md',
      isTodayExam && 'border-primary border-2',
      registration.status === 'cancelled' && 'opacity-60',
      isSessionCancelled && 'border-destructive border-2 opacity-75'
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-xl">{registration.examTitle || 'Exam'}</CardTitle>
            {registration.paperTitle && (
              <p className="text-sm font-medium text-muted-foreground">
                Paper: {registration.paperTitle}
              </p>
            )}
            {registration.subjectCode && registration.subjectName && (
              <p className="text-sm text-muted-foreground">
                {registration.subjectCode} - {registration.subjectName}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 items-end">
            {isSessionCancelled && (
              <Badge variant="destructive">Exam Cancelled</Badge>
            )}
            <Badge variant={registration.status === 'cancelled' ? 'destructive' : registration.status === 'confirmed' ? 'default' : 'secondary'}>
              {registration.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isSessionCancelled && (
          <>
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>
                This exam session has been cancelled by the coordinator. Please contact the exam office for more information.
              </AlertDescription>
            </Alert>
            <Separator />
          </>
        )}
        <div className="space-y-3">
          {examDate ? (
            <>
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">{format(examDate, 'PPPP')}</span>
                {isTodayExam && (
                  <Badge variant="destructive" className="ml-auto">Today</Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                <ClockIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">
                  {format(examDate, 'p')}
                  {registration.formattedDuration && ` • ${registration.formattedDuration}`}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Exam date not scheduled yet</span>
            </div>
          )}
          {registration.deliveryMode && (
            <div className="flex items-center gap-3">
              {registration.deliveryMode === 'online' ? (
                <MonitorIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <BuildingIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className="text-sm capitalize font-medium">{registration.deliveryMode}</span>
            </div>
          )}
          {registration.roomNumber && (
            <div className="flex items-center gap-3">
              <MapPinIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium">{registration.roomNumber}</span>
            </div>
          )}
          {registration.seatNumber && (
            <div className="flex items-center gap-3">
              <InfoIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm">Seat Number: <strong>{registration.seatNumber}</strong></span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Registered on {format(new Date(registration.registrationDate), 'PP')}</span>
        </div>

        {registration.specialRequirements && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm font-medium">Special Requirements:</p>
              <p className="text-sm text-muted-foreground">{registration.specialRequirements}</p>
            </div>
          </>
        )}

        {registration.status === 'registered' && isUpcoming && (
          <div className="flex justify-end pt-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancel(registration)}
            >
              <XCircleIcon className="h-4 w-4 mr-2" />
              Cancel Registration
            </Button>
          </div>
        )}

        {registration.status === 'cancelled' && registration.cancellationReason && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm font-medium text-destructive">Cancellation Reason:</p>
              <p className="text-sm text-muted-foreground">{registration.cancellationReason}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function AvailableSessionCard({
  session,
  canRegister,
  isRegistered,
  onRegister,
}: {
  session: ExamSession
  canRegister: boolean
  isRegistered: boolean
  onRegister: (session: ExamSession) => void
}) {
  const examDate = new Date(session.examDateTime)
  const endTime = new Date(session.endTime)
  const availableSeats = session.maxStudents - session.registeredStudents
  const isFull = availableSeats <= 0
  const isAlmostFull = availableSeats <= 5 && availableSeats > 0

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{session.examTitle}</CardTitle>
            {session.paperTitle && (
              <CardDescription className="font-medium">
                Paper: {session.paperTitle}
              </CardDescription>
            )}
            {session.subjectCode && session.subjectName && (
              <CardDescription className="flex items-center gap-2">
                <BookOpenIcon className="h-4 w-4" />
                {session.subjectCode} - {session.subjectName}
              </CardDescription>
            )}
          </div>
          <div className="flex gap-2">
            {isRegistered && (
              <Badge variant="default">
                <CheckCircle2Icon className="h-3 w-3 mr-1" />
                Enrolled
              </Badge>
            )}
            {isFull ? (
              <Badge variant="destructive">Full</Badge>
            ) : isAlmostFull ? (
              <Badge variant="outline">Almost Full</Badge>
            ) : (
              <Badge variant="secondary">Available</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>{format(examDate, 'PPP')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <span>{format(examDate, 'p')} ({session.formattedDuration})</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {session.deliveryMode === 'online' ? (
                <MonitorIcon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <BuildingIcon className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="capitalize font-medium">{session.deliveryMode}</span>
            </div>
            {session.roomNumber && (
              <div className="flex items-center gap-2 text-sm">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <span>{session.roomNumber}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <span>{session.registeredStudents} / {session.maxStudents} registered</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
              <span>{availableSeats} seats available</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
              <span>Register before: {format(endTime, 'PPp')}</span>
            </div>
          </div>
        </div>

        {session.instructions && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm font-medium">Instructions:</p>
              <p className="text-sm text-muted-foreground">{session.instructions}</p>
            </div>
          </>
        )}

        <div className="flex justify-end pt-2">
          <Button
            onClick={() => onRegister(session)}
            disabled={!canRegister || isFull || isRegistered}
          >
            <CheckCircle2Icon className="h-4 w-4 mr-2" />
            {isRegistered ? 'Already Enrolled' : isFull ? 'Session Full' : 'Register for Exam'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
