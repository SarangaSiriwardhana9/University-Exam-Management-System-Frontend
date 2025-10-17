import { useQuery } from '@tanstack/react-query'
import { dashboardService } from './use-dashboard'

export const useFacultyDashboardQuery = () => {
  return useQuery({
    queryKey: ['dashboard', 'faculty'],
    queryFn: () => dashboardService.getFacultyDashboard(),
  })
}

export const useAdminDashboardQuery = () => {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: () => dashboardService.getAdminDashboard(),
  })
}

export const useStudentDashboardQuery = () => {
  return useQuery({
    queryKey: ['dashboard', 'student'],
    queryFn: () => dashboardService.getStudentDashboard(),
  })
}
