'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ChevronLeftIcon, CheckCircle2Icon, AlertCircleIcon, SparklesIcon, SaveIcon } from 'lucide-react'
import { useRegistrationAnswersQuery, useAutoMarkMcq, useBulkMarkAnswers, useFinalizeMarking } from '@/features/marking/hooks/use-marking-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { cn } from '@/lib/utils'

type MarkingDetailPageProps = {
  params: Promise<{ sessionId: string; registrationId: string }>
}

export default function MarkingDetailPage({ params }: MarkingDetailPageProps) {
  const router = useRouter()
  const { sessionId, registrationId } = use(params)
  
  const { data, isLoading, refetch } = useRegistrationAnswersQuery(registrationId)
  const autoMarkMcq = useAutoMarkMcq()
  const bulkMark = useBulkMarkAnswers()
  const finalize = useFinalizeMarking()

  const [marks, setMarks] = useState<Record<string, { marks: number; feedback: string }>>({})
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (data?.answers) {
      const initialMarks: Record<string, { marks: number; feedback: string }> = {}
      data.answers.forEach(answer => {
        initialMarks[answer._id] = {
          marks: answer.marksObtained || 0,
          feedback: answer.feedback || ''
        }
      })
      setMarks(initialMarks)
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!data) {
    return <div>No data found</div>
  }

  const { registration, answers, session } = data
  const student = registration.studentId
  const paper = session?.paperId
  const paperTotalMarks = paper?.totalMarks

  const handleMarkChange = (answerId: string, field: 'marks' | 'feedback', value: string | number) => {
    setMarks(prev => ({
      ...prev,
      [answerId]: {
        ...prev[answerId],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const handleAutoMarkMcq = async () => {
    await autoMarkMcq.mutateAsync(registrationId)
    refetch()
  }

  const handleSaveAll = async () => {
    const answersToMark = answers
      .filter(answer => !answer.isMarked || marks[answer._id]?.marks !== answer.marksObtained)
      .map(answer => ({
        paperQuestionId: typeof answer.paperQuestionId === 'string' 
          ? answer.paperQuestionId 
          : (answer.paperQuestionId as any)._id,
        marksObtained: marks[answer._id]?.marks || 0,
        feedback: marks[answer._id]?.feedback || undefined
      }))

    if (answersToMark.length > 0) {
      await bulkMark.mutateAsync({
        registrationId,
        data: { answers: answersToMark }
      })
      setHasChanges(false)
      refetch()
    }
  }

  const handleFinalize = async () => {
    await finalize.mutateAsync(registrationId)
    router.push(`/faculty/marking/${sessionId}`)
  }

  const allMarked = answers.every(a => a.isMarked)
  const answeredQuestionsMarks = answers.reduce((sum, answer) => {
    const paperQ = answer.paperQuestionId as any
    return sum + (paperQ?.marksAllocated || 0)
  }, 0)
  const obtainedMarks = Object.values(marks).reduce((sum, m) => sum + (m.marks || 0), 0)
  
  const hasInvalidMarks = answers.some(answer => {
    const paperQ = answer.paperQuestionId as any
    const allocatedMarks = paperQ?.marksAllocated || 0
    const obtainedMarks = marks[answer._id]?.marks || 0
    return obtainedMarks > allocatedMarks || obtainedMarks < 0
  })

  const mcqCount = answers.filter(a => ['mcq', 'true_false'].includes(a.questionType)).length

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/faculty/marking/${sessionId}`)}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mark Answers</h1>
            <p className="text-muted-foreground mt-1">
              Student: {student.fullName} ({student.studentId})
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-muted-foreground">Total Questions</p>
            <p className="text-2xl font-bold">{answers.length}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-muted-foreground">Marked</p>
            <p className="text-2xl font-bold text-green-600">
              {answers.filter(a => a.isMarked).length}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-muted-foreground">Paper Total</p>
            <p className="text-2xl font-bold">{paperTotalMarks || 0}</p>
            {answeredQuestionsMarks !== paperTotalMarks && (
              <p className="text-xs text-muted-foreground mt-1">
                Answered: {answeredQuestionsMarks} marks
              </p>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-muted-foreground">Obtained</p>
            <p className="text-2xl font-bold text-blue-600">{obtainedMarks}</p>
            {paperTotalMarks && (
              <p className="text-xs text-muted-foreground mt-1">
                / {paperTotalMarks}
              </p>
            )}
          </CardHeader>
        </Card>
      </div>

      {mcqCount > 0 && (
        <Alert>
          <SparklesIcon className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              {mcqCount} MCQ question{mcqCount > 1 ? 's' : ''} can be auto-marked
            </span>
            <Button
              size="sm"
              onClick={handleAutoMarkMcq}
              disabled={autoMarkMcq.isPending}
            >
              <SparklesIcon className="h-4 w-4 mr-2" />
              {autoMarkMcq.isPending ? 'Auto-marking...' : 'Auto-mark MCQs'}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!allMarked && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>
            {answers.filter(a => !a.isMarked).length} answer(s) still need to be marked before finalization
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {answers.map((answer, index) => {
          const paperQ = answer.paperQuestionId as any
          const questionData = typeof paperQ?.questionId === 'object' ? paperQ.questionId : null
          const questionText = questionData?.questionText || 'Question text not available'
          const questionType = questionData?.questionType || answer.questionType
          const options = questionData?.options || []
          const allocatedMarks = paperQ?.marksAllocated || 0

          const isMcq = ['mcq', 'true_false'].includes(questionType)
          
          const selectedOptions = answer.selectedOptionIds && answer.selectedOptionIds.length > 0
            ? answer.selectedOptionIds.map((opt: any) => typeof opt === 'string' ? opt : opt._id)
            : answer.selectedOptionId 
              ? [typeof answer.selectedOptionId === 'string' ? answer.selectedOptionId : (answer.selectedOptionId as any)._id]
              : []
          
          return (
            <Card key={answer._id} className={cn(
              "transition-all",
              answer.isMarked && "border-green-200 bg-green-50/50"
            )}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Q{index + 1}</Badge>
                      <Badge variant="secondary" className="text-xs">
                        {questionType.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {allocatedMarks} marks
                      </Badge>
                      {answer.isMarked && (
                        <Badge className="bg-green-600 text-xs">
                          <CheckCircle2Icon className="h-3 w-3 mr-1" />
                          Marked
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium">{questionText}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isMcq && options.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Student Answer: {selectedOptions.length === 0 && <span className="text-orange-600">(No answer selected)</span>}
                    </p>
                    {options.map((option: any) => {
                      const optionId = typeof option._id === 'string' ? option._id : option._id?.toString()
                      const isSelected = selectedOptions.some((id: string) => id === optionId)
                      const isCorrect = option.isCorrect
                      
                      return (
                        <div
                          key={option._id}
                          className={cn(
                            "p-3 border rounded-lg",
                            isSelected && isCorrect && "bg-green-50 border-green-500",
                            isSelected && !isCorrect && "bg-red-50 border-red-500",
                            !isSelected && isCorrect && "bg-blue-50 border-blue-300"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <Badge variant={isCorrect ? "default" : "destructive"} className="text-xs">
                                Selected
                              </Badge>
                            )}
                            {isCorrect && (
                              <Badge variant="default" className="bg-green-600 text-xs">
                                Correct Answer
                              </Badge>
                            )}
                            <span>{option.optionText}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Student Answer:</p>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="whitespace-pre-wrap">
                        {answer.answerText || <span className="text-muted-foreground italic">No answer provided</span>}
                      </p>
                    </div>
                  </div>
                )}

                <MarkingForm
                  answerId={answer._id}
                  allocatedMarks={allocatedMarks}
                  currentMarks={marks[answer._id]?.marks || 0}
                  currentFeedback={marks[answer._id]?.feedback || ''}
                  onMarkChange={handleMarkChange}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Marks</p>
              <p className="text-2xl font-bold">{obtainedMarks} / {paperTotalMarks || 0}</p>
            </div>
            {!allMarked && (
              <Badge variant="destructive">
                {answers.filter(a => !a.isMarked).length} unmarked
              </Badge>
            )}
            {registration.isMarked && (
              <Badge className="bg-green-600">
                <CheckCircle2Icon className="h-3 w-3 mr-1" />
                Finalized
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/faculty/marking/${sessionId}`)}
            >
              {registration.isMarked ? 'Back' : 'Cancel'}
            </Button>
            {hasChanges && (
              <Button
                onClick={handleSaveAll}
                disabled={bulkMark.isPending || hasInvalidMarks}
              >
                <SaveIcon className="h-4 w-4 mr-2" />
                {bulkMark.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
            {hasInvalidMarks && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertCircleIcon className="h-3 w-3 mr-1" />
                Invalid marks
              </Badge>
            )}
            {allMarked && !registration.isMarked && (
              <Button
                onClick={handleFinalize}
                disabled={finalize.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2Icon className="h-4 w-4 mr-2" />
                {finalize.isPending ? 'Finalizing...' : 'Finalize Marking'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

type MarkingFormProps = {
  answerId: string
  allocatedMarks: number
  currentMarks: number
  currentFeedback: string
  onMarkChange: (answerId: string, field: 'marks' | 'feedback', value: string | number) => void
}

function MarkingForm({ answerId, allocatedMarks, currentMarks, currentFeedback, onMarkChange }: MarkingFormProps) {
  const markingSchema = z.object({
    marks: z.number()
      .min(0, 'Marks cannot be negative')
      .max(allocatedMarks, `Marks cannot exceed ${allocatedMarks}`),
    feedback: z.string().optional()
  })

  const form = useForm<z.infer<typeof markingSchema>>({
    resolver: zodResolver(markingSchema),
    mode: 'onChange',
    values: {
      marks: currentMarks,
      feedback: currentFeedback
    }
  })

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <FormField
          control={form.control}
          name="marks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Marks Obtained <span className="text-muted-foreground">(out of {allocatedMarks})</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={allocatedMarks}
                  step={0.5}
                  {...field}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    field.onChange(value)
                    onMarkChange(answerId, 'marks', value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value)
                    onMarkChange(answerId, 'feedback', e.target.value)
                  }}
                  placeholder="Add feedback for the student..."
                  rows={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}
