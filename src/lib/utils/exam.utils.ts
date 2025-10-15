export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const extractId = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value._id?.toString() || value.toString();
  }
  return String(value);
};

export const parseAnswerData = (answers: any[]): Record<string, { type: string; value: string }> => {
  const answersMap: Record<string, { type: string; value: string }> = {};
  
  answers.forEach((answer: any) => {
    const questionId = extractId(answer.paperQuestionId);
    const optionId = answer.selectedOptionId ? extractId(answer.selectedOptionId) : '';
    
    answersMap[questionId] = {
      type: answer.questionType,
      value: optionId || answer.answerText || '',
    };
  });
  
  return answersMap;
};

export const calculateTimeRemaining = (endTime: string | Date): number => {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  return Math.max(0, Math.floor((end - now) / 1000));
};

export const isExamActive = (startTime: string | Date, endTime: string | Date): boolean => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  return now >= start && now <= end;
};

export const canEnrollInExam = (startTime: string | Date, endTime: string | Date, bufferMinutes = 15): boolean => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  const enrollStart = new Date(start.getTime() - bufferMinutes * 60 * 1000);
  return now >= enrollStart && now <= end;
};
