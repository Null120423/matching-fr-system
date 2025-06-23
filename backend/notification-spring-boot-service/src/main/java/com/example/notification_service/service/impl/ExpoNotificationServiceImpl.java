package com.example.notification_service.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map; // Ensure Map is imported

import com.example.notification_service.service.ExpoNotificationService; // Assuming this is your interface now

@Service
public class ExpoNotificationServiceImpl implements ExpoNotificationService { // Implements the interface
    // Remove @Autowired public ExpoNotificationServiceImpl() {} if you're not using it
    // If you need it, make sure it injects dependencies like ObjectMapper
    // For now, keeping the current constructor with manual initialization of httpClient and objectMapper

    private static final String EXPO_PUSH_API_URL = "https://exp.host/--/api/v2/push/send";
    private final OkHttpClient httpClient; // Initialize in constructor
    private final ObjectMapper objectMapper; // Initialize in constructor

    // Constructor to properly initialize final fields
    public ExpoNotificationServiceImpl() {
        this.httpClient = new OkHttpClient();
        this.objectMapper = new ObjectMapper();
    }


    /**
     * Gửi một thông báo đẩy tới một hoặc nhiều Expo Push Token.
     *
     * @param to List các Expo Push Token (ví dụ: ["ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"])
     * @param title Tiêu đề của thông báo
     * @param body Nội dung của thông báo
     * @param data Dữ liệu tùy chỉnh gửi kèm thông báo (có thể null)
     * @throws IOException Nếu có lỗi trong quá trình gửi request HTTP
     */
    @Override // Important: always use @Override when implementing interface methods
    public void sendPushNotifications(List<String> to, String title, String body, Map<String, String> data) throws IOException {
        if (to == null || to.isEmpty()) {
            System.out.println("No Expo Push Tokens provided.");
            return;
        }

        // FIX: Construct the full notification payload expected by Expo Push API
        Map<String, Object> notificationPayload = new HashMap<>();
        notificationPayload.put("to", to); // This needs to be a List<String>
        notificationPayload.put("title", title);
        notificationPayload.put("body", body);
        notificationPayload.put("data", data != null ? data : new HashMap<String, String>()); // Ensure 'data' field is always present, even if empty

        String jsonPayload = objectMapper.writeValueAsString(notificationPayload); // Serialize the whole payload Map

        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), jsonPayload);

        Request request = new Request.Builder()
                .url(EXPO_PUSH_API_URL)
                .post(requestBody)
                .addHeader("Accept", "application/json")
                .addHeader("Accept-Encoding", "gzip, deflate")
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                System.err.println("Failed to send Expo push notification: " + response.code() + " " + response.message());
                System.err.println("Response body: " + (response.body() != null ? response.body().string() : "N/A"));
            } else {
                System.out.println("Expo push notification sent successfully! Response: " + (response.body() != null ? response.body().string() : "N/A"));
            }
        }
    }

    // Overload để gửi thông báo tới một token duy nhất
    @Override // Important: always use @Override
    public void sendPushNotification(String to, String title, String body, Map<String, String> data) throws IOException {
        sendPushNotifications(Collections.singletonList(to), title, body, data);
    }

    // You likely also have this from previous steps, ensure it's implemented:
    // @Override
    // public void sendDataOnlyNotification(List<String> to, Map<String, Object> customData) throws IOException { ... }
    // @Override
    // public long getUnreadNotificationsCount(String userId) { ... }
}