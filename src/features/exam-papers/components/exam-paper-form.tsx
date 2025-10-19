'use client'

import { useEffect, useState, useMemo } from 'react'
import { useForm, useFieldArray, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  PlusIcon, 
  TrashIcon, 
  SearchIcon, 
  ListTreeIcon, 
  AlertCircleIcon, 
  CheckCircle2Icon, 
  FilterIcon,
  XIcon
} from 'lucide-react'
import { EXAM_TYPES } from '../types/exam-papers'
import { QUESTION_TYPES, DIFFICULTY_LEVELS } from '@/constants/roles'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set())
  const [activePartTab, setActivePartTab] = useState<string>('')
  const [questionTypeFilter, setQuestionTypeFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [currentStep, setCurrentStep] = useState(1)

  const { user } = useAuth()
  const { data: allSubjectsData, isLoading: isLoadingAllSubjects } = useSubjectsQuery({ isActive: true })
  const { data: mySubjectsData, isLoading: isLoadingMySubjects } = useMySubjectsQuery({ isActive: true })
  const isFaculty = user?.role === USER_ROLES.FACULTY
  const subjects = (isFaculty ? mySubjectsData?.data : allSubjectsData?.data) || []

  const { data: questionsData, isLoading: isLoadingQuestions } = useQuestionsBySubjectQuery(
    selectedSubject || undefined,
    true
  )
  const questions = questionsData?.data || []

  const form = useForm<CreateExamPaperFormData>({
    resolver: zodResolver(isEditMode ? updateExamPaperSchema : createExamPaperSchema) as any,
    defaultValues: {
      subjectId: '',
      paperTitle: '',
      paperType: EXAM_TYPES.MIDTERM,
      totalMarks: 100,
      durationMinutes: 180,
      deliveryMode: 'onsite' as const,
      instructions: '',
      parts: [{ partLabel: 'A', partTitle: 'Multiple Choice Questions', partOrder: 1 }],
      questions: []
    }
  }) as UseFormReturn<CreateExamPaperFormData>

  const { fields: partFields, append: appendPart, remove: removePart } = useFieldArray({
    control: form.control,
    name: 'parts'
  })

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control: form.control,
    name: 'questions'
  })

  useEffect(() => {
    if (partFields.length > 0 && !activePartTab) {
      setActivePartTab(partFields[0].partLabel)
    }
  }, [partFields, activePartTab])

  useEffect(() => {
    if (paper && paper.questions) {
      setSelectedSubject(paper.subjectId)
      const questionIds = new Set(paper.questions.map(q => {
        return typeof q.questionId === 'string' ? q.questionId : q.questionId._id
      }))
      setSelectedQuestionIds(questionIds)
      
      const formData: any = {
        paperTitle: paper.paperTitle,
        paperType: paper.paperType,
        totalMarks: paper.totalMarks,
        durationMinutes: paper.durationMinutes,
        deliveryMode: paper.deliveryMode || 'onsite',
        instructions: paper.instructions || '',
        parts: paper.parts.map(p => ({
          partLabel: p.partLabel,
          partTitle: p.partTitle,
          partInstructions: p.partInstructions || '',
          partOrder: p.partOrder,
          hasOptionalQuestions: p.hasOptionalQuestions || false,
          minimumQuestionsToAnswer: p.minimumQuestionsToAnswer || 0
        })),
        questions: paper.questions.map(q => ({
          questionId: typeof q.questionId === 'string' ? q.questionId : q.questionId._id,
          questionOrder: q.questionOrder,
          marksAllocated: q.marksAllocated,
          partLabel: q.partLabel,
          partTitle: q.partTitle || '',
          isOptional: q.isOptional || false
        }))
      }
      
      if (!paper._id) {
        formData.subjectId = paper.subjectId
      }
      
      form.reset(formData)
      setCurrentStep(2)
    }
  }, [paper, form])

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value)
    form.setValue('subjectId', value)
  }

  const handleQuestionToggle = (question: Question) => {
    const questionId = question._id
    const newSelectedIds = new Set(selectedQuestionIds)
    
    if (newSelectedIds.has(questionId)) {
      newSelectedIds.delete(questionId)
      const index = questionFields.findIndex(q => q.questionId === questionId)
      if (index !== -1) removeQuestion(index)
    } else {
      newSelectedIds.add(questionId)
      const part = partFields.find(p => p.partLabel === activePartTab)
      const questionOrder = questionFields.length + 1

      const newQuestion: PaperQuestionDto = {
        questionId: question._id,
        questionOrder,
        marksAllocated: question.marks,
        partLabel: activePartTab,
        partTitle: part?.partTitle,
        isOptional: false
      }
      appendQuestion(newQuestion)
    }
    
    setSelectedQuestionIds(newSelectedIds)
  }

  const allocatedMarks = useMemo(() => 
    questionFields.reduce((sum, field) => sum + (field.marksAllocated || 0), 0),
    [questionFields]
  )

  const targetMarks = form.watch('totalMarks') || 0
  const marksMatch = allocatedMarks === targetMarks

  const filteredQuestions = useMemo(() => 
    questions.filter(q => {
      const matchesSearch = q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.topic?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = questionTypeFilter === 'all' || q.questionType === questionTypeFilter
      const matchesDifficulty = difficultyFilter === 'all' || q.difficultyLevel === difficultyFilter
      
      return matchesSearch && matchesType && matchesDifficulty
    }),
    [questions, searchTerm, questionTypeFilter, difficultyFilter]
  )

  const getQuestionDetails = (questionId: string) => {
    const fromBank = questions.find(q => q._id === questionId)
    if (fromBank) return fromBank
    
    if (paper?.questions) {
      const fromPaper = paper.questions.find(q => {
        const qId = typeof q.questionId === 'string' ? q.questionId : q.questionId._id
        return qId === questionId
      })
      if (fromPaper) {
        const questionData = typeof fromPaper.questionId === 'object' ? fromPaper.questionId : null
        
        return {
          _id: typeof fromPaper.questionId === 'string' ? fromPaper.questionId : fromPaper.questionId._id,
          questionText: questionData?.questionText || fromPaper.questionText || 'Question text not available',
          questionType: questionData?.questionType || fromPaper.questionType || 'unknown',
          difficultyLevel: questionData?.difficultyLevel || fromPaper.difficultyLevel || 'medium',
          marks: fromPaper.marksAllocated,
          hasSubQuestions: fromPaper.subQuestions && fromPaper.subQuestions.length > 0,
          options: questionData?.options || [],
          allowMultipleAnswers: questionData?.allowMultipleAnswers || false,
          topic: undefined,
          subtopic: undefined,
          bloomsTaxonomy: undefined,
          keywords: undefined,
          usageCount: 0,
          isPublic: false,
          createdBy: '',
          createdByName: undefined,
          isActive: true,
          subQuestionLevel: fromPaper.subQuestionLevel || 0,
          createdAt: fromPaper.createdAt,
          updatedAt: fromPaper.createdAt,
          subjectId: paper.subjectId,
          subjectCode: paper.subjectCode,
          subjectName: paper.subjectName
        }
      }
    }
    
    return undefined
  }

  const questionsByPart = useMemo(() => {
    const grouped: Record<string, typeof questionFields> = {}
    partFields.forEach(part => {
      grouped[part.partLabel] = questionFields.filter(q => q.partLabel === part.partLabel)
    })
    return grouped
  }, [questionFields, partFields])

  const handleSubmit = (data: CreateExamPaperFormData) => {
    const reorderedQuestions = data.questions
      .sort((a, b) => {
        if (a.partLabel < b.partLabel) return -1
        if (a.partLabel > b.partLabel) return 1
        return (a.questionOrder || 0) - (b.questionOrder || 0)
      })
      .map((q, index) => ({ ...q, questionOrder: index + 1 }))

    const submissionData = { ...data, questions: reorderedQuestions }

    if (isEditMode) {
      const { subjectId, ...updateData } = submissionData
      onSubmit(updateData as UpdateExamPaperFormData)
    } else {
      onSubmit(submissionData)
    }
  }

  const hasActiveFilters = questionTypeFilter !== 'all' || difficultyFilter !== 'all'

  if (isLoadingAllSubjects || isLoadingMySubjects) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full">
        <div className="flex flex-col h-full">
          <div className="border-b bg-muted/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {isEditMode ? 'Edit Exam Paper' : 'Create Exam Paper'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentStep === 1 ? 'Step 1: Basic Information & Sections' : 'Step 2: Add Questions to Sections'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-lg px-4 py-1">
                  {allocatedMarks} / {targetMarks} marks
                </Badge>
                {marksMatch && questionFields.length > 0 && (
                  <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === 1 ? "bg-primary text-primary-foreground" : "bg-green-600 text-white"
                )}>
                  {currentStep === 1 ? '1' : <CheckCircle2Icon className="h-5 w-5" />}
                </div>
                <span className="text-sm font-medium">Setup</span>
              </div>
              <div className="h-[2px] flex-1 bg-muted" />
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  2
                </div>
                <span className="text-sm font-medium">Add Questions</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {currentStep === 1 ? (
              <ScrollArea className="h-full">
                <div className="max-w-4xl mx-auto p-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>Set up the core details of your exam paper</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                                  {subjects.map(subject => (
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
                                    <SelectValue />
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

                        <FormField
                          control={form.control}
                          name="deliveryMode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Mode *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="onsite">Onsite</SelectItem>
                                  <SelectItem value="online">Online</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Online exams require computer labs for exam sessions
                              </FormDescription>
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
                              <Input placeholder="e.g., Software Engineering Final Exam 2024" {...field} />
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
                                  {...field}
                                  onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
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
                                  {...field}
                                  onChange={e => field.onChange(parseInt(e.target.value))}
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
                                placeholder="e.g., Answer all questions. Write answers in the provided booklet." 
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Paper Sections</CardTitle>
                          <CardDescription>Organize your exam into parts (e.g., MCQs, Essays, etc.)</CardDescription>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newLabel = String.fromCharCode(65 + partFields.length)
                            appendPart({
                              partLabel: newLabel,
                              partTitle: `Part ${newLabel}`,
                              partOrder: partFields.length + 1,
                              hasOptionalQuestions: false
                            })
                          }}
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add Section
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {partFields.map((field, index) => (
                        <div key={field.id} className="p-4 border-2 rounded-lg space-y-4 hover:border-primary/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="font-mono text-base px-3 py-1">
                                Part {field.partLabel}
                              </Badge>
                              <Badge variant="secondary">
                                {questionsByPart[field.partLabel]?.length || 0} questions
                              </Badge>
                            </div>
                            {partFields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  removePart(index)
                                  if (activePartTab === field.partLabel && partFields.length > 1) {
                                    setActivePartTab(partFields[0].partLabel)
                                  }
                                }}
                              >
                                <TrashIcon className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <FormField
                              control={form.control}
                              name={`parts.${index}.partLabel`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Section Label *</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="A" 
                                      className="font-mono uppercase" 
                                      {...field} 
                                      onChange={e => field.onChange(e.target.value.toUpperCase())} 
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
                                <FormLabel className="text-xs">Section Instructions (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="e.g., Choose the best answer for each question. Each question carries 1 mark." 
                                    rows={2}
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex items-center gap-4">
                            <FormField
                              control={form.control}
                              name={`parts.${index}.hasOptionalQuestions`}
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
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
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min={0}
                                        placeholder="Minimum questions to answer"
                                        {...field}
                                        onChange={e => field.onChange(parseInt(e.target.value))}
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
                    </CardContent>
                  </Card>

                  <div className="flex items-center justify-between pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => {
                        if (!selectedSubject) {
                          form.setError('subjectId', { message: 'Please select a subject' })
                          return
                        }
                        if (partFields.length === 0) {
                          return
                        }
                        setCurrentStep(2)
                      }}
                      disabled={!selectedSubject || partFields.length === 0}
                    >
                      Continue to Add Questions
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="h-full flex">
                <div className="flex-1 flex flex-col border-r">
                  <div className="border-b px-6 py-4 bg-muted/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Select Questions for Each Section</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep(1)}
                      >
                        ← Back to Setup
                      </Button>
                    </div>

                    <Tabs value={activePartTab} onValueChange={setActivePartTab}>
                      <TabsList className="w-full justify-start">
                        {partFields.map(part => {
                          const partQuestions = questionsByPart[part.partLabel] || []
                          const partMarks = partQuestions.reduce((sum, q) => sum + (q.marksAllocated || 0), 0)
                          
                          return (
                            <TabsTrigger key={part.id} value={part.partLabel} className="flex items-center gap-2">
                              <span className="font-mono">Part {part.partLabel}</span>
                              <Badge variant="secondary" className="text-xs">
                                {partQuestions.length}Q • {partMarks}m
                              </Badge>
                            </TabsTrigger>
                          )
                        })}
                      </TabsList>

                      {partFields.map(part => {
                        const partQuestions = questionsByPart[part.partLabel] || []
                        
                        return (
                          <TabsContent key={part.id} value={part.partLabel} className="mt-0">
                            <div className="pt-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-lg">{part.partTitle}</h4>
                                  {part.partInstructions && (
                                    <p className="text-sm text-muted-foreground mt-1">{part.partInstructions}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        )
                      })}
                    </Tabs>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="p-6">
                      {partFields.map(part => {
                        if (part.partLabel !== activePartTab) return null
                        
                        const partQuestions = questionsByPart[part.partLabel] || []

                        return (
                          <div key={part.id} className="space-y-3">
                            {partQuestions.length === 0 ? (
                              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                <ListTreeIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                                <p className="text-muted-foreground font-medium">No questions added yet</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Select questions from the question bank on the right
                                </p>
                              </div>
                            ) : (
                              partQuestions.map((field, idx) => {
                                const questionDetails = getQuestionDetails(field.questionId)
                                const questionIndex = questionFields.indexOf(field)
                                
                                return (
                                  <Card key={field.id}>
                                    <CardContent className="p-4">
                                      <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="font-mono">Q{idx + 1}</Badge>
                                            {questionDetails?.hasSubQuestions && (
                                              <Badge variant="default" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                                <ListTreeIcon className="h-3 w-3 mr-1" />
                                                Has Sub-parts
                                              </Badge>
                                            )}
                                          </div>
                                          <p className="font-medium mb-2">{questionDetails?.questionText}</p>
                                          
                                          {/* Display MCQ Options */}
                                          {questionDetails && (questionDetails.questionType === 'mcq' || questionDetails.questionType === 'true_false') && (
                                            <div className="mb-3 pl-4 space-y-1.5">
                                              {(() => {
                                                const options = (questionDetails as any).options || []
                                                if (options.length === 0) {
                                                  return (
                                                    <div className="text-xs text-muted-foreground italic">
                                                      No options available for this question
                                                    </div>
                                                  )
                                                }
                                                
                                                return options.map((option: any, optIdx: number) => (
                                                  <div key={option._id || optIdx} className="flex items-start gap-2 text-sm">
                                                    <span className="font-medium text-muted-foreground min-w-[24px]">
                                                      {String.fromCharCode(65 + optIdx)}.
                                                    </span>
                                                    <span className={cn(
                                                      option.isCorrect && "text-green-600 dark:text-green-400 font-medium"
                                                    )}>
                                                      {option.optionText}
                                                      {option.isCorrect && (
                                                        <Badge variant="default" className="ml-2 h-5 text-xs bg-green-600">
                                                          Correct
                                                        </Badge>
                                                      )}
                                                    </span>
                                                  </div>
                                                ))
                                              })()}
                                            </div>
                                          )}
                                          
                                          {questionDetails && (
                                            <div className="flex gap-2 flex-wrap mb-3">
                                              <Badge variant="outline" className="text-xs">
                                                {questionDetails.questionType.toUpperCase()}
                                              </Badge>
                                              <Badge variant="outline" className="text-xs">
                                                {questionDetails.difficultyLevel}
                                              </Badge>
                                              <Badge variant="secondary" className="text-xs">
                                                Default: {questionDetails.marks}m
                                              </Badge>
                                              {questionDetails.topic && (
                                                <Badge variant="secondary" className="text-xs">
                                                  {questionDetails.topic}
                                                </Badge>
                                              )}
                                            </div>
                                          )}

                                          <div className="grid grid-cols-3 gap-3">
                                            <FormField
                                              control={form.control}
                                              name={`questions.${questionIndex}.marksAllocated`}
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel className="text-xs">Marks *</FormLabel>
                                                  <FormControl>
                                                    <Input 
                                                      type="number" 
                                                      min={0.5}
                                                      step={0.5}
                                                      className="h-9"
                                                      {...field}
                                                      onChange={e => field.onChange(parseFloat(e.target.value))}
                                                    />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />

                                            <FormField
                                              control={form.control}
                                              name={`questions.${questionIndex}.isOptional`}
                                              render={({ field }) => (
                                                <FormItem className="flex flex-col justify-end">
                                                  <div className="flex items-center space-x-2 pb-2">
                                                    <FormControl>
                                                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormLabel className="text-xs !mt-0">Optional</FormLabel>
                                                  </div>
                                                </FormItem>
                                              )}
                                            />

                                            <div className="flex items-end">
                                              <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => {
                                                  removeQuestion(questionIndex)
                                                  setSelectedQuestionIds(prev => {
                                                    const newSet = new Set(prev)
                                                    newSet.delete(field.questionId)
                                                    return newSet
                                                  })
                                                }}
                                              >
                                                <TrashIcon className="h-4 w-4 mr-1" />
                                                Remove
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )
                              })
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>

                <div className="w-[400px] flex flex-col">
                  <div className="border-b px-4 py-4 bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Question Bank</h3>
                      <Badge variant="secondary" className="text-xs">
                        {filteredQuestions.length} / {questions.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search questions..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FilterIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Filters</span>
                          {hasActiveFilters && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 ml-auto"
                              onClick={() => {
                                setQuestionTypeFilter('all')
                                setDifficultyFilter('all')
                              }}
                            >
                              <XIcon className="h-3 w-3 mr-1" />
                              Clear
                            </Button>
                          )}
                        </div>

                        <Select value={questionTypeFilter} onValueChange={setQuestionTypeFilter}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Question Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value={QUESTION_TYPES.MCQ}>MCQ</SelectItem>
                            <SelectItem value={QUESTION_TYPES.STRUCTURED}>Structured</SelectItem>
                            <SelectItem value={QUESTION_TYPES.ESSAY}>Essay</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Difficulties</SelectItem>
                            <SelectItem value={DIFFICULTY_LEVELS.EASY}>Easy</SelectItem>
                            <SelectItem value={DIFFICULTY_LEVELS.MEDIUM}>Medium</SelectItem>
                            <SelectItem value={DIFFICULTY_LEVELS.HARD}>Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="p-4">
                      {isLoadingQuestions ? (
                        <div className="flex justify-center py-8">
                          <LoadingSpinner />
                        </div>
                      ) : filteredQuestions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          {hasActiveFilters ? 'No questions match your filters' : 'No questions available'}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {filteredQuestions.map(question => {
                            const isSelected = selectedQuestionIds.has(question._id)
                            const isInCurrentPart = questionFields.find(
                              q => q.questionId === question._id && q.partLabel === activePartTab
                            )

                            return (
                              <div
                                key={question._id}
                                className={cn(
                                  "p-3 border rounded-lg transition-all cursor-pointer",
                                  isInCurrentPart 
                                    ? "bg-primary/10 border-primary" 
                                    : isSelected 
                                      ? "bg-muted/50 border-muted-foreground/20"
                                      : "hover:bg-muted/50 hover:border-muted-foreground/20"
                                )}
                                onClick={() => !isInCurrentPart && handleQuestionToggle(question)}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    {question.hasSubQuestions && (
                                      <ListTreeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                    )}
                                    <p className="font-medium text-sm line-clamp-2 flex-1">
                                      {question.questionText}
                                    </p>
                                  </div>
                                  
                                  <div className="flex gap-1 flex-wrap">
                                    <Badge variant="outline" className="text-xs">
                                      {question.questionType.toUpperCase()}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {question.difficultyLevel}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {question.marks}m
                                    </Badge>
                                    {question.hasSubQuestions && (
                                      <Badge variant="default" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                        Sub-parts
                                      </Badge>
                                    )}
                                  </div>

                                  {isInCurrentPart ? (
                                    <Badge variant="default" className="w-full justify-center text-xs">
                                      Added to this section
                                    </Badge>
                                  ) : isSelected ? (
                                    <Badge variant="secondary" className="w-full justify-center text-xs">
                                      Added to another section
                                    </Badge>
                                  ) : (
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="w-full h-7 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleQuestionToggle(question)
                                      }}
                                    >
                                      <PlusIcon className="h-3 w-3 mr-1" />
                                      Add to Part {activePartTab}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>

          {currentStep === 2 && (
            <div className="border-t bg-muted/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Total Questions:</span>
                    <Badge variant="secondary">{questionFields.length}</Badge>
                  </div>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sections:</span>
                    <Badge variant="secondary">{partFields.length}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!marksMatch && questionFields.length > 0 && (
                    <Alert variant="destructive" className="py-2 px-3">
                      <AlertCircleIcon className="h-4 w-4" />
                      <AlertDescription className="text-xs ml-2">
                        Marks mismatch: {allocatedMarks} / {targetMarks}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading || questionFields.length === 0 || !marksMatch}
                    className="min-w-[120px]"
                  >
                    {isLoading ? 'Saving...' : isEditMode ? 'Update Paper' : 'Create Paper'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </Form>
  )
}
