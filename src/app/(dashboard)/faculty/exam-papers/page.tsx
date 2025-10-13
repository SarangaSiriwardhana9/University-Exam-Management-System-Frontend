 
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusIcon, SparklesIcon } from "lucide-react";
import { DataTable } from "@/components/data-display/data-table";
import { getExamPaperColumns } from "@/features/exam-papers/components/exam-paper-columns";
import { useExamPapersQuery } from "@/features/exam-papers/hooks/use-exam-papers-query";
import {
  useDeleteExamPaper,
  useDuplicateExamPaper,
  useFinalizeExamPaper,
} from "@/features/exam-papers/hooks/use-exam-paper-mutations";
import type { ExamPaper } from "@/features/exam-papers/types/exam-papers";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { RoleGuard } from "@/lib/auth/role-guard";
import { USER_ROLES } from "@/constants/roles";
import { usePagination } from "@/lib/hooks/use-pagination";

const ExamPapersPage = () => {
  const router = useRouter();
  const { page, limit, pagination, onPaginationChange } = usePagination()
  const [deletingPaper, setDeletingPaper] = useState<ExamPaper | null>(null);
  const [finalizingPaper, setFinalizingPaper] = useState<ExamPaper | null>(
    null
  );

  const { data, isLoading } = useExamPapersQuery({ myPapers : true, page, limit });
  const deleteMutation = useDeleteExamPaper();
  const duplicateMutation = useDuplicateExamPaper();
  const finalizeMutation = useFinalizeExamPaper();

  const handleDelete = () => {
    if (!deletingPaper) return;

    deleteMutation.mutate(deletingPaper._id, {
      onSuccess: () => {
        setDeletingPaper(null);
      },
    });
  };

  const handleDuplicate = (paper: ExamPaper) => {
    duplicateMutation.mutate(
      { 
        id: paper._id, 
        newTitle: `${paper.paperTitle} (Copy)` 
      },
      {
        onSuccess: (response) => {
          router.push(`/faculty/exam-papers/${response.data._id}/edit`);
        },
      }
    );
  };

  const handleFinalize = () => {
    if (!finalizingPaper) return;

    finalizeMutation.mutate(finalizingPaper._id, {
      onSuccess: () => {
        setFinalizingPaper(null);
      },
    });
  };

  const columns = getExamPaperColumns({
    onEdit: (paper) => router.push(`/faculty/exam-papers/${paper._id}/edit`),
    onDelete: (paper) => setDeletingPaper(paper),
    onView: (paper) => router.push(`/faculty/exam-papers/${paper._id}`),
    onDuplicate: handleDuplicate,
    onFinalize: (paper) => setFinalizingPaper(paper),
  });

  return (
    <RoleGuard allowedRoles={[USER_ROLES.FACULTY, USER_ROLES.ADMIN]}>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Exam Papers</h1>
            <p className='text-muted-foreground mt-1'>
              Create and manage exam papers from your question bank
            </p>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => router.push("/faculty/exam-papers/generate")}
            >
              <SparklesIcon className='mr-2 h-4 w-4' />
              Generate Paper
            </Button>
            <Button onClick={() => router.push("/faculty/exam-papers/create")}>
              <PlusIcon className='mr-2 h-4 w-4' />
              Create Paper
            </Button>
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
            searchKey='paperTitle'
            searchPlaceholder='Search exam papers...'
            pageCount={data?.totalPages ?? 0}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deletingPaper}
          onOpenChange={() => setDeletingPaper(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the exam paper &ldquo;
                {deletingPaper?.paperTitle}&ldquo;. This action cannot be
                undone.
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

        {/* Finalize Confirmation */}
        <AlertDialog
          open={!!finalizingPaper}
          onOpenChange={() => setFinalizingPaper(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Finalize Exam Paper?</AlertDialogTitle>
              <AlertDialogDescription>
                This will lock the exam paper &ldquo;
                {finalizingPaper?.paperTitle}&#34; and prevent any further
                edits. Once finalized, the paper cannot be modified. Are you
                sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleFinalize}
                disabled={finalizeMutation.isPending}
              >
                {finalizeMutation.isPending
                  ? "Finalizing..."
                  : "Finalize Paper"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </RoleGuard>
  );
};

export default ExamPapersPage;
