/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect } from 'react'
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
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  createQuestionSchema,
  type CreateQuestionFormData,
} from '../validations/question-schemas'
import type { Question } from '../types/questions'
import { useMySubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { QUESTION_TYPES, DIFFICULTY_LEVELS, BLOOMS_TAXONOMY, SUB_QUESTION_TYPES } from '@/constants/roles'
import { PlusIcon, TrashIcon, ChevronRightIcon, ListTreeIcon } from 'lucide-react'

type QuestionFormProps = {
  question?: Question
  onSubmit: (data: CreateQuestionFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export const QuestionForm = ({ question, onSubmit, onCancel, isLoading }: QuestionFormProps) => {
  const isEditMode = !!question
  
  // Use useMySubjectsQuery for faculty to get their assigned subjects
  const { data: subjectsData, isLoading: isSubjectsLoading } = useMySubjectsQuery()

  const form = useForm<CreateQuestionFormData>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      subjectId: '',
      questionText: '',
      questionDescription: '',
      questionType: QUESTION_TYPES.MCQ,
      difficultyLevel: DIFFICULTY_LEVELS.MEDIUM,
      marks: 1,
      topic: '',
      subtopic: '',
      bloomsTaxonomy: undefined,
      keywords: '',
      isPublic: false,
      options: [
        { optionText: '', isCorrect: false, optionOrder: 1 },
        { optionText: '', isCorrect: false, optionOrder: 2 },
      ],
      subQuestions: [],
    },
  })

  const questionType = form.watch('questionType')

  // Options field array for MCQ
  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control: form.control,
    name: 'options',
  })

  // Sub-questions field array for STRUCTURED/ESSAY
  const { fields: subQuestionFields, append: appendSubQuestion, remove: removeSubQuestion } = useFieldArray({
    control: form.control,
    name: 'subQuestions',
  })

  useEffect(() => {
    if (isEditMode && question) {
      form.reset({
        subjectId: question.subjectId,
        questionText: question.questionText,
        questionDescription: question.questionDescription,
        questionType: question.questionType,
        difficultyLevel: question.difficultyLevel,
        marks: question.marks,
        topic: question.topic,
        subtopic: question.subtopic,
        bloomsTaxonomy: question.bloomsTaxonomy,
        keywords: question.keywords,
        isPublic: question.isPublic,
        options: question.options || [],
        subQuestions: question.subQuestions || [],
      })
    }
  }, [isEditMode, question, form])

  const handleSubmit = (data: CreateQuestionFormData) => {
    // Clean up data based on question type
    if (data.questionType === QUESTION_TYPES.MCQ) {
      data.subQuestions = []
    } else {
      data.options = []
    }
    onSubmit(data)
  }

  const addOption = () => {
    appendOption({
      optionText: '',
      isCorrect: false,
      optionOrder: optionFields.length + 1,
    })
  }

  const addSubQuestion = () => {
    const nextLabel = String.fromCharCode(65 + subQuestionFields.length) // A, B, C, ...
    appendSubQuestion({
      questionText: '',
      questionDescription: '',
      questionType: SUB_QUESTION_TYPES.SHORT_ANSWER,
      marks: 1,
      subQuestionLabel: nextLabel,
      subQuestionOrder: subQuestionFields.length + 1,
      subQuestions: [],
    })
  }

  const calculateTotalMarks = () => {
    if (questionType === QUESTION_TYPES.MCQ) {
      return form.getValues('marks')
    }
    
    const subQuestions = form.getValues('subQuestions') || []
    if (subQuestions.length === 0) {
      return form.getValues('marks')
    }

    const calculateMarks = (subs: any[]): number => {
      let total = 0
      for (const sub of subs) {
        total += sub.marks || 0
        if (sub.subQuestions && sub.subQuestions.length > 0) {
          total += calculateMarks(sub.subQuestions)
        }
      }
      return total
    }

    return calculateMarks(subQuestions)
  }

  const totalMarks = calculateTotalMarks()

  // Get subjects array safely
  const subjects = subjectsData?.data || []

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    disabled={isSubjectsLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isSubjectsLoading ? "Loading subjects..." : "Select subject"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isSubjectsLoading ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          Loading subjects...
                        </div>
                      ) : subjects.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          No subjects assigned to you
                        </div>
                      ) : (
                        subjects.map((subject) => (
                          <SelectItem key={subject._id} value={subject._id}>
                            {subject.subjectCode} - {subject.subjectName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {subjects.length === 0 && !isSubjectsLoading && (
                      <span className="text-orange-600">
                        You don&#39;t have any subjects assigned. Please contact admin.
                      </span>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="questionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key="mcq" value={QUESTION_TYPES.MCQ}>Multiple Choice (MCQ)</SelectItem>
                        <SelectItem key="structured" value={QUESTION_TYPES.STRUCTURED}>Structured Question</SelectItem>
                        <SelectItem key="essay" value={QUESTION_TYPES.ESSAY}>Essay Question</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {field.value === QUESTION_TYPES.MCQ && 'Single correct answer with multiple options'}
                      {field.value === QUESTION_TYPES.STRUCTURED && 'Question with multiple sub-parts (A, B, C, etc.)'}
                      {field.value === QUESTION_TYPES.ESSAY && 'Long-form answer with optional sub-parts'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficultyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key="easy" value={DIFFICULTY_LEVELS.EASY}>Easy</SelectItem>
                        <SelectItem key="medium" value={DIFFICULTY_LEVELS.MEDIUM}>Medium</SelectItem>
                        <SelectItem key="hard" value={DIFFICULTY_LEVELS.HARD}>Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the question text..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional context or instructions for students..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {questionType === QUESTION_TYPES.MCQ && (
              <FormField
                control={form.control}
                name="marks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marks *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0.5"
                        max="100"
                        step="0.5"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(questionType === QUESTION_TYPES.STRUCTURED || questionType === QUESTION_TYPES.ESSAY) && (
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total Marks (Auto-calculated)</p>
                    <p className="text-xs text-muted-foreground">
                      Sum of all sub-question marks
                    </p>
                  </div>
                  <Badge variant="default" className="text-lg px-4 py-1">
                    {totalMarks} marks
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* MCQ Options */}
        {questionType === QUESTION_TYPES.MCQ && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Answer Options</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {optionFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <FormField
                    control={form.control}
                    name={`options.${index}.isCorrect`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 mt-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`options.${index}.optionText`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={`Option ${index + 1}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {optionFields.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="mt-1"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <p className="text-sm text-muted-foreground">
                Toggle the switch to mark the correct answer. Exactly one option must be correct.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Sub-questions for STRUCTURED/ESSAY */}
        {(questionType === QUESTION_TYPES.STRUCTURED || questionType === QUESTION_TYPES.ESSAY) && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ListTreeIcon className="h-5 w-5" />
                    Sub-Questions
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add parts (A, B, C, etc.) with nested sub-questions
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addSubQuestion}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Part
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {subQuestionFields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ListTreeIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No sub-questions added yet.</p>
                  <p className="text-sm">Click &#34;Add Part&#34; to create structured sub-questions.</p>
                </div>
              ) : (
                <SubQuestionBuilder
                  form={form}
                  fields={subQuestionFields}
                  remove={removeSubQuestion}
                  nestingLevel={0}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Data Structures" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtopic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtopic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Binary Trees" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bloomsTaxonomy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bloom&lsquo;s Taxonomy Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem key="remember" value={BLOOMS_TAXONOMY.REMEMBER}>Remember</SelectItem>
                      <SelectItem key="understand" value={BLOOMS_TAXONOMY.UNDERSTAND}>Understand</SelectItem>
                      <SelectItem key="apply" value={BLOOMS_TAXONOMY.APPLY}>Apply</SelectItem>
                      <SelectItem key="analyze" value={BLOOMS_TAXONOMY.ANALYZE}>Analyze</SelectItem>
                      <SelectItem key="evaluate" value={BLOOMS_TAXONOMY.EVALUATE}>Evaluate</SelectItem>
                      <SelectItem key="create" value={BLOOMS_TAXONOMY.CREATE}>Create</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., sorting, algorithm, complexity" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated keywords for search and filtering
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Public Question</FormLabel>
                    <FormDescription>
                      Make this question available to all faculty members
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || subjects.length === 0}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Question' : 'Create Question'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// Sub-component for nested sub-questions
type SubQuestionBuilderProps = {
  form: any
  fields: any[]
  remove: (index: number) => void
  nestingLevel: number
  parentPath?: string
}

const SubQuestionBuilder = ({ form, fields, remove, nestingLevel, parentPath = 'subQuestions' }: SubQuestionBuilderProps) => {
  const maxNestingLevel = 3

  const addNestedSubQuestion = (parentIndex: number) => {
    const currentSubs = form.getValues(`${parentPath}.${parentIndex}.subQuestions`) || []
    const nextLabel = getSubQuestionLabel(nestingLevel + 1, currentSubs.length)
    
    form.setValue(`${parentPath}.${parentIndex}.subQuestions`, [
      ...currentSubs,
      {
        questionText: '',
        questionDescription: '',
        questionType: SUB_QUESTION_TYPES.SHORT_ANSWER,
        marks: 1,
        subQuestionLabel: nextLabel,
        subQuestionOrder: currentSubs.length + 1,
        subQuestions: [],
      },
    ])
  }

  const removeNestedSubQuestion = (parentIndex: number, childIndex: number) => {
    const currentSubs = form.getValues(`${parentPath}.${parentIndex}.subQuestions`) || []
    form.setValue(
      `${parentPath}.${parentIndex}.subQuestions`,
      currentSubs.filter((_: any, i: number) => i !== childIndex)
    )
  }

  return (
    <div className="space-y-4">
      {fields.map((field, index) => {
        const nestedSubs = form.watch(`${parentPath}.${index}.subQuestions`) || []
        const canAddNested = nestingLevel < maxNestingLevel

        return (
          <Card key={field.id} className={`${nestingLevel > 0 ? 'ml-6 border-l-4' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {form.watch(`${parentPath}.${index}.subQuestionLabel`)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Level {nestingLevel + 1}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name={`${parentPath}.${index}.questionText`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Text *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter question text..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`${parentPath}.${index}.questionType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem key={`${parentPath}-${index}-short`} value={SUB_QUESTION_TYPES.SHORT_ANSWER}>Short Answer</SelectItem>
                            <SelectItem key={`${parentPath}-${index}-long`} value={SUB_QUESTION_TYPES.LONG_ANSWER}>Long Answer</SelectItem>
                            <SelectItem key={`${parentPath}-${index}-fill`} value={SUB_QUESTION_TYPES.FILL_BLANK}>Fill in Blank</SelectItem>
                            {canAddNested && (
                              <>
                                <SelectItem key={`${parentPath}-${index}-struct`} value={SUB_QUESTION_TYPES.STRUCTURED}>Structured</SelectItem>
                                <SelectItem key={`${parentPath}-${index}-essay`} value={SUB_QUESTION_TYPES.ESSAY}>Essay</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`${parentPath}.${index}.marks`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marks *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0.5"
                            max="100"
                            step="0.5"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name={`${parentPath}.${index}.questionDescription`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional context..."
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nested sub-questions */}
              {nestedSubs.length > 0 && (
                <div className="mt-4">
                  <Separator className="mb-4" />
                  <div className="flex items-center gap-2 mb-3">
                    <ChevronRightIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Nested Sub-questions</span>
                  </div>
                  <SubQuestionBuilder
                    form={form}
                    fields={nestedSubs.map((_, i) => ({ id: `${field.id}-${i}`, ..._ }))}
                    remove={(childIndex) => removeNestedSubQuestion(index, childIndex)}
                    nestingLevel={nestingLevel + 1}
                    parentPath={`${parentPath}.${index}.subQuestions`}
                  />
                </div>
              )}

              {canAddNested && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addNestedSubQuestion(index)}
                  className="w-full mt-2"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Nested Sub-question
                </Button>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Helper function to generate sub-question labels
const getSubQuestionLabel = (level: number, index: number): string => {
  if (level === 0) {
    // First level: A, B, C, ...
    return String.fromCharCode(65 + index)
  } else if (level === 1) {
    // Second level: i, ii, iii, ...
    return ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'][index] || `${index + 1}`
  } else {
    // Third level: a, b, c, ...
    return String.fromCharCode(97 + index)
  }
}