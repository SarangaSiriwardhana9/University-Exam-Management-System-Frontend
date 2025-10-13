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
  subjects: BackendSubject[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type BackendSubject = Omit<Subject, 'departmentId' | 'departmentName' | 'licId' | 'licName' | 'lecturerIds' | 'lecturers'> & {
  departmentId: string | { _id: string; departmentCode: string; departmentName: string }
  licId?: string | { _id: string; fullName: string; email: string }
  lecturerIds?: (string | { _id: string; fullName: string; email: string })[]
}

const extractId = (value: string | { _id: string } | null | undefined): string | undefined => {
  if (!value) return undefined
  return typeof value === 'string' ? value : value._id
}

const extractName = (value: { fullName?: string; departmentName?: string } | null | undefined): string | undefined => {
  if (!value || typeof value !== 'object') return undefined
  return value.fullName || value.departmentName
}

const transformSubject = (subj: any): Subject => {
  return {
    _id: subj._id,
    subjectCode: subj.subjectCode,
    subjectName: subj.subjectName,
    departmentId: typeof subj.departmentId === 'string' ? subj.departmentId : subj.departmentId?._id || '',
    departmentName: subj.departmentName || (typeof subj.departmentId === 'object' ? subj.departmentId?.departmentName : undefined),
    year: subj.year,
    semester: subj.semester,
    credits: subj.credits,
    description: subj.description,
    licId: typeof subj.licId === 'string' ? subj.licId : subj.licId?._id,
    licName: subj.licName || (typeof subj.licId === 'object' ? subj.licId?.fullName : undefined),
    lecturerIds: subj.lecturerIds?.map((l: any) => typeof l === 'string' ? l : l._id).filter(Boolean),
    lecturers: subj.lecturers || subj.lecturerIds?.filter((l: any) => typeof l === 'object').map((l: any) => ({ _id: l._id, fullName: l.fullName })),
    isActive: subj.isActive,
    createdAt: subj.createdAt,
    updatedAt: subj.updatedAt
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
    const subject = await apiClient.get<BackendSubject>(`/api/v1/subjects/${id}`)
    return {
      data: transformSubject(subject)
    }
  },

  getByDepartment: async (departmentId: string): Promise<ApiResponse<Subject[]>> => {
    const subjects = await apiClient.get<BackendSubject[]>(`/api/v1/subjects/department/${departmentId}`)
    return {
      data: Array.isArray(subjects) ? subjects.map(transformSubject) : []
    }
  },

  getStats: (): Promise<ApiResponse<SubjectStats>> =>
    apiClient.get('/api/v1/subjects/stats'),

  create: async (data: CreateSubjectDto): Promise<ApiResponse<Subject>> => {
    const subject = await apiClient.post<BackendSubject>('/api/v1/subjects', data)
    return {
      data: transformSubject(subject)
    }
  },

  update: async (id: string, data: UpdateSubjectDto): Promise<ApiResponse<Subject>> => {
    const subject = await apiClient.patch<BackendSubject>(`/api/v1/subjects/${id}`, data)
    return {
      data: transformSubject(subject)
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/subjects/${id}`),

  assignFaculty: (id: string, data: AssignFacultyDto): Promise<ApiResponse<FacultyAssignment>> =>
    apiClient.post(`/api/v1/subjects/${id}/assign-faculty`, data),

  getFacultyAssignments: (id: string, params?: { year?: number; semester?: number }): Promise<ApiResponse<FacultyAssignment[]>> =>
    apiClient.get(`/api/v1/subjects/${id}/faculty`, { params }),

  getMyAssignments: (params?: { year?: number; semester?: number }): Promise<ApiResponse<FacultyAssignment[]>> =>
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
        const raw: BackendSubject = {
          _id: (s._id ?? s.subjectId ?? '') as string,
          subjectCode: (s.subjectCode ?? '') as string,
          subjectName: (s.subjectName ?? '') as string,
          departmentId: (s.departmentId && (typeof s.departmentId === 'string' || (s.departmentId as Record<string, unknown>)._id)) 
            ? s.departmentId as BackendSubject['departmentId']
            : '',
          year: (s.year ?? 0) as number,
          semester: (s.semester ?? 1) as number,
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
