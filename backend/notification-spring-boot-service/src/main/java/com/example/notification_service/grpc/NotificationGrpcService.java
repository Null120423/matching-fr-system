package com.example.notification_service.grpc;
 
import java.util.UUID;

import com.example.notification_service.exception.NotificationNotFoundException;
import com.example.notification_service.exception.UnauthorizedNotificationAccessException;
import com.example.notification_service.model.NotificationModel;
import com.example.notification_service.service.NotificationService;

import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import notification.*;
import notification.NotificationIdRequest;
import notification.NotificationListResponse;
// gRPC generated
import notification.NotificationServiceGrpc;
import notification.UnreadCountResponse;
import notification.UserRequest;

@GrpcService
public class NotificationGrpcService extends NotificationServiceGrpc.NotificationServiceImplBase {

    private final NotificationService notificationService;

    public NotificationGrpcService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    public void getNotifications(UserRequest request, StreamObserver<NotificationListResponse> responseObserver) {
        try {
            var notifications = notificationService.getNotificationsByUserId(request.getUserId());
            var listBuilder = NotificationListResponse.newBuilder();
            for (NotificationModel n : notifications) {
                listBuilder.addNotifications(toProto(n));
            }
            responseObserver.onNext(listBuilder.build());
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL.withDescription("Failed to retrieve notifications: " + e.getMessage()).asRuntimeException());
        }
    }

    @Override
    public void getNotificationById(NotificationIdRequest request, StreamObserver<notification.Notification> responseObserver) {
        try {
            UUID notificationUuid = UUID.fromString(request.getNotificationId());
            NotificationModel n = notificationService.getNotificationById(notificationUuid, request.getUserId());
            responseObserver.onNext(toProto(n));
            responseObserver.onCompleted();
        } catch (NotificationNotFoundException e) {
            responseObserver.onError(Status.NOT_FOUND.withDescription(e.getMessage()).asRuntimeException());
        } catch (UnauthorizedNotificationAccessException e) {
            responseObserver.onError(Status.PERMISSION_DENIED.withDescription(e.getMessage()).asRuntimeException());
        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL.withDescription("Failed to get notification by ID: " + e.getMessage()).asRuntimeException());
        }
    }

    @Override
    public void markAsRead(NotificationIdRequest request, StreamObserver<notification.Notification> responseObserver) {
        try {
            UUID notificationUuid = UUID.fromString(request.getNotificationId());
            NotificationModel updated = notificationService.markNotificationAsRead(notificationUuid, request.getUserId());
            responseObserver.onNext(toProto(updated));
            responseObserver.onCompleted();
        } catch (NotificationNotFoundException e) {
            responseObserver.onError(Status.NOT_FOUND.withDescription(e.getMessage()).asRuntimeException());
        } catch (UnauthorizedNotificationAccessException e) {
            responseObserver.onError(Status.PERMISSION_DENIED.withDescription(e.getMessage()).asRuntimeException());
        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL.withDescription("Failed to mark notification as read: " + e.getMessage()).asRuntimeException());
        }
    }

    @Override
    public void getUnreadCount(UserRequest request, StreamObserver<UnreadCountResponse> responseObserver) {
        try {
            long count = notificationService.getUnreadNotificationsCount(request.getUserId());
            responseObserver.onNext(UnreadCountResponse.newBuilder().setCount((int) count).build());
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL.withDescription("Failed to get unread count: " + e.getMessage()).asRuntimeException());
        }
    }

    @Override
    public void createNotification(CreateNotificationRequest request, StreamObserver<notification.Notification> responseObserver) {
        try {
            NotificationModel newNotification = notificationService.createNotification(
                    request.getUserId(),
                    request.getType(),
                    request.getContent(),
                    request.getTitle()
            );
            responseObserver.onNext(toProto(newNotification));
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL.withDescription("Failed to create notification: " + e.getMessage()).asRuntimeException());
        }
    }
    
    private notification.Notification toProto(NotificationModel n) {
        // Khai báo một biến String để giữ ID trước khi gán cho builder
        String protoNotificationId = "";
        if (n.getId() != null) {
            protoNotificationId = n.getId().toString(); // Chuyển UUID sang String
        }

        return notification.Notification.newBuilder()
                .setId(protoNotificationId) // Gán biến String
                .setUserId(n.getUserId())
                .setType(n.getType())
                // .setContent(n.getContent()) // Content (từ proto) và Title (từ model)
                // Nếu proto Notification có trường "title" riêng, hãy thêm vào đây:
                // .setTitle(n.getTitle())
                // Nếu proto Notification chỉ có trường "content" và bạn muốn gộp title vào content:
                .setContent(n.getTitle() + ": " + n.getContent()) // Ví dụ gộp title và content
                .setIsRead(n.isRead())
                .setCreatedAt(n.getCreatedAt().toString())
                .setUpdatedAt( n.getUpdatedAt().toString())
                .build();
    }
}