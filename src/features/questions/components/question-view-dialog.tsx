/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import type { Question } from '../types/questions'
import { CheckCircleIcon, CircleIcon, ListTreeIcon } from 'lucide-react'

type QuestionViewDialogProps = {
  question: Question | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const QuestionViewDialog = ({ question, open, onOpenChange }: QuestionViewDialogProps) => {
  if (!question) return null

  const formatQuestionType = (type: string) => {
    const typeMap: Record<string, string> = {
      mcq: 'Multiple Choice (MCQ)',
      structured: 'Structured Question',
      essay: 'Essay Question',
      short_answer: 'Short Answer',
      long_answer: 'Long Answer',
      fill_blank: 'Fill in the Blank',
    }
    return typeMap[type] || type
  }

  const renderSubQuestions = (subQuestions: any[], level = 1) => {
    if (!subQuestions || subQuestions.length === 0) return null

    return (
      <div className={`space-y-3 ${level > 1 ? 'ml-6 border-l-2 pl-4' : ''}`}>
        {subQuestions.map((subQ, index) => (
          <Card key={subQ._id || index} className="border-l-4">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline" className="font-mono">
                  {subQ.subQuestionLabel}
                </Badge>
                <Badge variant="secondary">{subQ.marks} marks</Badge>
              </div>
              <p className="text-sm font-medium mb-2">{subQ.questionText}</p>
              {subQ.questionDescription && (
                <p className="text-xs text-muted-foreground mb-2">
                  {subQ.questionDescription}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {formatQuestionType(subQ.questionType)}
                </Badge>
                <span>Level {subQ.subQuestionLevel}</span>
              </div>
              
              {subQ.subQuestions && subQ.subQuestions.length > 0 && (
                <div className="mt-4">
                  {renderSubQuestions(subQ.subQuestions, level + 1)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Question Details
            {question.hasSubQuestions && (
              <Badge variant="outline" className="ml-2">
                <ListTreeIcon className="h-3 w-3 mr-1" />
                Has Sub-questions
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Question</h3>
              <p className="text-sm">{question.questionText}</p>
              {question.questionDescription && (
                <p className="text-sm text-muted-foreground mt-2">
                  {question.questionDescription}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{formatQuestionType(question.questionType)}</Badge>
              <Badge variant="outline">{question.difficultyLevel}</Badge>
              <Badge variant="default">{question.marks} marks</Badge>
              {question.isPublic ? (
                <Badge variant="default">Public</Badge>
              ) : (
                <Badge variant="secondary">Private</Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* MCQ Options */}
          {question.questionType === 'mcq' && question.options && question.options.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Answer Options</h3>
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <div
                    key={option._id || index}
                    className={`flex items-center gap-2 p-3 rounded-lg border ${
                      option.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''
                    }`}
                  >
                    {option.isCorrect ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <CircleIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm">{option.optionText}</span>
                    {option.isCorrect && (
                      <Badge variant="default" className="ml-auto">Correct</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-questions */}
          {question.hasSubQuestions && question.subQuestions && question.subQuestions.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <ListTreeIcon className="h-5 w-5" />
                Sub-Questions
              </h3>
              {renderSubQuestions(question.subQuestions)}
            </div>
          )}

          {/* Metadata */}
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            {question.subjectCode && (
              <div>
                <span className="text-muted-foreground">Subject:</span>
                <p className="font-medium">{question.subjectCode} - {question.subjectName}</p>
              </div>
            )}
            {question.topic && (
              <div>
                <span className="text-muted-foreground">Topic:</span>
                <p className="font-medium">{question.topic}</p>
              </div>
            )}
            {question.subtopic && (
              <div>
                <span className="text-muted-foreground">Subtopic:</span>
                <p className="font-medium">{question.subtopic}</p>
              </div>
            )}
            {question.bloomsTaxonomy && (
              <div>
                <span className="text-muted-foreground">Bloom's Level:</span>
                <p className="font-medium capitalize">{question.bloomsTaxonomy}</p>
              </div>
            )}
            {question.keywords && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Keywords:</span>
                <p className="font-medium">{question.keywords}</p>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Usage Count:</span>
              <p className="font-medium">{question.usageCount} times</p>
            </div>
            {question.createdByName && (
              <div>
                <span className="text-muted-foreground">Created By:</span>
                <p className="font-medium">{question.createdByName}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}