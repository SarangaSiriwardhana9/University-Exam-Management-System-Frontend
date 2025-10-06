 
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, BookOpenIcon, UsersIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAvailableSubjectsQuery } from '@/features/enrollments/hooks/use-enrollments-query'
import { useSelfEnrollment } from '@/features/enrollments/hooks/use-enrollment-mutations'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { useAuth } from '@/lib/auth/auth-provider'
import type { AvailableSubject } from '@/features/enrollments/types/enrollments'

const SelfEnrollmentPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const currentYear = new Date().getFullYear()
  
  const [academicYear, setAcademicYear] = useState<string>(`${currentYear}/${currentYear + 1}`)
  const [semester, setSemester] = useState<number>(1)

  const { data, isLoading, error } = useAvailableSubjectsQuery(academicYear, semester)
  const enrollMutation = useSelfEnrollment()

  const handleEnroll = (subjectId: string) => {
    enrollMutation.mutate(
      { subjectId, academicYear, semester },
      {
        onSuccess: () => {
          router.push('/student/enrollments')
        }
      }
    )
  }

  const academicYears = [
    `${currentYear}/${currentYear + 1}`,
    `${currentYear - 1}/${currentYear}`,
    `${currentYear + 1}/${currentYear + 2}`,
  ]

  const availableSubjects = data?.data || []
  const enrolledCount = availableSubjects.filter(s => s.isEnrolled).length
  const availableCount = availableSubjects.filter(s => !s.isEnrolled).length

  // Check if student has required info
  const hasRequiredInfo = user?.departmentId && user?.year

  return (
    <RoleGuard allowedRoles={[USER_ROLES.STUDENT]}>
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
            <h1 className="text-3xl font-bold text-gray-900">Enroll in Subjects</h1>
            <p className="text-muted-foreground mt-1">
              Browse and enroll in available subjects for your department and year
            </p>
          </div>
        </div>

        {/* Missing Information Alert */}
        {!hasRequiredInfo && (
          <Alert className="border-destructive/20 bg-destructive/5">
            <AlertCircleIcon className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              Your profile is incomplete. Please contact administration to set your department and academic year before enrolling in subjects.
            </AlertDescription>
          </Alert>
        )}

        {/* Period Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Academic Period</CardTitle>
            <CardDescription>
              Choose the academic year and semester to view available subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Academic Year</label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Semester</label>
                <Select 
                  value={semester.toString()} 
                  onValueChange={(value) => setSemester(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {hasRequiredInfo && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableSubjects.length}</div>
                <p className="text-xs text-muted-foreground">Available for your year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Already Enrolled</CardTitle>
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{enrolledCount}</div>
                <p className="text-xs text-muted-foreground">Current enrollments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available to Enroll</CardTitle>
                <BookOpenIcon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{availableCount}</div>
                <p className="text-xs text-muted-foreground">Ready to enroll</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subjects List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertCircleIcon className="h-16 w-16 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Subjects</h3>
              <p className="text-muted-foreground text-center">
                {(error as Error).message || 'Failed to load available subjects'}
              </p>
            </CardContent>
          </Card>
        ) : !hasRequiredInfo ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertCircleIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Profile Incomplete</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Please contact administration to complete your profile with department and academic year information before you can enroll in subjects.
              </p>
            </CardContent>
          </Card>
        ) : availableSubjects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpenIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Subjects Available</h3>
              <p className="text-muted-foreground text-center">
                There are no subjects available for your department and year in the selected academic period.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSubjects.map((subject: AvailableSubject) => (
              <Card 
                key={subject._id}
                className={subject.isEnrolled ? 'border-green-200 bg-green-50/50' : ''}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">
                        {subject.subjectName}
                      </CardTitle>
                      <p className="text-sm font-mono font-semibold text-primary">
                        {subject.subjectCode}
                      </p>
                    </div>
                    {subject.isEnrolled && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Enrolled
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subject.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {subject.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-muted-foreground">Credits</p>
                        <p className="font-semibold">{subject.credits}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Year</p>
                        <p className="font-semibold">Year {subject.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <UsersIcon className="w-4 h-4 mr-1" />
                      <span className="text-xs">
                        {subject.enrolledStudentsCount || 0} enrolled
                      </span>
                    </div>
                  </div>

                  {subject.departmentName && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        {subject.departmentName}
                      </p>
                    </div>
                  )}

                  <Button 
                    className="w-full"
                    disabled={subject.isEnrolled || enrollMutation.isPending}
                    onClick={() => handleEnroll(subject._id)}
                    variant={subject.isEnrolled ? 'outline' : 'default'}
                  >
                    {enrollMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Enrolling...</span>
                      </div>
                    ) : subject.isEnrolled ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        Already Enrolled
                      </>
                    ) : (
                      'Enroll Now'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  )
}

export default SelfEnrollmentPage