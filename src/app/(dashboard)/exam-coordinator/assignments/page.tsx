'use client'

import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CalendarCheckIcon, 
  SparklesIcon, 
  RocketIcon,
  ArrowLeftIcon 
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AssignmentsPage() {
  const router = useRouter()

  return (
    <RoleGuard allowedRoles={[USER_ROLES.EXAM_COORDINATOR]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invigilator Assignments</h1>
            <p className="text-muted-foreground mt-1">
              Manage invigilator assignments for exam sessions
            </p>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="flex items-center justify-center min-h-[500px]">
          <Card className="max-w-2xl w-full">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
                  <div className="relative bg-primary p-6 rounded-full">
                    <RocketIcon className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-primary    ">
                Coming Soon
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Invigilator Assignment Management
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground">
                We're working hard to bring you a comprehensive invigilator assignment system. 
                This feature will allow you to:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
                  <SparklesIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Assign Invigilators</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Easily assign invigilators to exam sessions
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
                  <SparklesIcon className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Bulk Assignments</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Assign multiple invigilators at once
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
                  <SparklesIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Availability Tracking</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Check invigilator availability and conflicts
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
                  <SparklesIcon className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Assignment Reports</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      View and export assignment statistics
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/exam-coordinator/dashboard')}
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  )
}
