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
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/data-display/data-table";
import { getRoomColumns } from "@/features/rooms/components/room-columns";
import { useRoomsQuery } from "@/features/rooms/hooks/use-rooms-query";
import { useDeleteRoom } from "@/features/rooms/hooks/use-room-mutations";
import type { Room } from "@/features/rooms/types/rooms";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { RoleGuard } from "@/lib/auth/role-guard";
import { USER_ROLES } from "@/constants/roles";
import { usePagination } from "@/lib/hooks/use-pagination";

const RoomsPage = () => {
  const router = useRouter();
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
  const { page, limit, pagination, onPaginationChange } = usePagination()
  const { data, isLoading } = useRoomsQuery( { page, limit });
  const deleteMutation = useDeleteRoom();

  const handleDelete = () => {
    if (!deletingRoom) return;

    deleteMutation.mutate(deletingRoom._id, {
      onSuccess: () => {
        setDeletingRoom(null);
      },
    });
  };

  const columns = getRoomColumns({
    onEdit: (room) => router.push(`/admin/rooms/${room._id}/edit`),
    onDelete: (room) => setDeletingRoom(room),
    onView: (room) => router.push(`/admin/rooms/${room._id}`),
  });

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Rooms Management
            </h1>
            <p className='text-muted-foreground mt-1'>
              Manage all rooms and examination venues
            </p>
          </div>
          <Button onClick={() => router.push("/admin/rooms/create")}>
            <PlusIcon className='mr-2 h-4 w-4' />
            Add Room
          </Button>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <LoadingSpinner size='lg' />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data?.data || []}
            searchKey='fullRoomNumber'
            searchPlaceholder='Search rooms...'
            pageCount={data?.totalPages ?? 0}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deletingRoom}
          onOpenChange={() => setDeletingRoom(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete room{" "}
                <strong>{deletingRoom?.fullRoomNumber}</strong> from the system.
                This action cannot be undone.
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

export default RoomsPage;
