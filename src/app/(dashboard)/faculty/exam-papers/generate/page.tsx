 
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { GeneratePaperForm } from '@/features/exam-papers/components/generate-paper-form'
import { useGenerateExamPaper } from '@/features/exam-papers/hooks/use-exam-paper-mutations'
import type { GeneratePaperFormData } from '@/features/exam-papers/validations/exam-paper-schemas'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const GenerateExamPaperPage = () => {
  const router = useRouter()
  const generateMutation = useGenerateExamPaper()

  const handleGenerate = (data: GeneratePaperFormData) => {
    generateMutation.mutate(data, {
      onSuccess: (response) => {
        router.push(`/faculty/exam-papers/${response.data._id}/edit`)
      }
    })
  }

  return (
    <RoleGuard allowedRoles={[USER_ROLES.FACULTY, USER_ROLES.ADMIN]}>
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
            <h1 className="text-3xl font-bold text-gray-900">Generate Exam Paper</h1>
            <p className="text-muted-foreground mt-1">
              Automatically generate paper based on criteria
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generation Criteria</CardTitle>
            <CardDescription>
              Define your requirements and let the system select matching questions automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GeneratePaperForm
              onSubmit={handleGenerate}
              onCancel={() => router.push('/faculty/exam-papers')}
              isLoading={generateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default GenerateExamPaperPage