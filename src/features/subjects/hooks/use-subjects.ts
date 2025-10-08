/* eslint-disable @typescript-eslint/no-explicit-any */
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
  subjects: Subject[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type RawSubject = Omit<Subject, 'departmentId' | 'departmentName'> & {
  departmentId: string | { _id: string; departmentCode: string; departmentName: string }
}

// Helper function to extract department name
const extractDepartmentName = (departmentId: RawSubject['departmentId']): string | undefined => {
  if (!departmentId) return undefined
  
  // If it's already an object
  if (typeof departmentId === 'object' && '_id' in departmentId) {
    return departmentId.departmentName
  }
  
  // If it's a stringified object (malformed backend response)
  if (typeof departmentId === 'string' && departmentId.includes('departmentName')) {
    try {
      // Try to extract the departmentName from the string
      const match = departmentId.match(/departmentName:\s*'([^']+)'/)
      if (match && match[1]) {
        return match[1]
      }
    } catch (error) {
      console.error('Failed to parse departmentId:', error)
    }
  }
  
  return undefined
}

// Helper function to extract department ID
const extractDepartmentId = (departmentId: RawSubject['departmentId']): string | undefined => {
  if (!departmentId) return undefined
  
  // If it's a string ID
  if (typeof departmentId === 'string' && !departmentId.includes('{')) {
    return departmentId
  }
  
  // If it's an object
  if (typeof departmentId === 'object' && '_id' in departmentId) {
    return departmentId._id
  }
  
  // If it's a stringified object
  if (typeof departmentId === 'string' && departmentId.includes('ObjectId')) {
    try {
      const match = departmentId.match(/ObjectId\('([^']+)'\)/)
      if (match && match[1]) {
        return match[1]
      }
    } catch (error) {
      console.error('Failed to parse departmentId:', error)
    }
  }
  
  return undefined
}

// Transform subject to normalize the data
const transformSubject = (subj: RawSubject): Subject => {
  const departmentId = extractDepartmentId(subj.departmentId)
  // prefer top-level departmentName if backend provided it
  const departmentName = (subj as any).departmentName || extractDepartmentName(subj.departmentId)
  // Extract LIC and lecturers if populated
  let licId: string | undefined = undefined
  let licName: string | undefined = undefined
  if (subj['licId']) {
    const lic = subj['licId'] as any
    if (typeof lic === 'string') licId = lic
    else if (lic && lic._id) {
      licId = lic._id
      licName = lic.fullName
    }
  }
  // backend might return licName as top-level when licId is a string
  if (!licName && (subj as any).licName) {
    licName = (subj as any).licName
  }

  let lecturerIds: string[] | undefined = undefined
  let lecturers: { _id: string; fullName: string }[] | undefined = undefined
  if (Array.isArray(subj['lecturerIds'])) {
    const arr = subj['lecturerIds'] as any[]
    lecturerIds = arr.map((x) => (x && x._id ? x._id : String(x)))
    // if lecturers are populated as objects, use their fullName; otherwise try to find a parallel top-level 'lecturers' list
    if (arr.length > 0 && arr[0] && arr[0]._id) {
      lecturers = arr.map((x) => ({ _id: x._id ? x._id : String(x), fullName: x.fullName }))
    } else if ((subj as any).lecturers && Array.isArray((subj as any).lecturers)) {
      lecturers = (subj as any).lecturers.map((x: any) => ({ _id: x._id?.toString() ?? String(x._id), fullName: x.fullName }))
    } else {
      // when we only have lecturerIds (strings), leave lecturers undefined so UI can show '-' or use IDs only
      lecturers = undefined
    }
  }

  return {
    ...subj,
    departmentId: departmentId || '',
    departmentName: departmentName,
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

  // Client-side wrapper: fetch faculty assignments and convert to a paginated Subject list
  getMySubjects: async (params?: GetSubjectsParams, userId?: string): Promise<PaginatedResponse<Subject>> => {
    const resp = await apiClient.get<FacultyAssignment[]>('/api/v1/subjects/my')
    const assignments = Array.isArray(resp) ? resp : []

    // If backend has no faculty_subjects yet, fallback to scanning subjects and matching by licId/lecturerIds
    let subjects: Subject[] = []
    if (assignments.length === 0 && userId) {
  // fetch up to 2000 subjects for client-side filtering (adjust if needed)
  const all = await apiClient.get<BackendSubjectsListResponse>('/api/v1/subjects', { params: { page: 1, limit: 2000 } })
      const rawSubjects = Array.isArray(all.subjects) ? all.subjects : all.subjects || []
      subjects = rawSubjects.map(transformSubject).filter((s) => {
        // match licId or lecturerIds
        if (s.licId && s.licId === userId) return true
        if (Array.isArray(s.lecturerIds) && s.lecturerIds.includes(userId)) return true
        return false
      })
    } else {

      // Convert each assignment.subjectId (may be populated object) into a Subject-like object
      subjects = assignments.map((a: any) => {
      const s = a.subjectId || {}
      const raw: RawSubject = {
        _id: s._id ?? s.subjectId ?? '',
        subjectCode: s.subjectCode ?? '',
        subjectName: s.subjectName ?? '',
        departmentId: (s.departmentId && (typeof s.departmentId === 'string' || s.departmentId._id)) ? s.departmentId : '',
        year: s.year ?? 0,
        credits: s.credits ?? 0,
        description: s.description,
        isActive: s.isActive ?? true,
        createdAt: s.createdAt ?? new Date().toISOString(),
        updatedAt: s.updatedAt ?? new Date().toISOString(),
      }
      return transformSubject(raw)
    })
    }

    // apply simple client-side pagination
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