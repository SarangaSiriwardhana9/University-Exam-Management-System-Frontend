export const ASSIGNMENT_TYPE = {
  CHIEF: 'chief',
  ASSISTANT: 'assistant',
  SUBSTITUTE: 'substitute'
} as const

export type AssignmentType = typeof ASSIGNMENT_TYPE[keyof typeof ASSIGNMENT_TYPE]

export const ASSIGNMENT_STATUS = {
  ASSIGNED: 'assigned',
  CONFIRMED: 'confirmed',
  DECLINED: 'declined',
  COMPLETED: 'completed'
} as const

export type AssignmentStatus = typeof ASSIGNMENT_STATUS[keyof typeof ASSIGNMENT_STATUS]

export type InvigilatorAssignment = {
  _id: string
  sessionId: string
  examTitle?: string
  examDateTime?: string
  roomNumber?: string
  invigilatorId: string
  invigilatorName?: string
  invigilatorEmail?: string
  assignmentType: AssignmentType
  assignedBy: string
  assignedByName?: string
  assignmentDate: string
  status: AssignmentStatus
  confirmedAt?: string
  declinedAt?: string
  declineReason?: string
  completedAt?: string
  notes?: string
  specialInstructions?: string
  createdAt: string
  updatedAt: string
}

export type CreateAssignmentDto = {
  sessionId: string
  invigilatorId: string
  assignmentType: AssignmentType
  assignmentDate: string
  notes?: string
  specialInstructions?: string
}

export type UpdateAssignmentDto = Partial<CreateAssignmentDto> & {
  status?: AssignmentStatus
  confirmedAt?: string
  declinedAt?: string
  declineReason?: string
  completedAt?: string
}

export type AssignmentStats = {
  totalAssignments: number
  assignmentsByStatus: Record<string, number>
  assignmentsByType: Record<string, number>
}

export type GetAssignmentsParams = {
  sessionId?: string
  invigilatorId?: string
  assignmentType?: AssignmentType
  status?: AssignmentStatus
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}