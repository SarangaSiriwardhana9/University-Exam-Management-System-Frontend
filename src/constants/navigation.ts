import { ROUTES } from './routes'
import { USER_ROLES } from './roles'
import type { UserRole } from './roles'

export type NavItem = {
  title: string
  href: string
  icon?: string
  description?: string
}

export const NAVIGATION_ITEMS: Record<UserRole, NavItem[]> = {
  [USER_ROLES.ADMIN]: [
    { title: 'Dashboard', href: ROUTES.ADMIN.DASHBOARD, icon: 'dashboard' },
    { title: 'Users', href: ROUTES.ADMIN.USERS, icon: 'users' },
    { title: 'Departments', href: ROUTES.ADMIN.DEPARTMENTS, icon: 'building' },
    { title: 'Subjects', href: ROUTES.ADMIN.SUBJECTS, icon: 'book' },
    { title: 'Rooms', href: ROUTES.ADMIN.ROOMS, icon: 'map' },
    { title: 'Reports', href: ROUTES.ADMIN.REPORTS, icon: 'chart' },
    { title: 'Calendar', href: ROUTES.ADMIN.CALENDAR, icon: 'calendar' },
    { title: 'Enrollments', href: ROUTES.ADMIN.ENROLLMENTS, icon: 'user-plus' }
  ],
  [USER_ROLES.FACULTY]: [
    { title: 'Dashboard', href: ROUTES.FACULTY.DASHBOARD, icon: 'dashboard' },
    { title: 'Subjects', href: ROUTES.FACULTY.SUBJECTS, icon: 'book' },
    { title: 'Questions', href: ROUTES.FACULTY.QUESTIONS, icon: 'help-circle' },
    { title: 'Exam Papers', href: ROUTES.FACULTY.EXAM_PAPERS, icon: 'file-text' },
    { title: 'Mark Answers', href: '/faculty/sessions', icon: 'clipboard-check' },
    { title: 'Results', href: ROUTES.FACULTY.RESULTS, icon: 'award' },
    { title: 'Assignments', href: ROUTES.FACULTY.ASSIGNMENTS, icon: 'clipboard' }
  ],
  [USER_ROLES.STUDENT]: [
    { title: 'Dashboard', href: ROUTES.STUDENT.DASHBOARD, icon: 'dashboard' },
    { title: 'Enrollments', href: ROUTES.STUDENT.ENROLLMENTS, icon: 'user-plus' },
    { title: 'Exams', href: ROUTES.STUDENT.EXAMS, icon: 'clock' },
    { title: 'Exam Calendar', href: ROUTES.STUDENT.EXAM_CALENDAR, icon: 'calendar' },
    { title: 'Results', href: ROUTES.STUDENT.RESULTS, icon: 'award' },
    { title: 'Notifications', href: ROUTES.STUDENT.NOTIFICATIONS, icon: 'bell' }
  ],
  [USER_ROLES.EXAM_COORDINATOR]: [
    { title: 'Dashboard', href: ROUTES.EXAM_COORDINATOR.DASHBOARD, icon: 'dashboard' },
    { title: 'Exam Sessions', href: ROUTES.EXAM_COORDINATOR.EXAM_SESSIONS, icon: 'calendar' },
    { title: 'Registrations', href: ROUTES.EXAM_COORDINATOR.REGISTRATIONS, icon: 'user-check' },
    { title: 'Rooms', href: ROUTES.EXAM_COORDINATOR.ROOMS, icon: 'map' },
    { title: 'Assignments', href: ROUTES.EXAM_COORDINATOR.ASSIGNMENTS, icon: 'clipboard' }
  ],
  [USER_ROLES.INVIGILATOR]: [
    { title: 'Dashboard', href: ROUTES.INVIGILATOR.DASHBOARD, icon: 'dashboard' },
    { title: 'Assignments', href: ROUTES.INVIGILATOR.ASSIGNMENTS, icon: 'clipboard' }
  ]
}