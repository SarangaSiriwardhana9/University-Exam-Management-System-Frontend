'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { ReportForm } from '@/features/reports/components/report-form'
import { useGenerateReport } from '@/features/reports/hooks/use-report-mutations'
import type { GenerateReportFormData } from '@/features/reports/validations/report-schemas'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const GenerateReportPage = () => {
  const router = useRouter()
  const generateMutation = useGenerateReport()

  const handleGenerate = (data: GenerateReportFormData) => {
    generateMutation.mutate(data, {
      onSuccess: () => {
        router.push('/admin/reports')
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
            <h1 className="text-3xl font-bold text-gray-900">Generate New Report</h1>
            <p className="text-muted-foreground mt-1">
              Configure and generate a new system report
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>
              Select the report type and configure the parameters below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportForm
              onSubmit={handleGenerate}
              onCancel={() => router.push('/admin/reports')}
              isLoading={generateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default GenerateReportPage