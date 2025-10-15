import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PaperQuestion, QuestionOption } from '@/features/exam-papers/types/exam-papers';

interface QuestionCardProps {
  question: PaperQuestion;
  questionNumber: number;
  answer: string;
  onAnswerChange: (answer: string) => void;
  onClearAnswer: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  answer,
  onAnswerChange,
  onClearAnswer,
}: QuestionCardProps) {
  const questionData = typeof question.questionId === 'object' ? question.questionId : null;
  const questionType = questionData?.questionType || question.questionType;
  const options = questionData?.options || [];

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
          {currentAnswer && (
            <Button variant="outline" size="sm" onClick={onClearAnswer} className="mt-2">
              Clear Selection
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="mt-3 space-y-2">
        <textarea
          className="w-full min-h-[150px] p-3 border rounded-md resize-y"
          placeholder="Type your answer here..."
          value={currentAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
        />
        {currentAnswer && (
          <Button variant="outline" size="sm" onClick={onClearAnswer}>
            Clear Answer
          </Button>
        )}
      </div>
    );
  };

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
                const subQData = typeof subQ.questionId === 'object' ? subQ.questionId : null;
                const subQType = subQData?.questionType || subQ.questionType;
                const subQOptions = subQData?.options || [];

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
                );
              })}
            </div>
          ) : (
            renderAnswerInput(questionType, options, answer)
          )}
        </div>
      </div>
    </div>
  );
}
