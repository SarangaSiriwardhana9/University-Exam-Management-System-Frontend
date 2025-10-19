'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle2Icon, XCircleIcon, TrophyIcon, BookOpenIcon, CalendarIcon, AlertCircleIcon } from 'lucide-react'
import { useStudentResultsQuery } from '@/features/results/hooks/use-results-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export default function StudentResultsPage() {
  const { data, isLoading } = useStudentResultsQuery()
  const [selectedYear, setSelectedYear] = useState<string>('1')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const results = data?.results || {}
  const years = Object.keys(results).sort((a, b) => parseInt(a) - parseInt(b))

  type YearData = { [semester: number]: any[] }

  if (years.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Results</h1>
          <p className="text-muted-foreground mt-1">View your exam results by year and semester</p>
        </div>
        <Alert>
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>
            No published results available yet. Results will appear here once they are published by faculty.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const calculateYearStats = (yearData: YearData) => {
    let totalMarks = 0
    let obtainedMarks = 0
    let totalSubjects = 0
    let passedSubjects = 0

    Object.values(yearData).forEach((semesterResults: any) => {
      semesterResults.forEach((result: any) => {
        totalMarks += result.totalMarks
        obtainedMarks += result.marksObtained
        totalSubjects++
        if (result.isPass) passedSubjects++
      })
    })

    const percentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : '0.00'
    
    return { totalMarks, obtainedMarks, percentage, totalSubjects, passedSubjects }
  }

  const calculateSemesterStats = (semesterResults: any[]) => {
    let totalMarks = 0
    let obtainedMarks = 0

    semesterResults.forEach((result) => {
      totalMarks += result.totalMarks
      obtainedMarks += result.marksObtained
    })

    const percentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : '0.00'
    
    return { totalMarks, obtainedMarks, percentage }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Results</h1>
        <p className="text-muted-foreground mt-1">View your exam results by year and semester</p>
      </div>

      <Tabs value={selectedYear} onValueChange={setSelectedYear}>
        <TabsList className="grid w-full grid-cols-4">
          {years.map((year) => {
            const stats = calculateYearStats(results[year as any] as YearData)
            return (
              <TabsTrigger key={year} value={year} className="flex flex-col gap-1 py-3">
                <span className="font-semibold">Year {year}</span>
                <span className="text-xs text-muted-foreground">{stats.percentage}%</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {years.map((year) => {
          const yearData = results[year as any] as YearData
          const yearStats = calculateYearStats(yearData)
          const semesters = Object.keys(yearData).sort((a, b) => parseInt(a) - parseInt(b))

          return (
            <TabsContent key={year} value={year} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Overall Percentage</CardDescription>
                    <CardTitle className="text-3xl">{yearStats.percentage}%</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Marks</CardDescription>
                    <CardTitle className="text-3xl">{yearStats.obtainedMarks}/{yearStats.totalMarks}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Subjects</CardDescription>
                    <CardTitle className="text-3xl">{yearStats.totalSubjects}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Pass Rate</CardDescription>
                    <CardTitle className="text-3xl text-green-600">
                      {yearStats.totalSubjects > 0 
                        ? ((yearStats.passedSubjects / yearStats.totalSubjects) * 100).toFixed(0)
                        : 0}%
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Accordion type="single" collapsible defaultValue="semester-1" className="space-y-4">
                {semesters.map((semester) => {
                  const semesterResults = yearData[semester]
                  const semesterStats = calculateSemesterStats(semesterResults)

                  return (
                    <AccordionItem key={semester} value={`semester-${semester}`} className="border rounded-lg">
                      <AccordionTrigger className="px-6 hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            <BookOpenIcon className="h-5 w-5 text-primary" />
                            <div className="text-left">
                              <h3 className="text-lg font-semibold">Semester {semester}</h3>
                              <p className="text-sm text-muted-foreground">{semesterResults.length} subjects</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Percentage</p>
                              <p className="text-lg font-bold">{semesterStats.percentage}%</p>
                            </div>
                            <Badge variant="outline" className="text-sm">
                              {semesterStats.obtainedMarks}/{semesterStats.totalMarks}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <Separator className="mb-4" />
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Exam</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-center">Marks</TableHead>
                                <TableHead className="text-center">Percentage</TableHead>
                                <TableHead className="text-center">Grade</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {semesterResults.map((result: any) => (
                                <TableRow key={result._id}>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{result.subjectName || 'N/A'}</p>
                                      <p className="text-xs text-muted-foreground">{result.subjectCode || 'N/A'}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium text-sm">{result.examTitle}</p>
                                      <p className="text-xs text-muted-foreground">{result.paperTitle}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <CalendarIcon className="h-3 w-3" />
                                      <span>{result.examDate ? format(new Date(result.examDate), 'MMM dd, yyyy') : 'N/A'}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <span className="font-semibold">{result.marksObtained}/{result.totalMarks}</span>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge variant={result.percentage >= 75 ? 'default' : result.percentage >= 40 ? 'secondary' : 'destructive'}>
                                      {result.percentage}%
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {result.grade ? (
                                      <Badge variant="outline" className="font-semibold">
                                        {result.grade}
                                      </Badge>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {result.isPass ? (
                                      <Badge className="bg-green-600">
                                        <CheckCircle2Icon className="h-3 w-3 mr-1" />
                                        Pass
                                      </Badge>
                                    ) : (
                                      <Badge variant="destructive">
                                        <XCircleIcon className="h-3 w-3 mr-1" />
                                        Fail
                                      </Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
