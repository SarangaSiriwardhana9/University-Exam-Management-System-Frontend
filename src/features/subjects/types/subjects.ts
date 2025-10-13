export type Subject = {
  _id: string
  subjectCode: string
  subjectName: string
  departmentId: string
  departmentName?: string
  year: number
  semester: number
  credits: number
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  licId?: string
  licName?: string
  lecturerIds?: string[]
  lecturers?: { _id: string; fullName: string }[]
}

export type CreateSubjectDto = {
  subjectCode: string
  subjectName: string
  departmentId: string
  year: number
  semester: number
  credits?: number
  description?: string
  licId?: string
  lecturerIds?: string[]
}

export type UpdateSubjectDto = Partial<Omit<CreateSubjectDto, 'subjectCode'>> & {
  isActive?: boolean
}

export type AssignFacultyDto = {
  facultyId: string
  year: number
  semester: number
  isCoordinator: boolean
  assignedDate: string
}

export type FacultyAssignment = {
  _id: string
  facultyId: string
  facultyName: string
  year: number
  semester: number
  isCoordinator: boolean
  assignedDate: string
}

export type SubjectStats = {
  totalSubjects: number
  subjectsByDepartment: Record<string, number>
  subjectsByYear: Record<string, number>
}

export type GetSubjectsParams = {
  departmentId?: string
  year?: number
  semester?: number
  isActive?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}