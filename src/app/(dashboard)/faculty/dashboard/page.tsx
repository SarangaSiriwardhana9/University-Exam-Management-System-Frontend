import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

export default function FacultyDashboard() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.FACULTY]}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Faculty Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Welcome to the Faculty Dashboard. Manage your subjects, questions, and exam papers here.</p>
        </div>
      </div>
    </RoleGuard>
  )
}