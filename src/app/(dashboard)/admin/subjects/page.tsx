"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { getSubjectColumns } from "@/features/subjects/components/subject-columns";
import { useSubjectsQuery } from "@/features/subjects/hooks/use-subjects-query";
import { useDeleteSubject } from "@/features/subjects/hooks/use-subject-mutations";
import { useDepartmentsQuery } from "@/features/departments/hooks/use-departments-query";
import type { Subject } from "@/features/subjects/types/subjects";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { RoleGuard } from "@/lib/auth/role-guard";
import { USER_ROLES } from "@/constants/roles";
import { usePagination } from "@/lib/hooks/use-pagination";

const SubjectsPage = () => {
  const router = useRouter();
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [semesterFilter, setSemesterFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { page, limit, pagination, onPaginationChange } = usePagination();
  
  const { data: departmentsData } = useDepartmentsQuery({ limit: 1000, isActive: true });
  
  const { data, isLoading } = useSubjectsQuery({ 
    page, 
    limit,
    departmentId: departmentFilter !== 'all' ? departmentFilter : undefined,
    year: yearFilter !== 'all' ? parseInt(yearFilter) : undefined,
    semester: semesterFilter !== 'all' ? parseInt(semesterFilter) : undefined,
    sortBy: 'createdAt',
    sortOrder,
  });
  const deleteMutation = useDeleteSubject();

  const handleDelete = () => {
    if (!deletingSubject) return;

    deleteMutation.mutate(deletingSubject._id, {
      onSuccess: () => {
        setDeletingSubject(null);
      },
    });
  };

  const columns = getSubjectColumns({
    onEdit: (subject) => router.push(`/admin/subjects/${subject._id}/edit`),
    onDelete: (subject) => setDeletingSubject(subject),
    onView: (subject) => router.push(`/admin/subjects/${subject._id}`),
  });

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Subjects Management
            </h1>
            <p className='text-muted-foreground mt-1'>
              Manage all subjects offered by the university
            </p>
          </div>
          <Button onClick={() => router.push("/admin/subjects/create")}>
            <PlusIcon className='mr-2 h-4 w-4' />
            Add Subject
          </Button>
        </div>

        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <FilterIcon className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-medium'>Filters:</span>
            {(departmentFilter !== 'all' || yearFilter !== 'all' || semesterFilter !== 'all') && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  setDepartmentFilter('all');
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

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder='Filter by department' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Departments</SelectItem>
                {departmentsData?.data?.map((dept) => (
                  <SelectItem key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
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
              <SelectTrigger>
                <SelectValue placeholder='Filter by semester' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Semesters</SelectItem>
                <SelectItem value='1'>Semester 1</SelectItem>
                <SelectItem value='2'>Semester 2</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
              <SelectTrigger>
                <SelectValue placeholder='Sort by date' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='desc'>Newest First</SelectItem>
                <SelectItem value='asc'>Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <LoadingSpinner size='lg' />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data?.data || []}
            searchKey='subjectName'
            searchPlaceholder='Search subjects...'
            pageCount={data?.totalPages ?? 0}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
          />
        )}

        <AlertDialog
          open={!!deletingSubject}
          onOpenChange={() => setDeletingSubject(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete{" "}
                <strong>{deletingSubject?.subjectName}</strong> (
                {deletingSubject?.subjectCode}) from the system. This action
                cannot be undone and may affect related questions, exam papers,
                and enrollments.
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

export default SubjectsPage;
