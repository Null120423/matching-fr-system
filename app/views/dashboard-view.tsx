import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Imports for icons, separator, scale, TextDefault
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

// Additional icons for enhanced UI
import useCurrentFriends from "@/services/hooks/matching/useCurrentFriends";
import {
  Activity,
  Bell,
  Calendar,
  ChevronRight,
  Clock,
  Coffee,
  Heart,
  MapPin,
  Plus,
  Star,
  UserPlus,
  Users,
} from "lucide-react-native";

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

// Enhanced Stats Card Component
interface StatsCardProps {
  stat: {
    label: string;
    value: string;
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

  const { data } = useCurrentFriends();

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
        {/* <TextDefault
          style={[styles.statLabel, { color: currentColors.textSecondary }]}
        >
          {stat.label}
        </TextDefault> */}
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
}

function QuickActionButton({
  title,
  subtitle,
  icon: Icon,
  color,
  backgroundColor,
  onPress,
  currentColors,
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

// Enhanced Activity Item
interface ActivityItemProps {
  activity: {
    title: string;
    time: string;
    location: string;
    type?: string;
  };
  currentColors: any;
  index: number;
}

function ActivityItem({ activity, currentColors, index }: ActivityItemProps) {
  const getActivityIcon = (type?: string) => {
    switch (type) {
      case "meeting":
        return Users;
      case "coffee":
        return Coffee;
      case "event":
        return Star;
      default:
        return Activity;
    }
  };

  const Icon = getActivityIcon(activity.type);

  return (
    <TouchableOpacity
      style={[
        styles.activityItem,
        { backgroundColor: currentColors.backgroundLightGray },
      ]}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.activityIconContainer,
          { backgroundColor: currentColors.primary + "20" },
        ]}
      >
        <Icon size={scale(20)} color={currentColors.primary} />
      </View>
      <View style={styles.activityDetails}>
        <TextDefault
          style={[styles.activityTitle, { color: currentColors.text }]}
        >
          {activity.title}
        </TextDefault>
        <View style={styles.activityMeta}>
          <Clock size={scale(14)} color={currentColors.textSecondary} />
          <TextDefault
            style={[
              styles.activityTime,
              { color: currentColors.textSecondary },
            ]}
          >
            {activity.time}
          </TextDefault>
        </View>
        <View style={styles.activityMeta}>
          <MapPin size={scale(14)} color={currentColors.textLight} />
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
      <View
        style={[
          styles.activityStatus,
          { backgroundColor: currentColors.success + "20" },
        ]}
      >
        <TextDefault
          style={[styles.activityStatusText, { color: currentColors.success }]}
        >
          Upcoming
        </TextDefault>
      </View>
    </TouchableOpacity>
  );
}

export default function DashboardScreen() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const shadowStyle = getShadowStyle(currentColors);

  const [myProfile, setMyProfile] = useState<any>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [friendRequestsCount, setFriendRequestsCount] = useState(3); // Mock data
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      const profile = await fetchMyProfile();
      setMyProfile(profile);

      const upcoming = await fetchAppointments("upcoming");
      setUpcomingAppointments(upcoming);

      const count = await getUnreadNotificationsCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await loadDashboardData();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Enhanced stats with navigation
  const stats = [
    {
      label: "Friend Requests",
      value: friendRequestsCount.toString(),
      icon: UserPlus,
      color: currentColors.primary,
      trend: "+2",
      onPress: () => {
        // router.push("/(common)/friends/requests");
      },
    },
    {
      label: "Appointments",
      value: upcomingAppointments.length.toString(),
      icon: Calendar,
      color: currentColors.success,
      trend: "+1",
      onPress: () => router.push("/(common)/appointments"),
    },
    {
      label: "Activities",
      value: myProfile?.activitiesCount?.toString() || "0",
      icon: Activity,
      color: currentColors.warning,
      onPress: () => {
        // router.push("/(common)/activities");
      },
    },
  ];

  // Enhanced quick actions
  const quickActions = [
    {
      title: "Your Friends",
      subtitle: "Manage your connections",
      icon: Users,
      color: currentColors.secondary,
      backgroundColor: currentColors.secondary + "10",
      onPress: () => {
        router.push("/(common)/current-friends");
      },
    },
    {
      title: "Find Friends",
      subtitle: "Discover new connections",
      icon: Users,
      color: currentColors.primary,
      backgroundColor: currentColors.primary + "10",
      onPress: () => {
        router.push("/(home)/discover");
      },
    },
    {
      title: "Create Event",
      subtitle: "Plan something fun",
      icon: Plus,
      color: currentColors.success,
      backgroundColor: currentColors.success + "10",
      onPress: () => {
        // router.push("/(common)/events/create");
      },
    },
    {
      title: "Friend Requests",
      subtitle: `${friendRequestsCount} pending requests`,
      icon: Heart,
      color: currentColors.danger,
      backgroundColor: currentColors.danger + "10",
      onPress: () => {
        router.push("/(common)/fr-requests");
      },
    },
    {
      title: "My Schedule",
      subtitle: "View your calendar",
      icon: Calendar,
      color: currentColors.info,
      backgroundColor: currentColors.info + "10",
      onPress: () => {
        // router.push("/(common)/schedule");
      },
    },
  ];

