// backend/notification-spring-boot-service/src/main/java/com/example/notification_service/service/NotificationService.java
package com.example.notification_service.service;

import com.example.notification_service.model.Notification;
import java.util.List;

public interface NotificationService {
    Notification createNotification(String userId, String type, String content);
    List<Notification> getNotificationsByUserId(String userId);
    Notification getNotificationById(String id, String userId);
    Notification markNotificationAsRead(String id, String userId);
    long getUnreadNotificationsCount(String userId);
}