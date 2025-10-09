/* eslint-disable @typescript-eslint/no-explicit-any */
 
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { QUESTION_TYPES, DIFFICULTY_LEVELS, BLOOMS_TAXONOMY } from '@/constants/roles'
import { createQuestionSchema, updateQuestionSchema, type CreateQuestionFormData, type UpdateQuestionFormData } from '../validations/question-schemas'
import type { Question } from '../types/questions'
import { useMySubjectsQuery, useSubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { useAuth } from '@/lib/auth/auth-provider'
import { USER_ROLES } from '@/constants/roles'

type CreateQuestionFormProps = {
  question?: never
  onSubmit: (data: CreateQuestionFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateQuestionFormProps = {
  question: Question
  onSubmit: (data: UpdateQuestionFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type QuestionFormProps = CreateQuestionFormProps | UpdateQuestionFormProps

export const QuestionForm = ({ question, onSubmit, onCancel, isLoading }: QuestionFormProps) => {
  const isEditMode = !!question
  const [selectedType, setSelectedType] = useState<string>(question?.questionType || QUESTION_TYPES.MCQ)

  const { user } = useAuth()
  const { data: allSubjectsData, isLoading: isLoadingAllSubjects } = useSubjectsQuery({ isActive: true })
  const { data: mySubjectsData, isLoading: isLoadingMySubjects } = useMySubjectsQuery({ isActive: true })
  const isFaculty = user?.role === USER_ROLES.FACULTY
  const subjects = (isFaculty ? mySubjectsData?.data : allSubjectsData?.data) || []

  const form = useForm<CreateQuestionFormData | UpdateQuestionFormData>({
 
    resolver: zodResolver(isEditMode ? updateQuestionSchema : createQuestionSchema),
    defaultValues: {
      subjectId: '',
      questionText: '',
      questionDescription: '',
      questionType: QUESTION_TYPES.MCQ,
      difficultyLevel: DIFFICULTY_LEVELS.MEDIUM,
      marks: 1,
      topic: '',
      subtopic: '',
      bloomsTaxonomy: BLOOMS_TAXONOMY.UNDERSTAND,
      keywords: '',
      isPublic: true,
      options: [
        { optionText: '', isCorrect: false, optionOrder: 1 },
        { optionText: '', isCorrect: false, optionOrder: 2 }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options'
  })

  useEffect(() => {
    if (question) {
      console.log('Setting form values with question:', question)
      form.reset({
        subjectId: question.subjectId,
        questionText: question.questionText,
        questionDescription: question.questionDescription || '',
        questionType: question.questionType,
        difficultyLevel: question.difficultyLevel,
        marks: question.marks,
        topic: question.topic || '',
        subtopic: question.subtopic || '',
        bloomsTaxonomy: question.bloomsTaxonomy,
        keywords: question.keywords || '',
        isPublic: question.isPublic,
        options: question.options && question.options.length > 0 
          ? question.options.map(opt => ({
              optionText: opt.optionText,
              isCorrect: opt.isCorrect,
              optionOrder: opt.optionOrder
            }))
          : [
              { optionText: '', isCorrect: false, optionOrder: 1 },
              { optionText: '', isCorrect: false, optionOrder: 2 }
            ]
      })
      setSelectedType(question.questionType)
    }
  }, [question, form])

  const handleSubmit = (data: CreateQuestionFormData | UpdateQuestionFormData) => {
    if (isEditMode) {
 
      const updateData: any = { ...data }
      delete updateData.subjectId
      
      if (selectedType !== QUESTION_TYPES.MCQ && selectedType !== QUESTION_TYPES.TRUE_FALSE) {
        delete updateData.options
      }
      
      (onSubmit as (data: UpdateQuestionFormData) => void)(updateData)
    } else {
 
      const createData: any = { ...data }
      if (selectedType !== QUESTION_TYPES.MCQ && selectedType !== QUESTION_TYPES.TRUE_FALSE) {
        delete createData.options
      }
      
      (onSubmit as (data: CreateQuestionFormData) => void)(createData)
    }
  }

  const needsOptions = selectedType === QUESTION_TYPES.MCQ || selectedType === QUESTION_TYPES.TRUE_FALSE

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
                  <Select onValueChange={field.onChange} value={field.value} disabled={isEditMode}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No subjects available
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

            <FormField
              control={form.control}
              name="questionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Type *</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedType(value)
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={QUESTION_TYPES.MCQ}>Multiple Choice (MCQ)</SelectItem>
                      <SelectItem value={QUESTION_TYPES.SHORT_ANSWER}>Short Answer</SelectItem>
                      <SelectItem value={QUESTION_TYPES.LONG_ANSWER}>Long Answer</SelectItem>
                      <SelectItem value={QUESTION_TYPES.FILL_BLANK}>Fill in the Blank</SelectItem>
                      <SelectItem value={QUESTION_TYPES.TRUE_FALSE}>True/False</SelectItem>
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
                    placeholder="Enter the question text" 
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
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Additional context or instructions" 
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <FormField
              control={form.control}
              name="marks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marks *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      max={100}
                      placeholder="Enter marks" 
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
              name="bloomsTaxonomy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bloom&apos;s Taxonomy</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
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
          </div>
        </div>

        {/* Categorization */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Categorization</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Calculus, Grammar" {...field} />
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
                    <Input placeholder="e.g., Derivatives, Tenses" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords</FormLabel>
                <FormControl>
                  <Input placeholder="Comma-separated keywords for searching" {...field} />
                </FormControl>
                <FormDescription>
                  Add keywords to make this question easier to find
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Make this question public</FormLabel>
                  <FormDescription>
                    Public questions can be used by other faculty members
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Options for MCQ/True-False */}
        {needsOptions && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Answer Options</h3>
              {selectedType === QUESTION_TYPES.MCQ && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ 
                    optionText: '', 
                    isCorrect: false, 
                    optionOrder: fields.length + 1 
                  })}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <FormField
                    control={form.control}
                    name={`options.${index}.isCorrect`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-y-0 pt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`options.${index}.optionText`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
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

                  {selectedType === QUESTION_TYPES.MCQ && fields.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <TrashIcon className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              Check the box next to correct answer(s)
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Question' : 'Create Question'}
          </Button>
        </div>
      </form>
    </Form>
  )
}