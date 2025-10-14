'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { ClockIcon, AlertCircleIcon, FileTextIcon, CheckCircle2Icon } from 'lucide-react'
import { useExamPaperQuery } from '@/features/exam-papers/hooks/use-exam-papers-query'
import type { ExamPaper, PaperQuestion, QuestionOption } from '@/features/exam-papers/types/exam-papers'
import { studentAnswersApi, SaveAnswerDto } from '@/features/student-answers/api/student-answers'
import { format } from 'date-fns'

export default function ExamPaperPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const paperId = params.paperId as string
  const sessionId = searchParams.get('session')

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<string, { type: string; value: string }>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: paperResponse, isLoading } = useExamPaperQuery(paperId, true)
  const paper = paperResponse?.data

  useEffect(() => {
    if (!paper) return

    const duration = paper.durationMinutes * 60
    setTimeRemaining(duration)

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [paper])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = async (questionId: string, answer: string, questionType: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: { type: questionType, value: answer } }))
  }

  const handleSubmit = async () => {
    if (!sessionId) {
      alert('Session ID is required to submit the exam')
      return
    }

    if (isSubmitting) return

    const confirmed = confirm('Are you sure you want to submit your exam? This action cannot be undone.')
    if (!confirmed) return

    setIsSubmitting(true)
    try {
      const answerDtos: SaveAnswerDto[] = Object.entries(answers).map(([paperQuestionId, answer]) => ({
        registrationId: sessionId,
        paperQuestionId,
        questionType: answer.type,
        ...(answer.type === 'mcq' || answer.type === 'true_false'
          ? { selectedOptionId: answer.value }
          : { answerText: answer.value }),
      }))

      await studentAnswersApi.submitExam({
        registrationId: sessionId,
        answers: answerDtos,
      })

      alert('Exam submitted successfully!')
      router.push('/student/exams')
    } catch (error: any) {
      console.error('Error submitting exam:', error)
      alert(error?.response?.data?.message || 'Failed to submit exam. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!paper) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>
                Exam paper not found. Please contact your instructor.
              </AlertDescription>
            </Alert>
            <Button className="w-full mt-4" onClick={() => router.push('/student/exams')}>
              Back to Exams
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const groupedQuestions = paper.questions?.reduce((acc, question) => {
    if (!acc[question.partLabel]) {
      acc[question.partLabel] = []
    }
    acc[question.partLabel].push(question)
    return acc
  }, {} as Record<string, PaperQuestion[]>) || {}

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="container max-w-5xl mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileTextIcon className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold">{paper.paperTitle}</h1>
                <p className="text-sm text-muted-foreground">
                  {paper.subjectCode} - {paper.subjectName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  <span className={`text-lg font-mono font-bold ${timeRemaining !== null && timeRemaining < 300 ? 'text-destructive' : ''}`}>
                    {timeRemaining !== null ? formatTime(timeRemaining) : '--:--:--'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Time Remaining</p>
              </div>
              <Button onClick={handleSubmit} size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Exam Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Marks</p>
                <p className="text-2xl font-bold">{paper.totalMarks}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-2xl font-bold">{paper.formattedDuration}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="text-2xl font-bold">{paper.questionCount || paper.questions?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <Badge variant="outline" className="text-base">
                  {paper.paperType}
                </Badge>
              </div>
            </div>

            {paper.instructions && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Instructions</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {paper.instructions}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {paper.parts.map((part) => {
          const partQuestions = groupedQuestions[part.partLabel] || []
          
          return (
            <Card key={part.partLabel} className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Part {part.partLabel}: {part.partTitle}</CardTitle>
                    <CardDescription>
                      {part.questionCount} question{part.questionCount !== 1 ? 's' : ''} • {part.totalMarks} marks
                    </CardDescription>
                  </div>
                  {part.hasOptionalQuestions && (
                    <Badge variant="secondary">
                      Answer {part.minimumQuestionsToAnswer} of {part.questionCount}
                    </Badge>
                  )}
                </div>
                {part.partInstructions && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {part.partInstructions}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {partQuestions.map((question, index) => (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    questionNumber={index + 1}
                    answer={answers[question._id]?.value || ''}
                    onAnswerChange={(answer) => handleAnswerChange(question._id, answer, question.questionType)}
                  />
                ))}
              </CardContent>
            </Card>
          )
        })}

        <Card className="sticky bottom-4 bg-background/95 backdrop-blur">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Questions Answered</p>
                  <p className="text-lg font-bold">
                    {Object.keys(answers).length} / {paper.questions?.length || 0}
                  </p>
                </div>
                {timeRemaining !== null && timeRemaining < 300 && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertDescription>
                      Less than 5 minutes remaining!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <Button onClick={handleSubmit} size="lg" disabled={isSubmitting}>
                <CheckCircle2Icon className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function QuestionCard({
  question,
  questionNumber,
  answer,
  onAnswerChange,
}: {
  question: PaperQuestion
  questionNumber: number
  answer: string
  onAnswerChange: (answer: string) => void
}) {
  const questionData = typeof question.questionId === 'object' ? question.questionId : null
  const questionType = questionData?.questionType || question.questionType
  const options = questionData?.options || []
  const isMCQ = questionType === 'mcq' || questionType === 'true_false'

  const renderAnswerInput = (qType: string, opts: QuestionOption[], currentAnswer: string) => {
    if (qType === 'mcq' || qType === 'true_false') {
      return (
        <div className="mt-3 space-y-2">
          {opts.map((option) => (
            <label
              key={option._id}
              className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                currentAnswer === option._id ? 'bg-primary/10 border-primary' : ''
              }`}
            >
              <input
                type="radio"
                name={`question-${question._id}`}
                value={option._id}
                checked={currentAnswer === option._id}
                onChange={(e) => onAnswerChange(e.target.value)}
                className="mt-1"
              />
              <span className="flex-1">{option.optionText}</span>
            </label>
          ))}
        </div>
      )
    }

    return (
      <textarea
        className="w-full min-h-[150px] p-3 border rounded-md resize-y mt-3"
        placeholder="Type your answer here..."
        value={currentAnswer}
        onChange={(e) => onAnswerChange(e.target.value)}
      />
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Badge variant="outline" className="mt-1">
          Q{questionNumber}
        </Badge>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-base font-medium whitespace-pre-wrap">
                {questionData?.questionText || question.questionText}
              </p>
              {question.isOptional && (
                <Badge variant="secondary" className="mt-2">
                  Optional
                </Badge>
              )}
            </div>
            <Badge variant="outline">
              {question.marksAllocated} mark{question.marksAllocated !== 1 ? 's' : ''}
            </Badge>
          </div>

          {question.subQuestions && question.subQuestions.length > 0 ? (
            <div className="mt-4 ml-4 space-y-4 border-l-2 pl-4">
              {question.subQuestions.map((subQ) => {
                const subQData = typeof subQ.questionId === 'object' ? subQ.questionId : null
                const subQType = subQData?.questionType || subQ.questionType
                const subQOptions = subQData?.options || []
                
                return (
                  <div key={subQ._id} className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-medium">
                        ({subQ.subQuestionLabel}) {subQData?.questionText || subQ.questionText}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {subQ.marksAllocated}m
                      </Badge>
                    </div>
                    {renderAnswerInput(subQType, subQOptions, answer)}
                  </div>
                )
              })}
            </div>
          ) : (
            renderAnswerInput(questionType, options, answer)
          )}
        </div>
      </div>
    </div>
  )
}
