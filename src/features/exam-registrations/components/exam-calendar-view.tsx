'use client'

import { useState } from 'react'
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isPast, isFuture } from 'date-fns'
import { Calendar, Clock, MapPin, BookOpen, ChevronLeft, ChevronRight, Filter, MonitorIcon, BuildingIcon, AlertCircle } from 'lucide-react'
import { useExamCalendar } from '../hooks/use-exam-calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export function ExamCalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [filterYear, setFilterYear] = useState<number | undefined>()
  const [filterSemester, setFilterSemester] = useState<number | undefined>()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

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
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        <MonitorIcon className="h-3 w-3 mr-1" />
        Online
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        <BuildingIcon className="h-3 w-3 mr-1" />
        Onsite
      </Badge>
    )
  }

  const getExamStatusColor = (examDate: string) => {
    const date = parseISO(examDate)
    if (isPast(date)) return 'bg-gray-100 border-gray-300 text-gray-600'
    if (isToday(date)) return 'bg-red-100 border-red-400 text-red-900'
    return 'bg-blue-100 border-blue-400 text-blue-900'
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{format(currentDate, 'MMMM yyyy')}</CardTitle>
                  <CardDescription className="mt-1">Click on a date to view exam details</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={previousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-sm text-gray-700 py-3 bg-gray-50 rounded-t">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for days before month starts */}
                {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-32 border border-gray-200 rounded bg-gray-50/50" />
                ))}
                
                {/* Calendar days */}
                {daysInMonth.map(day => {
                  const examsOnDay = getExamsForDate(day)
                  const hasExams = examsOnDay.length > 0
                  const isSelected = selectedDate && isSameDay(day, selectedDate)
                  const dayIsToday = isToday(day)
                  const dayIsPast = isPast(day) && !dayIsToday
                  
                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => hasExams && setSelectedDate(day)}
                      className={cn(
                        'min-h-32 border rounded-lg p-2 transition-all cursor-pointer hover:shadow-md',
                        dayIsToday && 'border-2 border-blue-500 bg-blue-50/50',
                        !isSameMonth(day, currentDate) && 'bg-gray-50/50 text-gray-400',
                        hasExams && !dayIsToday && 'border-orange-400 bg-orange-50/30 hover:bg-orange-50',
                        isSelected && 'ring-2 ring-primary shadow-lg',
                        dayIsPast && 'opacity-60',
                        !hasExams && 'hover:bg-gray-50'
                      )}
                    >
                      <div className={cn(
                        'text-sm font-semibold mb-1 flex items-center justify-between',
                        dayIsToday && 'text-blue-600'
                      )}>
                        <span>{format(day, 'd')}</span>
                        {hasExams && (
                          <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                            {examsOnDay.length}
                          </Badge>
                        )}
                      </div>
                      {hasExams && (
                        <ScrollArea className="h-20">
                          <div className="space-y-1 pr-2">
                            {examsOnDay.slice(0, 4).map(exam => (
                              <div
                                key={exam.registrationId}
                                className={cn(
                                  'text-xs rounded px-1.5 py-1 border font-medium transition-colors',
                                  getExamStatusColor(exam.examDate)
                                )}
                                title={`${exam.subject.code} - ${exam.subject.name}`}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="truncate font-semibold">{exam.subject.code}</span>
                                  {exam.deliveryMode === 'online' ? (
                                    <MonitorIcon className="h-3 w-3 flex-shrink-0" />
                                  ) : (
                                    <BuildingIcon className="h-3 w-3 flex-shrink-0" />
                                  )}
                                </div>
                                <div className="text-[10px] opacity-80 flex items-center gap-1">
                                  <Clock className="h-2.5 w-2.5" />
                                  {format(parseISO(exam.startTime), 'HH:mm')}
                                </div>
                              </div>
                            ))}
                            {examsOnDay.length > 4 && (
                              <div className="text-[10px] text-center text-gray-500 font-medium">
                                +{examsOnDay.length - 4} more
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  )
                })}
              </div>
              
              {/* Legend */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-600 border-t pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-50"></div>
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-orange-400 bg-orange-50"></div>
                  <span>Has Exams</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-red-400 bg-red-100"></div>
                  <span>Exam Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-blue-400 bg-blue-100"></div>
                  <span>Upcoming</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-gray-300 bg-gray-100"></div>
                  <span>Completed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Day Details */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select a Date'}
              </CardTitle>
              <CardDescription>
                {selectedDate ? (
                  getExamsForDate(selectedDate).length > 0 ? (
                    `${getExamsForDate(selectedDate).length} exam${getExamsForDate(selectedDate).length > 1 ? 's' : ''} scheduled`
                  ) : (
                    'No exams scheduled'
                  )
                ) : (
                  'Click on a date with exams to view details'
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDate && getExamsForDate(selectedDate).length > 0 ? (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {getExamsForDate(selectedDate).map((exam, index) => (
                      <div
                        key={exam.registrationId}
                        className={cn(
                          'p-4 rounded-lg border-2 transition-all',
                          isPast(parseISO(exam.examDate)) && 'bg-gray-50 border-gray-300',
                          isToday(parseISO(exam.examDate)) && 'bg-red-50 border-red-400',
                          isFuture(parseISO(exam.examDate)) && 'bg-blue-50 border-blue-400'
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{exam.examTitle}</h4>
                            <p className="text-xs text-gray-600">
                              {exam.subject.code} - {exam.subject.name}
                            </p>
                          </div>
                          {getDeliveryModeBadge(exam.deliveryMode)}
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="h-3.5 w-3.5 text-gray-500" />
                            <span className="font-medium">
                              {format(parseISO(exam.startTime), 'HH:mm')} - {format(parseISO(exam.endTime), 'HH:mm')}
                            </span>
                            <Badge variant="outline" className="ml-auto text-[10px] h-5">
                              {exam.durationMinutes} min
                            </Badge>
                          </div>
                          
                          {exam.room && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <MapPin className="h-3.5 w-3.5 text-gray-500" />
                              <span>
                                {exam.room.building} - Room {exam.room.roomNumber}
                                {exam.seatNumber && (
                                  <Badge variant="secondary" className="ml-2 text-[10px] h-5">
                                    Seat {exam.seatNumber}
                                  </Badge>
                                )}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-gray-700">
                            <BookOpen className="h-3.5 w-3.5 text-gray-500" />
                            <span>Year {exam.year}, Sem {exam.semester} • {exam.subject.credits} Credits</span>
                          </div>
                        </div>
                        
                        {exam.specialInstructions && (
                          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-300 rounded text-xs">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-3.5 w-3.5 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <p className="text-yellow-800">{exam.specialInstructions}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : selectedDate ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm">No exams on this date</p>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm">Select a date to view exam details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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
