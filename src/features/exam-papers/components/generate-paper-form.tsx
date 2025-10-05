 
'use client'

import { useState } from 'react'
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
import { PlusIcon, TrashIcon } from 'lucide-react'
import { EXAM_TYPES } from '../types/exam-papers'
import { QUESTION_TYPES, DIFFICULTY_LEVELS } from '@/constants/roles'
import { generatePaperSchema, type GeneratePaperFormData } from '../validations/exam-paper-schemas'
import { useSubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'

type GeneratePaperFormProps = {
  onSubmit: (data: GeneratePaperFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export const GeneratePaperForm = ({ onSubmit, onCancel, isLoading }: GeneratePaperFormProps) => {
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjectsQuery({ isActive: true })
  const subjects = subjectsData?.data || []

  const form = useForm<GeneratePaperFormData>({
    resolver: zodResolver(generatePaperSchema),
    defaultValues: {
      subjectId: '',
      paperTitle: '',
      paperType: EXAM_TYPES.MIDTERM,
      durationMinutes: 180,
      instructions: '',
      questionCriteria: [
        {
          count: 10,
          marksPerQuestion: 2,
          section: 'A'
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questionCriteria'
  })

  const calculateTotalMarks = () => {
    return fields.reduce((sum, field) => {
      const count = field.count || 0
      const marks = field.marksPerQuestion || 0
      return sum + (count * marks)
    }, 0)
  }

  const totalMarks = calculateTotalMarks()

  if (isLoadingSubjects) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <Select onValueChange={field.onChange} value={field.value}>
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

        {/* Question Criteria */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Question Criteria</h3>
              <p className="text-sm text-muted-foreground">
                Total: {totalMarks} marks
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({
                count: 5,
                marksPerQuestion: 2,
                section: String.fromCharCode(65 + fields.length)
              })}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Criteria
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Criteria {index + 1}</h4>
                  {fields.length > 1 && (
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <FormField
                    control={form.control}
                    name={`questionCriteria.${index}.count`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Count *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1}
                            placeholder="10"
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
                    name={`questionCriteria.${index}.marksPerQuestion`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Marks Each *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1}
                            placeholder="2"
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
                    name={`questionCriteria.${index}.difficultyLevel`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
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
                    name={`questionCriteria.${index}.questionType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value={QUESTION_TYPES.MCQ}>MCQ</SelectItem>
                            <SelectItem value={QUESTION_TYPES.SHORT_ANSWER}>Short Answer</SelectItem>
                            <SelectItem value={QUESTION_TYPES.LONG_ANSWER}>Long Answer</SelectItem>
                            <SelectItem value={QUESTION_TYPES.FILL_BLANK}>Fill Blank</SelectItem>
                            <SelectItem value={QUESTION_TYPES.TRUE_FALSE}>True/False</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name={`questionCriteria.${index}.topic`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Topic (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Algebra" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`questionCriteria.${index}.section`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Section (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="A, B, C..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  Subtotal: {(field.count || 0) * (field.marksPerQuestion || 0)} marks
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Paper'}
          </Button>
        </div>
      </form>
    </Form>
  )
}