import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Core components
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default";
import { scale } from "@/helper/helpers";

// Theme and colors
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";

// Icons
import {
  Activity,
  Bell,
  Calendar,
  ChevronRight,
  Heart,
  Plus,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react-native";
import React from "react";

const getShadowStyle = (currentColors: any) =>
  Platform.select({
    ios: {
      shadowColor: currentColors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
  });

// Dashboard data structure
interface DashboardData {
  totalFriends: number;
  totalAppointments: number;
  totalAppointmentToday: number;
  totalSwipe: number;
  totalSwipeToday: number;
  totalNewFriendRequestsToday: number;
  totalMatchesToday: number;
  totalMatches: number;
}

// Enhanced Stats Card Component
interface StatsCardProps {
  stat: {
    label: string;
    value: string;
    todayValue?: string;
    icon: any;
    color: string;
    trend?: string;
    onPress?: () => void;
  };
  currentColors: any;
  shadowStyle: any;
  index: number;
}

function StatsCard({
  stat,
  currentColors,
  shadowStyle,
  index,
}: StatsCardProps) {
  const Icon = stat.icon;

  return (
    <TouchableOpacity
      style={[
        styles.statCard,
        shadowStyle,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
      onPress={stat.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.statCardHeader}>
        <View
          style={[
            styles.statIconContainer,
            { backgroundColor: stat.color + "20" },
          ]}
        >
          <Icon size={scale(20)} color={stat.color} />
        </View>
        <TextDefault style={[styles.statValue, { color: currentColors.text }]}>
          {stat.value}
        </TextDefault>
        <TextDefault
          style={[styles.statLabel, { color: currentColors.textSecondary }]}
        >
          {stat.label}
        </TextDefault>
        {stat.todayValue && (
          <View
            style={[styles.todayBadge, { backgroundColor: stat.color + "15" }]}
          >
            <TextDefault style={[styles.todayText, { color: stat.color }]}>
              Today: {stat.todayValue}
            </TextDefault>
          </View>
        )}
        {stat.trend && (
          <View
            style={[
              styles.trendContainer,
              { backgroundColor: currentColors.success + "15" },
            ]}
          >
            <TrendingUp size={scale(12)} color={currentColors.success} />
            <TextDefault
              style={[styles.trendText, { color: currentColors.success }]}
            >
              {stat.trend}
            </TextDefault>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// Enhanced Quick Action Button
interface QuickActionProps {
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  backgroundColor: string;
  onPress: () => void;
  currentColors: any;
  badge?: string;
}

function QuickActionButton({
  title,
  subtitle,
  icon: Icon,
  color,
  backgroundColor,
  onPress,
  currentColors,
  badge,
}: QuickActionProps) {
  return (
    <TouchableOpacity
      style={[
        styles.quickActionCard,
        { backgroundColor, borderColor: color + "30" },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.quickActionIconContainer,
          { backgroundColor: color + "20" },
        ]}
      >
        <Icon size={scale(24)} color={color} />
        {badge && (
          <View
            style={[
              styles.actionBadge,
              { backgroundColor: currentColors.danger },
            ]}
          >
            <TextDefault style={styles.actionBadgeText}>{badge}</TextDefault>
          </View>
        )}
      </View>
      <View style={styles.quickActionContent}>
        <TextDefault style={[styles.quickActionTitle, { color }]}>
          {title}
        </TextDefault>
        <TextDefault
          style={[
            styles.quickActionSubtitle,
            { color: currentColors.textSecondary },
          ]}
        >
          {subtitle}
        </TextDefault>
      </View>
      <ChevronRight size={scale(16)} color={currentColors.textLight} />
    </TouchableOpacity>
  );
}

// Today's Highlights Component
interface TodayHighlightProps {
  title: string;
  value: string;
  icon: any;
  color: string;
  currentColors: any;
}

function TodayHighlight({
  title,
  value,
  icon: Icon,
  color,
  currentColors,
}: TodayHighlightProps) {
  return (
    <View
      style={[
        styles.highlightCard,
        { backgroundColor: color + "10", borderColor: color + "30" },
      ]}
    >
      <View style={[styles.highlightIcon, { backgroundColor: color + "20" }]}>
        <Icon size={scale(18)} color={color} />
      </View>
      <View style={styles.highlightContent}>
        <TextDefault style={[styles.highlightValue, { color }]}>
          {value}
        </TextDefault>
        <TextDefault
          style={[
            styles.highlightTitle,
            { color: currentColors.textSecondary },
          ]}
        >
          {title}
        </TextDefault>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const shadowStyle = getShadowStyle(currentColors);

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalFriends: 1,
    totalAppointments: 1,
    totalAppointmentToday: 0,
    totalSwipe: 1,
    totalSwipeToday: 0,
    totalNewFriendRequestsToday: 0,
    totalMatchesToday: 0,
    totalMatches: 2,
  });
  const [unreadCount, setUnreadCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      // Simulate API call - replace with actual API
      // const data = await fetchDashboardStats()
      // setDashboardData(data)
      console.log("Loading dashboard data...");
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Main stats with your data structure
  const mainStats = [
    {
      label: "Friends",
      value: dashboardData.totalFriends.toString(),
      icon: Users,
      color: currentColors.primary,
      onPress: () => router.push("/(common)/current-friends"),
    },
    {
      label: "Appointments",
      value: dashboardData.totalAppointments.toString(),
      todayValue: dashboardData.totalAppointmentToday.toString(),
      icon: Calendar,
      color: currentColors.success,
      onPress: () => router.push("/(common)/current-friends/appointments"),
    },
    {
      label: "Matches",
      value: dashboardData.totalMatches.toString(),
      todayValue: dashboardData.totalMatchesToday.toString(),
      icon: Heart,
      color: currentColors.secondary,
      trend:
        dashboardData.totalMatchesToday > 0
          ? `+${dashboardData.totalMatchesToday}`
          : undefined,
      onPress: () => {
        // router.push("/(common)/matches"),
      },
    },
    {
      label: "Swipes",
      value: dashboardData.totalSwipe.toString(),
      todayValue: dashboardData.totalSwipeToday.toString(),
      icon: Zap,
      color: currentColors.warning,
      onPress: () => router.push("/(home)/discover"),
    },
  ];

  // Today's highlights
  const todayHighlights = [
    {
      title: "New Friend Requests",
      value: dashboardData.totalNewFriendRequestsToday.toString(),
      icon: UserPlus,
      color: currentColors.info,
    },
    {
      title: "Today's Appointments",
      value: dashboardData.totalAppointmentToday.toString(),
      icon: Calendar,
      color: currentColors.success,
    },
    {
      title: "Today's Matches",
      value: dashboardData.totalMatchesToday.toString(),
      icon: Heart,
      color: currentColors.secondary,
    },
    {
      title: "Today's Swipes",
      value: dashboardData.totalSwipeToday.toString(),
      icon: Activity,
      color: currentColors.warning,
    },
  ];

  // Quick actions with badges
  const quickActions = [
    {
      title: "Find New Friends",
      subtitle: "Discover interesting people",
      icon: Users,
      color: currentColors.primary,
      backgroundColor: currentColors.primary + "10",
      onPress: () => router.push("/(home)/discover"),
    },
    {
      title: "Friend Requests",
      subtitle: `${dashboardData.totalNewFriendRequestsToday} new requests`,
      icon: UserPlus,
      color: currentColors.info,
      backgroundColor: currentColors.info + "10",
      badge:
        dashboardData.totalNewFriendRequestsToday > 0
          ? dashboardData.totalNewFriendRequestsToday.toString()
          : undefined,
      onPress: () => router.push("/(common)/fr-requests"),
    },
    {
      title: "Create Appointment",
      subtitle: "Plan to meet up",
      icon: Plus,
      color: currentColors.success,
      backgroundColor: currentColors.success + "10",
      onPress: () => router.push("/(common)/current-friends"),
    },
    {
      title: "My Friends",
      subtitle: `${dashboardData.totalFriends} friends`,
      icon: Heart,
      color: currentColors.secondary,
      backgroundColor: currentColors.secondary + "10",
      onPress: () => {
        router.push("/(common)/current-friends");
      },
    },
  ];

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: currentColors.background },
        ]}
      >
        <Activity size={scale(40)} color={currentColors.primary} />
        <TextDefault
          style={[styles.loadingText, { color: currentColors.text }]}
        >
          Loading dashboard...
        </TextDefault>
      </View>
    );
  }

  return (
    <View
      style={[styles.safeArea, { backgroundColor: currentColors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[currentColors.primary]}
            tintColor={currentColors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Separator height={Platform.OS === "ios" ? scale(55) : scale(10)} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <TextDefault
                style={[styles.headerTitle, { color: currentColors.text }]}
              >
                Good morning! 👋
              </TextDefault>
              <TextDefault
                style={[
                  styles.headerSubtitle,
                  { color: currentColors.textSecondary },
                ]}
              >
                Ready for new adventures?
              </TextDefault>
            </View>
            <TouchableOpacity
              style={[
                styles.notificationButton,
                { backgroundColor: currentColors.backgroundCard },
              ]}
              onPress={() => router.navigate("/(home)/notification")}
            >
              <Bell size={scale(24)} color={currentColors.text} />
              {unreadCount > 0 && (
                <View
                  style={[
                    styles.notificationBadge,
                    { backgroundColor: currentColors.danger },
                  ]}
                >
                  <TextDefault style={styles.notificationBadgeText}>
                    {unreadCount > 9 ? "9+" : unreadCount.toString()}
                  </TextDefault>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Today's Highlights */}
          <View style={styles.highlightsSection}>
            <TextDefault
              style={[styles.sectionTitle, { color: currentColors.text }]}
            >
              Today's Activity
            </TextDefault>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.highlightsScroll}
            >
              <View style={styles.highlightsContainer}>
                {todayHighlights.map((highlight, index) => (
                  <TodayHighlight
                    key={index}
                    {...highlight}
                    currentColors={currentColors}
                  />
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Main Stats Grid */}
          <View style={styles.statsSection}>
            <TextDefault
              style={[styles.sectionTitle, { color: currentColors.text }]}
            >
              Your Overview
            </TextDefault>
            <View style={styles.statsGrid}>
              {mainStats.map((stat, index) => (
                <StatsCard
                  key={index}
                  stat={stat}
                  currentColors={currentColors}
                  shadowStyle={shadowStyle}
                  index={index}
                />
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <View style={styles.sectionHeader}>
              <TextDefault
                style={[styles.sectionTitle, { color: currentColors.text }]}
              >
                Quick Actions
              </TextDefault>
            </View>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <QuickActionButton
                  key={index}
                  {...action}
                  currentColors={currentColors}
                />
              ))}
            </View>
          </View>

          {/* Activity Summary */}
          <View style={styles.summarySection}>
            <View
              style={[
                styles.summaryCard,
                shadowStyle,
                { backgroundColor: currentColors.backgroundCard },
              ]}
            >
              <TextDefault
                style={[styles.summaryTitle, { color: currentColors.text }]}
              >
                Activity Summary
              </TextDefault>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <TextDefault
                    style={[
                      styles.summaryValue,
                      { color: currentColors.primary },
                    ]}
                  >
                    {(
                      (dashboardData.totalMatches /
                        Math.max(dashboardData.totalSwipe, 1)) *
                      100
                    ).toFixed(1)}
                    %
                  </TextDefault>
                  <TextDefault
                    style={[
                      styles.summaryLabel,
                      { color: currentColors.textSecondary },
                    ]}
                  >
                    Match Rate
                  </TextDefault>
                </View>
                <View style={styles.summaryItem}>
                  <TextDefault
                    style={[
                      styles.summaryValue,
                      { color: currentColors.success },
                    ]}
                  >
                    {dashboardData.totalAppointments}
                  </TextDefault>
                  <TextDefault
                    style={[
                      styles.summaryLabel,
                      { color: currentColors.textSecondary },
                    ]}
                  >
                    Total Appointments
                  </TextDefault>
                </View>
                <View style={styles.summaryItem}>
                  <TextDefault
                    style={[
                      styles.summaryValue,
                      { color: currentColors.secondary },
                    ]}
                  >
                    {dashboardData.totalFriends}
                  </TextDefault>
                  <TextDefault
                    style={[
                      styles.summaryLabel,
                      { color: currentColors.textSecondary },
                    ]}
                  >
                    Friends
                  </TextDefault>
                </View>
              </View>
            </View>
          </View>
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
    gap: scale(16),
  },
  loadingText: {
    fontSize: scale(16),
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: scale(28),
    fontWeight: "bold",
    marginBottom: scale(4),
  },
  headerSubtitle: {
    fontSize: scale(16),
    fontWeight: "400",
  },
  notificationButton: {
    position: "relative",
    padding: scale(12),
    borderRadius: scale(12),
  },
  notificationBadge: {
    position: "absolute",
    top: scale(4),
    right: scale(4),
    minWidth: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(4),
  },
  notificationBadgeText: {
    fontSize: scale(10),
    fontWeight: "bold",
    color: "white",
  },
  content: {
    paddingHorizontal: scale(20),
    gap: scale(32),
  },

  // Highlights Section
  highlightsSection: {
    gap: scale(16),
  },
  highlightsScroll: {
    marginHorizontal: scale(-20),
    paddingHorizontal: scale(20),
  },
  highlightsContainer: {
    flexDirection: "row",
    gap: scale(12),
    paddingRight: scale(20),
  },
  highlightCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
    borderRadius: scale(12),
    borderWidth: 1,
    minWidth: scale(140),
  },
  highlightIcon: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(8),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
  },
  highlightContent: {
    flex: 1,
  },
  highlightValue: {
    fontSize: scale(20),
    fontWeight: "bold",
    marginBottom: scale(2),
  },
  highlightTitle: {
    fontSize: scale(12),
    fontWeight: "500",
  },

  // Stats Section
  statsSection: {
    gap: scale(16),
  },
  sectionTitle: {
    fontSize: scale(20),
    fontWeight: "bold",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(12),
  },
  statCard: {
    flex: 1,
    minWidth: scale(150),
    borderRadius: scale(16),
    padding: scale(16),
    borderWidth: 1,
  },
  statCardHeader: {
    alignItems: "center",
    gap: scale(8),
  },
  statIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: scale(24),
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: scale(14),
    fontWeight: "500",
    textAlign: "center",
  },
  todayBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(8),
    marginTop: scale(4),
  },
  todayText: {
    fontSize: scale(11),
    fontWeight: "600",
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    borderRadius: scale(8),
    gap: scale(2),
  },
  trendText: {
    fontSize: scale(12),
    fontWeight: "600",
  },

  // Quick Actions Section
  quickActionsSection: {
    gap: scale(16),
  },
  quickActionsGrid: {
    gap: scale(12),
  },
  quickActionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
    borderRadius: scale(12),
    borderWidth: 1,
  },
  quickActionIconContainer: {
    position: "relative",
    width: scale(48),
    height: scale(48),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(16),
  },
  actionBadge: {
    position: "absolute",
    top: scale(-4),
    right: scale(-4),
    minWidth: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    alignItems: "center",
    justifyContent: "center",
  },
  actionBadgeText: {
    fontSize: scale(10),
    fontWeight: "bold",
    color: "white",
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: scale(16),
    fontWeight: "600",
    marginBottom: scale(2),
  },
  quickActionSubtitle: {
    fontSize: scale(14),
  },

  // Summary Section
  summarySection: {
    gap: scale(16),
  },
  summaryCard: {
    borderRadius: scale(16),
    padding: scale(20),
  },
  summaryTitle: {
    fontSize: scale(18),
    fontWeight: "bold",
    marginBottom: scale(16),
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: scale(24),
    fontWeight: "bold",
    marginBottom: scale(4),
  },
  summaryLabel: {
    fontSize: scale(12),
    fontWeight: "500",
    textAlign: "center",
  },
});
