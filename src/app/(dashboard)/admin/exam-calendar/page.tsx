'use client'

import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { AdminExamCalendarView } from '@/features/exam-sessions/components/admin-exam-calendar-view'

export default function AdminExamCalendarPage() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.EXAM_COORDINATOR]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Calendar</h1>
          <p className="text-gray-600 mt-2">View all scheduled exams across all years and semesters</p>
        </div>
        
        <AdminExamCalendarView />
      </div>
    </RoleGuard>
  )
}
