import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { ComingSoon } from '@/components/common/coming-soon'

export default function FacultyAssignmentsPage() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.FACULTY]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage student assignments
          </p>
        </div>
        <ComingSoon 
          title="Assignments Management"
          description="This feature is currently under development. You will soon be able to create assignments, set deadlines, and track student submissions."
        />
      </div>
    </RoleGuard>
  )
}
