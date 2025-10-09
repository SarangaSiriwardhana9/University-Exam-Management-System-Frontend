 
'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { PlusIcon, TrashIcon, SearchIcon } from 'lucide-react'
import { EXAM_TYPES } from '../types/exam-papers'
import { createExamPaperSchema, updateExamPaperSchema, type CreateExamPaperFormData, type UpdateExamPaperFormData } from '../validations/exam-paper-schemas'
import type { ExamPaper } from '../types/exam-papers'
import { useMySubjectsQuery, useSubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { useQuestionsBySubjectQuery } from '@/features/questions/hooks/use-questions-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import type { Question } from '@/features/questions/types/questions'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth/auth-provider'
import { USER_ROLES } from '@/constants/roles'

type CreateExamPaperFormProps = {
  paper?: never
  onSubmit: (data: CreateExamPaperFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateExamPaperFormProps = {
  paper: ExamPaper
  onSubmit: (data: UpdateExamPaperFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type ExamPaperFormProps = CreateExamPaperFormProps | UpdateExamPaperFormProps

export const ExamPaperForm = ({ paper, onSubmit, onCancel, isLoading }: ExamPaperFormProps) => {
  const isEditMode = !!paper
  const [selectedSubject, setSelectedSubject] = useState<string>(paper?.subjectId || '')
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const { user } = useAuth()
  const { data: allSubjectsData, isLoading: isLoadingAllSubjects } = useSubjectsQuery({ isActive: true })
  const { data: mySubjectsData, isLoading: isLoadingMySubjects } = useMySubjectsQuery({ isActive: true })
  const isFaculty = user?.role === USER_ROLES.FACULTY
  const subjects = (isFaculty ? mySubjectsData?.data : allSubjectsData?.data) || []

  const { data: questionsData, isLoading: isLoadingQuestions } = useQuestionsBySubjectQuery(
    selectedSubject || undefined,
    false
  )
  const questions = questionsData?.data || []

  const form = useForm<CreateExamPaperFormData | UpdateExamPaperFormData>({
    resolver: zodResolver(isEditMode ? updateExamPaperSchema : createExamPaperSchema),
    defaultValues: {
      subjectId: '',
      paperTitle: '',
      paperType: EXAM_TYPES.MIDTERM,
      totalMarks: 100,
      durationMinutes: 180,
      instructions: '',
      questions: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions'
  })

  useEffect(() => {
    if (paper) {
      setSelectedSubject(paper.subjectId)
      form.reset({
        subjectId: paper.subjectId,
        paperTitle: paper.paperTitle,
        paperType: paper.paperType,
        totalMarks: paper.totalMarks,
        durationMinutes: paper.durationMinutes,
        instructions: paper.instructions || '',
        questions: paper.questions?.map((q, idx) => ({
          questionId: q.questionId,
          questionOrder: q.questionOrder || idx + 1,
          marksAllocated: q.marksAllocated,
          section: q.section || '',
          isOptional: q.isOptional || false
        })) || []
      })
    }
  }, [paper, form])

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value)
    form.setValue('subjectId', value)
    // Clear questions when subject changes
    form.setValue('questions', [])
  }

  const handleAddQuestion = (question: Question) => {
    const existingQuestion = fields.find(f => f.questionId === question._id)
    if (existingQuestion) {
      return // Question already added
    }

    append({
      questionId: question._id,
      questionOrder: fields.length + 1,
      marksAllocated: question.marks,
      section: '',
      isOptional: false
    })
    setIsQuestionDialogOpen(false)
  }

  const calculateTotalAllocatedMarks = () => {
    return fields.reduce((sum, field) => sum + (field.marksAllocated || 0), 0)
  }

  const allocatedMarks = calculateTotalAllocatedMarks()
  const targetMarks = form.watch('totalMarks') || 0

  const filteredQuestions = questions.filter(q => 
    q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.topic?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getQuestionDetails = (questionId: string) => {
    return questions.find(q => q._id === questionId)
  }

  const handleSubmit = (data: CreateExamPaperFormData | UpdateExamPaperFormData) => {
    if (isEditMode) {
      (onSubmit as (data: UpdateExamPaperFormData) => void)(data as UpdateExamPaperFormData)
    } else {
      (onSubmit as (data: CreateExamPaperFormData) => void)(data as CreateExamPaperFormData)
    }
  }

  if (isLoadingAllSubjects || isLoadingMySubjects) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject *</FormLabel>
                  <Select 
                    onValueChange={handleSubjectChange} 
                    value={field.value}
                    disabled={isEditMode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject._id} value={subject._id}>
                          {subject.subjectCode} - {subject.subjectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paperType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={EXAM_TYPES.MIDTERM}>Midterm</SelectItem>
                      <SelectItem value={EXAM_TYPES.FINAL}>Final</SelectItem>
                      <SelectItem value={EXAM_TYPES.QUIZ}>Quiz</SelectItem>
                      <SelectItem value={EXAM_TYPES.ASSIGNMENT}>Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="paperTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paper Title *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mathematics Midterm 2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="totalMarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Marks *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      placeholder="100" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Allocated: {allocatedMarks} / {targetMarks}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      placeholder="180" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
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
                <FormLabel>Instructions (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="General instructions for the exam" 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Questions</h3>
              <p className="text-sm text-muted-foreground">
                {fields.length} question(s) added
              </p>
            </div>
            <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!selectedSubject}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Questions
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Select Questions</DialogTitle>
                  <DialogDescription>
                    Choose questions from the question bank
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search questions..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {isLoadingQuestions ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : filteredQuestions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No questions available
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredQuestions.map((question) => {
                        const isAdded = fields.some(f => f.questionId === question._id)
                        return (
                          <div
                            key={question._id}
                            className={cn(
                              "p-4 border rounded-lg hover:bg-muted/50 transition-colors",
                              isAdded && "bg-muted opacity-50"
                            )}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="font-medium line-clamp-2">{question.questionText}</p>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {question.questionType.replace('_', ' ').toUpperCase()}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {question.difficultyLevel}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {question.marks} marks
                                  </Badge>
                                  {question.topic && (
                                    <Badge variant="secondary" className="text-xs">
                                      {question.topic}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleAddQuestion(question)}
                                disabled={isAdded}
                              >
                                {isAdded ? 'Added' : 'Add'}
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {fields.length === 0 ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <p className="text-muted-foreground">No questions added yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click &ldquo;Add Questions&ldquo; to select from question bank
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => {
                const questionDetails = getQuestionDetails(field.questionId)
                return (
                  <div key={field.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm">Q{index + 1}.</span>
                          <p className="font-medium line-clamp-1">
                            {questionDetails?.questionText || 'Question not found'}
                          </p>
                        </div>
                        {questionDetails && (
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {questionDetails.questionType.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {questionDetails.difficultyLevel}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <TrashIcon className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <FormField
                        control={form.control}
                        name={`questions.${index}.marksAllocated`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Marks</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min={1}
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
                        name={`questions.${index}.section`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Section</FormLabel>
                            <FormControl>
                              <Input placeholder="A, B, C..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`questions.${index}.isOptional`}
                        render={({ field }) => (
                          <FormItem className="flex items-end pb-2">
                            <div className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-xs !mt-0">Optional</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {allocatedMarks !== targetMarks && fields.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                ⚠️ Allocated marks ({allocatedMarks}) don&lsquo;t match total marks ({targetMarks})
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || fields.length === 0 || allocatedMarks !== targetMarks}
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Paper' : 'Create Paper'}
          </Button>
        </div>
      </form>
    </Form>
  )
}