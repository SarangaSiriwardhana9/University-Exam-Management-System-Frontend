'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { KeyIcon, AlertCircleIcon, CheckCircle2Icon, ClockIcon, BookOpenIcon } from 'lucide-react';
import { useMyExamRegistrationsQuery } from '@/features/exam-registrations/hooks/use-exam-registrations-query';
import { examRegistrationsService } from '@/features/exam-registrations/hooks/use-exam-registrations';
import type { ExamRegistration } from '@/features/exam-registrations/types/exam-registrations';
import { EXAM_MESSAGES } from '@/constants/exam.constants';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ExamEnrollmentPage() {
  const params = useParams()
  const router = useRouter()
  const registrationId = params.id as string

  const [enrollmentKey, setEnrollmentKey] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')

  const { data: registrationsResponse, isLoading } = useMyExamRegistrationsQuery()
  const registrations = registrationsResponse?.data || []
  const registration = registrations.find((r: ExamRegistration) => r._id === registrationId)

  const handleVerifyKey = async () => {
    if (!enrollmentKey.trim()) {
      setError('Please enter the enrollment key')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      const result = await examRegistrationsService.verifyEnrollmentKey(registrationId, enrollmentKey.trim())
      
      if (result.data.verified) {
        toast.success(EXAM_MESSAGES.ENROLLMENT_SUCCESS)
        router.push(`/student/exam-paper/${result.data.paperId}?session=${result.data.registrationId}`)
      }
    } catch (err: any) {
      setError(err.message || EXAM_MESSAGES.ENROLLMENT_ERROR)
      toast.error('Verification failed', {
        description: err.message || EXAM_MESSAGES.ENROLLMENT_ERROR
      })
    } finally {
      setIsVerifying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!registration) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>
                Registration not found. Please return to your exams page.
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

  if (!registration.canEnroll) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert>
              <ClockIcon className="h-4 w-4" />
              <AlertDescription>
                This exam is not currently available for enrollment. Please check back during the scheduled exam time.
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

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Online Exam Enrollment</CardTitle>
          <CardDescription>
            Enter the enrollment key provided by your instructor to access the exam
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">{registration.examTitle}</h3>
            </div>
            {registration.paperTitle && (
              <p className="text-sm text-muted-foreground">
                Paper: {registration.paperTitle}
              </p>
            )}
            {registration.subjectCode && registration.subjectName && (
              <p className="text-sm text-muted-foreground">
                {registration.subjectCode} - {registration.subjectName}
              </p>
            )}
            {registration.examDateTime && (
              <div className="flex items-center gap-2 text-sm">
                <ClockIcon className="h-4 w-4" />
                <span>{format(new Date(registration.examDateTime), 'PPp')}</span>
              </div>
            )}
            {registration.formattedDuration && (
              <p className="text-sm">
                <strong>Duration:</strong> {registration.formattedDuration}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="enrollmentKey">Enrollment Key</Label>
              <div className="relative">
                <KeyIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="enrollmentKey"
                  type="text"
                  placeholder="Enter enrollment key"
                  value={enrollmentKey}
                  onChange={(e) => {
                    setEnrollmentKey(e.target.value.toUpperCase())
                    setError('')
                  }}
                  className="pl-10 text-center text-lg tracking-wider font-mono"
                  maxLength={20}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleVerifyKey()
                    }
                  }}
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <Alert>
              <CheckCircle2Icon className="h-4 w-4" />
              <AlertDescription>
                The enrollment key is case-insensitive and should be provided by your instructor at the start of the exam.
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/student/exams')}
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleVerifyKey}
              disabled={isVerifying || !enrollmentKey.trim()}
            >
              {isVerifying ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2Icon className="h-4 w-4 mr-2" />
                  Start Exam
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
