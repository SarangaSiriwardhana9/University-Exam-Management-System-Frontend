'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PlusIcon, TrashIcon, SearchIcon, InfoIcon, ListTreeIcon } from 'lucide-react'
import { EXAM_TYPES } from '../types/exam-papers'
import { createExamPaperSchema, updateExamPaperSchema, type CreateExamPaperFormData, type UpdateExamPaperFormData } from '../validations/exam-paper-schemas'
import type { ExamPaper, PaperQuestionDto } from '../types/exam-papers'
import { useMySubjectsQuery, useSubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { useQuestionsBySubjectQuery } from '@/features/questions/hooks/use-questions-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import type { Question } from '@/features/questions/types/questions'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth/auth-provider'
import { USER_ROLES } from '@/constants/roles'

type ExamPaperFormProps = {
  paper?: ExamPaper
  onSubmit: (data: CreateExamPaperFormData | UpdateExamPaperFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export const ExamPaperForm = ({ paper, onSubmit, onCancel, isLoading }: ExamPaperFormProps) => {
  const isEditMode = !!paper
  const [selectedSubject, setSelectedSubject] = useState<string>(paper?.subjectId || '')
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPartForQuestion, setSelectedPartForQuestion] = useState<string>('')

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
      parts: [{ partLabel: 'A', partTitle: 'Multiple Choice Questions', partOrder: 1, hasOptionalQuestions: false }],
      questions: []
    }
  })

  const { fields: partFields, append: appendPart, remove: removePart } = useFieldArray({
    control: form.control,
    name: 'parts'
  })

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
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
        parts: paper.parts.map(p => ({
          partLabel: p.partLabel,
          partTitle: p.partTitle,
          partInstructions: p.partInstructions,
          partOrder: p.partOrder,
          hasOptionalQuestions: p.hasOptionalQuestions,
          minimumQuestionsToAnswer: p.minimumQuestionsToAnswer
        })),
        questions: paper.questions?.map((q) => ({
          questionId: q.questionId,
          questionOrder: q.questionOrder,
          marksAllocated: q.marksAllocated,
          partLabel: q.partLabel,
          partTitle: q.partTitle,
          isOptional: q.isOptional
        })) || []
      })
    }
  }, [paper, form])

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value)
    form.setValue('subjectId', value)
    form.setValue('questions', [])
  }

  const handleAddQuestion = (question: Question, partLabel: string) => {
    const existingQuestion = questionFields.find(f => f.questionId === question._id)
    if (existingQuestion) return

    const part = partFields.find(p => p.partLabel === partLabel)
    const questionOrder = questionFields.filter(q => q.partLabel === partLabel).length + 1

    const newQuestion: PaperQuestionDto = {
      questionId: question._id,
      questionOrder,
      marksAllocated: question.marks,
      partLabel: partLabel,
      partTitle: part?.partTitle,
      isOptional: false
    }

    appendQuestion(newQuestion)
    setIsQuestionDialogOpen(false)
  }

  const calculateTotalAllocatedMarks = () => {
    return questionFields.reduce((sum, field) => sum + (field.marksAllocated || 0), 0)
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
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Creating Exam Papers</AlertTitle>
          <AlertDescription>
            Add questions from your question bank to different parts of the paper. 
            Questions with sub-parts will automatically include their nested structure.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="pt-6 space-y-4">
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
                    <Input placeholder="e.g., SE3034 - Introduction to Programming - Final Exam 2024" {...field} />
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
                    <FormDescription>
                      {field.value ? `${Math.floor(field.value / 60)}h ${field.value % 60}m` : ''}
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
                  <FormLabel>General Instructions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Answer all questions. Write your answers in the provided answer booklet." 
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

        <Separator />

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Paper Sections</h3>
                <p className="text-sm text-muted-foreground">
                  Organize your exam into sections (Part A, Part B, etc.)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendPart({
                  partLabel: String.fromCharCode(65 + partFields.length),
                  partTitle: `Part ${String.fromCharCode(65 + partFields.length)}`,
                  partOrder: partFields.length + 1,
                  hasOptionalQuestions: false
                })}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>

            <div className="space-y-3">
              {partFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-3 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">Part {field.partLabel}</Badge>
                      {field.partTitle}
                    </h4>
                    {partFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePart(index)}
                      >
                        <TrashIcon className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`parts.${index}.partLabel`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Section Label *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="A, B, C..." 
                              className="font-mono uppercase" 
                              {...field} 
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`parts.${index}.partTitle`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Section Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Multiple Choice Questions" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`parts.${index}.partInstructions`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Section Instructions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Answer all questions. Each question carries 1 mark." 
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`parts.${index}.hasOptionalQuestions`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="text-xs !mt-0">Has Optional Questions</FormLabel>
                        </FormItem>
                      )}
                    />

                    {form.watch(`parts.${index}.hasOptionalQuestions`) && (
                      <FormField
                        control={form.control}
                        name={`parts.${index}.minimumQuestionsToAnswer`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Minimum to Answer</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min={0}
                                placeholder="e.g., 3"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Questions</h3>
                <p className="text-sm text-muted-foreground">
                  {questionFields.length} question(s) added • {allocatedMarks} marks allocated
                </p>
              </div>
              <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="default"
                    disabled={!selectedSubject || partFields.length === 0}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Questions
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Select Questions from Question Bank</DialogTitle>
                    <DialogDescription>
                      Choose questions to add to your exam paper. Questions with sub-parts will include all their nested structure.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search questions..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={selectedPartForQuestion} onValueChange={setSelectedPartForQuestion}>
                        <SelectTrigger className="w-[250px]">
                          <SelectValue placeholder="Select Section" />
                        </SelectTrigger>
                        <SelectContent>
                          {partFields.map(p => (
                            <SelectItem key={p.id} value={p.partLabel}>
                              Part {p.partLabel} - {p.partTitle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {!selectedPartForQuestion && (
                      <div className="text-center py-8 text-muted-foreground">
                        Please select a section to add questions to
                      </div>
                    )}

                    {selectedPartForQuestion && (
                      <>
                        {isLoadingQuestions ? (
                          <div className="flex justify-center py-8">
                            <LoadingSpinner />
                          </div>
                        ) : filteredQuestions.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No questions available for this subject
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {filteredQuestions.map((question) => {
                              const isAdded = questionFields.some(f => f.questionId === question._id)
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
                                      <div className="flex items-start gap-2">
                                        {question.hasSubQuestions && (
                                          <ListTreeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                        )}
                                        <p className="font-medium line-clamp-2">{question.questionText}</p>
                                      </div>
                                      <div className="flex gap-2 mt-2 flex-wrap">
                                        <Badge variant="outline" className="text-xs">
                                          {question.questionType.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          {question.difficultyLevel}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                          {question.marks} marks
                                        </Badge>
                                        {question.hasSubQuestions && (
                                          <Badge variant="default" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                            Has Sub-parts
                                          </Badge>
                                        )}
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
                                      onClick={() => handleAddQuestion(question, selectedPartForQuestion)}
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
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {questionFields.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <p className="text-muted-foreground font-medium">No questions added yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click &ldquo;Add Questions&rdquo; to select from your question bank
                </p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-2">
                {partFields.map((part) => {
                  const partQuestions = questionFields.filter(q => q.partLabel === part.partLabel)
                  const partMarks = partQuestions.reduce((sum, q) => sum + (q.marksAllocated || 0), 0)

                  return (
                    <AccordionItem key={part.id} value={part.partLabel} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 flex-1">
                          <Badge variant="outline" className="font-mono">Part {part.partLabel}</Badge>
                          <span className="font-medium">{part.partTitle}</span>
                          <Badge variant="secondary" className="ml-auto mr-4">
                            {partQuestions.length} questions • {partMarks} marks
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-3">
                        {partQuestions.map((field, index) => {
                          const questionDetails = getQuestionDetails(field.questionId)
                          const questionIndex = questionFields.indexOf(field)
                          
                          return (
                            <div key={field.id} className="p-4 border rounded-lg space-y-3 bg-card">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="font-mono text-xs">Q{index + 1}</Badge>
                                    {questionDetails?.hasSubQuestions && (
                                      <ListTreeIcon className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <p className="font-medium line-clamp-2 flex-1">
                                      {questionDetails?.questionText || 'Question not found'}
                                    </p>
                                  </div>
                                  {questionDetails && (
                                    <div className="flex gap-2 flex-wrap">
                                      <Badge variant="outline" className="text-xs">
                                        {questionDetails.questionType.replace('_', ' ').toUpperCase()}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {questionDetails.difficultyLevel}
                                      </Badge>
                                      {questionDetails.hasSubQuestions && (
                                        <Badge variant="default" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                          Structured with sub-parts
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeQuestion(questionIndex)}
                                >
                                  <TrashIcon className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <FormField
                                  control={form.control}
                                  name={`questions.${questionIndex}.marksAllocated`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-xs">Marks for this Question</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="number" 
                                          min={0.5}
                                          step={0.5}
                                          {...field}
                                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                      </FormControl>
                                      <FormDescription className="text-xs">
                                        Original: {questionDetails?.marks || 0} marks
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`questions.${questionIndex}.isOptional`}
                                  render={({ field }) => (
                                    <FormItem className="flex items-end pb-2">
                                      <div className="flex items-center space-x-2">
                                        <FormControl>
                                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel className="text-xs !mt-0">Mark as Optional</FormLabel>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            )}

            {allocatedMarks !== targetMarks && questionFields.length > 0 && (
              <Alert variant="destructive">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Mark Allocation Mismatch</AlertTitle>
                <AlertDescription>
                  Allocated marks ({allocatedMarks}) don&apos;t match total marks ({targetMarks}). 
                  Please adjust question marks or total marks.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || questionFields.length === 0 || allocatedMarks !== targetMarks}
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Paper' : 'Create Paper'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
