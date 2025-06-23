package com.example.notification_service.grpc;
 
import java.util.UUID;

import com.example.notification_service.exception.NotificationNotFoundException;
import com.example.notification_service.exception.UnauthorizedNotificationAccessException;
import com.example.notification_service.model.NotificationModel;
import com.example.notification_service.service.NotificationService;
import com.example.notification_service.service.ExpoNotificationService;
import com.google.protobuf.Timestamp;
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
import java.util.Map;
import java.util.Collections;
import java.util.HashMap;
import java.util.Collections;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper; 
import java.time.ZoneOffset;
@GrpcService
public class NotificationGrpcService extends NotificationServiceGrpc.NotificationServiceImplBase {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private final NotificationService notificationService;
    private final ExpoNotificationService expoNotificationService;

    public NotificationGrpcService(NotificationService notificationService, ExpoNotificationService expoNotificationService) {
        this.notificationService = notificationService;
        this.expoNotificationService = expoNotificationService;
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

            Map<String, String> pushData = new HashMap<>(); 
            pushData.put("type", request.getType());
            pushData.put("content", request.getContent());
            pushData.put("title", request.getTitle()); 
            pushData.put("userId", request.getUserId());
            pushData.put("expoToken", request.getExpoToken()); 
            System.err.println(request.getExpoToken());

            List<String> expoTokens = Collections.singletonList(request.getExpoToken());
            
            if (!expoTokens.isEmpty()) {
                expoNotificationService.sendPushNotification(
                    request.getExpoToken(), 
                    request.getTitle(),
                    request.getContent(),
                    pushData 
                );
            }

            responseObserver.onNext(toProto(newNotification));
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL.withDescription("Failed to create notification: " + e.getMessage()).asRuntimeException());
        }
    }
    
    private notification.Notification toProto(NotificationModel n) {
        String protoNotificationId = "";
        if (n.getId() != null) {
            protoNotificationId = n.getId().toString();
        }
        notification.Notification.Builder builder = notification.Notification.newBuilder()
                .setId(protoNotificationId)
                .setUserId(n.getUserId())
                .setType(n.getType())
                .setTitle(n.getTitle()) 
                .setBody(n.getContent()) 
                .setIsRead(n.isRead());
        return builder.build();
    }
}