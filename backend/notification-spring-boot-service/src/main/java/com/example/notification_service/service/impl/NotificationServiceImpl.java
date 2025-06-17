package com.example.notification_service.service.impl;

import com.example.notification_service.exception.NotificationNotFoundException;
import com.example.notification_service.exception.UnauthorizedNotificationAccessException;
import com.example.notification_service.model.Notification;
import com.example.notification_service.repository.NotificationRepository;
import com.example.notification_service.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
// import java.util.UUID; // Không còn cần thiết nếu JPA xử lý việc tạo UUID

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    @Transactional
    public Notification createNotification(String userId, String type, String content) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setContent(content);
        notification.setRead(false);
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getNotificationsByUserId(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public Notification getNotificationById(String id, String userId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with id: " + id));
        if (!notification.getUserId().equals(userId)) {
            throw new UnauthorizedNotificationAccessException("Unauthorized to access this notification.");
        }
        return notification;
    }

    @Override
    @Transactional
    public Notification markNotificationAsRead(String id, String userId) {
        Notification notification = getNotificationById(id, userId);
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    public long getUnreadNotificationsCount(String userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
}