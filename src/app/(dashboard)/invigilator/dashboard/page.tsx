import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

export default function InvigilatorDashboard() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.INVIGILATOR]}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Invigilator Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Welcome to the Invigilator Dashboard. View your exam assignments here.</p>
        </div>
      </div>
    </RoleGuard>
  )
}