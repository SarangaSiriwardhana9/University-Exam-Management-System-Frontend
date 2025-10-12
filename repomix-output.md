This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
src/app/globals.css
src/app/layout.tsx
src/constants/roles.ts
src/constants/routes.ts
src/features/exam-papers/components/exam-paper-columns.tsx
src/features/exam-papers/components/exam-paper-details.tsx
src/features/exam-papers/components/exam-paper-form.tsx
src/features/exam-papers/components/generate-paper-form.tsx
src/features/exam-papers/hooks/use-exam-paper-mutations.ts
src/features/exam-papers/hooks/use-exam-papers-query.ts
src/features/exam-papers/hooks/use-exam-papers.ts
src/features/exam-papers/types/exam-papers.ts
src/features/exam-papers/validations/exam-paper-schemas.ts
src/features/questions/components/question-columns.tsx
src/features/questions/components/question-details.tsx
src/features/questions/components/question-form.tsx
src/features/questions/hooks/use-question-mutations.ts
src/features/questions/hooks/use-questions-query.ts
src/features/questions/hooks/use-questions.ts
src/features/questions/types/questions.ts
src/features/questions/validations/question-schemas.ts
src/features/subjects/components/faculty-subject-columns.tsx
src/features/subjects/components/subject-columns.tsx
src/features/subjects/components/subject-form.tsx
src/features/subjects/hooks/use-subject-mutations.ts
src/features/subjects/hooks/use-subjects-query.ts
src/features/subjects/hooks/use-subjects.ts
src/features/subjects/types/subjects.ts
src/features/subjects/validations/subject-schemas.ts
src/lib/api/client.ts
src/lib/api/index.ts
src/lib/providers/query-provider.tsx
src/lib/utils.ts
src/types/auth.ts
src/types/common.ts
```

# Files

## File: src/features/exam-papers/components/exam-paper-details.tsx
```typescript
// src/features/exam-papers/components/exam-paper-details.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { ExamPaper, PaperQuestion, SubPaperQuestion } from '../types/exam-papers'
import { LockIcon, ClockIcon, FileTextIcon, ListTreeIcon } from 'lucide-react'
import { JSX } from 'react'
import { cn } from '@/lib/utils'

type ExamPaperDetailsProps = {
  paper: ExamPaper
}

const getLevelColors = (level: number) => {
  const colors = [
    'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
    'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
    'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950'
  ]
  return colors[level] || colors[0]
}

const getLevelBadgeColors = (level: number) => {
  const colors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
  ]
  return colors[level] || colors[0]
}

export const ExamPaperDetails = ({ paper }: ExamPaperDetailsProps) => {
  const renderSubQuestions = (subQuestions: SubPaperQuestion[], level: number = 0, parentLabel: string = ''): JSX.Element => {
    return (
      <div className={cn("space-y-2", level > 0 && "ml-6 mt-2")}>
        {subQuestions.map((sq) => {
          const fullLabel = parentLabel ? `${parentLabel}.${sq.subQuestionLabel}` : sq.subQuestionLabel
          
          return (
            <div key={sq._id} className={cn("p-3 border-2 rounded-lg", getLevelColors(level))}>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className={cn("font-mono text-xs font-bold", getLevelBadgeColors(level))}>
                  {fullLabel}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">{sq.questionText}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {sq.marksAllocated} marks
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {sq.questionType.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              {sq.subQuestions && sq.subQuestions.length > 0 && (
                <div className="mt-2">
                  {renderSubQuestions(sq.subQuestions, level + 1, fullLabel)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const calculateQuestionTotalMarks = (question: PaperQuestion): number => {
    let total = question.marksAllocated
    
    if (question.subQuestions && question.subQuestions.length > 0) {
      const calculateSubMarks = (sqs: SubPaperQuestion[]): number => {
        return sqs.reduce((sum, sq) => {
          let subTotal = sq.marksAllocated
          if (sq.subQuestions && sq.subQuestions.length > 0) {
            subTotal += calculateSubMarks(sq.subQuestions)
          }
          return sum + subTotal
        }, 0)
      }
      total += calculateSubMarks(question.subQuestions)
    }
    
    return total
  }

  return (
    <div className="space-y-6">
      {/* Paper Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle>{paper.paperTitle}</CardTitle>
                {paper.isFinalized && (
                  <Badge variant="default" className="bg-purple-600">
                    <LockIcon className="h-3 w-3 mr-1" />
                    Finalized
                  </Badge>
                )}
              </div>
              <CardDescription>
                {paper.subjectCode} - {paper.subjectName}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Exam Type</p>
              <Badge variant="outline" className="mt-1">
                {paper.paperType.charAt(0).toUpperCase() + paper.paperType.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Marks</p>
              <p className="mt-1 font-semibold text-lg">{paper.totalMarks}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Duration</p>
              <div className="flex items-center gap-1 mt-1">
                <ClockIcon className="h-4 w-4" />
                <span>{paper.formattedDuration}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Questions</p>
              <div className="flex items-center gap-1 mt-1">
                <FileTextIcon className="h-4 w-4" />
                <span>{paper.questionCount || 0}</span>
              </div>
            </div>
          </div>

          {paper.instructions && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">General Instructions</p>
                <div className="p-3 bg-muted/50 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{paper.instructions}</p>
                </div>
              </div>
            </>
          )}

          <Separator />
          <div className="flex gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Version</p>
              <p className="mt-1">{paper.versionNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created By</p>
              <p className="mt-1">{paper.createdByName || '—'}</p>
            </div>
            {paper.isFinalized && paper.finalizedAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Finalized At</p>
                <p className="mt-1">{new Date(paper.finalizedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Paper Structure Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Paper Structure</CardTitle>
          <CardDescription>
            {paper.parts.length} section(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paper.parts.map((part) => (
              <div key={part.partLabel} className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        Part {part.partLabel}
                      </Badge>
                      <h3 className="font-semibold">{part.partTitle}</h3>
                    </div>
                    {part.partInstructions && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        {part.partInstructions}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{part.totalMarks} marks</p>
                    <p className="text-xs text-muted-foreground">{part.questionCount} questions</p>
                  </div>
                </div>
                {part.hasOptionalQuestions && (
                  <Badge variant="secondary" className="text-xs mt-2">
                    Optional: Answer minimum {part.minimumQuestionsToAnswer} questions
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      {paper.questions && paper.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
            <CardDescription>
              Detailed breakdown of all questions in this exam paper
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {paper.parts.map((part) => {
                const partQuestions = paper.questions?.filter(q => q.partLabel === part.partLabel) || []
                
                return (
                  <AccordionItem key={part.partLabel} value={part.partLabel} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 flex-1">
                        <Badge variant="outline" className="font-mono">
                          Part {part.partLabel}
                        </Badge>
                        <span className="font-medium">{part.partTitle}</span>
                        <Badge variant="secondary" className="ml-auto mr-4">
                          {partQuestions.length} questions
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-3">
                      {partQuestions.map((question, idx) => {
                        const questionTotalMarks = calculateQuestionTotalMarks(question)
                        const hasSubParts = question.subQuestions && question.subQuestions.length > 0
                        
                        return (
                          <div key={question._id} className="p-4 border rounded-lg bg-card">
                            <div className="flex items-start gap-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono mt-0.5">
                                  Q{idx + 1}
                                </Badge>
                                {hasSubParts && (
                                  <ListTreeIcon className="h-4 w-4 text-purple-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium mb-2">{question.questionText}</p>
                                <div className="flex gap-2 flex-wrap mb-3">
                                  <Badge variant="secondary" className="text-xs">
                                    {questionTotalMarks} marks total
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {question.questionType.replace('_', ' ')}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {question.difficultyLevel}
                                  </Badge>
                                  {question.isOptional && (
                                    <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                                      Optional
                                    </Badge>
                                  )}
                                  {hasSubParts && (
                                    <Badge variant="default" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                      Structured Question
                                    </Badge>
                                  )}
                                </div>
                                
                                {hasSubParts && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                      <span>Question Parts:</span>
                                    </div>
                                    {renderSubQuestions(question.subQuestions!)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

## File: src/features/questions/components/question-details.tsx
```typescript
// src/features/questions/components/question-details.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Question, SubQuestion } from '../types/questions'
import { CheckCircle2Icon, CircleIcon } from 'lucide-react'
import { JSX } from 'react'
import { cn } from '@/lib/utils'

type QuestionDetailsProps = {
  question: Question
}

const getLevelColors = (level: number) => {
  const colors = [
    'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
    'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
    'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950'
  ]
  return colors[level] || colors[0]
}

const getLevelBadgeColors = (level: number) => {
  const colors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
  ]
  return colors[level] || colors[0]
}

export const QuestionDetails = ({ question }: QuestionDetailsProps) => {
  const renderSubQuestions = (subQuestions: SubQuestion[], level: number = 0, parentLabel: string = ''): JSX.Element => {
    return (
      <div className={cn("space-y-3", level > 0 && "ml-6 mt-3")}>
        {subQuestions.map((sq, idx) => {
          const fullLabel = parentLabel ? `${parentLabel}.${sq.subQuestionLabel}` : sq.subQuestionLabel
          
          return (
            <div key={sq._id} className={cn("p-4 border-2 rounded-lg", getLevelColors(level))}>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className={cn("font-mono font-bold mt-0.5", getLevelBadgeColors(level))}>
                  {fullLabel}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium">{sq.questionText}</p>
                  {sq.questionDescription && (
                    <p className="text-sm text-muted-foreground mt-1 italic">{sq.questionDescription}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {sq.marks} marks
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {sq.questionType.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              {sq.subQuestions && sq.subQuestions.length > 0 && (
                <div className="mt-3">
                  {renderSubQuestions(sq.subQuestions, level + 1, fullLabel)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const calculateTotalMarks = (): number => {
    if (!question.hasSubQuestions) return question.marks

    const calculateSubMarks = (sqs: SubQuestion[]): number => {
      return sqs.reduce((sum, sq) => {
        let total = sq.marks
        if (sq.subQuestions && sq.subQuestions.length > 0) {
          total += calculateSubMarks(sq.subQuestions)
        }
        return sum + total
      }, 0)
    }

    return question.subQuestions ? calculateSubMarks(question.subQuestions) : question.marks
  }

  const totalMarks = calculateTotalMarks()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle>{question.questionText}</CardTitle>
                {question.hasSubQuestions && (
                  <Badge variant="default" className="bg-purple-600">
                    Structured
                  </Badge>
                )}
              </div>
              {question.questionDescription && (
                <CardDescription className="mt-2">
                  {question.questionDescription}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subject</p>
              <p className="mt-1">
                {question.subjectCode} - {question.subjectName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <Badge variant="outline" className="mt-1">
                {question.questionType.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
              <Badge variant="outline" className="mt-1">
                {question.difficultyLevel.charAt(0).toUpperCase() + question.difficultyLevel.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Marks</p>
              <p className="mt-1 font-semibold text-lg">{totalMarks}</p>
            </div>
          </div>

          {(question.topic || question.subtopic) && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                {question.topic && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Topic</p>
                    <p className="mt-1">{question.topic}</p>
                  </div>
                )}
                {question.subtopic && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subtopic</p>
                    <p className="mt-1">{question.subtopic}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {question.bloomsTaxonomy && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bloom&apos;s Taxonomy</p>
                <Badge variant="secondary" className="mt-1">
                  {question.bloomsTaxonomy.charAt(0).toUpperCase() + question.bloomsTaxonomy.slice(1)}
                </Badge>
              </div>
            </>
          )}

          {question.keywords && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Keywords</p>
                <p className="mt-1 text-sm">{question.keywords}</p>
              </div>
            </>
          )}

          <Separator />
          <div className="flex gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usage Count</p>
              <p className="mt-1">{question.usageCount}x</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Visibility</p>
              <Badge variant={question.isPublic ? 'default' : 'secondary'} className="mt-1">
                {question.isPublic ? 'Public' : 'Private'}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={question.isActive ? 'default' : 'secondary'} className="mt-1">
                {question.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          {question.createdByName && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <p className="mt-1">{question.createdByName}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {question.options && question.options.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Answer Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div
                  key={option._id}
                  className={cn(
                    "flex items-start gap-3 p-3 border rounded-lg",
                    option.isCorrect && "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                  )}
                >
                  {option.isCorrect ? (
                    <CheckCircle2Icon className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  ) : (
                    <CircleIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={option.isCorrect ? 'font-medium' : ''}>
                      {String.fromCharCode(97 + index)}. {option.optionText}
                    </p>
                  </div>
                  {option.isCorrect && (
                    <Badge variant="default" className="bg-green-600">
                      Correct
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {question.hasSubQuestions && question.subQuestions && question.subQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Question Parts & Sub-parts</CardTitle>
            <CardDescription>
              This structured question contains {question.subQuestions.length} main part(s) with nested sub-parts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderSubQuestions(question.subQuestions)}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

## File: src/constants/roles.ts
```typescript
export const USER_ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty', 
  STUDENT: 'student',
  EXAM_COORDINATOR: 'exam_coordinator',
  INVIGILATOR: 'invigilator'
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

export const QUESTION_TYPES = {
  MCQ: 'mcq',
  SHORT_ANSWER: 'short_answer',
  LONG_ANSWER: 'long_answer',
  FILL_BLANK: 'fill_blank',
  TRUE_FALSE: 'true_false',
  STRUCTURED: 'structured'
} as const

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES]

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS]

export const BLOOMS_TAXONOMY = {
  REMEMBER: 'remember',
  UNDERSTAND: 'understand',
  APPLY: 'apply',
  ANALYZE: 'analyze',
  EVALUATE: 'evaluate',
  CREATE: 'create'
} as const

export type BloomsTaxonomy = typeof BLOOMS_TAXONOMY[keyof typeof BLOOMS_TAXONOMY]
```

## File: src/features/exam-papers/components/generate-paper-form.tsx
```typescript
// src/features/exam-papers/components/generate-paper-form.tsx
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
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PlusIcon, TrashIcon, InfoIcon } from 'lucide-react'
import { EXAM_TYPES } from '../types/exam-papers'
import { QUESTION_TYPES, DIFFICULTY_LEVELS } from '@/constants/roles'
import { generatePaperSchema, type GeneratePaperFormData } from '../validations/exam-paper-schemas'
import { useSubjectsQuery, useMySubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { useAuth } from '@/lib/auth/auth-provider'
import { USER_ROLES } from '@/constants/roles'

type GeneratePaperFormProps = {
  onSubmit: (data: GeneratePaperFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export const GeneratePaperForm = ({ onSubmit, onCancel, isLoading }: GeneratePaperFormProps) => {
  const { user } = useAuth()
  const { data: allSubjectsData, isLoading: isLoadingAllSubjects } = useSubjectsQuery({ isActive: true })
  const { data: mySubjectsData, isLoading: isLoadingMySubjects } = useMySubjectsQuery({ isActive: true })
  const isFaculty = user?.role === USER_ROLES.FACULTY
  const subjects = (isFaculty ? mySubjectsData?.data : allSubjectsData?.data) || []

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

  if (isLoadingAllSubjects || isLoadingMySubjects) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Info Alert */}
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Auto-Generate Exam Paper</AlertTitle>
          <AlertDescription>
            Automatically generate an exam paper by selecting questions from your question bank based on criteria like difficulty, type, and topic.
            Questions with sub-parts will be automatically included with their full structure.
          </AlertDescription>
        </Alert>

        {/* Basic Information */}
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
                  <FormDescription>
                    {field.value ? `${Math.floor(field.value / 60)}h ${field.value % 60}m` : ''}
                  </FormDescription>
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
          </CardContent>
        </Card>

        {/* Question Criteria */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Question Selection Criteria</h3>
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
                <div key={field.id} className="p-4 border rounded-lg space-y-4 bg-muted/30">
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
                              min={0.5}
                              step={0.5}
                              placeholder="2"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                              <SelectItem value={QUESTION_TYPES.LONG_ANSWER}>Essay/Long</SelectItem>
                              <SelectItem value={QUESTION_TYPES.FILL_BLANK}>Fill Blank</SelectItem>
                              <SelectItem value={QUESTION_TYPES.TRUE_FALSE}>True/False</SelectItem>
                              <SelectItem value={QUESTION_TYPES.STRUCTURED}>Structured</SelectItem>
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
                            <Input placeholder="A, B, C..." className="uppercase" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Which part of the paper (e.g., Part A)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    Subtotal: {(field.count || 0) * (field.marksPerQuestion || 0)} marks
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
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
```

## File: src/features/exam-papers/hooks/use-exam-paper-mutations.ts
```typescript
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { examPapersService } from './use-exam-papers'
import type { CreateExamPaperDto, UpdateExamPaperDto, GeneratePaperDto } from '../types/exam-papers'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateExamPaperDto) => examPapersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Created', {
        description: 'Exam paper has been created successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Exam Paper', {
        description: error.message || 'An error occurred while creating the exam paper.'
      })
    }
  })
}

export const useGenerateExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GeneratePaperDto) => examPapersService.generate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Generated', {
        description: 'Exam paper has been generated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Generate Exam Paper', {
        description: error.message || 'An error occurred while generating the exam paper.'
      })
    }
  })
}

export const useUpdateExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExamPaperDto }) =>
      examPapersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Updated', {
        description: 'Exam paper has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Exam Paper', {
        description: error.message || 'An error occurred while updating the exam paper.'
      })
    }
  })
}

