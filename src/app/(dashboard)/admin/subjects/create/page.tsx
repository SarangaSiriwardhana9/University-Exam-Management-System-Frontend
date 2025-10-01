'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { SubjectForm } from '@/features/subjects/components/subject-form'
import { useCreateSubject } from '@/features/subjects/hooks/use-subject-mutations'
import type { CreateSubjectFormData } from '@/features/subjects/validations/subject-schemas'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const CreateSubjectPage = () => {
  const router = useRouter()
  const createMutation = useCreateSubject()

  const handleCreate = (data: CreateSubjectFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/admin/subjects')
      }
    })
  }

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Subject</h1>
            <p className="text-muted-foreground mt-1">
              Add a new subject to the university curriculum
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subject Information</CardTitle>
            <CardDescription>
              Fill in the details below to create a new subject.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubjectForm
              onSubmit={handleCreate}
              onCancel={() => router.push('/admin/subjects')}
              isLoading={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default CreateSubjectPage