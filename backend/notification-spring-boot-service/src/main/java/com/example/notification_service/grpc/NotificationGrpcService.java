package com.example.notification_service.grpc;

import com.example.notification_service.model.Notification;
import com.example.notification_service.service.NotificationService;
import com.google.protobuf.Timestamp;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

import java.time.ZoneOffset;

@GrpcService
public class NotificationGrpcService extends NotificationGrpcService.NotificationServiceImpl {

    private final NotificationService notificationService;

    public NotificationGrpcService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    public void createNotification(CreateNotificationRequest request, StreamObserver<NotificationProto.Notification> responseObserver) {
        Notification created = notificationService.createNotification(
                request.getUserId(),
                request.getType(),
                request.getContent()
        );
        responseObserver.onNext(toProto(created));
        responseObserver.onCompleted();
    }

    @Override
    public void getNotifications(UserRequest request, StreamObserver<NotificationList> responseObserver) {
        var notifications = notificationService.getNotificationsByUserId(request.getUserId());
        var listBuilder = NotificationList.newBuilder();
        for (Notification n : notifications) {
            listBuilder.addNotifications(toProto(n));
        }
        responseObserver.onNext(listBuilder.build());
        responseObserver.onCompleted();
    }

    @Override
    public void getNotificationById(NotificationIdRequest request, StreamObserver<NotificationProto.Notification> responseObserver) {
        Notification n = notificationService.getNotificationById(request.getNotificationId(), request.getUserId());
        responseObserver.onNext(toProto(n));
        responseObserver.onCompleted();
    }

    @Override
    public void markAsRead(NotificationIdRequest request, StreamObserver<NotificationProto.Notification> responseObserver) {
        Notification updated = notificationService.markNotificationAsRead(request.getNotificationId(), request.getUserId());
        responseObserver.onNext(toProto(updated));
        responseObserver.onCompleted();
    }

    @Override
    public void getUnreadCount(UserRequest request, StreamObserver<UnreadCountResponse> responseObserver) {
        long count = notificationService.getUnreadNotificationsCount(request.getUserId());
        responseObserver.onNext(UnreadCountResponse.newBuilder().setCount(count).build());
        responseObserver.onCompleted();
    }

    private NotificationProto.Notification toProto(Notification n) {
        return NotificationProto.Notification.newBuilder()
                .setId(n.getId())
                .setUserId(n.getUserId())
                .setType(n.getType())
                .setContent(n.getContent())
                .setIsRead(n.isRead())
                .setCreatedAt(n.getCreatedAt().toInstant(ZoneOffset.UTC).toString())
                .setUpdatedAt(n.getUpdatedAt().toInstant(ZoneOffset.UTC).toString())
                .build();
    }
}
