export const NOTIFICATION_TYPE = {
  EXAM_SCHEDULE: 'exam_schedule',
  RESULT: 'result',
  ANNOUNCEMENT: 'announcement',
  REMINDER: 'reminder',
  ALERT: 'alert'
} as const

export type NotificationType = typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE]

export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const

export type NotificationPriority = typeof NOTIFICATION_PRIORITY[keyof typeof NOTIFICATION_PRIORITY]

export type Notification = {
  _id: string
  recipientId: string
  recipientName?: string
  senderId?: string
  senderName?: string
  title: string
  message: string
  notificationType: NotificationType
  isRead: boolean
  priority: NotificationPriority
  relatedTable?: string
  relatedId?: string
  scheduledAt?: string
  sentAt?: string
  readAt?: string
  createdAt: string
}

export type CreateNotificationDto = {
  recipientId: string
  title: string
  message: string
  notificationType: NotificationType
  priority?: NotificationPriority
  relatedTable?: string
  relatedId?: string
  scheduledAt?: string
}

export type UpdateNotificationDto = Partial<CreateNotificationDto> & {
  isRead?: boolean
  readAt?: string
  sentAt?: string
}

export type NotificationStats = {
  totalNotifications: number
  unreadCount: number
  notificationsByType: Record<string, number>
}

export type GetNotificationsParams = {
  recipientId?: string
  notificationType?: NotificationType
  isRead?: boolean
  priority?: NotificationPriority
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}