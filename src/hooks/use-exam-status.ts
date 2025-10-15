import { useState, useEffect } from 'react';
import { examRegistrationsApi } from '@/features/exam-registrations/api/exam-registrations';
import { STATUS_CHECK_INTERVAL } from '@/constants/exam.constants';

export const useExamStatus = (registrationId: string | null) => {
  const [examStatus, setExamStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!registrationId) {
      setIsLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const status = await examRegistrationsApi.getExamStatus(registrationId);
        setExamStatus(status);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch exam status');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, STATUS_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [registrationId]);

  return { examStatus, isLoading, error };
};