  // Enhanced recent activities with more details
  const recentActivities = upcomingAppointments.map((app, index) => ({
    title: app.activity || `Activity ${index + 1}`,
    time: app.time || "Today, 2:00 PM",
    location: app.location || "Coffee Shop Downtown",
    type: index % 3 === 0 ? "coffee" : index % 3 === 1 ? "meeting" : "event",
  }));

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
          Loading your dashboard...
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

        {/* Enhanced Header */}
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
              onPress={() => {
                router.navigate("/(home)/notification");
              }}
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
          {/* Enhanced Stats Grid */}
          <View style={styles.statsSection}>
            <TextDefault
              style={[styles.sectionTitle, { color: currentColors.text }]}
            >
              Your Overview
            </TextDefault>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
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

          {/* Enhanced Quick Actions */}
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

          {/* Enhanced Recent Activities */}
          <View style={styles.recentActivitiesSection}>
            <View style={styles.sectionHeader}>
              <TextDefault
                style={[styles.sectionTitle, { color: currentColors.text }]}
              >
                Upcoming Activities
              </TextDefault>
              <TouchableOpacity
                onPress={() => {
                  // router.push("/(common)/activities");
                }}
              >
                <TextDefault
                  style={[styles.seeAllText, { color: currentColors.primary }]}
                >
                  View All
                </TextDefault>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.activitiesCard,
                shadowStyle,
                { backgroundColor: currentColors.backgroundCard },
              ]}
            >
              {recentActivities.length > 0 ? (
                recentActivities
                  .slice(0, 3)
                  .map((activity, index) => (
                    <ActivityItem
                      key={index}
                      activity={activity}
                      currentColors={currentColors}
                      index={index}
                    />
                  ))
              ) : (
                <View style={styles.emptyState}>
                  <Calendar size={scale(48)} color={currentColors.textLight} />
                  <TextDefault
                    style={[
                      styles.emptyStateTitle,
                      { color: currentColors.text },
                    ]}
                  >
                    No upcoming activities
                  </TextDefault>
                  <TextDefault
                    style={[
                      styles.emptyStateSubtitle,
                      { color: currentColors.textSecondary },
                    ]}
                  >
                    Create your first event or join others!
                  </TextDefault>
                  <TouchableOpacity
                    style={[
                      styles.emptyStateButton,
                      { backgroundColor: currentColors.primary },
                    ]}
                    onPress={() => {
                      // router.push("/(common)/discover");
                    }}
                  >
                    <TextDefault style={styles.emptyStateButtonText}>
                      Explore Activities
                    </TextDefault>
                  </TouchableOpacity>
                </View>
              )}
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
  seeAllText: {
    fontSize: scale(14),
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    gap: scale(12),
  },
  statCard: {
    flex: 1,
    borderRadius: scale(16),
    padding: scale(10),
    borderWidth: 1,
  },
  statCardHeader: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  statIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
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
  statValue: {
    fontSize: scale(24),
    fontWeight: "bold",
    marginBottom: scale(4),
  },
  statLabel: {
    fontSize: scale(10),
    fontWeight: "500",
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
    width: scale(48),
    height: scale(48),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(16),
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

  // Activities Section
  recentActivitiesSection: {
    gap: scale(16),
  },
  activitiesCard: {
    borderRadius: scale(16),
    padding: scale(20),
    gap: scale(16),
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
    borderRadius: scale(12),
    gap: scale(12),
  },
  activityIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  activityDetails: {
    flex: 1,
    gap: scale(4),
  },
  activityTitle: {
    fontSize: scale(16),
    fontWeight: "600",
  },
  activityMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  activityTime: {
    fontSize: scale(14),
  },
  activityLocation: {
    fontSize: scale(14),
  },
  activityStatus: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(8),
  },
  activityStatusText: {
    fontSize: scale(12),
    fontWeight: "600",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: scale(40),
    gap: scale(12),
  },
  emptyStateTitle: {
    fontSize: scale(18),
    fontWeight: "600",
  },
  emptyStateSubtitle: {
    fontSize: scale(14),
    textAlign: "center",
  },
  emptyStateButton: {
    paddingHorizontal: scale(24),
    paddingVertical: scale(12),
    borderRadius: scale(8),
    marginTop: scale(8),
  },
  emptyStateButtonText: {
    color: "white",
    fontSize: scale(14),
    fontWeight: "600",
  },
});
