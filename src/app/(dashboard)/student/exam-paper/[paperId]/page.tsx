'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { ClockIcon, AlertCircleIcon, FileTextIcon, CheckCircle2Icon } from 'lucide-react'
import { useExamPaperQuery } from '@/features/exam-papers/hooks/use-exam-papers-query'
import type { ExamPaper, PaperQuestion, QuestionOption } from '@/features/exam-papers/types/exam-papers'
import { studentAnswersApi, SaveAnswerDto } from '@/features/student-answers/api/student-answers'
import { examRegistrationsApi } from '@/features/exam-registrations/api/exam-registrations'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { EXAM_MESSAGES } from '@/constants/exam.constants'

export default function ExamPaperPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const paperId = params.paperId as string
  const sessionId = searchParams.get('session')

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<string, { type: string; value: string | string[] }>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [examStatus, setExamStatus] = useState<any>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)

  const { data: paperResponse, isLoading } = useExamPaperQuery(paperId, true)
  const paper = paperResponse?.data

  useEffect(() => {
    if (!sessionId) return

    const fetchStatus = async () => {
      try {
        const status = await examRegistrationsApi.getExamStatus(sessionId)
        setExamStatus(status)
        
        if (status.examStartTime) {
          setHasStarted(true)
          setTimeRemaining(status.timeRemainingSeconds)
        }
      } catch (error) {
      }
    }

    fetchStatus()
    const statusInterval = setInterval(fetchStatus, 10000)

    return () => clearInterval(statusInterval)
  }, [sessionId])

  const autoSaveAnswers = async () => {
    if (!sessionId || Object.keys(answers).length === 0) {
      console.log('⏭️ Skipping auto-save: no session or no answers')
      return
    }

    try {
      for (const [paperQuestionId, answer] of Object.entries(answers)) {
        const answerDto: SaveAnswerDto = {
          registrationId: sessionId,
          paperQuestionId,
          questionType: answer.type,
        }
        
        if (answer.type === 'mcq' || answer.type === 'true_false') {
          if (Array.isArray(answer.value)) {
            answerDto.selectedOptionIds = answer.value
          } else {
            answerDto.selectedOptionId = answer.value as string
          }
        } else {
          answerDto.answerText = answer.value as string
        }
        
        await studentAnswersApi.saveAnswer(answerDto)
      }
    } catch (error) {
    }
  }

  const handleAutoSubmit = async () => {
    if (!sessionId) return

    try {
      const answerDtos: SaveAnswerDto[] = Object.entries(answers).map(([paperQuestionId, answer]) => {
        const dto: SaveAnswerDto = {
          registrationId: sessionId,
          paperQuestionId,
          questionType: answer.type,
        }
        
        if (answer.type === 'mcq' || answer.type === 'true_false') {
          if (Array.isArray(answer.value)) {
            dto.selectedOptionIds = answer.value
          } else {
            dto.selectedOptionId = answer.value as string
          }
        } else {
          dto.answerText = answer.value as string
        }
        
        return dto
      })

      await studentAnswersApi.submitExam({
        registrationId: sessionId,
        answers: answerDtos,
      })

      toast.success(EXAM_MESSAGES.TIME_EXPIRED)
      router.push(`/student/exam-submitted?auto=true&title=${encodeURIComponent(paper?.paperTitle || 'Exam')}`)
    } catch (error: any) {

      toast.warning(error?.message || EXAM_MESSAGES.TIME_EXPIRED)
      router.push(`/student/exam-submitted?auto=true&title=${encodeURIComponent(paper?.paperTitle || 'Exam')}`)
    }
  }

  useEffect(() => {
    if (!hasStarted || timeRemaining === null) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [hasStarted, timeRemaining])

  useEffect(() => {
    if (!hasStarted || !autoSaveEnabled || !sessionId) return

    const autoSaveInterval = setInterval(async () => {
      await autoSaveAnswers()
    }, 30000)
    return () => clearInterval(autoSaveInterval)
  }, [hasStarted, autoSaveEnabled, sessionId, answers])

  useEffect(() => {
    if (!hasStarted || !sessionId) return;

    const loadSavedAnswers = async () => {
      try {
        const response = await studentAnswersApi.getAnswers(sessionId)
        const savedAnswers = response.answers.reduce((answersMap, answer) => {
          const questionId = typeof answer.paperQuestionId === 'object' 
            ? answer.paperQuestionId._id?.toString() || answer.paperQuestionId.toString()
            : answer.paperQuestionId.toString()
          
          let value: string | string[]
          
          // Handle multiple selections
          if (answer.selectedOptionIds && answer.selectedOptionIds.length > 0) {
            value = answer.selectedOptionIds.map(id => 
              typeof id === 'object' ? id._id?.toString() || id.toString() : id.toString()
            )
          } else if (answer.selectedOptionId) {
            // Handle single selection
            value = typeof answer.selectedOptionId === 'object'
              ? answer.selectedOptionId._id?.toString() || answer.selectedOptionId.toString()
              : answer.selectedOptionId.toString()
          } else {
            // Handle text answers
            value = answer.answerText || ''
          }
          
          answersMap[questionId] = {
            type: answer.questionType,
            value: value
          }
          
          return answersMap
        }, {} as Record<string, { type: string; value: string | string[] }>)
        
        setAnswers(savedAnswers)
      } catch (error) {
      }
    }

    loadSavedAnswers()
  }, [hasStarted, sessionId])

  useEffect(() => {
    if (!hasStarted || !sessionId) return

    const activityInterval = setInterval(async () => {
      try {
        await examRegistrationsApi.updateActivity(sessionId)
      } catch (error) {
      }
    }, 120000)

    return () => clearInterval(activityInterval)
  }, [hasStarted, sessionId])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartExam = async () => {
    if (!sessionId) return

    setIsStarting(true)
    try {
      const response = await examRegistrationsApi.startExam(sessionId)
      setHasStarted(true)
      
      const status = await examRegistrationsApi.getExamStatus(sessionId)
      setExamStatus(status)
      setTimeRemaining(status.timeRemainingSeconds)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to start exam')
    } finally {
      setIsStarting(false)
    }
  }

  const handleAnswerChange = async (questionId: string, answer: string | string[], questionType: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: { type: questionType, value: answer } }))
    
    if (!sessionId) return
    
    try {
      const answerDto: SaveAnswerDto = {
        registrationId: sessionId,
        paperQuestionId: questionId,
        questionType: questionType,
      }
      
      if (questionType === 'mcq' || questionType === 'true_false') {
        if (Array.isArray(answer)) {
          answerDto.selectedOptionIds = answer
        } else {
          answerDto.selectedOptionId = answer
        }
      } else {
        answerDto.answerText = answer as string
      }
      
      await studentAnswersApi.saveAnswer(answerDto)
    } catch (error) {
    }
  }

  const handleClearAnswer = (questionId: string) => {
    setAnswers(prev => {
      const newAnswers = { ...prev }
      delete newAnswers[questionId]
      return newAnswers
    })
  }

  const handleSubmitClick = () => {
    if (!sessionId) {
      toast.error('Session ID is required to submit the exam')
      return
    }
    if (isSubmitting) return
    setShowSubmitDialog(true)
  }

  const handleConfirmSubmit = async () => {
    if (!sessionId) return
    
    setShowSubmitDialog(false)
    setIsSubmitting(true)
    try {
      const answerDtos: SaveAnswerDto[] = Object.entries(answers).map(([paperQuestionId, answer]) => {
        const dto: SaveAnswerDto = {
          registrationId: sessionId,
          paperQuestionId,
          questionType: answer.type,
        }
        
        if (answer.type === 'mcq' || answer.type === 'true_false') {
          if (Array.isArray(answer.value)) {
            dto.selectedOptionIds = answer.value
          } else {
            dto.selectedOptionId = answer.value as string
          }
        } else {
          dto.answerText = answer.value as string
        }
        
        return dto
      })

      await studentAnswersApi.submitExam({
        registrationId: sessionId,
        answers: answerDtos,
      })

      toast.success(EXAM_MESSAGES.SUBMIT_SUCCESS)
      router.push(`/student/exam-submitted?title=${encodeURIComponent(paper?.paperTitle || 'Exam')}`)
    } catch (error: any) {
      toast.error(error?.message || EXAM_MESSAGES.SUBMIT_ERROR)
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


  if (examStatus?.deliveryMode === 'online' && !hasStarted && examStatus?.canStart) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Start Your Exam?</CardTitle>
            <CardDescription>
              Please read the instructions carefully before starting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-medium">Exam Title:</span>
                <span>{paper.paperTitle}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-medium">Duration:</span>
                <span>{paper.durationMinutes} minutes</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-medium">Total Marks:</span>
                <span>{paper.totalMarks}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-medium">Total Questions:</span>
                <span>{paper.questionCount}</span>
              </div>
            </div>

            {paper.instructions && (
              <Alert>
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-wrap">
                  {paper.instructions}
                </AlertDescription>
              </Alert>
            )}

            <Alert>
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Once you start, the timer will begin counting down</li>
                  <li>Your answers will be auto-saved every 30 seconds</li>
                  <li>The exam will auto-submit when time expires</li>
                  <li>Make sure you have a stable internet connection</li>
                  <li>Do not refresh or close this page during the exam</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button
                onClick={() => router.push('/student/exams')}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartExam}
                disabled={isStarting}
                className="flex-1"
              >
                {isStarting ? 'Starting...' : 'Start Exam'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
              <Button onClick={handleSubmitClick} size="lg" disabled={isSubmitting}>
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

            {examStatus?.deliveryMode === 'online' && examStatus?.examStartTime && (
              <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-semibold text-sm">Exam Timing</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Started At</p>
                    <p className="font-medium">{format(new Date(examStatus.examStartTime), 'hh:mm:ss a')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Will End At</p>
                    <p className="font-medium">{format(new Date(examStatus.examEndTime), 'hh:mm:ss a')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Auto-Save</p>
                    <Badge variant={autoSaveEnabled ? 'default' : 'secondary'}>
                      {autoSaveEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

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
                    answer={answers[question._id]?.value || (question.questionType === 'mcq' && (typeof question.questionId === 'object' && question.questionId.allowMultipleAnswers) ? [] : '')}
                    onAnswerChange={(answer) => handleAnswerChange(question._id, answer, question.questionType)}
                    onClearAnswer={() => handleClearAnswer(question._id)}
                    onSubQuestionAnswerChange={handleAnswerChange}
                    onSubQuestionClearAnswer={handleClearAnswer}
                    answers={answers}
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
              <Button onClick={handleSubmitClick} size="lg" disabled={isSubmitting}>
                <CheckCircle2Icon className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your exam? This action cannot be undone. 
              Make sure you have answered all questions before submitting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Exam'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function QuestionCard({
  question,
  questionNumber,
  answer,
  onAnswerChange,
  onClearAnswer,
  onSubQuestionAnswerChange,
  onSubQuestionClearAnswer,
  answers,
}: {
  question: PaperQuestion
  questionNumber: number
  answer: string | string[]
  onAnswerChange: (answer: string | string[]) => void
  onClearAnswer: () => void
  onSubQuestionAnswerChange?: (subQId: string, answer: string | string[], questionType: string) => void
  onSubQuestionClearAnswer?: (subQId: string) => void
  answers: Record<string, { type: string; value: string | string[] }>
}) {
  const questionData = typeof question.questionId === 'object' ? question.questionId : null
  const questionType = questionData?.questionType || question.questionType
  const options = questionData?.options || []
  const allowMultipleAnswers = questionData?.allowMultipleAnswers || false
  const isMCQ = questionType === 'mcq' || questionType === 'true_false'

  const renderAnswerInput = (
    qType: string, 
    opts: QuestionOption[], 
    currentAnswer: string | string[], 
    allowMultiple: boolean = false,
    questionId?: string,
    onAnswerChangeFn?: (answer: string | string[]) => void,
    onClearFn?: () => void
  ) => {
    const handleChange = onAnswerChangeFn || onAnswerChange
    const handleClear = onClearFn || onClearAnswer
    
    if (qType === 'mcq' || qType === 'true_false') {
      const selectedIds = Array.isArray(currentAnswer) ? currentAnswer : (currentAnswer ? [currentAnswer] : [])
      
      const handleOptionChange = (optionId: string) => {
        if (allowMultiple) {
          const newSelection = selectedIds.includes(optionId)
            ? selectedIds.filter(id => id !== optionId)
            : [...selectedIds, optionId]
          handleChange(newSelection)
        } else {
          handleChange(optionId)
        }
      }
      
      return (
        <div className="mt-3 space-y-2">
          {allowMultiple && (
            <p className="text-sm text-muted-foreground mb-2">
              Select all that apply (Multiple answers allowed)
            </p>
          )}
          {opts.map((option) => {
            const isSelected = selectedIds.includes(option._id)
            return (
              <label
                key={option._id}
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                  isSelected ? 'bg-primary/10 border-primary' : ''
                }`}
              >
                <input
                  type={allowMultiple ? "checkbox" : "radio"}
                  name={allowMultiple ? undefined : `question-${questionId || question._id}`}
                  value={option._id}
                  checked={isSelected}
                  onChange={() => handleOptionChange(option._id)}
                  className="mt-1"
                />
                <span className="flex-1">{option.optionText}</span>
              </label>
            )
          })}
          {selectedIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="mt-2"
            >
              Clear Selection
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className="mt-3 space-y-2">
        <textarea
          className="w-full min-h-[150px] p-3 border rounded-md resize-y"
          placeholder="Type your answer here..."
          value={currentAnswer as string}
          onChange={(e) => handleChange(e.target.value)}
        />
        {currentAnswer && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
          >
            Clear Answer
          </Button>
        )}
      </div>
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
                {((questionData as any)?.questionDescription || (question as any).questionDescription) && (
                  <span className="text-sm text-muted-foreground font-normal ml-2">
                    ({(questionData as any)?.questionDescription || (question as any).questionDescription})
                  </span>
                )}
              </p>
              {allowMultipleAnswers && isMCQ && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  Multiple answers allowed
                </Badge>
              )}
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
            <div className="mt-4 space-y-4">
              {question.subQuestions.map((subQ) => {
                const subQData = typeof subQ.questionId === 'object' ? subQ.questionId : null
                const subQType = subQData?.questionType || subQ.questionType
                const subQOptions = subQData?.options || []
                const subQAllowMultiple = subQData?.allowMultipleAnswers || false
                const subQAnswer = answers[subQ._id]?.value || (subQType === 'mcq' && subQAllowMultiple ? [] : '')
                
                return (
                  <div key={subQ._id} className="ml-6 p-4 border-l-4 border-primary/20 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-primary">
                            ({subQ.subQuestionLabel})
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {subQType?.replace('_', ' ')}
                          </Badge>
                          {subQAllowMultiple && (subQType === 'mcq' || subQType === 'true_false') && (
                            <Badge variant="secondary" className="text-xs">
                              Multiple answers
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium whitespace-pre-wrap">
                          {subQData?.questionText || subQ.questionText}
                          {((subQData as any)?.questionDescription || (subQ as any).questionDescription) && (
                            <span className="text-xs text-muted-foreground font-normal ml-2">
                              ({(subQData as any)?.questionDescription || (subQ as any).questionDescription})
                            </span>
                          )}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {subQ.marksAllocated}m
                      </Badge>
                    </div>
                    {renderAnswerInput(
                      subQType, 
                      subQOptions, 
                      subQAnswer, 
                      subQAllowMultiple,
                      subQ._id,
                      (answer) => onSubQuestionAnswerChange?.(subQ._id, answer, subQType),
                      () => onSubQuestionClearAnswer?.(subQ._id)
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            renderAnswerInput(questionType, options, answer, allowMultipleAnswers)
          )}
        </div>
      </div>
    </div>
  )
}
