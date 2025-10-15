export const REGISTRATION_STATUS = {
  REGISTERED: 'registered',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  AUTO_SUBMITTED: 'auto_submitted',
  CANCELLED: 'cancelled'
} as const

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late'
} as const

export type RegistrationStatus = typeof REGISTRATION_STATUS[keyof typeof REGISTRATION_STATUS]
export type AttendanceStatus = typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS]

export type DeliveryMode = 'onsite' | 'online'

export type ExamRegistration = {
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
  deliveryMode?: DeliveryMode
  sessionStatus?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  enrollmentKey?: string
  canEnroll?: boolean
  studentId: string
  studentName?: string
  studentEmail?: string
  registrationDate: string
  seatNumber?: string
  attendanceStatus?: AttendanceStatus
  specialRequirements?: string
  status: RegistrationStatus
  registeredBy?: string
  registeredByName?: string
  cancelledAt?: string
  cancellationReason?: string
  examStartTime?: string
  examEndTime?: string
  actualSubmitTime?: string
  isAutoSubmitted?: boolean
  lastActivityAt?: string
  timeSpentSeconds?: number
  createdAt: string
  updatedAt: string
}

export type ExamSessionWithRegistration = {
  session: {
    _id: string
    paperId: string
    paperTitle: string
    subjectCode: string
    subjectName: string
    examTitle: string
    examDateTime: string
    durationMinutes: number
    formattedDuration: string
    roomId: string
    roomNumber: string
    building: string
    maxStudents: number
    registeredStudents: number
    availableSeats: number
    instructions?: string
    status: string
    academicYear: string
    semester: number
  }
  registration?: ExamRegistration
  canRegister: boolean
  registrationDeadline: string
}

export type CreateExamRegistrationDto = {
  sessionId: string
  specialRequirements?: string
}

export type UpdateExamRegistrationDto = {
  specialRequirements?: string
  status?: RegistrationStatus
  cancellationReason?: string
  attendanceStatus?: AttendanceStatus
  seatNumber?: string
}

export type GetExamRegistrationsParams = {
  sessionId?: string
  studentId?: string
  status?: RegistrationStatus
  attendanceStatus?: AttendanceStatus
  search?: string
  limit?: number
  page?: number
}

export type BackendExamRegistrationsListResponse = {
  registrations: ExamRegistration[]
  total: number
  page: number
  limit: number
  totalPages: number
}
