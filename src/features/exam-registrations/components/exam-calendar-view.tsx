'use client'

import { useState } from 'react'
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'
import { Calendar, Clock, MapPin, BookOpen, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { useExamCalendar } from '../hooks/use-exam-calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function ExamCalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [filterYear, setFilterYear] = useState<number | undefined>()
  const [filterSemester, setFilterSemester] = useState<number | undefined>()

  const { data, isLoading, error } = useExamCalendar({
    year: filterYear,
    semester: filterSemester,
  })

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getExamsForDate = (date: Date) => {
    if (!data?.exams) return []
    return data.exams.filter(exam => isSameDay(parseISO(exam.examDate), date))
  }

  const getDeliveryModeBadge = (mode: string) => {
    return mode === 'online' ? (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">Online</Badge>
    ) : (
      <Badge variant="secondary" className="bg-green-100 text-green-800">Onsite</Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-600">Error loading exam calendar. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totalExams || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{data?.upcomingExams || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{data?.completedExams || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <div className="flex gap-2">
                <Select value={filterYear?.toString() || 'all'} onValueChange={(v) => setFilterYear(v === 'all' ? undefined : parseInt(v))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSemester?.toString() || 'all'} onValueChange={(v) => setFilterSemester(v === 'all' ? undefined : parseInt(v))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
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
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar View */}
      {viewMode === 'calendar' ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                  {day}
                </div>
              ))}
              
              {/* Empty cells for days before month starts */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-24 border border-gray-100 rounded-lg bg-gray-50" />
              ))}
              
              {/* Calendar days */}
              {daysInMonth.map(day => {
                const examsOnDay = getExamsForDate(day)
                const hasExams = examsOnDay.length > 0
                
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'min-h-24 border rounded-lg p-2 transition-colors',
                      isToday(day) && 'border-blue-500 bg-blue-50',
                      !isSameMonth(day, currentDate) && 'bg-gray-50 text-gray-400',
                      hasExams && 'border-orange-300 bg-orange-50'
                    )}
                  >
                    <div className="text-sm font-medium mb-1">{format(day, 'd')}</div>
                    {hasExams && (
                      <div className="space-y-1">
                        {examsOnDay.map(exam => (
                          <div
                            key={exam.registrationId}
                            className="text-xs bg-white rounded p-1 border border-orange-200 truncate"
                            title={`${exam.subject.code} - ${format(parseISO(exam.startTime), 'HH:mm')}`}
                          >
                            <div className="font-medium">{exam.subject.code}</div>
                            <div className="text-gray-600">{format(parseISO(exam.startTime), 'HH:mm')}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* List View */
        <div className="space-y-4">
          {data?.exams && data.exams.length > 0 ? (
            data.exams.map(exam => (
              <Card key={exam.registrationId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{exam.examTitle}</CardTitle>
                      <CardDescription>
                        {exam.subject.code} - {exam.subject.name}
                      </CardDescription>
                    </div>
                    {getDeliveryModeBadge(exam.deliveryMode)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{format(parseISO(exam.examDate), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>
                        {format(parseISO(exam.startTime), 'HH:mm')} - {format(parseISO(exam.endTime), 'HH:mm')}
                        {' '}({exam.durationMinutes} mins)
                      </span>
                    </div>
                    {exam.room && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>
                          {exam.room.building} - Room {exam.room.roomNumber}
                          {exam.seatNumber && ` (Seat: ${exam.seatNumber})`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-700">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span>
                        Year {exam.year}, Semester {exam.semester} • {exam.subject.credits} Credits
                      </span>
                    </div>
                  </div>
                  {exam.specialInstructions && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Special Instructions:</strong> {exam.specialInstructions}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No exams scheduled</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
