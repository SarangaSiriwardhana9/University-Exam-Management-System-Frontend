export const ENROLLMENT_STATUS = {
  ACTIVE: 'active',
  WITHDRAWN: 'withdrawn',
  COMPLETED: 'completed'
} as const

export type EnrollmentStatus = typeof ENROLLMENT_STATUS[keyof typeof ENROLLMENT_STATUS]

export type StudentEnrollment = {
  _id: string
  studentId: string
  studentName?: string
  studentEmail?: string
  subjectId: string
  subjectCode?: string
  subjectName?: string
  subjectCredits?: number
  academicYear: string
  semester: number
  enrollmentDate: string
  status: EnrollmentStatus
  withdrawnDate?: string
  withdrawnReason?: string
  enrolledBy: string
  enrolledByName?: string
  createdAt: string
  updatedAt: string
}

export type CreateEnrollmentDto = {
  studentId: string
  subjectId: string
  academicYear: string
  semester: number
  enrollmentDate: string
}

export type UpdateEnrollmentDto = Partial<CreateEnrollmentDto> & {
  status?: EnrollmentStatus
  withdrawnDate?: string
  withdrawnReason?: string
}

export type EnrollmentStats = {
  totalEnrollments: number
  enrollmentsByStatus: Record<string, number>
  enrollmentsBySubject: Record<string, number>
}

export type GetEnrollmentsParams = {
  studentId?: string
  subjectId?: string
  academicYear?: string
  semester?: number
  status?: EnrollmentStatus
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}