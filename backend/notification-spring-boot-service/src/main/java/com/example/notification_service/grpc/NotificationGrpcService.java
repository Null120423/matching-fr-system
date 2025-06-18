package com.example.notification_service.grpc;
 
import com.example.notification_service.exception.NotificationNotFoundException;
import com.example.notification_service.exception.UnauthorizedNotificationAccessException;
import com.example.notification_service.model.NotificationModel;
import com.example.notification_service.service.NotificationService;

import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
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
            NotificationModel n = notificationService.getNotificationById(request.getNotificationId(), request.getUserId());
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
            NotificationModel updated = notificationService.markNotificationAsRead(request.getNotificationId(), request.getUserId());
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

    private notification.Notification toProto(NotificationModel n) {
        return notification.Notification.newBuilder()
                .setId(n.getId())
                .setUserId(n.getUserId())
                .setType(n.getType())
                .setContent(n.getContent())
                .setIsRead(n.isRead())
                .setCreatedAt(n.getCreatedAt().toString())
                .setUpdatedAt( n.getUpdatedAt().toString())
                .build();
    }
}