export interface ExamRegistration {
  _id: string
  sessionId: string
  paperId?: string
  examTitle?: string
  paperTitle?: string
  examDateTime?: string
  roomNumber?: string
  subjectCode?: string
  subjectName?: string
  durationMinutes?: number
  formattedDuration?: string
  deliveryMode?: string
  sessionStatus?: string
  enrollmentKey?: string
  canEnroll?: boolean
  studentId: string
  studentName?: string
  studentEmail?: string
  studentUsername?: string
  registrationDate: string
  seatNumber?: number
  attendanceStatus?: string
  specialRequirements?: string
  status: RegistrationStatus
  registeredBy?: string
  registeredByName?: string
  cancelledAt?: string
  cancelledBy?: string
  cancellationReason?: string
  actualStartTime?: string
  actualSubmitTime?: string
  examStartTime?: string
  examEndTime?: string
  totalMarksObtained?: number
  isMarked?: boolean
  markedBy?: string
  markedAt?: string
  createdAt?: string
  updatedAt?: string
}

export type RegistrationStatus = 
  | 'registered' 
  | 'in_progress' 
  | 'completed' 
  | 'auto_submitted' 
  | 'absent'

export interface RegistrationStats {
  total: number
  registered: number
  inProgress: number
  completed: number
  absent: number
}

export interface GetRegistrationsParams {
  sessionId?: string
  studentId?: string
  status?: RegistrationStatus
  page?: number
  limit?: number
  search?: string
}

export interface RegistrationsListResponse {
  registrations: ExamRegistration[]
  total: number
  page: number
  limit: number
  totalPages: number
}
