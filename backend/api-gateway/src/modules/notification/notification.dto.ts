// backend/api-gateway/src/notification/notification.controller.ts

import { Observable } from 'rxjs';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface NotificationCreate {
  type: string;
  content: string;
  title: string;
  userId?: string;
}

export interface NotificationServiceGrpc {
  getNotifications(data: {
    userId: string;
  }): Observable<{ notifications: Notification[] }>;
  getNotificationById(data: {
    userId: string;
    notificationId: string;
  }): Observable<Notification>;
  markAsRead(data: {
    userId: string;
    notificationId: string;
  }): Observable<Notification>;
  getUnreadCount(data: { userId: string }): Observable<{ count: number }>;
  createNotification(data: NotificationCreate): Observable<Notification>;
}
