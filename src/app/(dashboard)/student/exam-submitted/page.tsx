'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2Icon, ClockIcon, FileTextIcon, HomeIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function ExamSubmittedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAutoSubmitted = searchParams.get('auto') === 'true';
  const examTitle = searchParams.get('title') || 'Exam';

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/student/exams');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-6">
              <CheckCircle2Icon className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl">Exam Submitted Successfully!</CardTitle>
          <CardDescription className="text-lg mt-2">
            {isAutoSubmitted
              ? 'Your exam was automatically submitted when time expired'
              : 'Your answers have been recorded successfully'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-muted rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <FileTextIcon className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-semibold">{examTitle}</p>
                <p className="text-sm text-muted-foreground">Submitted at {format(new Date(), 'PPp')}</p>
              </div>
            </div>

            {isAutoSubmitted && (
              <Alert>
                <ClockIcon className="h-4 w-4" />
                <AlertDescription>
                  Time expired! Your exam was automatically submitted with all your saved answers.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-3">
            <Alert>
              <CheckCircle2Icon className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Your answers have been securely saved</li>
                  <li>You will be notified when results are published</li>
                  <li>Check your exam history for submission details</li>
                  <li>Contact your instructor if you have any concerns</li>
                </ul>
              </AlertDescription>
            </Alert>

            <p className="text-sm text-muted-foreground text-center">
              You will be redirected to your exams page in 10 seconds...
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => router.push('/student/exams')} className="flex-1" size="lg">
              <HomeIcon className="h-4 w-4 mr-2" />
              Go to My Exams
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
