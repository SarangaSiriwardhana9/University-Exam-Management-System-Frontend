import { useQuery } from '@tanstack/react-query'
import { examRegistrationsApi, GetExamCalendarParams } from '../api/exam-registrations'

export const useExamCalendar = (params?: GetExamCalendarParams) => {
  return useQuery({
    queryKey: ['exam-calendar', params],
    queryFn: () => examRegistrationsApi.getMyExamCalendar(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
