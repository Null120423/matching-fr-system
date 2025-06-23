package com.example.notification_service.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface ExpoNotificationService {
    void sendPushNotifications(List<String> to, String title, String body, Map<String, String> data) throws IOException;
    void sendPushNotification(String to, String title, String body, Map<String, String> data) throws IOException;
}