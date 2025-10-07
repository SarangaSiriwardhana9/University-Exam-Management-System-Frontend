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
import { getReportColumns } from "@/features/reports/components/report-columns";
import { useReportsHistoryQuery } from "@/features/reports/hooks/use-reports-query";
import {
  useDeleteReport,
  useDownloadReport,
} from "@/features/reports/hooks/use-report-mutations";
import type { ReportResult } from "@/features/reports/types/reports";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { RoleGuard } from "@/lib/auth/role-guard";
import { USER_ROLES } from "@/constants/roles";
import { usePagination } from "@/lib/hooks/use-pagination";

const ReportsPage = () => {
  const router = useRouter();
  const [deletingReport, setDeletingReport] = useState<ReportResult | null>(
    null
  );
  const { page, limit, pagination, onPaginationChange } = usePagination();
  const { data, isLoading } = useReportsHistoryQuery({ page, limit });
  const deleteMutation = useDeleteReport();
  const downloadMutation = useDownloadReport();

  const handleDelete = () => {
    if (!deletingReport) return;

    deleteMutation.mutate(deletingReport.reportId, {
      onSuccess: () => {
        setDeletingReport(null);
      },
    });
  };

  const handleDownload = (report: ReportResult) => {
    downloadMutation.mutate(report.reportId);
  };

  const columns = getReportColumns({
    onDownload: handleDownload,
    onDelete: (report) => setDeletingReport(report),
  });

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Reports Management
            </h1>
            <p className='text-muted-foreground mt-1'>
              Generate and manage system reports
            </p>
          </div>
          <Button onClick={() => router.push("/admin/reports/generate")}>
            <PlusIcon className='mr-2 h-4 w-4' />
            Generate Report
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
            searchKey='title'
            searchPlaceholder='Search reports...'
            pageCount={data?.totalPages ?? 0}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deletingReport}
          onOpenChange={() => setDeletingReport(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the report{" "}
                <strong>{deletingReport?.title}</strong> from the system. This
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

export default ReportsPage;
