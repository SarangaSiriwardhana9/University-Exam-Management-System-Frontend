 
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
  enrolledBy?: string
  enrolledByName?: string
  createdAt: string
  updatedAt: string
}


export type AvailableSubject = {
  _id: string
  subjectCode: string
  subjectName: string
  year: number
  credits: number
  description?: string
  departmentId: string
  departmentName?: string
  isEnrolled: boolean
  enrolledStudentsCount?: number
}

export type CreateEnrollmentDto = {
  studentId: string
  subjectId: string
  academicYear: string
  semester: number
  enrollmentDate?: string
}


export type SelfEnrollmentDto = {
  subjectId: string
  academicYear: string
  semester: number
}

export type UpdateEnrollmentDto = {
  academicYear?: string
  semester?: number
  enrollmentDate?: string
  status?: EnrollmentStatus
  withdrawnReason?: string
  withdrawnDate?: string
}

export type EnrollmentStats = {
  totalEnrollments: number
  activeEnrollments: number
  withdrawnEnrollments: number
  completedEnrollments: number
  averageEnrollmentsPerSubject: number
  averageEnrollmentsPerStudent: number
}

export type GetEnrollmentsParams = {
  studentId?: string
  subjectId?: string
  academicYear?: string
  semester?: number
  status?: EnrollmentStatus
  page?: number
  limit?: number
  search?: string
}