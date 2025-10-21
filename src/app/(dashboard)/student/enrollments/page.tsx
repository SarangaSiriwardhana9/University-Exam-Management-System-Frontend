 
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, BookOpenIcon, GraduationCapIcon, UsersIcon, CheckCircleIcon } from 'lucide-react';
import { DataTable } from '@/components/data-display/data-table';
import { getStudentEnrollmentColumns } from '@/features/enrollments/components/student-enrollment-columns';
import { useMyEnrollmentsQuery, useAvailableSubjectsQuery } from '@/features/enrollments/hooks/use-enrollments-query';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { RoleGuard } from '@/lib/auth/role-guard';
import { USER_ROLES } from '@/constants/roles';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ENROLLMENT_STATUS } from '@/features/enrollments/types/enrollments';
import type { EnrollmentStatus, AvailableSubject } from '@/features/enrollments/types/enrollments';
import { usePagination } from '@/lib/hooks/use-pagination';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSelfEnrollment } from '@/features/enrollments/hooks/use-enrollment-mutations'

const StudentEnrollmentsPage = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | 'all'>('all');

  const { page, limit, pagination, onPaginationChange } = usePagination();
  const queryParams = {
    page,
    limit,
    ...(statusFilter !== 'all' && { status: statusFilter }),
  };

  const { data, isLoading } = useMyEnrollmentsQuery(queryParams);

  // Local state to show/hide the enroll panel (merged from the separate enroll page)
  const [showEnrollPanel, setShowEnrollPanel] = useState(false)

  // Self-enroll controls
  const [year, setYear] = useState<number>(1)
  const [semester, setSemester] = useState<number>(1)

  const { data: availableData, isLoading: isAvailableLoading, error: availableError } = useAvailableSubjectsQuery(year, semester)
  const enrollMutation = useSelfEnrollment()
  const availableSubjects = availableData?.data || []

  const columns = getStudentEnrollmentColumns({
    onView: (enrollment) => router.push(`/student/enrollments/${enrollment._id}`),
  });

  const totalEnrollments = data?.total ?? 0;
  const activeEnrollments = data?.data?.filter((e) => e.status === ENROLLMENT_STATUS.ACTIVE).length ?? 0;
  const totalCredits = data?.data
    ?.filter((e) => e.status === ENROLLMENT_STATUS.ACTIVE)
    .reduce((sum, e) => sum + (e.subjectCredits || 0), 0) ?? 0;

  return (
    <RoleGuard allowedRoles={[USER_ROLES.STUDENT]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Enrollments</h1>
            <p className="text-muted-foreground mt-1">View and manage your course enrollments</p>
          </div>
          <Button onClick={() => setShowEnrollPanel((v) => !v)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Enroll in Subject
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEnrollments}</div>
              <p className="text-xs text-muted-foreground">Across all pages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
              <GraduationCapIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEnrollments}</div>
              <p className="text-xs text-muted-foreground">Currently enrolled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCredits}</div>
              <p className="text-xs text-muted-foreground">Active subjects</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="status-select" className="text-sm font-medium mb-2 block">Status</label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as EnrollmentStatus | 'all')}
                >
                  <SelectTrigger id="status-select">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value={ENROLLMENT_STATUS.ACTIVE}>Active</SelectItem>
                    <SelectItem value={ENROLLMENT_STATUS.WITHDRAWN}>Withdrawn</SelectItem>
                    <SelectItem value={ENROLLMENT_STATUS.COMPLETED}>Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inline Enroll Panel (merged feature from /enroll) */}
        {showEnrollPanel && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Enroll in Subjects</h2>
                  <p className="text-sm text-muted-foreground">Browse and enroll in available subjects for your department and year</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowEnrollPanel(false)}>Close</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Period selection */}
              <div className="flex gap-2 mb-4">
                <Select value={year.toString()} onValueChange={(v) => setYear(Number(v))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={semester.toString()} onValueChange={(v) => setSemester(Number(v))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isAvailableLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : availableError ? (
                <Alert>
                  <AlertDescription>{availableError?.message || 'Failed to load available subjects'}</AlertDescription>
                </Alert>
              ) : availableSubjects.length === 0 ? (
                <CardContent className="py-8 text-center">No subjects available for the selected period.</CardContent>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableSubjects.map((subject: AvailableSubject) => (
                    <Card key={subject._id} className={`flex flex-col ${subject.isEnrolled ? 'border-green-200 bg-green-50/50' : ''}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">{subject.subjectName}</CardTitle>
                            <p className="text-sm font-mono font-semibold text-primary">{subject.subjectCode}</p>
                          </div>
                          {subject.isEnrolled && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              Enrolled
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-1 space-y-4">
                        <div className="min-h-[2.5rem]">
                          {subject.description ? (
                            <p className="text-sm text-muted-foreground line-clamp-2">{subject.description}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No description available</p>
                          )}
                        </div>
                        
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
                            <span className="text-xs">{subject.enrolledStudentsCount || 0} enrolled</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t min-h-[2rem]">
                          {subject.departmentName ? (
                            <p className="text-xs text-muted-foreground">{subject.departmentName}</p>
                          ) : (
                            <p className="text-xs text-muted-foreground invisible">-</p>
                          )}
                        </div>

                        <Button className="w-full mt-auto" disabled={subject.isEnrolled || enrollMutation.isPending} onClick={() => enrollMutation.mutate({ subjectId: subject._id, year, semester }, { onSuccess: () => setShowEnrollPanel(false) })} variant={subject.isEnrolled ? 'outline' : 'default'}>
                          {enrollMutation.isPending ? (
                            <div className="flex items-center space-x-2"><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> <span>Enrolling...</span></div>
                          ) : subject.isEnrolled ? (
                            <><CheckCircleIcon className="w-4 h-4 mr-2" /> Already Enrolled</>
                          ) : (
                            'Enroll Now'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Enrollments Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : data?.data?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpenIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Enrollments Yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                You haven&lsquo;t enrolled in any subjects. Start by enrolling in available subjects.
              </p>
              <Button onClick={() => setShowEnrollPanel(true)}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Enroll in Subject
              </Button>
            </CardContent>
          </Card>
        ) : (
          <DataTable
            columns={columns}
            data={data?.data || []}
            searchKey="subjectName"
            searchPlaceholder="Search by subject name..."
            pageCount={data?.totalPages ?? 0}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
          />
        )}
      </div>
    </RoleGuard>
  );
};

export default StudentEnrollmentsPage;