import { router } from "expo-router";
import React, { useEffect, useState } from "react"; // Import useEffect
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Imports for icons, separator, scale, TextDefault (assuming these are pure RN components)
import DiscoverIcon from "@/assets/svg/discover-icon";
import NotificationIcon from "@/assets/svg/notification-icon";
import PersonIcon from "@/assets/svg/person-icon";
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default";
import { scale } from "@/helper/helpers";

// Import mock API services
import { fetchAppointments } from "@/services/appointments";
import { getUnreadNotificationsCount } from "@/services/notifications";
import { fetchMyProfile } from "@/services/users";

// Import theme and colors
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000", // Will be overridden by theme
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  android: {
    elevation: 2,
  },
});

export default function DashboardScreen() {
  const { theme, toggleTheme } = useTheme();
  const currentColors = Colors[theme || "light"];

  const [myProfile, setMyProfile] = useState<any>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const profile = await fetchMyProfile();
        setMyProfile(profile);

        const upcoming = await fetchAppointments("upcoming");
        setUpcomingAppointments(upcoming);

        const count = await getUnreadNotificationsCount();
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        // Handle error: show a message to the user
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Update stats data based on fetched data
  const stats = [
    {
      label: "Lời mời mới",
      value: myProfile?.friendsCount || "...",
      icon: PersonIcon,
      color: currentColors.info,
    },
    {
      label: "Lịch hẹn",
      value: upcomingAppointments.length.toString(),
      icon: DiscoverIcon,
      color: currentColors.success,
    },
    {
      label: "Hoạt động",
      value: myProfile?.activitiesCount || "...",
      icon: NotificationIcon,
      color: currentColors.secondary,
    },
  ];

  // Map upcoming appointments to recentActivities structure
  const recentActivities = upcomingAppointments.map((app) => ({
    title: app.activity,
    time: app.time,
    location: app.location,
  }));

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
        <TextDefault>Đang tải dữ liệu...</TextDefault>
      </View>
    );
  }

  return (
    <View
      style={[styles.safeArea, { backgroundColor: currentColors.background }]}
    >
      <ScrollView style={styles.scrollView}>
        <Separator height={Platform.OS === "ios" ? scale(55) : scale(10)} />
        <View style={styles.header}>
          <View>
            <TextDefault
              style={[styles.headerTitle, { color: currentColors.text }]}
            >
              Chào buổi sáng!
            </TextDefault>
            <TextDefault
              style={[
                styles.headerSubtitle,
                { color: currentColors.textSecondary },
              ]}
            >
              Sẵn sàng cho những cuộc hẹn mới chứ?
            </TextDefault>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/(home)/notification")} // Navigate to notifications screen
          >
            <NotificationIcon color={currentColors.text} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <TextDefault style={styles.notificationBadgeTextDefault}>
                  {unreadCount}
                </TextDefault>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Theme Toggle Button */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={[
            styles.themeToggleButton,
            { backgroundColor: currentColors.backgroundLightGray },
          ]}
        >
          <TextDefault style={{ color: currentColors.primary }}>
            Chuyển Theme ({theme === "light" ? "Sáng" : "Tối"})
          </TextDefault>
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <View
                  key={index}
                  style={[
                    styles.statCard,
                    shadowStyle,
                    {
                      backgroundColor: currentColors.backgroundCard,
                      borderColor: currentColors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.statIconContainer,
                      { backgroundColor: stat.color },
                    ]}
                  >
                    <Icon color="white" />
                  </View>
                  <TextDefault
                    style={[styles.statValue, { color: currentColors.text }]}
                  >
                    {stat.value}
                  </TextDefault>
                  <TextDefault
                    style={[
                      styles.statLabel,
                      { color: currentColors.textSecondary },
                    ]}
                  >
                    {stat.label}
                  </TextDefault>
                </View>
              );
            })}
          </View>

          {/* Quick Actions */}
          <View
            style={[
              styles.quickActionsCard,
              shadowStyle,
              {
                backgroundColor: currentColors.backgroundCard,
                borderColor: currentColors.border,
              },
            ]}
          >
            <TextDefault
              style={[styles.quickActionsTitle, { color: currentColors.text }]}
            >
              Hành động nhanh
            </TextDefault>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={[
                  styles.quickActionButton,
                  {
                    backgroundColor: currentColors.backgroundLightBlue,
                    borderColor: currentColors.backgroundBlueLite,
                  },
                ]}
              >
                <PersonIcon color={currentColors.info} />
                <TextDefault
                  style={[
                    styles.quickActionButtonTextDefaultBlue,
                    { color: currentColors.info },
                  ]}
                >
                  Gợi ý kết nối
                </TextDefault>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(common)/appointments")}
                style={[
                  styles.quickActionButtonGreen,
                  {
                    backgroundColor: currentColors.backgroundLightGreen,
                    borderColor: currentColors.backgroundLightGreen,
                  },
                ]}
              >
                <DiscoverIcon color={currentColors.success} />
                <TextDefault
                  style={[
                    styles.quickActionButtonTextDefaultGreen,
                    { color: currentColors.success },
                  ]}
                >
                  Quản lý cuộc hẹn
                </TextDefault>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Activities List */}
          <View
            style={[
              styles.recentActivitiesCard,
              shadowStyle,
              {
                backgroundColor: currentColors.backgroundCard,
                borderColor: currentColors.border,
              },
            ]}
          >
            <TextDefault
              style={[
                styles.recentActivitiesTitle,
                { color: currentColors.text },
              ]}
            >
              Hoạt động sắp tới
            </TextDefault>
            <View style={styles.recentActivitiesList}>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <View
                    key={index}
                    style={[
                      styles.activityItem,
                      { backgroundColor: currentColors.backgroundLightGray },
                    ]}
                  >
                    <View
                      style={[
                        styles.activityIconContainer,
                        { backgroundColor: currentColors.backgroundBlueLite },
                      ]}
                    >
                      <NotificationIcon color={currentColors.info} />
                    </View>
                    <View style={styles.activityDetails}>
                      <TextDefault
                        style={[
                          styles.activityTitle,
                          { color: currentColors.text },
                        ]}
                      >
                        {activity.title}
                      </TextDefault>
                      <TextDefault
                        style={[
                          styles.activityTime,
                          { color: currentColors.textSecondary },
                        ]}
                      >
                        {activity.time}
                      </TextDefault>
                      <TextDefault
                        style={[
                          styles.activityLocation,
                          { color: currentColors.textLight },
                        ]}
                      >
                        {activity.location}
                      </TextDefault>
                    </View>
                  </View>
                ))
              ) : (
                <TextDefault
                  style={{
                    color: currentColors.textSecondary,
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  Không có hoạt động sắp tới nào.
                </TextDefault>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB", // bg-gray-50
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 24 : 0, // Padding for Android status bar
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20, // TextDefault-xl
    fontWeight: "bold",
    color: "#111827", // TextDefault-gray-900
  },
  headerSubtitle: {
    fontSize: 14, // TextDefault-sm
    color: "#4B5563", // TextDefault-gray-600
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    backgroundColor: "#EF4444", // bg-red-500
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadgeTextDefault: {
    fontSize: 10, // TextDefault-xs
    color: "white",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 24, // space-y-6 equivalent in React Native (for vertical spacing between major sections)
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16, // gap-4 equivalent (for horizontal spacing)
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    flex: 1, // To make cards take equal space
    borderWidth: 1,
    borderColor: "#F3F4F6", // border-gray-100
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8, // mb-2
  },
  statValue: {
    fontSize: 24, // TextDefault-2xl
    fontWeight: "bold",
    color: "#111827", // TextDefault-gray-900
  },
  statLabel: {
    fontSize: 12, // TextDefault-xs
    color: "#4B5563", // TextDefault-gray-600
  },
  quickActionsCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6", // border-gray-100
  },
  quickActionsTitle: {
    fontWeight: "600", // font-semibold
    color: "#111827", // TextDefault-gray-900
    marginBottom: 12, // mb-3
  },
  quickActionsGrid: {
    flexDirection: "row",
    gap: 12, // gap-3
  },
  quickActionButton: {
    flex: 1, // flex-1
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12, // p-3
    backgroundColor: "#EFF6FF", // bg-blue-50
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DBEAFE", // border-blue-100
  },
  quickActionButtonGreen: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#ECFDF5", // bg-green-50
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1FAE5", // border-green-100
  },
  quickActionButtonIcon: {
    marginRight: 8, // mr-2
  },
  quickActionButtonTextDefaultBlue: {
    color: "#2563EB", // TextDefault-blue-600
    fontWeight: "500", // font-medium
  },
  quickActionButtonTextDefaultGreen: {
    color: "#16A34A", // TextDefault-green-600
    fontWeight: "500", // font-medium
  },
  recentActivitiesCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6", // border-gray-100
  },
  recentActivitiesTitle: {
    fontWeight: "600", // font-semibold
    color: "#111827", // TextDefault-gray-900
    marginBottom: 12, // mb-3
  },
  recentActivitiesList: {
    gap: 12, // space-y-3
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12, // p-3
    backgroundColor: "#F9FAFB", // bg-gray-50
    borderRadius: 8,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#DBEAFE", // bg-blue-100
    borderRadius: 20, // rounded-full
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12, // mr-3
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: "500", // font-medium
    color: "#111827", // TextDefault-gray-900
  },
  activityTime: {
    fontSize: 14, // TextDefault-sm
    color: "#4B5563", // TextDefault-gray-600
  },
  activityLocation: {
    fontSize: 12, // TextDefault-xs
    color: "#6B7280", // TextDefault-gray-500
  },
  themeToggleButton: {
    padding: 10,
    borderRadius: 8,
    alignSelf: "center",
    marginVertical: 10,
  },
});
