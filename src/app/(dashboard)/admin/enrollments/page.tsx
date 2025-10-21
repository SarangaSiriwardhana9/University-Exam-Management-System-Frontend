 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PlusIcon, FilterIcon, XIcon } from "lucide-react";
import { DataTable } from "@/components/data-display/data-table";
import { getEnrollmentColumns } from "@/features/enrollments/components/enrollment-columns";
import { useEnrollmentsQuery } from "@/features/enrollments/hooks/use-enrollments-query";
import { useDeleteEnrollment } from "@/features/enrollments/hooks/use-enrollment-mutations";
import type {
  StudentEnrollment,
  EnrollmentStatus,
} from "@/features/enrollments/types/enrollments";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { RoleGuard } from "@/lib/auth/role-guard";
import { USER_ROLES } from "@/constants/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ENROLLMENT_STATUS } from "@/features/enrollments/types/enrollments";
import { usePagination } from "@/lib/hooks/use-pagination";

const EnrollmentsPage = () => {
  const router = useRouter();
  const [deletingEnrollment, setDeletingEnrollment] =
    useState<StudentEnrollment | null>(null);
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | "all">("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { page, limit, pagination, onPaginationChange } = usePagination();
  
  const { data, isLoading } = useEnrollmentsQuery({ 
    page, 
    limit,
    status: statusFilter !== "all" ? statusFilter as EnrollmentStatus : undefined,
    year: yearFilter !== "all" ? parseInt(yearFilter) : undefined,
    semester: semesterFilter !== "all" ? parseInt(semesterFilter) : undefined,
    sortBy: 'createdAt',
    sortOrder,
  });
  const deleteMutation = useDeleteEnrollment();

  const handleDelete = () => {
    if (!deletingEnrollment) return;

    deleteMutation.mutate(deletingEnrollment._id, {
      onSuccess: () => {
        setDeletingEnrollment(null);
      },
    });
  };

  const columns = getEnrollmentColumns({
    onEdit: (enrollment) =>
      router.push(`/admin/enrollments/${enrollment._id}/edit`),
    onDelete: (enrollment) => setDeletingEnrollment(enrollment),
    onView: (enrollment) => router.push(`/admin/enrollments/${enrollment._id}`),
  });

  // Calculate stats
  const totalEnrollments = data?.data?.length || 0;
  const activeEnrollments =
    data?.data?.filter((e) => e.status === ENROLLMENT_STATUS.ACTIVE).length ||
    0;

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.EXAM_COORDINATOR]}>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Student Enrollments
            </h1>
            <p className='text-muted-foreground mt-1'>
              Manage student course enrollments
            </p>
          </div>
          <Button onClick={() => router.push("/admin/enrollments/create")}>
            <PlusIcon className='mr-2 h-4 w-4' />
            Add Enrollment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{totalEnrollments}</div>
              <p className='text-xs text-muted-foreground'>
                All time enrollments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{activeEnrollments}</div>
              <p className='text-xs text-muted-foreground'>
                Currently enrolled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {totalEnrollments > 0
                  ? Math.round(
                      ((data?.data?.filter(
                        (e) => e.status === ENROLLMENT_STATUS.COMPLETED
                      ).length || 0) /
                        totalEnrollments) *
                        100
                    )
                  : 0}
                %
              </div>
              <p className='text-xs text-muted-foreground'>
                Successfully completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <FilterIcon className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-medium'>Filters:</span>
            {(statusFilter !== 'all' || yearFilter !== 'all' || semesterFilter !== 'all') && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  setStatusFilter('all');
                  setYearFilter('all');
                  setSemesterFilter('all');
                }}
                className='h-8 px-2'
              >
                <XIcon className='h-3 w-3 mr-1' />
                Clear All
              </Button>
            )}
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EnrollmentStatus | "all")}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value={ENROLLMENT_STATUS.ACTIVE}>Active</SelectItem>
                <SelectItem value={ENROLLMENT_STATUS.WITHDRAWN}>Withdrawn</SelectItem>
                <SelectItem value={ENROLLMENT_STATUS.COMPLETED}>Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by year' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Years</SelectItem>
                <SelectItem value='1'>Year 1</SelectItem>
                <SelectItem value='2'>Year 2</SelectItem>
                <SelectItem value='3'>Year 3</SelectItem>
                <SelectItem value='4'>Year 4</SelectItem>
              </SelectContent>
            </Select>

            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by semester' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Semesters</SelectItem>
                <SelectItem value='1'>Semester 1</SelectItem>
                <SelectItem value='2'>Semester 2</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Sort by date' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='desc'>Newest First</SelectItem>
                <SelectItem value='asc'>Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enrollments Table */}
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <LoadingSpinner size='lg' />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data?.data || []}
            searchKey='studentName'
            searchPlaceholder='Search by student name...'
            pageCount={data?.totalPages ?? 0}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deletingEnrollment}
          onOpenChange={() => setDeletingEnrollment(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the enrollment for{" "}
                <strong>{deletingEnrollment?.studentName}</strong> in{" "}
                <strong>{deletingEnrollment?.subjectName}</strong>. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className='bg-destructive hover:bg-destructive/90'
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </RoleGuard>
  );
};

export default EnrollmentsPage;
