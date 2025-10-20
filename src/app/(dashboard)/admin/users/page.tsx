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
import { PlusIcon, FilterIcon } from "lucide-react";
import { DataTable } from "@/components/data-display/data-table";
import { getUserColumns } from "@/features/users/components/user-columns";
import { useUsersQuery } from "@/features/users/hooks/use-users-query";
import { useDeleteUser } from "@/features/users/hooks/use-user-mutations";
import type { User } from "@/features/users/types/users";
import type { UserRole } from "@/constants/roles";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { RoleGuard } from "@/lib/auth/role-guard";
import { USER_ROLES } from "@/constants/roles";
import { usePagination } from "@/lib/hooks/use-pagination";

const UsersPage = () => {
  const router = useRouter();
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { page, limit, pagination, onPaginationChange } = usePagination();
  
  const { data, isLoading } = useUsersQuery({ 
    page, 
    limit,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    sortBy: 'createdAt',
    sortOrder,
  });

  const deleteMutation = useDeleteUser();

  const handleDelete = () => {
    if (!deletingUser) return;

    deleteMutation.mutate(deletingUser._id, {
      onSuccess: () => {
        setDeletingUser(null);
      },
    });
  };

  const columns = getUserColumns({
    onEdit: (user) => router.push(`/admin/users/${user._id}/edit`),
    onDelete: (user) => setDeletingUser(user),
    onView: (user) => router.push(`/admin/users/${user._id}`),
  });

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Users Management
            </h1>
            <p className='text-muted-foreground mt-1'>
              Manage all users in the system
            </p>
          </div>
          <Button onClick={() => router.push("/admin/users/create")}>
            <PlusIcon className='mr-2 h-4 w-4' />
            Add User
          </Button>
        </div>

        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <FilterIcon className='h-4 w-4 text-muted-foreground' />
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | 'all')}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Roles</SelectItem>
                <SelectItem value={USER_ROLES.ADMIN}>Admin</SelectItem>
                <SelectItem value={USER_ROLES.FACULTY}>Faculty</SelectItem>
                <SelectItem value={USER_ROLES.STUDENT}>Student</SelectItem>
                <SelectItem value={USER_ROLES.EXAM_COORDINATOR}>Exam Coordinator</SelectItem>
                <SelectItem value={USER_ROLES.INVIGILATOR}>Invigilator</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <LoadingSpinner size='lg' />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            searchKey='fullName'
            pageCount={data?.totalPages ?? 0}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deletingUser}
          onOpenChange={() => setDeletingUser(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete{" "}
                <strong>{deletingUser?.fullName}</strong> from the system. This
                action cannot be undone.
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

export default UsersPage;
