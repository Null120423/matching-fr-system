package com.example.notification_service.exception;

public class UnauthorizedNotificationAccessException extends RuntimeException {
    public UnauthorizedNotificationAccessException(String message) {
        super(message);
    }
}