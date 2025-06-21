import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Icons
import {
  Bell,
  Calendar,
  CheckCircle,
  ChevronRight,
  Heart,
  Info,
  Mail,
} from "lucide-react-native";

// Core components
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default"; // Assuming TextDefault uses theme colors internally or can receive them
import { scale } from "@/helper/helpers";

// Mock API service
import {
  fetchNotifications,
  markNotificationAsRead,
  Notification,
} from "@/services/notifications";

// Theme Context
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000", // Will be themed
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  android: {
    elevation: 2,
  },
});

export default function NotificationsListScreen() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      try {
        const fetchedNotifications = await fetchNotifications();
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const handleNotificationPress = async (notificationId: string) => {
    try {
      // Mark as read via API and update state
      await markNotificationAsRead(notificationId);
      const updatedNotifications = notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      );
      setNotifications(updatedNotifications);

      const selectedNotif = updatedNotifications.find(
        (notif) => notif.id === notificationId
      );
      if (selectedNotif) {
        router.push({
          pathname: "/(common)/notification/detail",
          params: { id: selectedNotif.id },
        });
      }
    } catch (error) {
      console.error("Failed to mark notification as read or navigate:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment_invite":
        return <Calendar size={20} color={currentColors.info} />;
      case "system_update":
        return <Info size={20} color={currentColors.textSecondary} />;
      case "like":
        return <Heart size={20} color={currentColors.secondary} />;
      case "appointment_accepted":
        return <CheckCircle size={20} color={currentColors.success} />;
      default:
        return <Bell size={20} color={currentColors.textSecondary} />;
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.safeArea,
          {
            backgroundColor: currentColors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <TextDefault style={{ color: currentColors.text }}>
          Đang tải thông báo...
        </TextDefault>
      </View>
    );
  }

  return (
    <View
      style={[styles.safeArea, { backgroundColor: currentColors.background }]}
    >
      <Separator height={Platform.OS === "ios" ? scale(55) : scale(10)} />
      <View style={styles.header}>
        <TextDefault
          style={[styles.headerTitle, { color: currentColors.text }]}
        >
          Thông báo
        </TextDefault>
        <TextDefault
          style={[
            styles.headerSubtitle,
            { color: currentColors.textSecondary },
          ]}
        >
          Tất cả cập nhật và thông báo của bạn
        </TextDefault>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <TouchableOpacity
                key={notif.id}
                style={[
                  styles.notificationCard,
                  shadowStyle,
                  {
                    backgroundColor: notif.isRead
                      ? currentColors.backgroundCard
                      : currentColors.backgroundLightBlue,
                    borderColor: notif.isRead
                      ? currentColors.border
                      : currentColors.backgroundBlueLite,
                    shadowColor: currentColors.text, // Themed shadow
                  },
                ]}
                onPress={() => handleNotificationPress(notif.id)}
              >
                <View
                  style={[
                    styles.notificationIconContainer,
                    { backgroundColor: currentColors.backgroundLightGray },
                  ]}
                >
                  {getNotificationIcon(notif.type)}
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <TextDefault
                      style={[
                        styles.notificationTitle,
                        !notif.isRead && styles.unreadNotificationTitle,
                        { color: currentColors.text },
                      ]}
                    >
                      {notif.title}
                    </TextDefault>
                    {!notif.isRead && (
                      <Mail size={16} color={currentColors.info} />
                    )}
                  </View>
                  <TextDefault
                    style={[
                      styles.notificationMessage,
                      { color: currentColors.textSecondary },
                    ]}
                    numberOfLines={2}
                  >
                    {notif.message}
                  </TextDefault>
                  <TextDefault
                    style={[
                      styles.notificationTime,
                      { color: currentColors.textLight },
                    ]}
                  >
                    {notif.time}
                  </TextDefault>
                </View>
                <ChevronRight size={20} color={currentColors.border} />
              </TouchableOpacity>
            ))
          ) : (
            <View
              style={[
                styles.emptyState,
                {
                  backgroundColor: currentColors.backgroundCard,
                  borderColor: currentColors.border,
                },
              ]}
            >
              <Bell size={60} color={currentColors.border} />
              <TextDefault
                style={[
                  styles.emptyStateText,
                  { color: currentColors.textSecondary },
                ]}
              >
                Bạn chưa có thông báo nào.
              </TextDefault>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 12,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
  },
  unreadNotificationCard: {
    // backgroundColor and borderColor handled by dynamic styles
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "500",
    flexShrink: 1,
    marginRight: 8,
  },
  unreadNotificationTitle: {
    fontWeight: "bold",
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    borderRadius: 8,
    borderWidth: 1,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
});
