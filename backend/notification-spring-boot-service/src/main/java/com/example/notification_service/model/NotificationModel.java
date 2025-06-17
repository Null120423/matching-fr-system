// backend/notification-spring-boot-service/src/main/java/com/example/notification_service/model/Notification.java
package com.example.notification_service.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.*;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter()
@Setter()
public class NotificationModel {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "BINARY(16)")
    private String id; // Sử dụng String để khớp với UUID từ NestJS

    @Column(nullable = false)
    private String userId; // Người nhận thông báo

    @Column(nullable = false)
    private String type; // Ví dụ: "appointment_request", "new_match", "friend_request"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content; // Nội dung thông báo

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isRead;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }
    public String getUserId() {
        return userId;
    }
    public String getType() {
        return type;    
    }
    public String getContent() {
        return content;
    }
    public boolean isRead() {
        return isRead;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public boolean getIsRead() {
        return isRead;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setIsRead(boolean isRead) {
        this.isRead = isRead;
    }

    public void setRead(boolean read) {
        this.isRead = read;
    }

}