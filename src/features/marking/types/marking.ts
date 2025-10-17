export interface StudentAnswer {
  _id: string
  registrationId: string
  studentId: string
  sessionId: string
  paperId: string
  paperQuestionId: string
  questionId: string
  questionType: string
  selectedOptionId?: string
  selectedOptionIds?: string[]
  answerText?: string
  isMarkedForReview: boolean
  timeSpentSeconds: number
  answeredAt?: string
  marksObtained?: number
  isMarked: boolean
  markedBy?: string
  markedAt?: string
  feedback?: string
  createdAt: string
  updatedAt: string
}

export interface MarkingSubmission {
  _id: string
  sessionId: string
  studentId: {
    _id: string
    fullName: string
    email: string
    studentId: string
  }
  registrationDate: string
  status: string
  actualSubmitTime?: string
  totalMarksObtained?: number
  isMarked: boolean
  markedBy?: string
  markedAt?: string
}

export interface MarkingStats {
  total: number
  marked: number
  unmarked: number
}

export interface MarkAnswerDto {
  marksObtained: number
  feedback?: string
}

export interface BulkMarkAnswersDto {
  answers: Array<{
    paperQuestionId: string
    marksObtained: number
    feedback?: string
  }>
}

export interface RegistrationAnswersResponse {
  registration: {
    _id: string
    studentId: {
      _id: string
      fullName: string
      email: string
      studentId: string
    }
    sessionId: any
    status: string
    actualSubmitTime?: string
    totalMarksObtained?: number
    isMarked: boolean
  }
  session: any
  answers: StudentAnswer[]
}
