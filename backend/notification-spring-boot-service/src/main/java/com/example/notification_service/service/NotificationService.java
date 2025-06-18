// backend/notification-spring-boot-service/src/main/java/com/example/notification_service/service/NotificationService.java
package com.example.notification_service.service;

import java.util.List;
import java.util.UUID;

import com.example.notification_service.model.NotificationModel;

public interface NotificationService {
    NotificationModel createNotification(String userId, String type, String content, String title);
    List<NotificationModel> getNotificationsByUserId(String userId);
    NotificationModel getNotificationById(UUID id, String userId);
    NotificationModel markNotificationAsRead(UUID id, String userId);
    long getUnreadNotificationsCount(String userId);
}