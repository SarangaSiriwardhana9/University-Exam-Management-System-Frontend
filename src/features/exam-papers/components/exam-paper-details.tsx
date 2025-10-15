'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
 
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