'use client'

import { useState } from 'react'
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isPast, isFuture } from 'date-fns'
import { Calendar, Clock, BookOpen, ChevronLeft, ChevronRight, Filter, MonitorIcon, BuildingIcon, Users, History, Eye, EyeOff } from 'lucide-react'
import { useExamSessionsQuery } from '../hooks/use-exam-sessions-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function AdminExamCalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [filterYear, setFilterYear] = useState<number | undefined>()
  const [filterSemester, setFilterSemester] = useState<number | undefined>()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showHistory, setShowHistory] = useState(true)

  const { data, isLoading, error } = useExamSessionsQuery({
    limit: 1000,
    year: filterYear,
    semester: filterSemester,
  })

  const allSessions = data?.data || []
  const sessions = showHistory ? allSessions : allSessions.filter(s => {
    const sessionDate = s.examDate || s.examDateTime
    return sessionDate && (isFuture(parseISO(sessionDate)) || isToday(parseISO(sessionDate)) || s.status === 'in_progress')
  })
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => {
      const sessionDate = session.examDate || session.examDateTime
      return sessionDate && isSameDay(parseISO(sessionDate), date)
    })
  }

  const getDeliveryModeBadge = (mode: string) => (
    mode === 'online' ? (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        <MonitorIcon className="h-3 w-3 mr-1" />Online
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        <BuildingIcon className="h-3 w-3 mr-1" />Onsite
      </Badge>
    )
  )

  const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    const formatStatus = (s: string) => 
      s.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    
    return (
      <Badge variant="secondary" className={config[status] || config.scheduled}>
        {formatStatus(status)}
      </Badge>
    )
  }

  const totalExams = allSessions.length
  const upcomingExams = sessions.filter(s => {
    const date = s.examDate || s.examDateTime
    return date && isFuture(parseISO(date)) && s.status === 'scheduled'
  }).length
  const completedExams = sessions.filter(s => s.status === 'completed').length
  const ongoingExams = sessions.filter(s => s.status === 'in_progress').length

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-96 w-full" /></div>
  if (error) return <Card><CardContent className="pt-6"><p className="text-red-600">Error loading exam calendar.</p></CardContent></Card>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Total Exams</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{totalExams}</div></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Upcoming</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-blue-600">{upcomingExams}</div></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Ongoing</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-orange-600">{ongoingExams}</div></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-green-600">{completedExams}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <div className="flex gap-2">
                <Select value={filterYear?.toString() || 'all'} onValueChange={(v) => setFilterYear(v === 'all' ? undefined : parseInt(v))}>
                  <SelectTrigger className="w-32"><SelectValue placeholder="Year" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSemester?.toString() || 'all'} onValueChange={(v) => setFilterSemester(v === 'all' ? undefined : parseInt(v))}>
                  <SelectTrigger className="w-32"><SelectValue placeholder="Semester" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={showHistory ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setShowHistory(!showHistory)}
                className="gap-2"
              >
                {showHistory ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {showHistory ? 'Hide History' : 'Show History'}
              </Button>
              <Button variant={viewMode === 'calendar' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('calendar')}>
                <Calendar className="h-4 w-4 mr-2" />Calendar
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>List</Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle className="text-2xl">{format(currentDate, 'MMMM yyyy')}</CardTitle></div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-sm py-3 bg-gray-50">{day}</div>
                ))}
                {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-24 border rounded bg-gray-50/50" />
                ))}
                {daysInMonth.map(day => {
                  const sessionsOnDay = getSessionsForDate(day)
                  const hasSessions = sessionsOnDay.length > 0
                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => hasSessions && setSelectedDate(day)}
                      className={cn(
                        'min-h-24 border rounded-lg p-2 cursor-pointer transition-all',
                        isToday(day) && 'border-2 border-blue-500 bg-blue-50',
                        !isSameMonth(day, currentDate) && 'bg-gray-50/50 text-gray-400',
                        hasSessions && 'border-orange-400 bg-orange-50/30 hover:bg-orange-100/50',
                        selectedDate && isSameDay(day, selectedDate) && 'ring-2 ring-primary'
                      )}
                    >
                      <div className="text-sm font-semibold flex justify-between">
                        <span>{format(day, 'd')}</span>
                        {hasSessions && <Badge variant="secondary" className="h-5 px-1.5 text-xs">{sessionsOnDay.length}</Badge>}
                      </div>
                      {hasSessions && (
                        <div className="mt-1 space-y-1 text-[10px]">
                          {sessionsOnDay.slice(0, 2).map(s => (
                            <div key={s._id} className="truncate">
                              <div className="font-medium">{s.examTitle}</div>
                              {s.startTime && (
                                <div className="text-gray-500 flex items-center gap-1">
                                  <Clock className="h-2.5 w-2.5" />
                                  {format(parseISO(s.startTime), 'HH:mm')}
                                </div>
                              )}
                            </div>
                          ))}
                          {sessionsOnDay.length > 2 && <div className="text-gray-500">+{sessionsOnDay.length - 2} more</div>}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select a Date'}
              </CardTitle>
              <CardDescription>
                {selectedDate && getSessionsForDate(selectedDate).length > 0 
                  ? `${getSessionsForDate(selectedDate).length} exam${getSessionsForDate(selectedDate).length > 1 ? 's' : ''} scheduled`
                  : 'Click on a date with exams to view details'}
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              {selectedDate && getSessionsForDate(selectedDate).length > 0 ? (
                <div className="space-y-4">
                  {getSessionsForDate(selectedDate).map(s => (
                    <div key={s._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-base mb-2">{s.examTitle}</h4>
                          <div className="flex gap-2 flex-wrap">
                            {getDeliveryModeBadge(s.deliveryMode)}
                            {getStatusBadge(s.status)}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            {s.startTime && s.endTime && (
                              <span>{format(parseISO(s.startTime), 'HH:mm')} - {format(parseISO(s.endTime), 'HH:mm')}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 flex-shrink-0" />
                            <span>{s.registeredStudents || 0} students registered</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 flex-shrink-0" />
                            <span>Year {s.year}, Semester {s.semester}</span>
                          </div>
                          {s.roomNumber && (
                            <div className="flex items-center gap-2">
                              <BuildingIcon className="h-4 w-4 flex-shrink-0" />
                              <span>{s.roomNumber}</span>
                            </div>
                          )}
                          {s.durationMinutes && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 flex-shrink-0" />
                              <span>{s.durationMinutes} minutes</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm">No exams selected</p>
                  <p className="text-xs mt-2">Click on a calendar date to view exam details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.length > 0 ? sessions.map(s => (
            <Card key={s._id}>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="text-xl">{s.examTitle}</CardTitle>
                  <div className="flex gap-2">{getDeliveryModeBadge(s.deliveryMode)}{getStatusBadge(s.status)}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-500" />{s.examDate && format(parseISO(s.examDate), 'MMM d, yyyy')}</div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    {s.startTime && s.endTime && (
                      <span>{format(parseISO(s.startTime), 'HH:mm')} - {format(parseISO(s.endTime), 'HH:mm')}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-gray-500" />{s.registeredStudents || 0} students</div>
                  <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-gray-500" />Year {s.year}, Sem {s.semester}</div>
                  {s.roomNumber && <div className="flex items-center gap-2"><BuildingIcon className="h-4 w-4 text-gray-500" />{s.roomNumber}</div>}
                  {s.durationMinutes && <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gray-500" />{s.durationMinutes} mins</div>}
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card><CardContent className="pt-6 text-center text-gray-500"><Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" /><p>No exams scheduled</p></CardContent></Card>
          )}
        </div>
      )}
    </div>
  )
}