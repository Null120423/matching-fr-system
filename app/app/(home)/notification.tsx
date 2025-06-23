import { router } from "expo-router";
import { useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Icons
import {
  Bell,
  ChevronRight,
  Heart,
  MoreHorizontal,
  Users,
  Zap,
} from "lucide-react-native";

// Core components
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default";
import { scale } from "@/helper/helpers";

// Theme Context
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import useGetNotifications from "@/services/hooks/notification/useGetNotifications";
import React from "react";

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  android: {
    elevation: 4,
  },
});

export default function NotificationsListScreen() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const { data: notifications, isLoading, refetch } = useGetNotifications();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notificationId: string) => {
    try {
      router.push({
        pathname: "/(common)/notification/detail",
        params: { id: notificationId },
      });
    } catch (error) {
      console.error("Failed to navigate:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const iconProps = { size: 24, strokeWidth: 2 };

    switch (type) {
      case "FRIEND_REQUEST":
        return <Users {...iconProps} color="#6366F1" />;
      case "SWIPE":
        return <Heart {...iconProps} color="#EC4899" />;
      case "MATCH":
        return <Zap {...iconProps} color="#F59E0B" />;
      default:
        return <Bell {...iconProps} color={currentColors.textSecondary} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "FRIEND_REQUEST":
        return {
          bg: "#EEF2FF",
          border: "#C7D2FE",
          accent: "#6366F1",
        };
      case "SWIPE":
        return {
          bg: "#FDF2F8",
          border: "#FBCFE8",
          accent: "#EC4899",
        };
      case "MATCH":
        return {
          bg: "#FFFBEB",
          border: "#FED7AA",
          accent: "#F59E0B",
        };
      default:
        return {
          bg: currentColors.backgroundCard,
          border: currentColors.border,
          accent: currentColors.textSecondary,
        };
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case "FRIEND_REQUEST":
        return "Lời mời kết bạn";
      case "SWIPE":
        return "Có người thích bạn";
      case "MATCH":
        return "Ghép đôi thành công!";
      default:
        return "Thông báo";
    }
  };

  if (isLoading) {
    return (
      <View
        style={[styles.safeArea, { backgroundColor: currentColors.background }]}
      >
        <View style={styles.loadingContainer}>
          <View
            style={[
              styles.loadingCard,
              { backgroundColor: currentColors.backgroundCard },
            ]}
          >
            <Bell size={32} color={currentColors.textSecondary} />
            <TextDefault
              style={[
                styles.loadingText,
                { color: currentColors.textSecondary },
              ]}
            >
              Đang tải thông báo...
            </TextDefault>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.safeArea, { backgroundColor: currentColors.background }]}
    >
      <Separator height={Platform.OS === "ios" ? scale(55) : scale(10)} />

      {/* Header */}
      <View style={styles.header}>
        <View>
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
            {notifications?.filter((n) => !n.isRead).length || 0} chưa đọc •{" "}
            {notifications?.length || 0} tổng cộng
          </TextDefault>
        </View>
        <TouchableOpacity
          style={[
            styles.headerAction,
            { backgroundColor: currentColors.backgroundCard },
          ]}
        >
          <MoreHorizontal size={20} color={currentColors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {notifications && notifications.length > 0 ? (
            notifications.map((notif, index) => {
              const colors = getNotificationColor(notif.type);
              return (
                <TouchableOpacity
                  key={notif.id}
                  style={[
                    styles.notificationCard,
                    shadowStyle,
                    {
                      backgroundColor: colors.bg,
                      borderColor: colors.border,
                      marginBottom:
                        index === notifications.length - 1 ? 20 : 12,
                    },
                  ]}
                  onPress={() => handleNotificationPress(notif.id)}
                  activeOpacity={0.7}
                >
                  {/* Accent bar */}
                  <View
                    style={[
                      styles.accentBar,
                      { backgroundColor: colors.accent },
                    ]}
                  />

                  <View style={styles.cardContent}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: `${colors.accent}15` },
                      ]}
                    >
                      {getNotificationIcon(notif.type)}
                    </View>

                    <View style={styles.textContent}>
                      <View style={styles.titleRow}>
                        <View style={styles.titleWithDot}>
                          <TextDefault
                            bold
                            style={[
                              styles.notificationTitle,
                              { color: currentColors.text },
                            ]}
                          >
                            {getNotificationTitle(notif.type)}
                          </TextDefault>
                          {!notif.isRead && (
                            <View
                              style={[
                                styles.unreadDot,
                                { backgroundColor: colors.accent },
                              ]}
                            />
                          )}
                        </View>
                        <TextDefault
                          style={[
                            styles.timeText,
                            { color: currentColors.textLight },
                          ]}
                        >
                          {formatTimeAgo(new Date().toISOString())}
                        </TextDefault>
                      </View>

                      <TextDefault
                        style={[
                          styles.notificationBody,
                          { color: currentColors.textSecondary },
                        ]}
                        numberOfLines={2}
                      >
                        {notif.body}
                      </TextDefault>

                      {notif.type === "MATCH" && (
                        <View
                          style={[
                            styles.matchBadge,
                            { backgroundColor: colors.accent },
                          ]}
                        >
                          <TextDefault style={styles.matchBadgeText}>
                            Nhắn tin ngay!
                          </TextDefault>
                        </View>
                      )}
                    </View>

                    <ChevronRight size={16} color={currentColors.textLight} />
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View
              style={[
                styles.emptyState,
                { backgroundColor: currentColors.backgroundCard },
              ]}
            >
              <View
                style={[
                  styles.emptyIconContainer,
                  { backgroundColor: currentColors.backgroundLightGray },
                ]}
              >
                <Bell size={48} color={currentColors.textLight} />
              </View>
              <TextDefault
                style={[styles.emptyTitle, { color: currentColors.text }]}
              >
                Chưa có thông báo
              </TextDefault>
              <TextDefault
                style={[
                  styles.emptySubtitle,
                  { color: currentColors.textSecondary },
                ]}
              >
                Khi có người tương tác với bạn, thông báo sẽ xuất hiện ở đây
              </TextDefault>
            </View>
          )}
        </View>

        <Separator height={scale(100)} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    width: "100%",
    maxWidth: 280,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    opacity: 0.8,
  },
  headerAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  notificationCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  accentBar: {
    height: 4,
    width: "100%",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContent: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 17,
    fontWeight: "600",
    flex: 1,
  },
  timeText: {
    fontSize: 13,
    marginLeft: 8,
  },
  notificationBody: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 8,
  },
  matchBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  matchBadgeText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
    borderRadius: 20,
    marginTop: 40,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.8,
  },
  titleWithDot: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});
