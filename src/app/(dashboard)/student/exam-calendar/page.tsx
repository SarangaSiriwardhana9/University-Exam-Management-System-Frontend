'use client'

import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { ExamCalendarView } from '@/features/exam-registrations/components/exam-calendar-view'

export default function StudentExamCalendarPage() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.STUDENT]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Exam Calendar</h1>
          <p className="text-gray-600 mt-2">View all your scheduled exams with dates, times, and locations</p>
        </div>
        
        <ExamCalendarView />
      </div>
    </RoleGuard>
  )
}