export const useDuplicateExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle: string }) => 
      examPapersService.duplicate(id, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Duplicated', {
        description: 'Exam paper has been duplicated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Duplicate Exam Paper', {
        description: error.message || 'An error occurred while duplicating the exam paper.'
      })
    }
  })
}

export const useFinalizeExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => examPapersService.finalize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Finalized', {
        description: 'Exam paper has been finalized and locked.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Finalize Exam Paper', {
        description: error.message || 'An error occurred while finalizing the exam paper.'
      })
    }
  })
}

export const useDeleteExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => examPapersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Deleted', {
        description: 'Exam paper has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Exam Paper', {
        description: error.message || 'An error occurred while deleting the exam paper.'
      })
    }
  })
}
```

## File: src/features/exam-papers/hooks/use-exam-papers-query.ts
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { examPapersService } from './use-exam-papers'
import type { GetExamPapersParams } from '../types/exam-papers'

export const useExamPapersQuery = (params?: GetExamPapersParams) => {
  return useQuery({
    queryKey: ['exam-papers', params],
    queryFn: () => examPapersService.getAll(params),
    staleTime: 30000,
  })
}

export const useExamPaperQuery = (id: string | undefined, includeQuestions = true) => {
  return useQuery({
    queryKey: ['exam-papers', id, includeQuestions],
    queryFn: async () => {
      if (!id) throw new Error('Exam Paper ID is required')
      return await examPapersService.getById(id, { includeQuestions })
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useExamPaperStatsQuery = () => {
  return useQuery({
    queryKey: ['exam-papers', 'stats'],
    queryFn: () => examPapersService.getStats(),
    staleTime: 60000,
  })
}
```

## File: src/features/exam-papers/validations/exam-paper-schemas.ts
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod'
import { EXAM_TYPES } from '../types/exam-papers'

const subQuestionSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    questionId: z.string().min(1, 'Question is required'),
    marksAllocated: z.number().min(0.5, 'Marks must be at least 0.5'),
    subQuestionLabel: z.string().min(1, 'Sub-question label is required'),
    subQuestionOrder: z.number().int().min(1),
    subQuestions: z.array(subQuestionSchema).optional()
  })
)

const paperQuestionSchema = z.object({
  questionId: z.string().min(1, 'Question is required'),
  questionOrder: z.number().int().min(1),
  marksAllocated: z.number().min(0.5, 'Marks must be at least 0.5'),
  partLabel: z.string().min(1, 'Part label is required'),
  partTitle: z.string().optional(),
  isOptional: z.boolean().optional(),
  subQuestions: z.array(subQuestionSchema).optional()
})

const paperPartSchema = z.object({
  partLabel: z.string().min(1, 'Part label is required'),
  partTitle: z.string().min(1, 'Part title is required'),
  partInstructions: z.string().optional(),
  partOrder: z.number().int().min(1),
  hasOptionalQuestions: z.boolean().optional(),
  minimumQuestionsToAnswer: z.number().int().min(0).optional()
})

export const createExamPaperSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  paperTitle: z.string().min(5, 'Title must be at least 5 characters'),
  paperType: z.enum([
    EXAM_TYPES.MIDTERM,
    EXAM_TYPES.FINAL,
    EXAM_TYPES.QUIZ,
    EXAM_TYPES.ASSIGNMENT
  ]),
  totalMarks: z.number().min(1, 'Total marks must be at least 1'),
  durationMinutes: z.number().int().min(1, 'Duration must be at least 1 minute'),
  instructions: z.string().optional(),
  parts: z.array(paperPartSchema).min(1, 'At least one part is required'),
  questions: z.array(paperQuestionSchema).min(1, 'At least one question is required')
})

export const updateExamPaperSchema = createExamPaperSchema.partial().extend({
  isActive: z.boolean().optional()
})

const questionCriteriaSchema = z.object({
  topic: z.string().optional(),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']).optional(),
  questionType: z.string().optional(),
  count: z.number().int().min(1, 'Count must be at least 1'),
  marksPerQuestion: z.number().min(0.5, 'Marks per question must be at least 0.5'),
  section: z.string().optional()
})

export const generatePaperSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  paperTitle: z.string().min(5, 'Title must be at least 5 characters'),
  paperType: z.enum([
    EXAM_TYPES.MIDTERM,
    EXAM_TYPES.FINAL,
    EXAM_TYPES.QUIZ,
    EXAM_TYPES.ASSIGNMENT
  ]),
  durationMinutes: z.number().int().min(1, 'Duration must be at least 1 minute'),
  instructions: z.string().optional(),
  questionCriteria: z.array(questionCriteriaSchema).min(1, 'At least one criteria is required')
})

export type CreateExamPaperFormData = z.infer<typeof createExamPaperSchema>
export type UpdateExamPaperFormData = z.infer<typeof updateExamPaperSchema>
export type GeneratePaperFormData = z.infer<typeof generatePaperSchema>
```

## File: src/features/questions/components/question-columns.tsx
```typescript
'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon, ListTreeIcon } from 'lucide-react'
import type { Question } from '../types/questions'
import { cn } from '@/lib/utils'
import type { QuestionType, DifficultyLevel } from '@/constants/roles'

const getQuestionTypeBadge = (type: QuestionType | string) => {
  const typeStyles = {
    mcq: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    short_answer: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    long_answer: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    fill_blank: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    true_false: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
    structured: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
  } as const
  return typeStyles[type as keyof typeof typeStyles] || 'bg-muted'
}

const getDifficultyBadge = (level: DifficultyLevel | string) => {
  const difficultyStyles = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  } as const
  return difficultyStyles[level as keyof typeof difficultyStyles] || 'bg-muted'
}

const formatQuestionType = (type: string) => {
  if (type === 'structured') return 'STRUCTURED'
  return type.replace('_', ' ').toUpperCase()
}

const formatDifficulty = (level: string) => {
  return level.charAt(0).toUpperCase() + level.slice(1)
}

type QuestionColumnsProps = {
  onEdit: (question: Question) => void
  onDelete: (question: Question) => void
  onView: (question: Question) => void
}

