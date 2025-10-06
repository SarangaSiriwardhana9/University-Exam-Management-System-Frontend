'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { createExamSessionSchema, updateExamSessionSchema, type CreateExamSessionFormData, type UpdateExamSessionFormData } from '../validations/exam-session-schemas'
import type { ExamSession } from '../types/exam-sessions'
import { useQuery } from '@tanstack/react-query'
import { examPapersService } from '@/features/exam-papers/hooks/use-exam-papers'
import { roomsService } from '@/features/rooms/hooks/use-rooms'

type CreateExamSessionFormProps = {
  session?: never
  onSubmit: (data: CreateExamSessionFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateExamSessionFormProps = {
  session: ExamSession
  onSubmit: (data: UpdateExamSessionFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type ExamSessionFormProps = CreateExamSessionFormProps | UpdateExamSessionFormProps

export const ExamSessionForm = ({ session, onSubmit, onCancel, isLoading }: ExamSessionFormProps) => {
  const isEditMode = !!session

  // Fetch exam papers and rooms for dropdowns
  const { data: examPapersData } = useQuery({
    queryKey: ['exam-papers'],
    queryFn: () => examPapersService.getAll({ isFinalized: true, isActive: true })
  })

  const { data: roomsData } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomsService.getAll({ isActive: true })
  })

  const form = useForm<CreateExamSessionFormData | UpdateExamSessionFormData>({
    resolver: zodResolver(isEditMode ? updateExamSessionSchema : createExamSessionSchema),
    defaultValues: {
      paperId: '',
      examTitle: '',
      examDateTime: '',
      durationMinutes: 120,
      roomId: '',
      maxStudents: 30,
      instructions: '',
      academicYear: new Date().getFullYear().toString(),
      semester: 1
    }
  })

  useEffect(() => {
    if (session) {
      // Format datetime for input
      const examDateTime = session.examDateTime ? 
        new Date(session.examDateTime).toISOString().slice(0, 16) : ''
      
      form.reset({
        paperId: session.paperId,
        examTitle: session.examTitle,
        examDateTime,
        durationMinutes: session.durationMinutes,
        roomId: session.roomId,
        maxStudents: session.maxStudents,
        instructions: session.instructions || '',
        academicYear: session.academicYear,
        semester: session.semester
      })
    }
  }, [session, form])

  const handleSubmit = (data: CreateExamSessionFormData | UpdateExamSessionFormData) => {
    if (isEditMode) {
      (onSubmit as (data: UpdateExamSessionFormData) => void)(data as UpdateExamSessionFormData)
    } else {
      (onSubmit as (data: CreateExamSessionFormData) => void)(data as CreateExamSessionFormData)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Exam Paper Selection */}
        <FormField
          control={form.control}
          name="paperId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exam Paper *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam paper" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {examPapersData?.data.map((paper) => (
                    <SelectItem key={paper._id} value={paper._id}>
                      <div className="flex flex-col">
                        <span>{paper.paperTitle}</span>
                        <span className="text-sm text-muted-foreground">
                          {paper.subjectCode} - {paper.subjectName}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <FormField
            control={form.control}
            name="examDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam Date & Time *</FormLabel>
                <FormControl>
                  <Input 
                    type="datetime-local" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="durationMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Minutes) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="120" 
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roomsData?.data.map((room) => (
                      <SelectItem key={room._id} value={room._id}>
                        <div className="flex flex-col">
                          <span>{room.roomNumber}</span>
                          <span className="text-sm text-muted-foreground">
                            {room.building} - Capacity: {room.capacity}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Academic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="academicYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Year *</FormLabel>
                <FormControl>
                  <Input placeholder="2024" {...field} />
                </FormControl>
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
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Instructions */}
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

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Session' : 'Create Session'}
          </Button>
        </div>
      </form>
    </Form>
  )
}