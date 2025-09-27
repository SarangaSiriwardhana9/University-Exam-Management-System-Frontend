import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

export default function ExamCoordinatorDashboard() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.EXAM_COORDINATOR]}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Exam Coordinator Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Welcome to the Exam Coordinator Dashboard. Manage exam sessions and registrations here.</p>
        </div>
      </div>
    </RoleGuard>
  )
}