export const getQuestionColumns = ({ onEdit, onDelete, onView }: QuestionColumnsProps): ColumnDef<Question>[] => [
  {
    accessorKey: 'questionText',
    header: 'Question',
    cell: ({ row }) => {
      const text = row.original.questionText
      const hasSubQuestions = row.original.hasSubQuestions
      return (
        <div className="max-w-md">
          <div className="flex items-start gap-2">
            {hasSubQuestions && (
              <ListTreeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            )}
            <p className="font-medium line-clamp-2">{text}</p>
          </div>
          {row.original.topic && (
            <p className="text-xs text-muted-foreground mt-1">Topic: {row.original.topic}</p>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'subjectCode',
    header: 'Subject',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.subjectCode}</p>
        <p className="text-xs text-muted-foreground line-clamp-1">{row.original.subjectName}</p>
      </div>
    ),
  },
  {
    accessorKey: 'questionType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.questionType
      return (
        <Badge variant="outline" className={cn('font-medium', getQuestionTypeBadge(type))}>
          {formatQuestionType(type)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'difficultyLevel',
    header: 'Difficulty',
    cell: ({ row }) => {
      const level = row.original.difficultyLevel
      return (
        <Badge variant="outline" className={cn('font-medium', getDifficultyBadge(level))}>
          {formatDifficulty(level)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'marks',
    header: 'Marks',
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.marks}</span>
    ),
  },
  {
    accessorKey: 'usageCount',
    header: 'Usage',
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.usageCount}x</span>
    ),
  },
  {
    accessorKey: 'isPublic',
    header: 'Visibility',
    cell: ({ row }) => {
      const isPublic = row.original.isPublic
      return (
        <Badge variant={isPublic ? 'default' : 'secondary'}>
          {isPublic ? 'Public' : 'Private'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const question = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(question)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(question)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(question)}
              className="text-destructive focus:text-destructive"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
```

## File: src/features/questions/hooks/use-question-mutations.ts
```typescript
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { questionsService } from './use-questions'
import type { CreateQuestionDto, UpdateQuestionDto } from '../types/questions'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateQuestionDto) => questionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Question Created', {
        description: 'Question has been added to the question bank.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Question', {
        description: error.message || 'An error occurred while creating the question.'
      })
    }
  })
}

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionDto }) =>
      questionsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Question Updated', {
        description: 'Question has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Question', {
        description: error.message || 'An error occurred while updating the question.'
      })
    }
  })
}

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => questionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Question Deleted', {
        description: 'Question has been removed from the question bank.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Question', {
        description: error.message || 'An error occurred while deleting the question.'
      })
    }
  })
}
```

## File: src/features/questions/hooks/use-questions-query.ts
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { questionsService } from './use-questions'
import type { GetQuestionsParams } from '../types/questions'

export const useQuestionsQuery = (params?: GetQuestionsParams) => {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => questionsService.getAll(params),
    staleTime: 30000,
  })
}

export const useQuestionQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['questions', id],
    queryFn: async () => {
      if (!id) throw new Error('Question ID is required')
      return await questionsService.getById(id)
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useQuestionsBySubjectQuery = (subjectId: string | undefined, includePrivate = false) => {
  return useQuery({
    queryKey: ['questions', 'subject', subjectId, includePrivate],
    queryFn: async () => {
      if (!subjectId) throw new Error('Subject ID is required')
      return await questionsService.getBySubject(subjectId, { includePrivate })
    },
    enabled: !!subjectId && subjectId !== 'undefined',
    retry: 1,
  })
}

export const useQuestionStatsQuery = () => {
  return useQuery({
    queryKey: ['questions', 'stats'],
    queryFn: () => questionsService.getStats(),
    staleTime: 60000,
  })
}
```

## File: src/features/subjects/hooks/use-subject-mutations.ts
```typescript
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subjectsService } from './use-subjects'
import type { CreateSubjectDto, UpdateSubjectDto } from '../types/subjects'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateSubject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSubjectDto) => subjectsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Subject Created', {
        description: 'Subject has been created successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Subject', {
        description: error.message || 'An error occurred while creating the subject.'
      })
    }
  })
}

export const useUpdateSubject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubjectDto }) =>
      subjectsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Subject Updated', {
        description: 'Subject has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Subject', {
        description: error.message || 'An error occurred while updating the subject.'
      })
    }
  })
}

export const useDeleteSubject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => subjectsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Subject Deleted', {
        description: 'Subject has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Subject', {
        description: error.message || 'An error occurred while deleting the subject.'
      })
    }
  })
}
```

## File: src/lib/api/client.ts
```typescript
import type { ApiError } from '@/types/common'

type RequestConfig = {
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getHeaders = (customHeaders?: Record<string, string>): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  private buildURL = (url: string, params?: Record<string, unknown>): string => {
    const fullURL = new URL(url, this.baseURL)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          fullURL.searchParams.append(key, String(value))
        }
      })
    }
    
    return fullURL.toString()
  }

  private handleResponse = async <T>(response: Response): Promise<T> => {
    if (response.status === 401) {
      this.handleUnauthorized()
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const error: ApiError = {
        message: errorData.message || 'Request failed',
        error: errorData.error || 'HTTP Error',
        statusCode: response.status
      }
      throw error
    }

    return response.json()
  }

  private handleUnauthorized = () => {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
  }

  setToken = (token: string | null): void => {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  getToken = (): string | null => {
    if (this.token) return this.token
    
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        this.token = storedToken
        return storedToken
      }
    }
    
    return null
  }

  get = async <T = unknown>(url: string, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'GET',
      headers: this.getHeaders(config?.headers)
    })
    return this.handleResponse<T>(response)
  }

  post = async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'POST',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data)
    })
    return this.handleResponse<T>(response)
  }

  patch = async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'PATCH',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data)
    })
    return this.handleResponse<T>(response)
  }

  put = async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'PUT',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data)
    })
    return this.handleResponse<T>(response)
  }

  delete = async <T = unknown>(url: string, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'DELETE',
      headers: this.getHeaders(config?.headers)
    })
    return this.handleResponse<T>(response)
  }

  upload = async <T = unknown>(url: string, formData: FormData, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const headers = { ...config?.headers }
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }
    
    // Don't set Content-Type for FormData, let browser set it with boundary
    delete headers['Content-Type']
    
    const response = await fetch(fullURL, {
      method: 'POST',
      headers,
      body: formData
    })
    return this.handleResponse<T>(response)
  }
}

// Create and export the API client instance
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
export const apiClient = new ApiClient(API_BASE_URL)

// Initialize token from localStorage on client side
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token')
  if (token) {
    apiClient.setToken(token)
  }
}
```

## File: src/lib/api/index.ts
```typescript
import { invigilatorAssignmentsService } from '@/features/assignments/hooks/use-assignments'
import { authService } from '@/features/auth/hooks/use-api'
import { academicCalendarService } from '@/features/calendar/hooks/use-calendar'
import { dashboardService } from '@/features/dashboard/hooks/use-dashboard'
import { departmentsService } from '@/features/departments/hooks/use-departments'
import { studentEnrollmentsService } from '@/features/enrollments/hooks/use-enrollments'
import { examPapersService } from '@/features/exam-papers/hooks/use-exam-papers'
import { examSessionsService } from '@/features/exam-sessions/hooks/use-exam-sessions'
import { fileUploadsService } from '@/features/file-uploads/hooks/use-file-uploads'
import { notificationsService } from '@/features/notifications/hooks/use-notifications'
import { questionsService } from '@/features/questions/hooks/use-questions'
import { examRegistrationsService } from '@/features/registrations/hooks/use-registrations'
import { reportsService } from '@/features/reports/hooks/use-reports'
import { resultsService } from '@/features/results/hooks/use-results'
import { roomsService } from '@/features/rooms/hooks/use-rooms'
import { subjectsService } from '@/features/subjects/hooks/use-subjects'
import { usersService } from '@/features/users/hooks/use-users'

 
 
 
 

// Combined API object
export const api = {
  auth: authService,
  users: usersService,
  departments: departmentsService,
  subjects: subjectsService,
  questions: questionsService,
  rooms: roomsService,
  examPapers: examPapersService,
  examSessions: examSessionsService,
  studentEnrollments: studentEnrollmentsService,
  examRegistrations: examRegistrationsService,
  invigilatorAssignments: invigilatorAssignmentsService,
  results: resultsService,
  academicCalendar: academicCalendarService,
  notifications: notificationsService,
  fileUploads: fileUploadsService,
  reports: reportsService,
  dashboard: dashboardService
}

export default api
```

## File: src/lib/providers/query-provider.tsx
```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

## File: src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
```

## File: src/types/auth.ts
```typescript
import type { UserRole } from '@/constants/roles'

export type LoginDto = {
  usernameOrEmail: string
  password: string
}

export type RegisterDto = {
  email: string
  username?: string
  password: string
  fullName: string
  contactPrimary?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
}

export type LoginResponse = {
  user: {
    id: string
    username: string
    email: string
    fullName: string
    role: string
    isActive: boolean
  }
  accessToken: string
}

export type ForgotPasswordDto = {
  email: string
}

export type ResetPasswordDto = {
  token: string
  password: string
  confirmPassword: string
}
```

## File: src/types/common.ts
```typescript
export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type ApiResponse<T> = {
  data: T
  message?: string
}

export type ApiError = {
  message: string
  error?: string
  statusCode?: number
}

export type BaseQueryParams = {
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
```

## File: src/app/globals.css
```css
@import "tailwindcss";

 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;

    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;

    --primary: 194 27% 6%;
    --primary-foreground: 0 0% 98%;

    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;

    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;

    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;

    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;

    --radius: 0.5rem;

    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;

    /* font variables */
    --font-unbounded: '';
    --font-inter: '';
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;

    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;

    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;

    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;

    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;

    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;

    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;

    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;

    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

 
@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));

  --color-chart-1: hsl(var(--chart-1));
  --color-chart-2: hsl(var(--chart-2));
  --color-chart-3: hsl(var(--chart-3));
  --color-chart-4: hsl(var(--chart-4));
  --color-chart-5: hsl(var(--chart-5));

  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

 
body {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: Arial, Helvetica, sans-serif;
}
```

## File: src/features/exam-papers/components/exam-paper-columns.tsx
```typescript
'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon, CopyIcon, LockIcon, LayersIcon } from 'lucide-react'
import type { ExamPaper, ExamType } from '../types/exam-papers'
import { cn } from '@/lib/utils'

const getExamTypeBadge = (type: ExamType) => {
  const typeStyles = {
    midterm: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    final: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    quiz: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    assignment: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
  } as const
  return typeStyles[type] || 'bg-muted'
}

const formatExamType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`
  if (hours > 0) return `${hours}h`
  return `${mins}m`
}

type ExamPaperColumnsProps = {
  onEdit: (paper: ExamPaper) => void
  onDelete: (paper: ExamPaper) => void
  onView: (paper: ExamPaper) => void
  onDuplicate: (paper: ExamPaper) => void
  onFinalize: (paper: ExamPaper) => void
}

