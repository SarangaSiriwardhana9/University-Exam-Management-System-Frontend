'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { generateReportSchema, type GenerateReportFormData } from '../validations/report-schemas'
import { REPORT_FORMAT, type ReportType } from '../types/reports'
import { useReportTypesQuery } from '../hooks/use-reports-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'

type ReportFormProps = {
  onSubmit: (data: GenerateReportFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export const ReportForm = ({ onSubmit, onCancel, isLoading }: ReportFormProps) => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null)
  const { data: reportTypesResponse, isLoading: isLoadingTypes } = useReportTypesQuery()

  const form = useForm<GenerateReportFormData>({
    resolver: zodResolver(generateReportSchema),
    defaultValues: {
      reportType: '',
      title: '',
      description: '',
      format: REPORT_FORMAT.PDF,
      parameters: {},
      filters: {}
    }
  })

  const reportTypes = reportTypesResponse?.data || []
  const watchReportType = form.watch('reportType')

  useEffect(() => {
    if (watchReportType) {
      const reportType = reportTypes.find(rt => rt.id === watchReportType)
      setSelectedReportType(reportType || null)
    } else {
      setSelectedReportType(null)
    }
  }, [watchReportType, reportTypes])

  if (isLoadingTypes) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Report Type Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Report Configuration</h3>
          
          <FormField
            control={form.control}
            name="reportType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Type *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedReportType && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Report Details:</p>
              <p className="text-sm text-muted-foreground">{selectedReportType.description}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Category: <span className="font-medium">{selectedReportType.category}</span>
              </p>
            </div>
          )}

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter report title" {...field} />
                </FormControl>
                <FormDescription>
                  Give your report a descriptive title
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe what this report will include..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Output Format *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={REPORT_FORMAT.PDF}>
                      <div>
                        <div className="font-medium">PDF</div>
                        <div className="text-sm text-muted-foreground">Portable Document Format</div>
                      </div>
                    </SelectItem>
                    <SelectItem value={REPORT_FORMAT.EXCEL}>
                      <div>
                        <div className="font-medium">Excel</div>
                        <div className="text-sm text-muted-foreground">Microsoft Excel Spreadsheet</div>
                      </div>
                    </SelectItem>
                    <SelectItem value={REPORT_FORMAT.CSV}>
                      <div>
                        <div className="font-medium">CSV</div>
                        <div className="text-sm text-muted-foreground">Comma-Separated Values</div>
                      </div>
                    </SelectItem>
                    <SelectItem value={REPORT_FORMAT.JSON}>
                      <div>
                        <div className="font-medium">JSON</div>
                        <div className="text-sm text-muted-foreground">JavaScript Object Notation</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dynamic Parameters based on Report Type */}
        {selectedReportType && selectedReportType.parameters.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Report Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedReportType.parameters.map((param) => (
                <div key={param.name} className="space-y-2">
                  <label className="text-sm font-medium">
                    {param.name.charAt(0).toUpperCase() + param.name.slice(1)}
                    {param.required && ' *'}
                  </label>
                  {param.type === 'select' && param.options ? (
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${param.name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {param.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      type={param.type} 
                      placeholder={`Enter ${param.name}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </form>
    </Form>
  )
}