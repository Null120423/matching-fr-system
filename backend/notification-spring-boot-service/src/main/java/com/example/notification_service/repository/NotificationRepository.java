// backend/notification-spring-boot-service/src/main/java/com/example/notification_service/repository/NotificationRepository.java
package com.example.notification_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.notification_service.model.NotificationModel;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationModel, String> {
    List<NotificationModel> findByUserIdOrderByCreatedAtDesc(String userId);
    long countByUserIdAndIsReadFalse(String userId);
}