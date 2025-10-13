'use client'

import { useEffect, useMemo } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { createExamSessionSchema, updateExamSessionSchema, type CreateExamSessionFormData, type UpdateExamSessionFormData } from '../validations/exam-session-schemas'
import type { ExamSession } from '../types/exam-sessions'
import { useExamPapersQuery, useExamPaperQuery } from '@/features/exam-papers/hooks/use-exam-papers-query'
import { useRoomsQuery, useRoomQuery } from '@/features/rooms/hooks/use-rooms-query'

type ExamSessionFormProps = {
  session?: ExamSession
  onSubmit: (data: CreateExamSessionFormData | UpdateExamSessionFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export const ExamSessionForm = ({ session, onSubmit, onCancel, isLoading }: ExamSessionFormProps) => {
  const isEditMode = !!session

  const { data: examPapersData, isLoading: isLoadingPapers } = useExamPapersQuery({ 
    isFinalized: true, 
    isActive: true 
  })

  const { data: roomsData, isLoading: isLoadingRooms } = useRoomsQuery({ 
    isActive: true 
  })

  const sessionPaperId = session?.paperId
  const sessionRoomId = session?.roomId

  const { data: sessionPaperData, isLoading: isLoadingSessionPaper } = useExamPaperQuery(
    isEditMode ? sessionPaperId : undefined
  )

  const { data: sessionRoomData, isLoading: isLoadingSessionRoom } = useRoomQuery(
    isEditMode ? sessionRoomId : undefined
  )

  const examPapers = useMemo(() => {
    const map = new Map()
    ;(examPapersData?.data || []).forEach(p => map.set(p._id, p))
    if (sessionPaperData?.data) map.set(sessionPaperData.data._id, sessionPaperData.data)
    return Array.from(map.values())
  }, [examPapersData?.data, sessionPaperData?.data])

  const rooms = useMemo(() => {
    const map = new Map()
    ;(roomsData?.data || []).forEach(r => map.set(r._id, r))
    if (sessionRoomData?.data) map.set(sessionRoomData.data._id, sessionRoomData.data)
    return Array.from(map.values())
  }, [roomsData?.data, sessionRoomData?.data])

  const form = useForm<CreateExamSessionFormData>({
    resolver: zodResolver(isEditMode ? updateExamSessionSchema : createExamSessionSchema) as any,
    defaultValues: {
      paperId: '',
      examTitle: '',
      examDate: '',
      startTime: '09:00',
      endTime: '12:00',
      roomId: '',
      maxStudents: 30,
      instructions: '',
      year: 1,
      semester: 1
    }
  }) as UseFormReturn<CreateExamSessionFormData>

  useEffect(() => {
    if (!isEditMode || !session) return

    const readyToReset = 
      !isLoadingPapers &&
      !isLoadingRooms &&
      (!sessionPaperId || !isLoadingSessionPaper) &&
      (!sessionRoomId || !isLoadingSessionRoom)

    if (readyToReset) {
      const examDate = session.examDate ? 
        new Date(session.examDate).toISOString().slice(0, 10) : ''
      const startTime = session.startTime ?
        new Date(session.startTime).toTimeString().slice(0, 5) : '09:00'
      const endTime = session.endTime ?
        new Date(session.endTime).toTimeString().slice(0, 5) : '12:00'
      
      form.reset({
        paperId: session.paperId,
        examTitle: session.examTitle,
        examDate,
        startTime,
        endTime,
        roomId: session.roomId,
        maxStudents: session.maxStudents,
        instructions: session.instructions || '',
        year: session.year,
        semester: session.semester
      })
    }
  }, [
    isEditMode,
    session,
    isLoadingPapers,
    isLoadingRooms,
    isLoadingSessionPaper,
    isLoadingSessionRoom,
    sessionPaperId,
    sessionRoomId,
    form
  ])

  const handleSubmit = (data: CreateExamSessionFormData) => {
    if (isEditMode) {
      const { paperId, ...updateData } = data
      onSubmit(updateData as UpdateExamSessionFormData)
    } else {
      onSubmit(data)
    }
  }

  const isLoadingInitialData = isEditMode && (
    isLoadingPapers ||
    isLoadingRooms ||
    (sessionPaperId && isLoadingSessionPaper) ||
    (sessionRoomId && isLoadingSessionRoom)
  )

  if (!isEditMode && (isLoadingPapers || isLoadingRooms)) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Exam Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingInitialData && (
              <div className="text-sm text-muted-foreground">Loading session data...</div>
            )}
            <FormField
              control={form.control}
              name="paperId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Paper *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isEditMode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam paper" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {examPapers.map((paper) => (
                        <SelectItem key={paper._id} value={paper._id}>
                          {paper.paperTitle} ({paper.subjectCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isEditMode && (
                    <FormDescription>
                      Exam paper cannot be changed after session creation
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="examTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter exam title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="examDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Date *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time *</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time *</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Students can register until this time
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxStudents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Students *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="30" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={isLoadingRooms || (isEditMode && !!sessionRoomId && isLoadingSessionRoom)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms.map((room) => (
                          <SelectItem key={room._id} value={room._id}>
                            {room.roomNumber} - {room.building} (Cap: {room.capacity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4].map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            Year {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Year level (1-4)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2].map((sem) => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Semester (1 or 2)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter special instructions for the exam..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!!isLoading || !!isLoadingInitialData}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Session' : 'Create Session'}
          </Button>
        </div>
      </form>
    </Form>
  )
}