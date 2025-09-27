import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

export default function AdminDashboard() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Welcome to the Admin Dashboard. This is where you can manage the entire university system.</p>
        </div>
      </div>
    </RoleGuard>
  )
}