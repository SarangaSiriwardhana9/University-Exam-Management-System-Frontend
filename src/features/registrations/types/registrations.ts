export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late'
} as const

export type AttendanceStatus = typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS]

export const REGISTRATION_STATUS = {
  REGISTERED: 'registered',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
} as const

export type RegistrationStatus = typeof REGISTRATION_STATUS[keyof typeof REGISTRATION_STATUS]

export type ExamRegistration = {
  _id: string
  sessionId: string
  examTitle?: string
  examDateTime?: string
  roomNumber?: string
  studentId: string
  studentName?: string
  studentEmail?: string
  registrationDate: string
  seatNumber?: string
  attendanceStatus?: AttendanceStatus
  specialRequirements?: string
  status: RegistrationStatus
  registeredBy: string
  registeredByName?: string
  cancelledAt?: string
  cancellationReason?: string
  createdAt: string
  updatedAt: string
}

export type CreateRegistrationDto = {
  sessionId: string
  studentId: string
  registrationDate: string
  seatNumber?: string
  specialRequirements?: string
}

export type UpdateRegistrationDto = Partial<CreateRegistrationDto> & {
  status?: RegistrationStatus
  attendanceStatus?: AttendanceStatus
  cancelledAt?: string
  cancellationReason?: string
}

export type RegistrationStats = {
  totalRegistrations: number
  registrationsByStatus: Record<string, number>
  attendanceStats: Record<string, number>
}

export type GetRegistrationsParams = {
  sessionId?: string
  studentId?: string
  status?: RegistrationStatus
  attendanceStatus?: AttendanceStatus
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}