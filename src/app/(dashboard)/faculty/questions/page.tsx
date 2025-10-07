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
import { getQuestionColumns } from "@/features/questions/components/question-columns";
import { useQuestionsQuery } from "@/features/questions/hooks/use-questions-query";
import { useDeleteQuestion } from "@/features/questions/hooks/use-question-mutations";
import type { Question } from "@/features/questions/types/questions";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { RoleGuard } from "@/lib/auth/role-guard";
import { USER_ROLES } from "@/constants/roles";
import { usePagination } from "@/lib/hooks/use-pagination";

const QuestionsPage = () => {
  const router = useRouter();
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(
    null
  );
const { page, limit, pagination, onPaginationChange } = usePagination()
  const { data, isLoading } = useQuestionsQuery({ myQuestions: true, page, limit });
  const deleteMutation = useDeleteQuestion();

  const handleDelete = () => {
    if (!deletingQuestion) return;

    deleteMutation.mutate(deletingQuestion._id, {
      onSuccess: () => {
        setDeletingQuestion(null);
      },
    });
  };

  const columns = getQuestionColumns({
    onEdit: (question) =>
      router.push(`/faculty/questions/${question._id}/edit`),
    onDelete: (question) => setDeletingQuestion(question),
    onView: (question) => router.push(`/faculty/questions/${question._id}`),
  });

  return (
    <RoleGuard allowedRoles={[USER_ROLES.FACULTY, USER_ROLES.ADMIN]}>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Question Bank</h1>
            <p className='text-muted-foreground mt-1'>
              Create and manage your question bank
            </p>
          </div>
          <Button onClick={() => router.push("/faculty/questions/create")}>
            <PlusIcon className='mr-2 h-4 w-4' />
            Add Question
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
            searchKey='questionText'
            searchPlaceholder='Search questions...'
            pageCount={data?.totalPages ?? 0}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deletingQuestion}
          onOpenChange={() => setDeletingQuestion(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this question from the question
                bank. This action cannot be undone.
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

export default QuestionsPage;
