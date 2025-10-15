import { useState, useEffect } from 'react';

interface UseExamTimerProps {
  initialTime: number | null;
  onTimeExpired: () => void;
  isActive: boolean;
}

export const useExamTimer = ({ initialTime, onTimeExpired, isActive }: UseExamTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(initialTime);

  useEffect(() => {
    setTimeRemaining(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (!isActive || timeRemaining === null) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeRemaining, onTimeExpired]);

  return { timeRemaining };
};
