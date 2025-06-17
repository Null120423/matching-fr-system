// backend/notification-spring-boot-service/src/main/java/com/example/notification_service/service/NotificationService.java
package com.example.notification_service.service;

import com.example.notification_service.model.NotificationModel;
import java.util.List;

public interface NotificationService {
    NotificationModel createNotification(String userId, String type, String content);
    List<NotificationModel> getNotificationsByUserId(String userId);
    NotificationModel getNotificationById(String id, String userId);
    NotificationModel markNotificationAsRead(String id, String userId);
    long getUnreadNotificationsCount(String userId);
}