'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { useForm, useFieldArray, type UseFormReturn, type FieldValues } from 'react-hook-form'
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  createQuestionSchema,
  type CreateQuestionFormData,
} from '../validations/question-schemas'
import type { Question } from '../types/questions'
import { useMySubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { QUESTION_TYPES, DIFFICULTY_LEVELS, BLOOMS_TAXONOMY, SUB_QUESTION_TYPES } from '@/constants/roles'
import { PlusIcon, TrashIcon, ListTreeIcon, BookOpenIcon, FileTextIcon, InfoIcon, CheckCircle2Icon } from 'lucide-react'
import { LoadingSpinner } from '@/components/common/loading-spinner'
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
  initialData?: Partial<CreateQuestionFormData> | null
}

type SubQuestionFieldsProps = {
  form: UseFormReturn<CreateQuestionFormData>
  parentPath: string
  level: number
  onRemove: () => void
}

const SubQuestionFields = ({ form, parentPath, level, onRemove }: SubQuestionFieldsProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `${parentPath}.subQuestions` as 'subQuestions',
  })

  const addNestedSubQuestion = () => {
    append(getDefaultSubQuestion(fields.length))
  }

  const subQuestionLabel = form.watch(`${parentPath}.subQuestionLabel` as any)
  const marks = form.watch(`${parentPath}.marks` as any)

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
              name={`${parentPath}.questionText` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter question text..." className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name={`${parentPath}.questionType` as any}
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
              name={`${parentPath}.marks` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marks *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0.5"
                      max="100"
                      step="0.5"
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : 0
                        field.onChange(value)
                        
                        setTimeout(() => {
                          const allSubQuestions = form.getValues('subQuestions')
                          const calculatedMarks = calculateTotalMarks(form.getValues('questionType'), 0, allSubQuestions)
                          form.setValue('marks', calculatedMarks, { shouldValidate: false, shouldDirty: true })
                        }, 0)
                      }}
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
          name={`${parentPath}.questionDescription` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional context..." rows={2} {...field} value={field.value || ''} />
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

export const QuestionForm = ({ question, onSubmit, onCancel, isLoading, initialData }: QuestionFormProps) => {
  const isEditMode = !!question
  const { data: subjectsData, isLoading: isSubjectsLoading } = useMySubjectsQuery()
  const [formKey, setFormKey] = useState(0)
  const hasInitialized = useRef(false)

  const form = useForm({
    resolver: zodResolver(createQuestionSchema) as any,
    defaultValues: getDefaultQuestionFormData(),
  }) as UseFormReturn<CreateQuestionFormData>

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
    if (isEditMode && question && !isSubjectsLoading && !hasInitialized.current) {
      const formData = mapQuestionToFormData(question)
      form.reset(formData)
      setFormKey((prev: number) => prev + 1)
      hasInitialized.current = true
    } else if (!isEditMode && initialData && !hasInitialized.current) {
      form.reset({ ...getDefaultQuestionFormData(), ...initialData })
      setFormKey((prev: number) => prev + 1)
      hasInitialized.current = true
    }
  }, [isEditMode, question, isSubjectsLoading, initialData, form])

  const handleSubmit = (data: CreateQuestionFormData) => {
    if (data.questionType === QUESTION_TYPES.STRUCTURED || data.questionType === QUESTION_TYPES.ESSAY) {
      data.marks = calculateTotalMarks(data.questionType, 0, data.subQuestions)
    }
    
    const cleanedData = cleanQuestionFormData(data)
    if (isEditMode) {
      const { subjectId, ...updateData } = cleanedData
      onSubmit(updateData as CreateQuestionFormData)
    } else {
      onSubmit(cleanedData)
    }
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
  const subjects = subjectsData?.data || []

  const totalMarks = useMemo(() => {
    return calculateTotalMarks(questionType, watchedMarks, watchedSubQuestions)
  }, [questionType, watchedMarks, JSON.stringify(watchedSubQuestions)])

  useEffect(() => {
    if (questionType === QUESTION_TYPES.STRUCTURED || questionType === QUESTION_TYPES.ESSAY) {
      const calculatedMarks = calculateTotalMarks(questionType, 0, watchedSubQuestions)
      if (calculatedMarks !== watchedMarks) {
        form.setValue('marks', calculatedMarks, { shouldValidate: false, shouldDirty: true })
      }
    }
  }, [questionType, JSON.stringify(watchedSubQuestions), watchedMarks, form])

  return (
    <Form {...form}>
      <form key={formKey} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpenIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Question details and type</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject *</FormLabel>
                  <Select 
                    key={field.value || 'empty'}
                    onValueChange={field.onChange} 
                    value={field.value} 
                    disabled={isSubjectsLoading || isEditMode}
                    defaultValue={field.value}
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
                    <FormLabel className="flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4" />
                      Question Type *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficultyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <InfoIcon className="h-4 w-4" />
                      Difficulty Level *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
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
                  <FormLabel className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4" />
                    Question Text *
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the question text..." className="min-h-[100px]" {...field} />
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
                  <FormLabel className="flex items-center gap-2">
                    <InfoIcon className="h-4 w-4" />
                    Additional Instructions (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional context or instructions..." className="min-h-[80px]" {...field} value={field.value || ''} />
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
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
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
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <CheckCircle2Icon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle>Answer Options</CardTitle>
                      <CardDescription>Configure MCQ options and correct answers</CardDescription>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="allowMultipleAnswers"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 rounded-lg border p-3 bg-muted/50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </FormControl>
                        <div className="space-y-0.5">
                          <FormLabel className="!mt-0 cursor-pointer font-medium">
                            Multiple Correct Answers
                          </FormLabel>
                          <FormDescription className="text-xs">
                            {field.value ? 'Students can select multiple correct answers' : 'Only one correct answer allowed'}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const allowMultiple = form.watch('allowMultipleAnswers')
                const selectedCorrectIndex = optionFields.findIndex((_, idx) => form.watch(`options.${idx}.isCorrect`))
                
                return (
                  <div className="space-y-3">
                    {optionFields.map((field, index) => (
                      <div key={field.id} className="flex gap-3 items-start p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        {allowMultiple ? (
                          <FormField
                            control={form.control}
                            name={`options.${index}.isCorrect`}
                            render={({ field }) => (
                              <FormItem className="flex items-center mt-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="h-5 w-5 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ) : (
                          <FormField
                            control={form.control}
                            name={`options.${index}.isCorrect`}
                            render={({ field }) => (
                              <FormItem className="flex items-center mt-2">
                                <FormControl>
                                  <RadioGroup
                                    value={selectedCorrectIndex.toString()}
                                    onValueChange={(val) => {
                                      optionFields.forEach((_, idx) => {
                                        form.setValue(`options.${idx}.isCorrect`, idx === parseInt(val))
                                      })
                                    }}
                                  >
                                    <RadioGroupItem value={index.toString()} className="h-5 w-5 border-2 border-primary" />
                                  </RadioGroup>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`options.${index}.optionText`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                    {...field}
                                    className="font-medium"
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
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        )}

        {(questionType === QUESTION_TYPES.STRUCTURED || questionType === QUESTION_TYPES.ESSAY) && (
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <ListTreeIcon className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle>Sub-Questions</CardTitle>
                    <CardDescription>Add structured parts and sub-parts</CardDescription>
                  </div>
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
                  <p>No sub-questions added yet. Click "Add Part" to create structured sub-questions.</p>
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

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <InfoIcon className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Metadata and categorization</CardDescription>
              </div>
            </div>
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
                      <Input placeholder="Data Structures" {...field} value={field.value || ''} />
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
                      <Input placeholder="Binary Trees" {...field} value={field.value || ''} />
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
                    <Input placeholder="sorting, algorithm, complexity" {...field} value={field.value || ''} />
                  </FormControl>
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

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} size="lg">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || subjects.length === 0} size="lg" className="min-w-[150px]">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Saving...</span>
              </div>
            ) : (
              isEditMode ? 'Update Question' : 'Create Question'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}