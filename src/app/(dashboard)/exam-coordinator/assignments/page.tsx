import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { ComingSoon } from '@/components/common/coming-soon'

export default function AssignmentsPage() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.EXAM_COORDINATOR]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invigilator Assignments</h1>
          <p className="text-muted-foreground mt-1">
            Manage invigilator assignments for exam sessions
          </p>
        </div>
        <ComingSoon 
          title="Invigilator Assignments"
          description="This feature is currently under development. You will soon be able to assign invigilators to exam sessions, track availability, and manage bulk assignments."
        />
      </div>
    </RoleGuard>
  )
}
