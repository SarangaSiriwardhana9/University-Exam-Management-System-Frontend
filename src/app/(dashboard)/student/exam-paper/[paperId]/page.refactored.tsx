'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ClockIcon, AlertCircleIcon, FileTextIcon, CheckCircle2Icon } from 'lucide-react';
import { useExamPaperQuery } from '@/features/exam-papers/hooks/use-exam-papers-query';
import type { PaperQuestion } from '@/features/exam-papers/types/exam-papers';
import { studentAnswersApi, SaveAnswerDto } from '@/features/student-answers/api/student-answers';
import { examRegistrationsApi } from '@/features/exam-registrations/api/exam-registrations';
import { QuestionCard } from '@/components/exam/question-card';
import { useExamTimer } from '@/hooks/use-exam-timer';
import { useExamStatus } from '@/hooks/use-exam-status';
import { useAutoSave } from '@/hooks/use-auto-save';
import { formatTime, parseAnswerData } from '@/lib/utils/exam.utils';
import { ACTIVITY_UPDATE_INTERVAL, EXAM_MESSAGES } from '@/constants/exam.constants';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ExamPaperPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paperId = params.paperId as string;
  const registrationId = searchParams.get('session');

  const [answers, setAnswers] = useState<Record<string, { type: string; value: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const { data: paperResponse, isLoading } = useExamPaperQuery(paperId, true);
  const paper = paperResponse?.data;

  const { examStatus } = useExamStatus(registrationId);
  const { timeRemaining } = useExamTimer({
    initialTime: examStatus?.timeRemainingSeconds || null,
    onTimeExpired: handleAutoSubmit,
    isActive: hasStarted,
  });

  useAutoSave({
    registrationId,
    answers,
    isEnabled: autoSaveEnabled,
    isActive: hasStarted,
  });

  useEffect(() => {
    if (examStatus?.examStartTime) {
      setHasStarted(true);
    }
  }, [examStatus]);

  useEffect(() => {
    if (!hasStarted || !registrationId) return;

    const loadSavedAnswers = async () => {
      try {
        const response = await studentAnswersApi.getAnswers(registrationId);
        setAnswers(parseAnswerData(response.answers));
      } catch (error) {
        toast.error('Failed to load saved answers');
      }
    };

    loadSavedAnswers();
  }, [hasStarted, registrationId]);

  useEffect(() => {
    if (!hasStarted || !registrationId) return;

    const interval = setInterval(async () => {
      try {
        await examRegistrationsApi.updateActivity(registrationId);
      } catch (error) {
        // Silent fail
      }
    }, ACTIVITY_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [hasStarted, registrationId]);

  async function handleStartExam() {
    if (!registrationId) return;

    setIsStarting(true);
    try {
      await examRegistrationsApi.startExam(registrationId);
      setHasStarted(true);
      toast.success('Exam started successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to start exam');
    } finally {
      setIsStarting(false);
    }
  }

  async function handleAutoSubmit() {
    if (!registrationId) return;

    try {
      const answerDtos: SaveAnswerDto[] = Object.entries(answers).map(([paperQuestionId, answer]) => ({
        registrationId,
        paperQuestionId,
        questionType: answer.type,
        ...(answer.type === 'mcq' || answer.type === 'true_false'
          ? { selectedOptionId: answer.value }
          : { answerText: answer.value }),
      }));

      await studentAnswersApi.submitExam({ registrationId, answers: answerDtos });
      toast.success(EXAM_MESSAGES.TIME_EXPIRED);
      router.push('/student/exams');
    } catch (error) {
      toast.error('Failed to auto-submit exam');
    }
  }

  async function handleAnswerChange(questionId: string, answer: string, questionType: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: { type: questionType, value: answer } }));

    if (!registrationId) return;

    try {
      const answerDto: SaveAnswerDto = {
        registrationId,
        paperQuestionId: questionId,
        questionType,
        ...(questionType === 'mcq' || questionType === 'true_false'
          ? { selectedOptionId: answer }
          : { answerText: answer }),
      };
      await studentAnswersApi.saveAnswer(answerDto);
    } catch (error) {
      toast.error(EXAM_MESSAGES.SAVE_ERROR);
    }
  }

  function handleClearAnswer(questionId: string) {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
  }

  async function handleSubmit() {
    if (!registrationId || isSubmitting) return;

    const confirmed = confirm('Are you sure you want to submit your exam? This action cannot be undone.');
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      const answerDtos: SaveAnswerDto[] = Object.entries(answers).map(([paperQuestionId, answer]) => ({
        registrationId,
        paperQuestionId,
        questionType: answer.type,
        ...(answer.type === 'mcq' || answer.type === 'true_false'
          ? { selectedOptionId: answer.value }
          : { answerText: answer.value }),
      }));

      await studentAnswersApi.submitExam({ registrationId, answers: answerDtos });
      toast.success(EXAM_MESSAGES.SUBMIT_SUCCESS);
      router.push('/student/exams');
    } catch (error: any) {
      toast.error(error?.message || EXAM_MESSAGES.SUBMIT_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>Exam paper not found. Please contact your instructor.</AlertDescription>
            </Alert>
            <Button className="w-full mt-4" onClick={() => router.push('/student/exams')}>
              Back to Exams
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const groupedQuestions =
    paper.questions?.reduce((acc, question) => {
      if (!acc[question.partLabel]) {
        acc[question.partLabel] = [];
      }
      acc[question.partLabel].push(question);
      return acc;
    }, {} as Record<string, PaperQuestion[]>) || {};

  if (examStatus?.deliveryMode === 'online' && !hasStarted && examStatus?.canStart) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Start Your Exam?</CardTitle>
            <CardDescription>Please read the instructions carefully before starting</CardDescription>
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
                <AlertDescription className="whitespace-pre-wrap">{paper.instructions}</AlertDescription>
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
              <Button onClick={() => router.push('/student/exams')} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleStartExam} disabled={isStarting} className="flex-1">
                {isStarting ? 'Starting...' : 'Start Exam'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
                  <span
                    className={`text-lg font-mono font-bold ${
                      timeRemaining !== null && timeRemaining < 300 ? 'text-destructive' : ''
                    }`}
                  >
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
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{paper.instructions}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {paper.parts.map((part) => {
          const partQuestions = groupedQuestions[part.partLabel] || [];

          return (
            <Card key={part.partLabel} className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>
                      Part {part.partLabel}: {part.partTitle}
                    </CardTitle>
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
                {part.partInstructions && <p className="text-sm text-muted-foreground mt-2">{part.partInstructions}</p>}
              </CardHeader>
              <CardContent className="space-y-6">
                {partQuestions.map((question, index) => (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    questionNumber={index + 1}
                    answer={answers[question._id]?.value || ''}
                    onAnswerChange={(answer) => handleAnswerChange(question._id, answer, question.questionType)}
                    onClearAnswer={() => handleClearAnswer(question._id)}
                  />
                ))}
              </CardContent>
            </Card>
          );
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
                    <AlertDescription>Less than 5 minutes remaining!</AlertDescription>
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
  );
}
