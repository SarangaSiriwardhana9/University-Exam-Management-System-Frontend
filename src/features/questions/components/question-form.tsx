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
import { PlusIcon, TrashIcon, ListTreeIcon } from 'lucide-react'
import {
  getDefaultQuestionFormData,
  getDefaultMcqOptions,
  getDefaultSubQuestion,
  calculateTotalMarks,
  cleanQuestionFormData,
  mapQuestionToFormData,
} from '../utils/question-utils'

type QuestionFormProps = {
  question?: Question
  onSubmit: (data: CreateQuestionFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type SubQuestionFieldsProps = {
  form: any
  parentPath: string
  level: number
  onRemove: () => void
}

const SubQuestionFields = ({ form, parentPath, level, onRemove }: SubQuestionFieldsProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `${parentPath}.subQuestions`,
  })

  const addNestedSubQuestion = () => {
    append(getDefaultSubQuestion(fields.length))
  }

  const subQuestionLabel = form.watch(`${parentPath}.subQuestionLabel`)
  const marks = form.watch(`${parentPath}.marks`)

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {subQuestionLabel}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Level {level}
            </Badge>
            <Badge variant="default" className="text-xs">
              {marks || 0} marks
            </Badge>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name={`${parentPath}.questionText`}
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
              name={`${parentPath}.questionType`}
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
                      <SelectItem value={SUB_QUESTION_TYPES.SHORT_ANSWER}>Short Answer</SelectItem>
                      <SelectItem value={SUB_QUESTION_TYPES.LONG_ANSWER}>Long Answer</SelectItem>
                      <SelectItem value={SUB_QUESTION_TYPES.FILL_BLANK}>Fill in Blank</SelectItem>
                      <SelectItem value={SUB_QUESTION_TYPES.STRUCTURED}>Structured</SelectItem>
                      <SelectItem value={SUB_QUESTION_TYPES.ESSAY}>Essay</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`${parentPath}.marks`}
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
          name={`${parentPath}.questionDescription`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional context..."
                  rows={2}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {level < 3 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListTreeIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Nested Sub-questions</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addNestedSubQuestion}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Sub-part
                </Button>
              </div>

              {fields.length > 0 && (
                <div className="space-y-3 ml-4 border-l-2 pl-4">
                  {fields.map((field, index) => (
                    <SubQuestionFields
                      key={field.id}
                      form={form}
                      parentPath={`${parentPath}.subQuestions.${index}`}
                      level={level + 1}
                      onRemove={() => remove(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export const QuestionForm = ({ question, onSubmit, onCancel, isLoading }: QuestionFormProps) => {
  const isEditMode = !!question
  const { data: subjectsData, isLoading: isSubjectsLoading } = useMySubjectsQuery()

  const form = useForm<CreateQuestionFormData>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: getDefaultQuestionFormData(),
  })

  const questionType = form.watch('questionType')

  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control: form.control,
    name: 'options',
  })

  const { fields: subQuestionFields, append: appendSubQuestion, remove: removeSubQuestion } = useFieldArray({
    control: form.control,
    name: 'subQuestions',
  })

  useEffect(() => {
    if (questionType === QUESTION_TYPES.STRUCTURED || questionType === QUESTION_TYPES.ESSAY) {
      form.setValue('options', [])
    } else if (questionType === QUESTION_TYPES.MCQ && (!form.getValues('options') || form.getValues('options')?.length === 0)) {
      form.setValue('options', getDefaultMcqOptions())
    }
  }, [questionType, form])

  useEffect(() => {
    if (isEditMode && question) {
      form.reset(mapQuestionToFormData(question))
    }
  }, [isEditMode, question, form])

  const handleSubmit = (data: CreateQuestionFormData) => {
    const cleanedData = cleanQuestionFormData(data)
    onSubmit(cleanedData)
  }

  const addOption = () => {
    appendOption({
      optionText: '',
      isCorrect: false,
      optionOrder: optionFields.length + 1,
    })
  }

  const addSubQuestion = () => {
    appendSubQuestion(getDefaultSubQuestion(subQuestionFields.length))
  }

  const watchedMarks = form.watch('marks')
  const watchedSubQuestions = form.watch('subQuestions')
  const totalMarks = calculateTotalMarks(questionType, watchedMarks, watchedSubQuestions)
  const subjects = subjectsData?.data || []

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubjectsLoading || isEditMode}>
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
                  {isEditMode && (
                    <FormDescription>
                      Subject cannot be changed when editing
                    </FormDescription>
                  )}
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
                        <SelectItem value={QUESTION_TYPES.MCQ}>Multiple Choice (MCQ)</SelectItem>
                        <SelectItem value={QUESTION_TYPES.STRUCTURED}>Structured Question</SelectItem>
                        <SelectItem value={QUESTION_TYPES.ESSAY}>Essay Question</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {field.value === QUESTION_TYPES.MCQ && 'Single correct answer with multiple options'}
                      {field.value === QUESTION_TYPES.STRUCTURED && 'Question with multiple sub-parts with nested levels'}
                      {field.value === QUESTION_TYPES.ESSAY && 'Long-form answer with optional nested sub-parts'}
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
                        <SelectItem value={DIFFICULTY_LEVELS.EASY}>Easy</SelectItem>
                        <SelectItem value={DIFFICULTY_LEVELS.MEDIUM}>Medium</SelectItem>
                        <SelectItem value={DIFFICULTY_LEVELS.HARD}>Hard</SelectItem>
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
                      value={field.value || ''}
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
                    Add parts (A, B, C, etc.) with up to 3 levels of nesting (A, A.i, A.i.a)
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
                  <p className="text-sm">Click &quot;Add Part&quot; to create structured sub-questions.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subQuestionFields.map((field, index) => (
                    <SubQuestionFields
                      key={field.id}
                      form={form}
                      parentPath={`subQuestions.${index}`}
                      level={1}
                      onRemove={() => removeSubQuestion(index)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
                      <Input placeholder="e.g., Data Structures" {...field} value={field.value || ''} />
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
                      <Input placeholder="e.g., Binary Trees" {...field} value={field.value || ''} />
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
                  <FormLabel>Bloom&#39;s Taxonomy Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={BLOOMS_TAXONOMY.REMEMBER}>Remember</SelectItem>
                      <SelectItem value={BLOOMS_TAXONOMY.UNDERSTAND}>Understand</SelectItem>
                      <SelectItem value={BLOOMS_TAXONOMY.APPLY}>Apply</SelectItem>
                      <SelectItem value={BLOOMS_TAXONOMY.ANALYZE}>Analyze</SelectItem>
                      <SelectItem value={BLOOMS_TAXONOMY.EVALUATE}>Evaluate</SelectItem>
                      <SelectItem value={BLOOMS_TAXONOMY.CREATE}>Create</SelectItem>
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
                    <Input placeholder="e.g., sorting, algorithm, complexity" {...field} value={field.value || ''} />
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

        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
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