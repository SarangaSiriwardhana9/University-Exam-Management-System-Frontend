import { apiClient } from '@/lib/api/client'

export interface SaveAnswerDto {
  registrationId: string
  paperQuestionId: string
  questionType: string
  selectedOptionId?: string
  answerText?: string
  isMarkedForReview?: boolean
  timeSpentSeconds?: number
}

export interface SubmitExamDto {
  registrationId: string
  answers: SaveAnswerDto[]
}

export interface StudentAnswer {
  _id: string
  registrationId: string
  studentId: string
  sessionId: string
  paperId: string
  paperQuestionId: string | { _id: string; toString: () => string }
  questionId: string
  questionType: string
  selectedOptionId?: string | { _id: string; toString: () => string }
  answerText?: string
  isMarkedForReview: boolean
  timeSpentSeconds: number
  answeredAt?: string
  createdAt: string
  updatedAt: string
}

export const studentAnswersApi = {
  saveAnswer: async (data: SaveAnswerDto) => {
    return apiClient.post('/api/v1/student-answers/save', data)
  },

  submitExam: async (data: SubmitExamDto) => {
    return apiClient.post('/api/v1/student-answers/submit', data)
  },

  getAnswers: async (registrationId: string) => {
    return apiClient.get<{ answers: StudentAnswer[] }>(`/api/v1/student-answers/registration/${registrationId}`)
  },

  getStats: async (registrationId: string) => {
    return apiClient.get<{ totalAnswered: number; markedForReview: number }>(
      `/api/v1/student-answers/registration/${registrationId}/stats`
    )
  },
}
