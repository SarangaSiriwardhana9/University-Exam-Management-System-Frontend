export type Result = {
  _id: string
  sessionId: string
  examTitle?: string
  subjectCode?: string
  subjectName?: string
  examDate?: string
  studentId: string
  studentName?: string
  studentEmail?: string
  studentIdNumber?: string
  marksObtained: number
  totalMarks: number
  percentage: number
  grade?: string
  gradePoints?: number
  isPass: boolean
  remarks?: string
  enteredBy: string
  enteredByName?: string
  verifiedBy?: string
  verifiedByName?: string
  verifiedAt?: string
  isPublished: boolean
  publishedAt?: string
  publishedBy?: string
  enteredAt: string
  updatedAt: string
}

export type CreateResultDto = {
  sessionId: string
  studentId: string
  marksObtained: number
  totalMarks: number
  grade?: string
  gradePoints?: number
  remarks?: string
}

export type UpdateResultDto = Partial<CreateResultDto> & {
  verifiedBy?: string
  verifiedAt?: string
  isPublished?: boolean
  publishedAt?: string
  publishedBy?: string
}

export type ResultStats = {
  totalResults: number
  averagePercentage: number
  gradeDistribution: Record<string, number>
  passRate: number
}

export type GetResultsParams = {
  sessionId?: string
  studentId?: string
  subjectId?: string
  academicYear?: string
  semester?: number
  isPublished?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type StudentResultItem = {
  _id: string
  sessionId: string
  examTitle: string
  examDate: string
  paperTitle: string
  subjectCode: string
  subjectName: string
  marksObtained: number
  totalMarks: number
  percentage: number
  grade?: string
  gradePoints?: number
  isPass: boolean
  remarks?: string
  publishedAt?: string
}

export type GroupedResults = {
  [year: number]: {
    [semester: number]: StudentResultItem[]
  }
}

export type StudentResultsResponse = {
  results: GroupedResults
}