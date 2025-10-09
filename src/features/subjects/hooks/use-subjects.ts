import { apiClient } from '@/lib/api/client'
import type { 
  Subject, 
  CreateSubjectDto, 
  UpdateSubjectDto, 
  AssignFacultyDto,
  FacultyAssignment,
  SubjectStats, 
  GetSubjectsParams 
} from '../types/subjects'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

type BackendSubjectsListResponse = {
  subjects: RawSubject[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type RawSubject = Omit<Subject, 'departmentId' | 'departmentName'> & {
  departmentId: string | { _id: string; departmentCode: string; departmentName: string }
}

const extractDepartmentName = (departmentId: RawSubject['departmentId']): string | undefined => {
  if (!departmentId) return undefined
  
  if (typeof departmentId === 'object' && '_id' in departmentId) {
    return departmentId.departmentName
  }
  
  if (typeof departmentId === 'string' && departmentId.includes('departmentName')) {
    try {
      const match = departmentId.match(/departmentName:\s*'([^']+)'/)
      if (match?.[1]) return match[1]
    } catch {
      return undefined
    }
  }
  
  return undefined
}

const extractDepartmentId = (departmentId: RawSubject['departmentId']): string | undefined => {
  if (!departmentId) return undefined
  
  if (typeof departmentId === 'string' && !departmentId.includes('{')) {
    return departmentId
  }
  
  if (typeof departmentId === 'object' && '_id' in departmentId) {
    return departmentId._id
  }
  
  if (typeof departmentId === 'string' && departmentId.includes('ObjectId')) {
    try {
      const match = departmentId.match(/ObjectId\('([^']+)'\)/)
      if (match?.[1]) return match[1]
    } catch {
      return undefined
    }
  }
  
  return undefined
}

const transformSubject = (subj: RawSubject): Subject => {
  const departmentId = extractDepartmentId(subj.departmentId)
  const departmentName = (subj as Record<string, unknown>).departmentName as string | undefined || extractDepartmentName(subj.departmentId)
  
  let licId: string | undefined = undefined
  let licName: string | undefined = undefined
  
  if (subj['licId']) {
    const lic = subj['licId'] as Record<string, unknown>
    if (typeof lic === 'string') {
      licId = lic
    } else if (lic?._id) {
      licId = lic._id as string
      licName = lic.fullName as string
    }
  }
  
  if (!licName && (subj as Record<string, unknown>).licName) {
    licName = (subj as Record<string, unknown>).licName as string
  }

  let lecturerIds: string[] | undefined = undefined
  let lecturers: { _id: string; fullName: string }[] | undefined = undefined
  
  if (Array.isArray(subj['lecturerIds'])) {
    const arr = subj['lecturerIds'] as Record<string, unknown>[]
    lecturerIds = arr.map((x) => (x?._id ? String(x._id) : String(x)))
    
    if (arr.length > 0 && arr[0]?._id) {
      lecturers = arr.map((x) => ({ 
        _id: String(x._id), 
        fullName: x.fullName as string 
      }))
    } else if ((subj as Record<string, unknown>).lecturers && Array.isArray((subj as Record<string, unknown>).lecturers)) {
      const subjLecturers = (subj as Record<string, unknown>).lecturers as Record<string, unknown>[]
      lecturers = subjLecturers.map((x) => ({ 
        _id: x._id?.toString() ?? String(x._id), 
        fullName: x.fullName as string 
      }))
    }
  }

  return {
    ...subj,
    departmentId: departmentId || '',
    departmentName,
    licId,
    licName,
    lecturerIds,
    lecturers
  }
}

export const subjectsService = {
  getAll: async (params?: GetSubjectsParams): Promise<PaginatedResponse<Subject>> => {
    const response = await apiClient.get<BackendSubjectsListResponse>('/api/v1/subjects', { params })
    return {
      data: (response.subjects || []).map(transformSubject),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<Subject>> => {
    const subject = await apiClient.get<RawSubject>(`/api/v1/subjects/${id}`)
    return {
      data: transformSubject(subject)
    }
  },

  getByDepartment: async (departmentId: string): Promise<ApiResponse<Subject[]>> => {
    const subjects = await apiClient.get<RawSubject[]>(`/api/v1/subjects/department/${departmentId}`)
    return {
      data: Array.isArray(subjects) ? subjects.map(transformSubject) : []
    }
  },

  getStats: (): Promise<ApiResponse<SubjectStats>> =>
    apiClient.get('/api/v1/subjects/stats'),

  create: async (data: CreateSubjectDto): Promise<ApiResponse<Subject>> => {
    const subject = await apiClient.post<RawSubject>('/api/v1/subjects', data)
    return {
      data: transformSubject(subject)
    }
  },

  update: async (id: string, data: UpdateSubjectDto): Promise<ApiResponse<Subject>> => {
    const subject = await apiClient.patch<RawSubject>(`/api/v1/subjects/${id}`, data)
    return {
      data: transformSubject(subject)
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/subjects/${id}`),

  assignFaculty: (id: string, data: AssignFacultyDto): Promise<ApiResponse<FacultyAssignment>> =>
    apiClient.post(`/api/v1/subjects/${id}/assign-faculty`, data),

  getFacultyAssignments: (id: string, params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<FacultyAssignment[]>> =>
    apiClient.get(`/api/v1/subjects/${id}/faculty`, { params }),

  getMyAssignments: (params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<FacultyAssignment[]>> =>
    apiClient.get('/api/v1/subjects/my', { params }),

  getMySubjects: async (params?: GetSubjectsParams, userId?: string): Promise<PaginatedResponse<Subject>> => {
    const resp = await apiClient.get<FacultyAssignment[]>('/api/v1/subjects/my')
    const assignments = Array.isArray(resp) ? resp : []

    let subjects: Subject[] = []
    
    if (assignments.length === 0 && userId) {
      const all = await apiClient.get<BackendSubjectsListResponse>('/api/v1/subjects', { 
        params: { page: 1, limit: 2000 } 
      })
      const rawSubjects = Array.isArray(all.subjects) ? all.subjects : []
      subjects = rawSubjects.map(transformSubject).filter((s) => {
        if (s.licId && s.licId === userId) return true
        if (Array.isArray(s.lecturerIds) && s.lecturerIds.includes(userId)) return true
        return false
      })
    } else {
      subjects = assignments.map((a: Record<string, unknown>) => {
        const s = (a.subjectId || {}) as Record<string, unknown>
        const raw: RawSubject = {
          _id: (s._id ?? s.subjectId ?? '') as string,
          subjectCode: (s.subjectCode ?? '') as string,
          subjectName: (s.subjectName ?? '') as string,
          departmentId: (s.departmentId && (typeof s.departmentId === 'string' || (s.departmentId as Record<string, unknown>)._id)) 
            ? s.departmentId as RawSubject['departmentId']
            : '',
          year: (s.year ?? 0) as number,
          credits: (s.credits ?? 0) as number,
          description: s.description as string | undefined,
          isActive: (s.isActive ?? true) as boolean,
          createdAt: (s.createdAt ?? new Date().toISOString()) as string,
          updatedAt: (s.updatedAt ?? new Date().toISOString()) as string,
        }
        return transformSubject(raw)
      })
    }

    const page = params?.page ?? 1
    const limit = params?.limit ?? 10
    const total = subjects.length
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const start = (page - 1) * limit
    const paged = subjects.slice(start, start + limit)

    return {
      data: paged,
      total,
      page,
      limit,
      totalPages,
    }
  },

  removeFacultyAssignment: (assignmentId: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/subjects/faculty-assignment/${assignmentId}`)
}
