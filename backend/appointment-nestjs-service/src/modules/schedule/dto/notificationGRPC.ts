// backend/api-gateway/src/notification/notification.controller.ts

import { Observable } from 'rxjs';
import { UserDto } from 'src/dto';

export interface UserProfileServiceGrpc {
  getListUsersByIds(payload: { userIds: string[] }): Observable<{
    users: UserDto[];
  }>;
  getUserById(data: { userId: string }): Observable<UserDto>;
}

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
  expoToken: string;
}

export interface NotificationServiceGrpc {
  createNotification(data: NotificationCreate): Observable<Notification>;
}
