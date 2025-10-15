export const EXAM_STATUS = {
  REGISTERED: 'registered',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  AUTO_SUBMITTED: 'auto_submitted',
  CANCELLED: 'cancelled',
} as const;

export const QUESTION_TYPES = {
  MCQ: 'mcq',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
  LONG_ANSWER: 'long_answer',
} as const;

export const AUTO_SAVE_INTERVAL = 30000;
export const ACTIVITY_UPDATE_INTERVAL = 120000;
export const STATUS_CHECK_INTERVAL = 10000;

export const ENROLLMENT_BUFFER_MINUTES = 15;

export const EXAM_MESSAGES = {
  SAVE_SUCCESS: 'Answer saved successfully',
  SAVE_ERROR: 'Failed to save answer',
  SUBMIT_SUCCESS: 'Exam submitted successfully!',
  SUBMIT_ERROR: 'Failed to submit exam. Please try again.',
  TIME_EXPIRED: 'Time expired! Your exam has been automatically submitted.',
  ENROLLMENT_SUCCESS: 'Enrollment verified successfully!',
  ENROLLMENT_ERROR: 'Invalid enrollment key. Please try again.',
} as const;
