 
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, BookOpenIcon, GraduationCapIcon } from 'lucide-react';
import { DataTable } from '@/components/data-display/data-table';
import { getStudentEnrollmentColumns } from '@/features/enrollments/components/student-enrollment-columns';
import { useMyEnrollmentsQuery } from '@/features/enrollments/hooks/use-enrollments-query';
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
import type { EnrollmentStatus } from '@/features/enrollments/types/enrollments';
import { usePagination } from '@/lib/hooks/use-pagination';
import { useState } from 'react';

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
          <Button onClick={() => router.push('/student/enrollments/enroll')} className="bg-gradient-to-r from-student to-student/80 hover:from-student/90 hover:to-student/70">
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
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as EnrollmentStatus | 'all')}
                >
                  <SelectTrigger>
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
              <Button onClick={() => router.push('/student/enrollments/enroll')}>
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