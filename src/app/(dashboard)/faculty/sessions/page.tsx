'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ClipboardCheckIcon, 
  SearchIcon, 
  CalendarIcon, 
  ClockIcon,
  UsersIcon,
  FileTextIcon 
} from 'lucide-react'
import { useExamSessionsQuery } from '@/features/exam-sessions/hooks/use-exam-sessions-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { format } from 'date-fns'

export default function FacultySessionsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  
  const { data, isLoading } = useExamSessionsQuery({ limit: 100 })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const sessions = data?.data || []
  const filteredSessions = sessions.filter(session => 
    session.examTitle.toLowerCase().includes(search.toLowerCase()) ||
    (session.paperTitle && session.paperTitle.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Sessions</h1>
          <p className="text-muted-foreground mt-1">
            View and mark student submissions
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileTextIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No sessions found</p>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <Card key={session._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{session.examTitle}</CardTitle>
                    {session.paperTitle && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Paper: {session.paperTitle}
                      </p>
                    )}
                    <CardDescription className="mt-2 space-y-1">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {format(new Date(session.examDate), 'PPP')}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          {format(new Date(session.startTime), 'p')} - {format(new Date(session.endTime), 'p')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UsersIcon className="h-4 w-4" />
                        <span className="text-sm">
                          {session.registeredStudents} / {session.maxStudents} students
                        </span>
                      </div>
                    </CardDescription>
                  </div>
                  <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                    {session.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{session.deliveryMode}</Badge>
                    {session.subjectCode && (
                      <Badge variant="outline">{session.subjectCode}</Badge>
                    )}
                    {session.subjectName && (
                      <Badge variant="outline">{session.subjectName}</Badge>
                    )}
                  </div>
                  <Button
                    onClick={() => router.push(`/faculty/marking/${session._id}`)}
                  >
                    <ClipboardCheckIcon className="h-4 w-4 mr-2" />
                    Mark Answers
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
