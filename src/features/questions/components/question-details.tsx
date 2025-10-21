'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2Icon, CircleIcon, BookOpenIcon, FileTextIcon, InfoIcon, ListTreeIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Question, SubQuestion } from '../types/questions'
import { getSubjectInfo, getCreatedByName, calculateQuestionTotalMarks } from '../utils/question-utils'
import { getLevelColors, getLevelBadgeColors } from '../constants/question-styles'
import { JSX } from 'react'

type QuestionDetailsProps = {
  question: Question
}

export const QuestionDetails = ({ question }: QuestionDetailsProps) => {
  const subjectInfo = getSubjectInfo(question)
  const createdByName = getCreatedByName(question)
  const totalMarks = calculateQuestionTotalMarks(question)

  const renderSubQuestions = (subQuestions: SubQuestion[], level: number = 1, parentLabel: string = ''): JSX.Element => {
    return (
      <div className={cn("space-y-3", level > 1 && "ml-6 mt-3")}>
        {subQuestions.map((sq) => {
          const fullLabel = parentLabel ? `${parentLabel}.${sq.subQuestionLabel}` : sq.subQuestionLabel
          
          return (
            <div key={sq._id} className={cn("p-4 border rounded-lg", getLevelColors(level - 1))}>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className={cn("font-mono font-bold mt-0.5", getLevelBadgeColors(level - 1))}>
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

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <BookOpenIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <CardTitle className="text-2xl">{question.questionText}</CardTitle>
                {question.hasSubQuestions && (
                  <Badge variant="default" className="bg-purple-600">
                    <ListTreeIcon className="h-3 w-3 mr-1" />
                    Structured
                  </Badge>
                )}
              </div>
              {question.questionDescription && (
                <CardDescription className="mt-2 text-base">
                  {question.questionDescription}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpenIcon className="h-4 w-4" />
                <span>Subject</span>
              </div>
              <p className="font-medium">
                {subjectInfo.code && subjectInfo.name 
                  ? `${subjectInfo.code} - ${subjectInfo.name}`
                  : subjectInfo.code || subjectInfo.name || 'N/A'}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileTextIcon className="h-4 w-4" />
                <span>Type</span>
              </div>
              <Badge variant="outline" className="mt-1">
                {question.questionType.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <InfoIcon className="h-4 w-4" />
                <span>Difficulty</span>
              </div>
              <Badge variant="outline" className="mt-1">
                {question.difficultyLevel.charAt(0).toUpperCase() + question.difficultyLevel.slice(1)}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2Icon className="h-4 w-4" />
                <span>Total Marks</span>
              </div>
              <p className="font-bold text-2xl text-primary">{totalMarks}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Bloom&#39;s Taxonomy</p>
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

          {createdByName && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <p className="mt-1">{createdByName}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {question.options && question.options.length > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <CheckCircle2Icon className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle>Answer Options</CardTitle>
                <CardDescription>
                  {question.allowMultipleAnswers ? 'Multiple correct answers allowed' : 'Single correct answer'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={option._id}
                  className={cn(
                    "flex items-start gap-3 p-4 border rounded-lg transition-all",
                    option.isCorrect && "bg-green-50 border-green-200"
                  )}
                >
                  {option.isCorrect ? (
                    <CheckCircle2Icon className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CircleIcon className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={cn("text-base", option.isCorrect && 'font-semibold')}>
                      <span className="font-bold text-primary">{String.fromCharCode(65 + index)}.</span> {option.optionText}
                    </p>
                  </div>
                  {option.isCorrect && (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle2Icon className="h-3 w-3 mr-1" />
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
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <ListTreeIcon className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <CardTitle>Question Parts & Sub-parts</CardTitle>
                <CardDescription>
                  This structured question contains {question.subQuestions.length} main part(s) with nested sub-parts
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderSubQuestions(question.subQuestions)}
          </CardContent>
        </Card>
      )}
    </div>
  )
}