export const getExamPaperColumns = ({ 
  onEdit, 
  onDelete, 
  onView, 
  onDuplicate,
  onFinalize 
}: ExamPaperColumnsProps): ColumnDef<ExamPaper>[] => [
  {
    accessorKey: 'paperTitle',
    header: 'Title',
    cell: ({ row }) => {
      const paper = row.original
      return (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{paper.paperTitle}</p>
            {paper.parts && paper.parts.length > 1 && (
              <Badge variant="outline" className="text-xs">
                <LayersIcon className="h-3 w-3 mr-1" />
                {paper.parts.length} parts
              </Badge>
            )}
          </div>
          {paper.subjectCode && (
            <p className="text-xs text-muted-foreground">
              {paper.subjectCode} - {paper.subjectName}
            </p>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'paperType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.paperType
      return (
        <Badge variant="outline" className={cn('font-medium', getExamTypeBadge(type))}>
          {formatExamType(type)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'parts',
    header: 'Structure',
    cell: ({ row }) => {
      const parts = row.original.parts || []
      if (parts.length === 0) return <span className="text-muted-foreground">—</span>
      
      return (
        <div className="flex flex-wrap gap-1">
          {parts.slice(0, 3).map((part) => (
            <Badge key={part.partLabel} variant="secondary" className="text-xs">
              {part.partLabel}
            </Badge>
          ))}
          {parts.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{parts.length - 3}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'totalMarks',
    header: 'Total Marks',
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.totalMarks}</span>
    ),
  },
  {
    accessorKey: 'durationMinutes',
    header: 'Duration',
    cell: ({ row }) => (
      <span>{formatDuration(row.original.durationMinutes)}</span>
    ),
  },
  {
    accessorKey: 'questionCount',
    header: 'Questions',
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.questionCount || 0}</span>
    ),
  },
  {
    accessorKey: 'isFinalized',
    header: 'Status',
    cell: ({ row }) => {
      const isFinalized = row.original.isFinalized
      const isActive = row.original.isActive
      return (
        <div className="flex gap-1">
          {isFinalized && (
            <Badge variant="default" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              <LockIcon className="h-3 w-3 mr-1" />
              Finalized
            </Badge>
          )}
          {!isFinalized && (
            <Badge variant="secondary">
              Draft
            </Badge>
          )}
          {!isActive && (
            <Badge variant="secondary">
              Inactive
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return date.toLocaleDateString()
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const paper = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(paper)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {!paper.isFinalized && (
              <DropdownMenuItem onClick={() => onEdit(paper)}>
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDuplicate(paper)}>
              <CopyIcon className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            {!paper.isFinalized && (
              <DropdownMenuItem onClick={() => onFinalize(paper)}>
                <LockIcon className="mr-2 h-4 w-4" />
                Finalize
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(paper)}
              className="text-destructive focus:text-destructive"
              disabled={paper.isFinalized}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
```

## File: src/features/exam-papers/hooks/use-exam-papers.ts
```typescript
import { apiClient } from '@/lib/api/client'
import type { 
  ExamPaper, 
  CreateExamPaperDto, 
  UpdateExamPaperDto, 
  GeneratePaperDto,
  ExamPaperStats, 
  GetExamPapersParams,
  BackendExamPapersListResponse
} from '../types/exam-papers'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const examPapersService = {
  getAll: async (params?: GetExamPapersParams): Promise<PaginatedResponse<ExamPaper>> => {
    const response = await apiClient.get<BackendExamPapersListResponse>('/api/v1/exam-papers', { params })
    return {
      data: response.examPapers || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string, params?: { includeQuestions?: boolean }): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.get<ExamPaper>(`/api/v1/exam-papers/${id}`, { params })
    return { data: paper }
  },

  getStats: (): Promise<ApiResponse<ExamPaperStats>> =>
    apiClient.get('/api/v1/exam-papers/stats'),

  create: async (data: CreateExamPaperDto): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.post<ExamPaper>('/api/v1/exam-papers', data)
    return { data: paper }
  },

  generate: async (data: GeneratePaperDto): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.post<ExamPaper>('/api/v1/exam-papers/generate', data)
    return { data: paper }
  },

  update: async (id: string, data: UpdateExamPaperDto): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.patch<ExamPaper>(`/api/v1/exam-papers/${id}`, data)
    return { data: paper }
  },

  duplicate: async (id: string, newTitle: string): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.post<ExamPaper>(`/api/v1/exam-papers/${id}/duplicate`, { newTitle })
    return { data: paper }
  },

  finalize: async (id: string): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.patch<ExamPaper>(`/api/v1/exam-papers/${id}/finalize`)
    return { data: paper }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/exam-papers/${id}`)
}
```

## File: src/features/exam-papers/types/exam-papers.ts
```typescript
import type { QuestionType, DifficultyLevel } from '@/constants/roles'

export const EXAM_TYPES = {
  MIDTERM: 'midterm',
  FINAL: 'final',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment'
} as const

export type ExamType = typeof EXAM_TYPES[keyof typeof EXAM_TYPES]

export type SubPaperQuestion = {
  _id: string
  questionId: string
  questionText: string
  questionType: string
  difficultyLevel: string
  marksAllocated: number
  subQuestionLabel: string
  subQuestionOrder: number
  subQuestionLevel: number
  subQuestions?: SubPaperQuestion[]
  createdAt: string
}

export type PaperQuestion = {
  _id: string
  questionId: string
  questionText: string
  questionType: string
  difficultyLevel: string
  questionOrder: number
  marksAllocated: number
  partLabel: string
  partTitle?: string
  isOptional: boolean
  subQuestionLevel: number
  subQuestions?: SubPaperQuestion[]
  createdAt: string
}

export type PaperPart = {
  partLabel: string
  partTitle: string
  partInstructions?: string
  partOrder: number
  totalMarks: number
  questionCount: number
  hasOptionalQuestions?: boolean
  minimumQuestionsToAnswer?: number
}

export type ExamPaper = {
  _id: string
  subjectId: string
  subjectCode?: string
  subjectName?: string
  paperTitle: string
  paperType: ExamType
  totalMarks: number
  durationMinutes: number
  formattedDuration: string
  instructions?: string
  createdBy: string
  createdByName?: string
  isFinalized: boolean
  finalizedAt?: string
  finalizedBy?: string
  versionNumber: number
  parentPaperId?: string
  isActive: boolean
  parts: PaperPart[]
  questions?: PaperQuestion[]
  questionCount?: number
  createdAt: string
  updatedAt: string
}

export type SubQuestionDto = {
  questionId: string
  marksAllocated: number
  subQuestionLabel: string
  subQuestionOrder: number
  subQuestions?: SubQuestionDto[]
}

export type PaperQuestionDto = {
  questionId: string
  questionOrder: number
  marksAllocated: number
  partLabel: string
  partTitle?: string
  isOptional?: boolean
  subQuestions?: SubQuestionDto[]
}

export type PaperPartDto = {
  partLabel: string
  partTitle: string
  partInstructions?: string
  partOrder: number
  hasOptionalQuestions?: boolean
  minimumQuestionsToAnswer?: number
}

export type CreateExamPaperDto = {
  subjectId: string
  paperTitle: string
  paperType: ExamType
  totalMarks: number
  durationMinutes: number
  instructions?: string
  parts: PaperPartDto[]
  questions: PaperQuestionDto[]
}

export type UpdateExamPaperDto = Partial<CreateExamPaperDto> & {
  isActive?: boolean
}

export type QuestionCriteriaDto = {
  topic?: string
  difficultyLevel?: DifficultyLevel
  questionType?: QuestionType
  count: number
  marksPerQuestion: number
  section?: string
}

export type GeneratePaperDto = {
  subjectId: string
  paperTitle: string
  paperType: ExamType
  durationMinutes: number
  instructions?: string
  questionCriteria: QuestionCriteriaDto[]
}

export type ExamPaperStats = {
  totalPapers: number
  finalizedPapers: number
  papersByType: Record<string, number>
  papersBySubject: Array<{ subjectName: string; count: number }>
  averageQuestionsPerPaper: number
  averageDuration: number
}

export type GetExamPapersParams = {
  subjectId?: string
  paperType?: ExamType
  isFinalized?: boolean
  isActive?: boolean
  myPapers?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type BackendExamPapersListResponse = {
  examPapers: ExamPaper[]
  total: number
  page: number
  limit: number
  totalPages: number
}
```

## File: src/features/questions/types/questions.ts
```typescript
import type { QuestionType, DifficultyLevel, BloomsTaxonomy } from '@/constants/roles'

export type SubQuestion = {
  _id: string
  questionText: string
  questionDescription?: string
  questionType: string
  marks: number
  subQuestionLabel: string
  subQuestionOrder: number
  subQuestionLevel: number
  subQuestions?: SubQuestion[]
  createdAt: string
  updatedAt: string
}

export type Question = {
  _id: string
  subjectId: string
  subjectCode?: string
  subjectName?: string
  questionText: string
  questionDescription?: string
  questionType: QuestionType
  difficultyLevel: DifficultyLevel
  marks: number
  topic?: string
  subtopic?: string
  bloomsTaxonomy?: BloomsTaxonomy
  keywords?: string
  usageCount: number
  isPublic: boolean
  createdBy: string
  createdByName?: string
  isActive: boolean
  hasSubQuestions: boolean
  subQuestionLevel: number
  options?: QuestionOption[]
  subQuestions?: SubQuestion[]
  createdAt: string
  updatedAt: string
}

export type QuestionOption = {
  _id: string
  optionText: string
  isCorrect: boolean
  optionOrder: number
  createdAt: string
}

export type CreateSubQuestionDto = {
  questionText: string
  questionDescription?: string
  questionType: QuestionType
  marks: number
  subQuestionLabel: string
  subQuestionOrder: number
  subQuestions?: CreateSubQuestionDto[]
}

export type CreateQuestionDto = {
  subjectId: string
  questionText: string
  questionDescription?: string
  questionType: QuestionType
  difficultyLevel: DifficultyLevel
  marks: number
  topic?: string
  subtopic?: string
  bloomsTaxonomy?: BloomsTaxonomy
  keywords?: string
  isPublic?: boolean
  options?: Array<{
    optionText: string
    isCorrect: boolean
    optionOrder: number
  }>
  subQuestions?: CreateSubQuestionDto[]
}

export type UpdateQuestionDto = Partial<Omit<CreateQuestionDto, 'subjectId'>> & {
  isActive?: boolean
}

export type QuestionStats = {
  totalQuestions: number
  activeQuestions: number
  publicQuestions: number
  questionsByType: Record<string, number>
  questionsByDifficulty: Record<string, number>
  questionsBySubject: Array<{ subjectName: string; count: number }>
}

export type GetQuestionsParams = {
  subjectId?: string
  questionType?: QuestionType
  difficultyLevel?: DifficultyLevel
  topic?: string
  isPublic?: boolean
  isActive?: boolean
  myQuestions?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type BackendQuestionsListResponse = {
  questions: Question[]
  total: number
  page: number
  limit: number
  totalPages: number
}
```

## File: src/features/questions/validations/question-schemas.ts
```typescript
// src/features/questions/validations/question-schemas.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod'
import { QUESTION_TYPES, DIFFICULTY_LEVELS, BLOOMS_TAXONOMY } from '@/constants/roles'

const questionOptionSchema = z.object({
  optionText: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
  optionOrder: z.number().int().min(1)
})

const subQuestionSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    questionText: z.string().min(3, 'Question text must be at least 3 characters'),
    questionDescription: z.string().optional(),
    questionType: z.enum([
      QUESTION_TYPES.MCQ,
      QUESTION_TYPES.SHORT_ANSWER,
      QUESTION_TYPES.LONG_ANSWER,
      QUESTION_TYPES.FILL_BLANK,
      QUESTION_TYPES.TRUE_FALSE
    ]),
    marks: z.number().min(0.5, 'Marks must be at least 0.5').max(100, 'Marks cannot exceed 100'),
    subQuestionLabel: z.string().min(1, 'Sub-question label is required'),
    subQuestionOrder: z.number().int().min(1),
    subQuestions: z.array(subQuestionSchema).optional()
  })
)

export const createQuestionSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  questionText: z.string().min(10, 'Question text must be at least 10 characters'),
  questionDescription: z.string().optional(),
  questionType: z.enum([
    QUESTION_TYPES.MCQ,
    QUESTION_TYPES.SHORT_ANSWER,
    QUESTION_TYPES.LONG_ANSWER,
    QUESTION_TYPES.FILL_BLANK,
    QUESTION_TYPES.TRUE_FALSE,
    QUESTION_TYPES.STRUCTURED
  ]),
  difficultyLevel: z.enum([
    DIFFICULTY_LEVELS.EASY,
    DIFFICULTY_LEVELS.MEDIUM,
    DIFFICULTY_LEVELS.HARD
  ]),
  marks: z.number().min(0.5, 'Marks must be at least 0.5').max(100, 'Marks cannot exceed 100'),
  topic: z.string().optional(),
  subtopic: z.string().optional(),
  bloomsTaxonomy: z.enum([
    BLOOMS_TAXONOMY.REMEMBER,
    BLOOMS_TAXONOMY.UNDERSTAND,
    BLOOMS_TAXONOMY.APPLY,
    BLOOMS_TAXONOMY.ANALYZE,
    BLOOMS_TAXONOMY.EVALUATE,
    BLOOMS_TAXONOMY.CREATE
  ]).optional(),
  keywords: z.string().optional(),
  isPublic: z.boolean().optional(),
  options: z.array(questionOptionSchema).optional(),
  subQuestions: z.array(subQuestionSchema).optional()
}).refine((data) => {
  // MCQ and True/False must have at least 2 options
  if (data.questionType === QUESTION_TYPES.MCQ || data.questionType === QUESTION_TYPES.TRUE_FALSE) {
    return data.options && data.options.length >= 2
  }
  return true
}, {
  message: "MCQ and True/False questions must have at least 2 options",
  path: ["options"]
}).refine((data) => {
  // MCQ must have at least one correct answer
  if (data.questionType === QUESTION_TYPES.MCQ && data.options) {
    return data.options.some(opt => opt.isCorrect)
  }
  return true
}, {
  message: "MCQ must have at least one correct answer",
  path: ["options"]
})

// Note: Sub-questions are now optional for structured/essay questions
// Users can create structured questions without sub-parts if they prefer

export const updateQuestionSchema = createQuestionSchema.partial().omit({ subjectId: true }).extend({
  isActive: z.boolean().optional()
})

export type CreateQuestionFormData = z.infer<typeof createQuestionSchema>
export type UpdateQuestionFormData = z.infer<typeof updateQuestionSchema>
```

## File: src/features/subjects/components/faculty-subject-columns.tsx
```typescript
'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontalIcon, EyeIcon, HelpCircleIcon, FileTextIcon, UsersIcon } from 'lucide-react'
import type { Subject } from '../types/subjects'

type FacultySubjectColumnsProps = {
  onView: (subject: Subject) => void
  onManageQuestions: (subject: Subject) => void
  onManagePapers: (subject: Subject) => void
}

export const getFacultySubjectColumns = ({ 
  onView, 
  onManageQuestions, 
  onManagePapers 
}: FacultySubjectColumnsProps): ColumnDef<Subject>[] => [
  {
    accessorKey: 'subjectCode',
    header: 'Code',
    cell: ({ row }) => (
      <div className="font-mono font-semibold text-primary">
        {row.original.subjectCode}
      </div>
    ),
  },
  {
    accessorKey: 'subjectName',
    header: 'Subject Name',
    cell: ({ row }) => (
      <div className="font-medium max-w-xs truncate">{row.original.subjectName}</div>
    ),
  },
  {
    accessorKey: 'departmentName',
    header: 'Department',
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.departmentName || '—'}
      </div>
    ),
  },
  {
    accessorKey: 'licName',
    header: 'LIC',
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">{row.original.licName || '—'}</div>
    ),
  },
  {
    accessorKey: 'year',
    header: 'Year',
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono">
        Year {row.original.year}
      </Badge>
    ),
  },
  {
    accessorKey: 'credits',
    header: 'Credits',
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original.credits}
      </div>
    ),
  },
  {
    accessorKey: 'lecturerIds',
    header: 'Lecturers',
    cell: ({ row }) => (
      <div className="text-sm max-w-xs truncate">{(row.original.lecturers || []).map(l => l.fullName).join(', ') || '—'}</div>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const subject = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(subject)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onManageQuestions(subject)}>
              <HelpCircleIcon className="mr-2 h-4 w-4" />
              Manage Questions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onManagePapers(subject)}>
              <FileTextIcon className="mr-2 h-4 w-4" />
              Manage Exam Papers
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => window.open(`/faculty/subjects/${subject._id}/students`, '_blank')}
            >
              <UsersIcon className="mr-2 h-4 w-4" />
              View Students
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
```

## File: src/features/subjects/types/subjects.ts
```typescript
export type Subject = {
  _id: string
  subjectCode: string
  subjectName: string
  departmentId: string
  departmentName?: string
  year: number
  credits: number
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  licId?: string
  licName?: string
  lecturerIds?: string[]
  lecturers?: { _id: string; fullName: string }[]
}

export type CreateSubjectDto = {
  subjectCode: string
  subjectName: string
  departmentId: string
  year: number
  credits?: number
  description?: string
  licId?: string
  lecturerIds?: string[]
}

export type UpdateSubjectDto = Partial<Omit<CreateSubjectDto, 'subjectCode'>> & {
  isActive?: boolean
}

export type AssignFacultyDto = {
  facultyId: string
  academicYear: string
  semester: number
  isCoordinator: boolean
  assignedDate: string
}

export type FacultyAssignment = {
  _id: string
  facultyId: string
  facultyName: string
  academicYear: string
  semester: number
  isCoordinator: boolean
  assignedDate: string
}

export type SubjectStats = {
  totalSubjects: number
  subjectsByDepartment: Record<string, number>
  subjectsByYear: Record<string, number>
}

export type GetSubjectsParams = {
  departmentId?: string
  year?: number
  isActive?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
```

## File: src/features/subjects/validations/subject-schemas.ts
```typescript
import { z } from 'zod'

export const createSubjectSchema = z.object({
  subjectCode: z.string()
    .min(2, 'Subject code must be at least 2 characters')
    .max(20, 'Subject code must be less than 20 characters')
    .regex(/^[A-Z0-9\-]+$/, 'Subject code must contain only uppercase letters, numbers, and hyphens'),
  subjectName: z.string()
    .min(3, 'Subject name must be at least 3 characters')
    .max(200, 'Subject name must be less than 200 characters'),
  departmentId: z.string()
    .min(1, 'Department is required'),
  year: z.coerce.number()
    .int('Year must be an integer')
    .min(1, 'Year must be at least 1')
    .max(6, 'Year must be at most 6'),
  credits: z.coerce.number()
    .min(0, 'Credits must be at least 0')
    .max(10, 'Credits must be at most 10')
    .optional()
    .default(3),
  description: z.string().optional()
  ,
  licId: z.string().optional(),
  lecturerIds: z.array(z.string()).optional()
})

export const updateSubjectSchema = createSubjectSchema.partial().omit({ subjectCode: true }).extend({
  isActive: z.boolean().optional()
})

export type CreateSubjectFormData = z.infer<typeof createSubjectSchema>
export type UpdateSubjectFormData = z.infer<typeof updateSubjectSchema>
```

## File: src/app/layout.tsx
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { AuthProvider } from '@/lib/auth/auth-provider'
import { QueryProvider } from '@/lib/providers/query-provider'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "University Management System",
  description: "Comprehensive university exam management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <NuqsAdapter>
              {children}
              <Toaster position="top-right" />
            </NuqsAdapter>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

## File: src/constants/routes.ts
```typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    DEPARTMENTS: '/admin/departments',
    SUBJECTS: '/admin/subjects',
    ROOMS: '/admin/rooms',
    REPORTS: '/admin/reports',
    CALENDAR: '/admin/calendar',
    ENROLLMENTS: '/admin/enrollments',

    GENERATE_REPORT: '/admin/reports/generate',
  },
  
  FACULTY: {
    ROOT: '/faculty',
    DASHBOARD: '/faculty/dashboard',
    SUBJECTS: '/faculty/subjects',
    QUESTIONS: '/faculty/questions',
    EXAM_PAPERS: '/faculty/exam-papers',
    RESULTS: '/faculty/results',
    ASSIGNMENTS: '/faculty/assignments'
  },
  
  STUDENT: {
    ROOT: '/student',
    DASHBOARD: '/student/dashboard',
    ENROLLMENTS: '/student/enrollments',
    EXAMS: '/student/exams',
    RESULTS: '/student/results',
    NOTIFICATIONS: '/student/notifications'
  },
  
  EXAM_COORDINATOR: {
    ROOT: '/exam-coordinator',
    DASHBOARD: '/exam-coordinator/dashboard',
    EXAM_SESSIONS: '/exam-coordinator/exam-sessions',
    REGISTRATIONS: '/exam-coordinator/registrations',
    ROOMS: '/exam-coordinator/rooms',
    ASSIGNMENTS: '/exam-coordinator/assignments'
  },
  
  INVIGILATOR: {
    ROOT: '/invigilator',
    DASHBOARD: '/invigilator/dashboard',
    ASSIGNMENTS: '/invigilator/assignments'
  }
} as const
```

## File: src/features/exam-papers/components/exam-paper-form.tsx
```typescript
// src/features/exam-papers/components/exam-paper-form.tsx
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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
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
      parts: [
        {
          partLabel: 'A',
          partTitle: 'Multiple Choice Questions',
          partOrder: 1,
          hasOptionalQuestions: false
        }
      ],
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
    if (existingQuestion) {
      return
    }

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
    return questionFields.reduce((sum, field) => {
      return sum + (field.marksAllocated || 0)
    }, 0)
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
        {/* Info Alert */}
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Creating Exam Papers</AlertTitle>
          <AlertDescription>
            Add questions from your question bank to different parts of the paper. 
            Questions with sub-parts will automatically include their nested structure in the paper.
          </AlertDescription>
        </Alert>

        {/* Basic Information */}
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
                  <FormLabel>General Instructions (Optional)</FormLabel>
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

        {/* Paper Parts/Sections */}
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
                            <Input placeholder="A, B, C..." className="font-mono uppercase" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
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
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
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

        {/* Questions */}
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
                          <Badge variant="outline" className="font-mono">
                            Part {part.partLabel}
                          </Badge>
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
                                    <Badge variant="outline" className="font-mono text-xs">
                                      Q{index + 1}
                                    </Badge>
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
                                          <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
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

        {/* Form Actions */}
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
```

## File: src/features/questions/components/question-form.tsx
```typescript
'use client'

import { JSX, useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  PlusIcon, 
  TrashIcon, 
  ChevronDownIcon, 
  ChevronRightIcon,
  InfoIcon,
  CheckCircle2Icon,
  AlertCircleIcon
} from 'lucide-react'
import { QUESTION_TYPES, DIFFICULTY_LEVELS, BLOOMS_TAXONOMY } from '@/constants/roles'
import { createQuestionSchema, updateQuestionSchema, type CreateQuestionFormData, type UpdateQuestionFormData } from '../validations/question-schemas'
import type { Question, CreateSubQuestionDto } from '../types/questions'
import { useMySubjectsQuery, useSubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { useAuth } from '@/lib/auth/auth-provider'
import { USER_ROLES } from '@/constants/roles'
import { cn } from '@/lib/utils'

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

type SubQuestionField = CreateSubQuestionDto & { id: string }

const getLabelForLevel = (level: number, order: number): string => {
  if (level === 0) {
    return String.fromCharCode(65 + order - 1)
  } else if (level === 1) {
    const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii']
    return romanNumerals[order - 1] || `(${order})`
  } else {
    return String.fromCharCode(97 + order - 1)
  }
}

const convertSubQuestion = (sq: Question['subQuestions'][0]): CreateSubQuestionDto => ({
  questionText: sq.questionText,
  questionDescription: sq.questionDescription,
  questionType: sq.questionType,
  marks: sq.marks || 0,
  subQuestionLabel: sq.subQuestionLabel,
  subQuestionOrder: sq.subQuestionOrder,
  subQuestions: sq.subQuestions?.map(convertSubQuestion)
})

export const QuestionForm = ({ question, onSubmit, onCancel, isLoading }: QuestionFormProps) => {
  const isEditMode = !!question
  const [selectedType, setSelectedType] = useState<string>(question?.questionType || QUESTION_TYPES.MCQ)
  const [subQuestionFields, setSubQuestionFields] = useState<SubQuestionField[]>([])
  const [expandedSubQuestions, setExpandedSubQuestions] = useState<Set<string>>(new Set())

  const { user } = useAuth()
  const { data: allSubjectsData, isLoading: isLoadingAllSubjects } = useSubjectsQuery({ isActive: true })
  const { data: mySubjectsData, isLoading: isLoadingMySubjects } = useMySubjectsQuery({ isActive: true })
  const isFaculty = user?.role === USER_ROLES.FACULTY
  const subjects = (isFaculty ? mySubjectsData?.data : allSubjectsData?.data) || []

  const needsOptions = selectedType === QUESTION_TYPES.MCQ || selectedType === QUESTION_TYPES.TRUE_FALSE
  const canHaveSubQuestions = selectedType === QUESTION_TYPES.STRUCTURED || selectedType === QUESTION_TYPES.LONG_ANSWER

  const calculateTotalMarks = useMemo(() => {
    const calculateSubMarks = (sqs: SubQuestionField[]): number => {
      return sqs.reduce((sum, sq) => {
        let total = sq.marks || 0
        if (sq.subQuestions && sq.subQuestions.length > 0) {
          total += calculateSubMarks(sq.subQuestions as SubQuestionField[])
        }
        return sum + total
      }, 0)
    }

    return calculateSubMarks(subQuestionFields)
  }, [subQuestionFields])

  const form = useForm<CreateQuestionFormData | UpdateQuestionFormData>({
    resolver: zodResolver(isEditMode ? updateQuestionSchema : createQuestionSchema),
    mode: 'onChange',
    defaultValues: {
      ...(isEditMode ? {} : { subjectId: '' }),
      questionText: '',
      questionDescription: '',
      questionType: QUESTION_TYPES.MCQ,
      difficultyLevel: DIFFICULTY_LEVELS.MEDIUM,
      marks: 0,
      topic: '',
      subtopic: '',
      bloomsTaxonomy: BLOOMS_TAXONOMY.UNDERSTAND,
      keywords: '',
      isPublic: true,
      options: [
        { optionText: '', isCorrect: false, optionOrder: 1 },
        { optionText: '', isCorrect: false, optionOrder: 2 }
      ],
      subQuestions: []
    }
  })

  useEffect(() => {
    if (question) {
      const baseFormData = {
        questionText: question.questionText,
        questionDescription: question.questionDescription || '',
        questionType: question.questionType,
        difficultyLevel: question.difficultyLevel,
        marks: question.marks || 0,
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
            ],
        subQuestions: question.subQuestions?.map(convertSubQuestion) || []
      }

      if (isEditMode) {
        form.reset(baseFormData)
      } else {
        form.reset({
          ...baseFormData,
          subjectId: question.subjectId
        })
      }

      setSelectedType(question.questionType)
      
      if (question.subQuestions && question.subQuestions.length > 0) {
        const converted = question.subQuestions.map((sq, idx) => ({
          ...convertSubQuestion(sq),
          id: `sq-${idx}-${Date.now()}`
        }))
        setSubQuestionFields(converted)
        
        const allIds = new Set<string>()
        const collectIds = (sqs: SubQuestionField[]) => {
          sqs.forEach(sq => {
            allIds.add(sq.id)
            if (sq.subQuestions) collectIds(sq.subQuestions as SubQuestionField[])
          })
        }
        collectIds(converted)
        setExpandedSubQuestions(allIds)
      }
    }
  }, [question, form, isEditMode])

  useEffect(() => {
    if (canHaveSubQuestions) {
      form.setValue('marks', calculateTotalMarks)
    }
  }, [canHaveSubQuestions, calculateTotalMarks, form])

  const handleSubmit = (data: CreateQuestionFormData | UpdateQuestionFormData) => {
    if (canHaveSubQuestions) {
      const formattedSubQuestions = subQuestionFields.map(sq => ({
        questionText: sq.questionText,
        questionDescription: sq.questionDescription,
        questionType: sq.questionType,
        marks: sq.marks || 0,
        subQuestionLabel: sq.subQuestionLabel,
        subQuestionOrder: sq.subQuestionOrder,
        subQuestions: sq.subQuestions
      }))

      data.subQuestions = formattedSubQuestions
      data.marks = calculateTotalMarks
    } else {
      data.subQuestions = undefined
    }

    if (!needsOptions) {
      data.options = undefined
    }

    if (isEditMode) {
      const { subjectId: _, ...updateData } = data as CreateQuestionFormData
      onSubmit(updateData as UpdateQuestionFormData)
    } else {
      onSubmit(data as CreateQuestionFormData)
    }
  }

  const addSubQuestion = (parentId?: string, level: number = 0) => {
    if (level >= 3) return

    const countAtLevel = (sqs: SubQuestionField[], targetParent?: string): number => {
      if (!targetParent) {
        return subQuestionFields.length
      }
      
      let count = 0
      const traverse = (items: SubQuestionField[]) => {
        items.forEach(sq => {
          if (sq.id === targetParent && sq.subQuestions) {
            count = sq.subQuestions.length
          }
          if (sq.subQuestions) traverse(sq.subQuestions as SubQuestionField[])
        })
      }
      traverse(sqs)
      return count
    }

    const currentCount = countAtLevel(subQuestionFields, parentId)
    const newOrder = currentCount + 1
    const autoLabel = getLabelForLevel(level, newOrder)

    const newSubQuestion: SubQuestionField = {
      id: `sq-${Date.now()}-${Math.random()}`,
      questionText: '',
      questionDescription: '',
      questionType: QUESTION_TYPES.SHORT_ANSWER,
      marks: 0,
      subQuestionLabel: autoLabel,
      subQuestionOrder: newOrder,
      subQuestions: []
    }

    if (!parentId) {
      setSubQuestionFields([...subQuestionFields, newSubQuestion])
    } else {
      const updateSubQuestions = (sqs: SubQuestionField[]): SubQuestionField[] => {
        return sqs.map(sq => {
          if (sq.id === parentId) {
            return {
              ...sq,
              subQuestions: [...(sq.subQuestions || []), newSubQuestion]
            }
          }
          if (sq.subQuestions && sq.subQuestions.length > 0) {
            return {
              ...sq,
              subQuestions: updateSubQuestions(sq.subQuestions as SubQuestionField[])
            }
          }
          return sq
        })
      }
      setSubQuestionFields(updateSubQuestions(subQuestionFields))
    }
    
    setExpandedSubQuestions(new Set([...expandedSubQuestions, newSubQuestion.id]))
  }

  const removeSubQuestion = (id: string) => {
    const filterSubQuestions = (sqs: SubQuestionField[]): SubQuestionField[] => {
      return sqs
        .filter(sq => sq.id !== id)
        .map(sq => ({
          ...sq,
          subQuestions: sq.subQuestions ? filterSubQuestions(sq.subQuestions as SubQuestionField[]) : []
        }))
    }
    setSubQuestionFields(filterSubQuestions(subQuestionFields))
    
    const newExpanded = new Set(expandedSubQuestions)
    newExpanded.delete(id)
    setExpandedSubQuestions(newExpanded)
  }

  const updateSubQuestion = (id: string, field: keyof SubQuestionField, value: string | number) => {
    const updateSubQuestions = (sqs: SubQuestionField[]): SubQuestionField[] => {
      return sqs.map(sq => {
        if (sq.id === id) {
          return { ...sq, [field]: value }
        }
        if (sq.subQuestions && sq.subQuestions.length > 0) {
          return {
            ...sq,
            subQuestions: updateSubQuestions(sq.subQuestions as SubQuestionField[])
          }
        }
        return sq
      })
    }
    setSubQuestionFields(updateSubQuestions(subQuestionFields))
  }

  const toggleSubQuestion = (id: string) => {
    const newExpanded = new Set(expandedSubQuestions)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedSubQuestions(newExpanded)
  }

  const validateOptions = (): boolean => {
    if (!needsOptions) return true
    
    const options = form.watch('options') || []
    if (options.length < 2) return false
    
    const hasText = options.every(opt => opt.optionText.trim().length > 0)
    if (!hasText) return false
    
    if (selectedType === QUESTION_TYPES.MCQ) {
      return options.some(opt => opt.isCorrect)
    }
    
    return true
  }

  const validateSubQuestionsStructure = (): boolean => {
    if (!canHaveSubQuestions) return true

    const validateFields = (sqs: SubQuestionField[]): boolean => {
      return sqs.every(sq => {
        const hasText = sq.questionText.trim().length >= 3
        const hasValidType = Boolean(sq.questionType)
        const hasValidLabel = Boolean(sq.subQuestionLabel)
        
        let childrenValid = true
        if (sq.subQuestions && sq.subQuestions.length > 0) {
          childrenValid = validateFields(sq.subQuestions as SubQuestionField[])
        }
        
        return hasText && hasValidType && hasValidLabel && childrenValid
      })
    }

    if (subQuestionFields.length === 0) return true
    return validateFields(subQuestionFields)
  }

  const renderSubQuestionForm = (sq: SubQuestionField, level: number = 0, parentLabel: string = ''): JSX.Element => {
    const isExpanded = expandedSubQuestions.has(sq.id)
    const fullLabel = parentLabel ? `${parentLabel}.${sq.subQuestionLabel}` : sq.subQuestionLabel
    const canAddMore = level < 2

    const levelColors = [
      'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
      'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
      'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950'
    ]

    const levelBadgeColors = [
      'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
    ]

    return (
      <div key={sq.id} className={cn("rounded-lg border-2", level > 0 && "ml-6 mt-3", levelColors[level])}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleSubQuestion(sq.id)}
                className="h-8 px-2"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </Button>
              <Badge variant="outline" className={cn("font-mono font-bold", levelBadgeColors[level])}>
                {fullLabel}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {sq.marks > 0 ? `(${sq.marks} marks)` : '(No marks)'}
              </span>
            </div>
            <div className="flex gap-2">
              {canAddMore && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addSubQuestion(sq.id, level + 1)}
                  className="h-8"
                >
                  <PlusIcon className="h-3 w-3 mr-1" />
                  Add Sub-part
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSubQuestion(sq.id)}
                className="h-8 text-destructive hover:text-destructive"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-3 pt-3 border-t">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium">Label *</label>
                  <Input
                    value={sq.subQuestionLabel}
                    onChange={(e) => updateSubQuestion(sq.id, 'subQuestionLabel', e.target.value)}
                    placeholder="e.g., A, i, a"
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Marks *</label>
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={sq.marks || ''}
                    onChange={(e) => updateSubQuestion(sq.id, 'marks', e.target.value ? parseFloat(e.target.value) : 0)}
                    placeholder="0"
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Type *</label>
                  <Select
                    value={sq.questionType}
                    onValueChange={(value) => updateSubQuestion(sq.id, 'questionType', value)}
                  >
                    <SelectTrigger className="mt-1 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={QUESTION_TYPES.SHORT_ANSWER}>Short Answer</SelectItem>
                      <SelectItem value={QUESTION_TYPES.LONG_ANSWER}>Long Answer</SelectItem>
                      <SelectItem value={QUESTION_TYPES.MCQ}>MCQ</SelectItem>
                      <SelectItem value={QUESTION_TYPES.FILL_BLANK}>Fill Blank</SelectItem>
                      <SelectItem value={QUESTION_TYPES.TRUE_FALSE}>True/False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium">Question Text *</label>
                <Textarea
                  value={sq.questionText}
                  onChange={(e) => updateSubQuestion(sq.id, 'questionText', e.target.value)}
                  placeholder="Enter the question or instruction"
                  className="mt-1 min-h-[70px]"
                />
              </div>

              <div>
                <label className="text-xs font-medium">Additional Instructions (Optional)</label>
                <Textarea
                  value={sq.questionDescription || ''}
                  onChange={(e) => updateSubQuestion(sq.id, 'questionDescription', e.target.value)}
                  placeholder="Additional context or instructions"
                  className="mt-1 min-h-[50px]"
                />
              </div>
            </div>
          )}
        </div>

        {sq.subQuestions && sq.subQuestions.length > 0 && (
          <div className="px-4 pb-4">
            {sq.subQuestions.map((subSq) => renderSubQuestionForm(subSq as SubQuestionField, level + 1, fullLabel))}
          </div>
        )}
      </div>
    )
  }

  if (isLoadingAllSubjects || isLoadingMySubjects) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const formErrors = form.formState.errors
  const hasOptionErrors = needsOptions && !validateOptions()
  const hasSubQuestionErrors = canHaveSubQuestions && !validateSubQuestionsStructure()
  const totalMarks = canHaveSubQuestions ? calculateTotalMarks : (form.watch('marks') || 0)
  const hasMarksError = totalMarks <= 0
  
  const validationErrors: string[] = []
  
  if (formErrors.subjectId?.message) validationErrors.push(`Subject: ${formErrors.subjectId.message}`)
  if (formErrors.questionText?.message) validationErrors.push(`Question Text: ${formErrors.questionText.message}`)
  if (formErrors.questionType?.message) validationErrors.push(`Question Type: ${formErrors.questionType.message}`)
  if (formErrors.difficultyLevel?.message) validationErrors.push(`Difficulty: ${formErrors.difficultyLevel.message}`)
  if (!canHaveSubQuestions && formErrors.marks?.message) validationErrors.push(`Marks: ${formErrors.marks.message}`)
  
  if (hasOptionErrors) validationErrors.push('Options: Please add at least 2 options with at least one correct answer')
  if (hasMarksError) validationErrors.push('Marks: Total marks must be greater than 0')
  if (hasSubQuestionErrors) validationErrors.push('Sub-questions: Some sub-questions are incomplete')
  
  const isFormValid = form.formState.isValid && 
    validateOptions() &&
    (totalMarks > 0) &&
    (!canHaveSubQuestions || validateSubQuestionsStructure())

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Question Creation</AlertTitle>
          <AlertDescription>
            For structured or essay questions, add multiple parts. Marks are automatically calculated from all sub-parts.
          </AlertDescription>
        </Alert>

        {validationErrors.length > 0 ? (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Please fix {validationErrors.length} issue{validationErrors.length !== 1 ? 's' : ''}</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle2Icon className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-200">Ready to submit</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              All validation passed. Total marks: {totalMarks}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isEditMode && (
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
              )}

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
                        <SelectItem value={QUESTION_TYPES.MCQ}>Multiple Choice</SelectItem>
                        <SelectItem value={QUESTION_TYPES.SHORT_ANSWER}>Short Answer</SelectItem>
                        <SelectItem value={QUESTION_TYPES.LONG_ANSWER}>Essay / Long Answer</SelectItem>
                        <SelectItem value={QUESTION_TYPES.STRUCTURED}>Structured (Multiple Parts)</SelectItem>
                        <SelectItem value={QUESTION_TYPES.FILL_BLANK}>Fill in the Blank</SelectItem>
                        <SelectItem value={QUESTION_TYPES.TRUE_FALSE}>True/False</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose Structured or Essay to add sub-parts
                    </FormDescription>
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
                  <FormLabel>Main Question Text *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={canHaveSubQuestions 
                        ? "e.g., 'Discuss the evolution of programming paradigms'" 
                        : "Enter the question text"
                      }
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
                      placeholder="Additional context or instructions"
                      className="min-h-[60px]"
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
                    <FormLabel>
                      {canHaveSubQuestions ? 'Total Marks (Calculated)' : 'Marks *'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        max={100}
                        step={0.5}
                        placeholder="0"
                        value={canHaveSubQuestions ? calculateTotalMarks : (field.value === 0 ? '' : field.value)}
                        onChange={(e) => {
                          if (!canHaveSubQuestions) {
                            const value = e.target.value
                            field.onChange(value === '' ? 0 : parseFloat(value))
                          }
                        }}
                        disabled={canHaveSubQuestions}
                        className={canHaveSubQuestions ? 'bg-muted' : ''}
                      />
                    </FormControl>
                    {canHaveSubQuestions && (
                      <FormDescription className="text-xs">
                        Auto-calculated from sub-parts
                      </FormDescription>
                    )}
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorization & Metadata</CardTitle>
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
                    <Input placeholder="Comma-separated keywords" {...field} />
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
          </CardContent>
        </Card>

        {needsOptions && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Answer Options</CardTitle>
                {selectedType === QUESTION_TYPES.MCQ && (form.watch('options')?.length || 0) < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentOptions = form.watch('options') || []
                      form.setValue('options', [
                        ...currentOptions,
                        { 
                          optionText: '', 
                          isCorrect: false, 
                          optionOrder: currentOptions.length + 1 
                        }
                      ])
                    }}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(form.watch('options') || []).map((_, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
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
                            placeholder={`Option ${String.fromCharCode(97 + index)})`}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedType === QUESTION_TYPES.MCQ && (form.watch('options')?.length || 0) > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const currentOptions = form.watch('options') || []
                        form.setValue('options', currentOptions.filter((_, i) => i !== index))
                      }}
                    >
                      <TrashIcon className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
              <p className="text-sm text-muted-foreground">
                ✓ Check the box next to the correct answer(s)
              </p>
            </CardContent>
          </Card>
        )}

        {canHaveSubQuestions && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Question Parts & Sub-parts</CardTitle>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                    <span className="font-semibold text-foreground">Total: {calculateTotalMarks} marks</span>
                    <span>•</span>
                    <span>{subQuestionFields.length} part{subQuestionFields.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => addSubQuestion()}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Part
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Structure:</strong> Level 1 (A, B, C) → Level 2 (i, ii, iii) → Level 3 (a, b, c)
                </AlertDescription>
              </Alert>

              {subQuestionFields.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <p className="text-muted-foreground font-medium">No parts added yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Click &ldquo;Add Part&rdquo; to create question parts
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {subQuestionFields.map((sq) => renderSubQuestionForm(sq, 0))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Separator />

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2">
            {isFormValid ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircle2Icon className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Form is valid</span>
              </div>
            ) : (
              <div className="flex items-center text-amber-600 dark:text-amber-400">
                <AlertCircleIcon className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{validationErrors.length} issue{validationErrors.length !== 1 ? 's' : ''} to fix</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Question' : 'Create Question'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
```

## File: src/features/questions/hooks/use-questions.ts
```typescript
import { apiClient } from '@/lib/api/client'
import type { 
  Question, 
  CreateQuestionDto, 
  UpdateQuestionDto, 
  QuestionStats, 
  GetQuestionsParams,
  BackendQuestionsListResponse
} from '../types/questions'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const questionsService = {
  getAll: async (params?: GetQuestionsParams): Promise<PaginatedResponse<Question>> => {
    const response = await apiClient.get<BackendQuestionsListResponse>('/api/v1/questions', { params })
    return {
      data: response.questions || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<Question>> => {
    const question = await apiClient.get<Question>(`/api/v1/questions/${id}`)
    return { data: question }
  },

  getBySubject: async (subjectId: string, params?: { includePrivate?: boolean }): Promise<ApiResponse<Question[]>> => {
    const questions = await apiClient.get<Question[]>(`/api/v1/questions/subject/${subjectId}`, { params })
    return {
      data: Array.isArray(questions) ? questions : []
    }
  },

  getStats: (): Promise<ApiResponse<QuestionStats>> =>
    apiClient.get('/api/v1/questions/stats'),

  create: async (data: CreateQuestionDto): Promise<ApiResponse<Question>> => {
    const question = await apiClient.post<Question>('/api/v1/questions', data)
    return { data: question }
  },

  update: async (id: string, data: UpdateQuestionDto): Promise<ApiResponse<Question>> => {
    const question = await apiClient.patch<Question>(`/api/v1/questions/${id}`, data)
    return { data: question }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/questions/${id}`)
}
```

## File: src/features/subjects/components/subject-columns.tsx
```typescript
'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon } from 'lucide-react'
import type { Subject } from '../types/subjects'

type SubjectColumnsProps = {
  onEdit: (subject: Subject) => void
  onDelete: (subject: Subject) => void
  onView: (subject: Subject) => void
}

export const getSubjectColumns = ({ onEdit, onDelete, onView }: SubjectColumnsProps): ColumnDef<Subject>[] => [
  {
    accessorKey: 'subjectCode',
    header: 'Code',
    cell: ({ row }) => (
      <div className="font-mono font-semibold text-primary">
        {row.original.subjectCode}
      </div>
    ),
  },
  {
    accessorKey: 'subjectName',
    header: 'Subject Name',
    cell: ({ row }) => (
      <div className="font-medium max-w-xs truncate">{row.original.subjectName}</div>
    ),
  },
  {
    accessorKey: 'departmentName',
    header: 'Department',
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.departmentName || '—'}
      </div>
    ),
  },
  {
    accessorKey: 'licName',
    header: 'LIC',
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">{row.original.licName || '—'}</div>
    ),
  },
  {
    accessorKey: 'year',
    header: 'Year',
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono">
        Year {row.original.year}
      </Badge>
    ),
  },
  {
    accessorKey: 'credits',
    header: 'Credits',
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original.credits}
      </div>
    ),
  },
  {
    accessorKey: 'lecturerIds',
    header: 'Lecturers',
    cell: ({ row }) => (
      <div className="text-sm max-w-xs truncate">
        {row.original.lecturers?.length
          ? row.original.lecturers.map(l => l.fullName).join(', ')
          : row.original.lecturerIds?.length
            ? `${row.original.lecturerIds.length} lecturer${row.original.lecturerIds.length > 1 ? 's' : ''}`
            : '—'}
      </div>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return date.toLocaleDateString()
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const subject = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(subject)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(subject)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(subject)}
              className="text-destructive focus:text-destructive"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
```

## File: src/features/subjects/components/subject-form.tsx
```typescript
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  createSubjectSchema,
  updateSubjectSchema,
  type CreateSubjectFormData,
  type UpdateSubjectFormData,
} from '../validations/subject-schemas'

import type { Subject } from '../types/subjects'
import type { User } from '@/features/users/types/users'
import type { Department } from '@/features/departments/types/departments'
import { useDepartmentsQuery, useDepartmentQuery } from '@/features/departments/hooks/use-departments-query'
import { useUsersQuery, useUserQuery } from '@/features/users/hooks/use-users-query'
import { usersService } from '@/features/users/hooks/use-users'
import { USER_ROLES } from '@/constants/roles'

type CreateSubjectFormProps = {
  subject?: never
  onSubmit: (data: CreateSubjectFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateSubjectFormProps = {
  subject: Subject
  onSubmit: (data: UpdateSubjectFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type SubjectFormProps = CreateSubjectFormProps | UpdateSubjectFormProps

export const SubjectForm = ({ subject, onSubmit, onCancel, isLoading }: SubjectFormProps) => {
  const isEditMode = !!subject

  const { data: departmentsData, isLoading: isDepartmentsLoading } = useDepartmentsQuery({ isActive: true })
  const { data: facultyData, isLoading: isFacultyLoading } = useUsersQuery({ role: USER_ROLES.FACULTY, isActive: true })

  const extractId = (v?: string | { _id?: string; id?: string } | null): string | undefined => {
    if (!v) return undefined
    if (typeof v === 'string') return v
    return v._id ?? v.id ?? undefined
  }

  const subjectDepartmentId = extractId(subject?.departmentId)
  const subjectLicId = extractId(subject?.licId)

  const { data: departmentResponse, isLoading: isDepartmentLoading } = useDepartmentQuery(subjectDepartmentId ?? undefined)
  const { data: licResponse, isLoading: isLicLoading } = useUserQuery(subjectLicId ?? undefined)

  const [extraLecturers, setExtraLecturers] = useState<User[]>([])
  const [isLoadingExtraLecturers, setIsLoadingExtraLecturers] = useState(false)
  const [licOpen, setLicOpen] = useState(false)
  const [lecturerQuery, setLecturerQuery] = useState('')

  const form = useForm<CreateSubjectFormData | UpdateSubjectFormData>({
    resolver: zodResolver(isEditMode ? updateSubjectSchema : createSubjectSchema) as unknown as Resolver<
      CreateSubjectFormData | UpdateSubjectFormData
    >,
    defaultValues: isEditMode
      ? {
          subjectName: '',
          departmentId: '',
          year: 1,
          credits: 3,
          description: '',
          licId: undefined,
          lecturerIds: [],
        }
      : {
          subjectCode: '',
          subjectName: '',
          departmentId: '',
          year: 1,
          credits: 3,
          description: '',
          licId: undefined,
          lecturerIds: [],
        },
  })

  const watchedLecturerIds = form.watch('lecturerIds')

  useEffect(() => {
    if (!subject || !subject.lecturerIds?.length) return

    const missingIds = subject.lecturerIds.map(extractId).filter(Boolean) as string[]
    const existing = new Set((facultyData?.data || []).map((u: User) => u._id))
    const toFetch = missingIds.filter((id) => !existing.has(id))

    if (toFetch.length > 0) {
      setIsLoadingExtraLecturers(true)
      Promise.all(
        toFetch.map((id) => usersService.getById(id).then((r) => r.data).catch(() => null))
      )
        .then((res) => {
          setExtraLecturers(res.filter(Boolean) as User[])
        })
        .finally(() => setIsLoadingExtraLecturers(false))
    }
  }, [subject, facultyData?.data])

  useEffect(() => {
    if (!isEditMode || !subject) return

    const readyToReset =
      !isDepartmentsLoading &&
      !isFacultyLoading &&
      (!subjectDepartmentId || !isDepartmentLoading) &&
      (!subjectLicId || !isLicLoading)

    if (readyToReset) {
      form.reset({
        subjectName: subject.subjectName,
        departmentId: subjectDepartmentId ?? '',
        year: subject.year,
        credits: subject.credits,
        description: subject.description || '',
        licId: subjectLicId ?? undefined,
        lecturerIds: subject.lecturerIds?.map(extractId).filter(Boolean) || [],
      })
    }
  }, [
    isEditMode,
    subject,
    isDepartmentsLoading,
    isFacultyLoading,
    isDepartmentLoading,
    isLicLoading,
    subjectDepartmentId,
    subjectLicId,
    form,
  ])

  const facultyOptions = useMemo(() => {
    const map = new Map<string, User>()
    ;(facultyData?.data || []).forEach((u) => map.set(u._id, u))
    if (licResponse?.data) map.set(licResponse.data._id, licResponse.data)
    extraLecturers.forEach((u) => map.set(u._id, u))
    return Array.from(map.values())
  }, [facultyData?.data, licResponse?.data, extraLecturers])

  const departmentOptions = useMemo(() => {
    const map = new Map<string, Department>()
    ;(departmentsData?.data || []).forEach((d) => map.set(d._id, d))
    if (departmentResponse?.data) map.set(departmentResponse.data._id, departmentResponse.data)
    if (subject?.departmentId && typeof subject.departmentId === 'object') {
      const deptObj = subject.departmentId as Department
      if (deptObj._id) map.set(deptObj._id, deptObj)
    }
    return Array.from(map.values())
  }, [departmentsData?.data, departmentResponse?.data, subject?.departmentId])

  const handleSubmit = (data: CreateSubjectFormData | UpdateSubjectFormData) => {
    isEditMode
      ? (onSubmit as (data: UpdateSubjectFormData) => void)(data as UpdateSubjectFormData)
      : (onSubmit as (data: CreateSubjectFormData) => void)(data as CreateSubjectFormData)
  }

  const isLoadingInitialData =
    isEditMode &&
    (isDepartmentsLoading ||
      isFacultyLoading ||
      (subjectDepartmentId && isDepartmentLoading) ||
      (subjectLicId && isLicLoading) ||
      isLoadingExtraLecturers)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Subject Information</h3>
          {isLoadingInitialData && (
            <div className="text-sm text-muted-foreground">Loading subject data...</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isEditMode && (
              <FormField
                control={form.control}
                name="subjectCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Code *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., CS101, MATH201"
                        {...field}
                        className="font-mono uppercase"
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormDescription>Unique code for the subject (uppercase)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="subjectName"
              render={({ field }) => (
                <FormItem className={!isEditMode ? '' : 'md:col-span-2'}>
                  <FormLabel>Subject Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Data Structures and Algorithms" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="licId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lecturer In Charge (LIC)</FormLabel>
                  <Popover open={licOpen} onOpenChange={setLicOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between" disabled={Boolean(isFacultyLoading || (isEditMode && subjectLicId && isLicLoading))}>
                        {field.value ? (facultyOptions.find((u) => u._id === field.value)?.fullName || 'Select LIC (optional)') : 'Select LIC (optional)'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search lecturers..." />
                        <CommandEmpty>No lecturer found.</CommandEmpty>
                        <CommandList>
                          {facultyOptions.map((u) => (
                            <CommandItem
                              key={u._id}
                              value={`${u.fullName} ${u.email}`}
                              onSelect={() => {
                                field.onChange(u._id)
                                setLicOpen(false)
                              }}
                            >
                              {u.fullName} ({u.email})
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Optional lecturer in charge for this subject</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Lecturers</FormLabel>
              <div className="mb-2">
                <Input placeholder="Search lecturers..." value={lecturerQuery} onChange={(e) => setLecturerQuery(e.target.value)} />
              </div>
              <div className="max-h-40 overflow-auto rounded border p-2">
                {isFacultyLoading || isLoadingExtraLecturers ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">Loading lecturers...</div>
                ) : facultyOptions.length > 0 ? (
                  facultyOptions
                    .filter((u) => {
                      const q = lecturerQuery.trim().toLowerCase()
                      if (!q) return true
                      return (
                        u.fullName.toLowerCase().includes(q) ||
                        (u.email || '').toLowerCase().includes(q)
                      )
                    })
                    .map((u) => (
                    <label
                      key={u._id}
                      className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-accent rounded px-2"
                    >
                      <input
                        type="checkbox"
                        checked={watchedLecturerIds?.includes(u._id) ?? false}
                        onChange={(e) => {
                          const current = form.getValues('lecturerIds') || []
                          if (e.target.checked) {
                            form.setValue('lecturerIds', [...current, u._id], { shouldDirty: true })
                          } else {
                            form.setValue(
                              'lecturerIds',
                              current.filter((id: string) => id !== u._id),
                              { shouldDirty: true }
                            )
                          }
                        }}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">
                        {u.fullName} ({u.email})
                      </span>
                    </label>
                    ))
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">No faculty available</div>
                )}
              </div>
              <FormDescription>Assign multiple lecturers to this subject</FormDescription>
            </FormItem>
          </div>

          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                  disabled={Boolean(isDepartmentsLoading || (isEditMode && subjectDepartmentId && isDepartmentLoading))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departmentOptions.length > 0 ? (
                      departmentOptions.map((department) => (
                        <SelectItem key={department._id} value={department._id}>
                          {department.departmentCode} - {department.departmentName}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        {isDepartmentsLoading ? 'Loading departments...' : 'No departments available'}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>Select the department this subject belongs to</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year *</FormLabel>
                  <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString() ?? undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          Year {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Which year is this subject offered in</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="credits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credits *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="3"
                    />
                  </FormControl>
                  <FormDescription>Credit hours for this subject</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter subject description (optional)" className="resize-none" rows={4} {...field} />
                </FormControl>
                <FormDescription>Brief description of the subject content and objectives</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isLoadingInitialData}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Subject' : 'Create Subject'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

## File: src/features/subjects/hooks/use-subjects-query.ts
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { subjectsService } from './use-subjects'
import type { GetSubjectsParams } from '../types/subjects'
import { useAuth } from '@/lib/auth/auth-provider'

export const useSubjectsQuery = (params?: GetSubjectsParams) => {
  return useQuery({
    queryKey: ['subjects', params],
    queryFn: () => subjectsService.getAll(params),
    staleTime: 30000,
  })
}

export const useSubjectQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['subjects', id],
    queryFn: async () => {
      if (!id) throw new Error('Subject ID is required')
      return await subjectsService.getById(id)
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useSubjectStatsQuery = () => {
  return useQuery({
    queryKey: ['subjects', 'stats'],
    queryFn: () => subjectsService.getStats(),
    staleTime: 60000,
  })
}

export const useFacultyAssignmentsQuery = (subjectId: string | undefined, params?: { academicYear?: string; semester?: number }) => {
  return useQuery({
    queryKey: ['subjects', subjectId, 'assignments', params],
    queryFn: async () => {
      if (!subjectId) throw new Error('Subject ID is required')
      return await subjectsService.getFacultyAssignments(subjectId, params)
    },
    enabled: !!subjectId && subjectId !== 'undefined',
    retry: 1,
  })
}

export const useSubjectsByDepartmentQuery = (departmentId: string | undefined) => {
  return useQuery({
    queryKey: ['subjects', 'department', departmentId],
    queryFn: async () => {
      if (!departmentId) throw new Error('Department ID is required')
      return await subjectsService.getByDepartment(departmentId)
    },
    enabled: !!departmentId && departmentId !== 'undefined',
    staleTime: 30000,
  })
}

export const useMySubjectsQuery = (params?: GetSubjectsParams) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subjects', 'my-subjects', user?._id, params],
    queryFn: async () => {
      if (!user?._id) throw new Error('User not authenticated');

      return await subjectsService.getMySubjects(params, user._id);
    },
    enabled: !!user?._id,
    staleTime: 30000,
  });
};
```

## File: src/features/subjects/hooks/use-subjects.ts
```typescript
import { apiClient } from '@/lib/api/client'
import type { 
  Subject, 
  CreateSubjectDto, 
  UpdateSubjectDto, 
  AssignFacultyDto,
  FacultyAssignment,
  SubjectStats, 
  GetSubjectsParams 
} from '../types/subjects'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

type BackendSubjectsListResponse = {
  subjects: RawSubject[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type RawSubject = Omit<Subject, 'departmentId' | 'departmentName'> & {
  departmentId: string | { _id: string; departmentCode: string; departmentName: string }
}

const extractDepartmentName = (departmentId: RawSubject['departmentId']): string | undefined => {
  if (!departmentId) return undefined
  
  if (typeof departmentId === 'object' && '_id' in departmentId) {
    return departmentId.departmentName
  }
  
  if (typeof departmentId === 'string' && departmentId.includes('departmentName')) {
    try {
      const match = departmentId.match(/departmentName:\s*'([^']+)'/)
      if (match?.[1]) return match[1]
    } catch {
      return undefined
    }
  }
  
  return undefined
}

const extractDepartmentId = (departmentId: RawSubject['departmentId']): string | undefined => {
  if (!departmentId) return undefined
  
  if (typeof departmentId === 'string' && !departmentId.includes('{')) {
    return departmentId
  }
  
  if (typeof departmentId === 'object' && '_id' in departmentId) {
    return departmentId._id
  }
  
  if (typeof departmentId === 'string' && departmentId.includes('ObjectId')) {
    try {
      const match = departmentId.match(/ObjectId\('([^']+)'\)/)
      if (match?.[1]) return match[1]
    } catch {
      return undefined
    }
  }
  
  return undefined
}

const transformSubject = (subj: RawSubject): Subject => {
  const departmentId = extractDepartmentId(subj.departmentId)
  const departmentName = (subj as Record<string, unknown>).departmentName as string | undefined || extractDepartmentName(subj.departmentId)
  
  let licId: string | undefined = undefined
  let licName: string | undefined = undefined
  
  if (subj['licId']) {
    const lic = subj['licId'] as Record<string, unknown>
    if (typeof lic === 'string') {
      licId = lic
    } else if (lic?._id) {
      licId = lic._id as string
      licName = lic.fullName as string
    }
  }
  
  if (!licName && (subj as Record<string, unknown>).licName) {
    licName = (subj as Record<string, unknown>).licName as string
  }

  let lecturerIds: string[] | undefined = undefined
  let lecturers: { _id: string; fullName: string }[] | undefined = undefined
  
  if (Array.isArray(subj['lecturerIds'])) {
    const arr = subj['lecturerIds'] as Record<string, unknown>[]
    lecturerIds = arr.map((x) => (x?._id ? String(x._id) : String(x)))
    
    if (arr.length > 0 && arr[0]?._id) {
      lecturers = arr.map((x) => ({ 
        _id: String(x._id), 
        fullName: x.fullName as string 
      }))
    } else if ((subj as Record<string, unknown>).lecturers && Array.isArray((subj as Record<string, unknown>).lecturers)) {
      const subjLecturers = (subj as Record<string, unknown>).lecturers as Record<string, unknown>[]
      lecturers = subjLecturers.map((x) => ({ 
        _id: x._id?.toString() ?? String(x._id), 
        fullName: x.fullName as string 
      }))
    }
  }

  return {
    ...subj,
    departmentId: departmentId || '',
    departmentName,
    licId,
    licName,
    lecturerIds,
    lecturers
  }
}

export const subjectsService = {
  getAll: async (params?: GetSubjectsParams): Promise<PaginatedResponse<Subject>> => {
    const response = await apiClient.get<BackendSubjectsListResponse>('/api/v1/subjects', { params })
    return {
      data: (response.subjects || []).map(transformSubject),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<Subject>> => {
    const subject = await apiClient.get<RawSubject>(`/api/v1/subjects/${id}`)
    return {
      data: transformSubject(subject)
    }
  },

  getByDepartment: async (departmentId: string): Promise<ApiResponse<Subject[]>> => {
    const subjects = await apiClient.get<RawSubject[]>(`/api/v1/subjects/department/${departmentId}`)
    return {
      data: Array.isArray(subjects) ? subjects.map(transformSubject) : []
    }
  },

  getStats: (): Promise<ApiResponse<SubjectStats>> =>
    apiClient.get('/api/v1/subjects/stats'),

  create: async (data: CreateSubjectDto): Promise<ApiResponse<Subject>> => {
    const subject = await apiClient.post<RawSubject>('/api/v1/subjects', data)
    return {
      data: transformSubject(subject)
    }
  },

  update: async (id: string, data: UpdateSubjectDto): Promise<ApiResponse<Subject>> => {
    const subject = await apiClient.patch<RawSubject>(`/api/v1/subjects/${id}`, data)
    return {
      data: transformSubject(subject)
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/subjects/${id}`),

  assignFaculty: (id: string, data: AssignFacultyDto): Promise<ApiResponse<FacultyAssignment>> =>
    apiClient.post(`/api/v1/subjects/${id}/assign-faculty`, data),

  getFacultyAssignments: (id: string, params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<FacultyAssignment[]>> =>
    apiClient.get(`/api/v1/subjects/${id}/faculty`, { params }),

  getMyAssignments: (params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<FacultyAssignment[]>> =>
    apiClient.get('/api/v1/subjects/my', { params }),

  getMySubjects: async (params?: GetSubjectsParams, userId?: string): Promise<PaginatedResponse<Subject>> => {
    const resp = await apiClient.get<FacultyAssignment[]>('/api/v1/subjects/my')
    const assignments = Array.isArray(resp) ? resp : []

    let subjects: Subject[] = []
    
    if (assignments.length === 0 && userId) {
      const all = await apiClient.get<BackendSubjectsListResponse>('/api/v1/subjects', { 
        params: { page: 1, limit: 2000 } 
      })
      const rawSubjects = Array.isArray(all.subjects) ? all.subjects : []
      subjects = rawSubjects.map(transformSubject).filter((s) => {
        if (s.licId && s.licId === userId) return true
        if (Array.isArray(s.lecturerIds) && s.lecturerIds.includes(userId)) return true
        return false
      })
    } else {
      subjects = assignments.map((a: Record<string, unknown>) => {
        const s = (a.subjectId || {}) as Record<string, unknown>
        const raw: RawSubject = {
          _id: (s._id ?? s.subjectId ?? '') as string,
          subjectCode: (s.subjectCode ?? '') as string,
          subjectName: (s.subjectName ?? '') as string,
          departmentId: (s.departmentId && (typeof s.departmentId === 'string' || (s.departmentId as Record<string, unknown>)._id)) 
            ? s.departmentId as RawSubject['departmentId']
            : '',
          year: (s.year ?? 0) as number,
          credits: (s.credits ?? 0) as number,
          description: s.description as string | undefined,
          isActive: (s.isActive ?? true) as boolean,
          createdAt: (s.createdAt ?? new Date().toISOString()) as string,
          updatedAt: (s.updatedAt ?? new Date().toISOString()) as string,
        }
        return transformSubject(raw)
      })
    }

    const page = params?.page ?? 1
    const limit = params?.limit ?? 10
    const total = subjects.length
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const start = (page - 1) * limit
    const paged = subjects.slice(start, start + limit)

    return {
      data: paged,
      total,
      page,
      limit,
      totalPages,
    }
  },

  removeFacultyAssignment: (assignmentId: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/subjects/faculty-assignment/${assignmentId}`)
}
```
