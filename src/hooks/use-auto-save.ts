import { useEffect } from 'react';
import { studentAnswersApi, SaveAnswerDto } from '@/features/student-answers/api/student-answers';
import { AUTO_SAVE_INTERVAL } from '@/constants/exam.constants';

interface UseAutoSaveProps {
  registrationId: string | null;
  answers: Record<string, { type: string; value: string }>;
  isEnabled: boolean;
  isActive: boolean;
}

export const useAutoSave = ({ registrationId, answers, isEnabled, isActive }: UseAutoSaveProps) => {
  useEffect(() => {
    if (!isActive || !isEnabled || !registrationId || Object.keys(answers).length === 0) return;

    const saveAnswers = async () => {
      try {
        for (const [paperQuestionId, answer] of Object.entries(answers)) {
          const answerDto: SaveAnswerDto = {
            registrationId,
            paperQuestionId,
            questionType: answer.type,
            ...(answer.type === 'mcq' || answer.type === 'true_false'
              ? { selectedOptionId: answer.value }
              : { answerText: answer.value }),
          };
          await studentAnswersApi.saveAnswer(answerDto);
        }
      } catch (error) {
      }
    };

    const interval = setInterval(saveAnswers, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [isActive, isEnabled, answers, registrationId]);
};
