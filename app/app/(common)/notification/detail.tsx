import { useRoute } from "@react-navigation/native";
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
  Clock,
  Heart,
  MapPin,
  Package,
  User,
  XCircle,
} from "lucide-react-native";

// Core components
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default"; // Assuming TextDefault uses theme colors internally
import { scale } from "@/helper/helpers";

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

export default function NotificationDetailsScreen() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  const params = useRoute()?.params as { id: string };
  const notificationId = params?.id;

  const [notification, setNotification] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // todo getNotificationById
    // const loadNotification = async () => {
    //   if (!notificationId) {
    //     setIsLoading(false);
    //     return;
    //   }
    //   setIsLoading(true);
    //   try {
    //     const fetchedNotif = await getNotificationById(notificationId);
    //     if (fetchedNotif) {
    //       setNotification(fetchedNotif);
    //       // Automatically mark as read when details are viewed
    //       await markNotificationAsRead(notificationId);
    //     }
    //   } catch (error) {
    //     console.error("Failed to load notification details:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // loadNotification();
  }, [notificationId]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment_invite":
        return <Calendar size={24} color={currentColors.info} />;
      case "system_update":
        return <Package size={24} color={currentColors.textSecondary} />;
      case "like":
        return <Heart size={24} color={currentColors.secondary} />;
      case "appointment_accepted":
        return <CheckCircle size={24} color={currentColors.success} />;
      default:
        return <Bell size={24} color={currentColors.textSecondary} />;
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          detailsStyles.safeArea,
          {
            backgroundColor: currentColors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <TextDefault style={{ color: currentColors.text }}>
          Đang tải chi tiết thông báo...
        </TextDefault>
      </View>
    );
  }

  if (!notification) {
    return (
      <View
        style={[
          detailsStyles.emptyContainer,
          {
            backgroundColor: currentColors.backgroundCard,
            borderColor: currentColors.border,
            shadowColor: currentColors.text,
          },
        ]}
      >
        <Bell size={64} color={currentColors.border} />
        <TextDefault
          style={[
            detailsStyles.emptyText,
            { color: currentColors.textSecondary },
          ]}
        >
          Không tìm thấy chi tiết thông báo.
        </TextDefault>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            detailsStyles.emptyButton,
            { backgroundColor: currentColors.primary },
          ]}
        >
          <TextDefault style={detailsStyles.emptyButtonText}>
            Quay lại
          </TextDefault>
        </TouchableOpacity>
      </View>
    );
  }

  // Handle specific actions for notification types (e.g., accept/decline invite)
  const handleAcceptInvite = () => {
    // todo updateAppointmentStatus
    // Call appointments service to accept
    // console.log("Accepting invite from notification:", notification.id);
    // You'd typically call an API here: updateAppointmentStatus(notification.details.appointmentId, 'accepted');
    alert("Lời mời đã được chấp nhận (Mock)");
    router.back();
  };

  const handleDeclineInvite = () => {
    // todo updateAppointmentStatus
    // Call appointments service to decline
    // console.log("Declining invite from notification:", notification.id);
    // You'd typically call an API here: updateAppointmentStatus(notification.details.appointmentId, 'declined');
    alert("Lời mời đã được từ chối (Mock)");
    router.back();
  };

  const handleViewProfile = (userId: string) => {
    console.log("Navigating to user profile:", userId);
    // router.push({ pathname: "/(home)/discover/user-profile", params: { id: userId } });
    alert(`Điều hướng đến hồ sơ của ${userId} (Mock)`);
  };

  return (
    <View
      style={[
        detailsStyles.safeArea,
        { backgroundColor: currentColors.background },
      ]}
    >
      <ScrollView style={detailsStyles.scrollView}>
        <Separator height={Platform.OS === "ios" ? scale(55) : scale(10)} />
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 16 }}>
          <TextDefault style={{ color: currentColors.textSecondary }}>
            Back
          </TextDefault>
        </TouchableOpacity>
        <View style={detailsStyles.header}>
          <TextDefault
            style={[detailsStyles.headerTitle, { color: currentColors.text }]}
          >
            Chi tiết thông báo
          </TextDefault>
          <TextDefault
            style={[
              detailsStyles.headerSubtitle,
              { color: currentColors.textSecondary },
            ]}
          >
            {notification.title}
          </TextDefault>
        </View>

        {notification && (
          <View style={detailsStyles.content}>
            <View
              style={[
                detailsStyles.card,
                shadowStyle,
                {
                  backgroundColor: currentColors.backgroundCard,
                  borderColor: currentColors.border,
                  shadowColor: currentColors.text,
                },
              ]}
            >
              <View
                style={[
                  detailsStyles.cardHeader,
                  { borderBottomColor: currentColors.border },
                ]}
              >
                <View
                  style={[
                    detailsStyles.iconBackground,
                    { backgroundColor: currentColors.backgroundLightBlue },
                  ]}
                >
                  {getNotificationIcon(notification.type)}
                </View>
                <View style={detailsStyles.headerText}>
                  <TextDefault
                    style={[
                      detailsStyles.cardTitle,
                      { color: currentColors.text },
                    ]}
                  >
                    {notification.title}
                  </TextDefault>
                  <TextDefault
                    style={[
                      detailsStyles.cardTime,
                      { color: currentColors.textSecondary },
                    ]}
                  >
                    {notification.time}
                  </TextDefault>
                </View>
              </View>

              <View style={detailsStyles.cardBody}>
                <TextDefault
                  style={[
                    detailsStyles.cardMessage,
                    { color: currentColors.textSecondary },
                  ]}
                >
                  {notification.message}
                </TextDefault>

                {/* Render specific details based on notification type */}
                {notification.type === "appointment_invite" &&
                  notification.details && (
                    <View
                      style={[
                        detailsStyles.detailsSection,
                        { borderTopColor: currentColors.border },
                      ]}
                    >
                      <TextDefault
                        style={[
                          detailsStyles.detailsTitle,
                          { color: currentColors.text },
                        ]}
                      >
                        Thông tin lời mời:
                      </TextDefault>
                      <View style={detailsStyles.detailRow}>
                        <User
                          size={16}
                          color={currentColors.textSecondary}
                          style={detailsStyles.detailIcon}
                        />
                        <TextDefault
                          style={[
                            detailsStyles.detailText,
                            { color: currentColors.textSecondary },
                          ]}
                        >
                          Người gửi: {notification.details.from}
                        </TextDefault>
                      </View>
                      <View style={detailsStyles.detailRow}>
                        <Calendar
                          size={16}
                          color={currentColors.textSecondary}
                          style={detailsStyles.detailIcon}
                        />
                        <TextDefault
                          style={[
                            detailsStyles.detailText,
                            { color: currentColors.textSecondary },
                          ]}
                        >
                          Hoạt động: {notification.details.activity}
                        </TextDefault>
                      </View>
                      <View style={detailsStyles.detailRow}>
                        <Clock
                          size={16}
                          color={currentColors.textSecondary}
                          style={detailsStyles.detailIcon}
                        />
                        <TextDefault
                          style={[
                            detailsStyles.detailText,
                            { color: currentColors.textSecondary },
                          ]}
                        >
                          Thời gian: {notification.details.time}
                        </TextDefault>
                      </View>
                      <View style={detailsStyles.detailRow}>
                        <MapPin
                          size={16}
                          color={currentColors.textSecondary}
                          style={detailsStyles.detailIcon}
                        />
                        <TextDefault
                          style={[
                            detailsStyles.detailText,
                            { color: currentColors.textSecondary },
                          ]}
                        >
                          Địa điểm: {notification.details.location}
                        </TextDefault>
                      </View>
                      <View
                        style={[
                          detailsStyles.actionButtonsContainer,
                          { borderTopColor: currentColors.border },
                        ]}
                      >
                        <TouchableOpacity
                          style={[
                            detailsStyles.actionButton,
                            detailsStyles.acceptButton,
                            { backgroundColor: currentColors.success },
                          ]}
                          onPress={handleAcceptInvite}
                        >
                          <CheckCircle
                            size={16}
                            color="white"
                            style={detailsStyles.buttonIcon}
                          />
                          <TextDefault style={detailsStyles.buttonText}>
                            Chấp nhận
                          </TextDefault>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            detailsStyles.actionButton,
                            detailsStyles.declineButton,
                            {
                              backgroundColor: currentColors.backgroundCard,
                              borderColor: currentColors.border,
                            },
                          ]}
                          onPress={handleDeclineInvite}
                        >
                          <XCircle
                            size={16}
                            color={currentColors.text}
                            style={detailsStyles.buttonIcon}
                          />
                          <TextDefault
                            style={detailsStyles.buttonTextSecondary}
                          >
                            Từ chối
                          </TextDefault>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                {notification.type === "system_update" &&
                  notification.details && (
                    <View
                      style={[
                        detailsStyles.detailsSection,
                        { borderTopColor: currentColors.border },
                      ]}
                    >
                      <TextDefault
                        style={[
                          detailsStyles.detailsTitle,
                          { color: currentColors.text },
                        ]}
                      >
                        Chi tiết cập nhật:
                      </TextDefault>
                      <TextDefault
                        style={[
                          detailsStyles.detailText,
                          { color: currentColors.textSecondary },
                        ]}
                      >
                        Phiên bản: {notification.details.version}
                      </TextDefault>
                      <TextDefault
                        style={[
                          detailsStyles.detailText,
                          { color: currentColors.textSecondary },
                        ]}
                      >
                        Các tính năng mới:
                      </TextDefault>
                      {notification.details.features.map(
                        (feature: string, index: number) => (
                          <View key={index} style={detailsStyles.featureItem}>
                            <TextDefault
                              style={[
                                detailsStyles.featureBullet,
                                { color: currentColors.textSecondary },
                              ]}
                            >
                              •
                            </TextDefault>
                            <TextDefault
                              style={[
                                detailsStyles.detailText,
                                { color: currentColors.textSecondary },
                              ]}
                            >
                              {feature}
                            </TextDefault>
                          </View>
                        )
                      )}
                    </View>
                  )}

                {notification.type === "like" && notification.details && (
                  <View
                    style={[
                      detailsStyles.detailsSection,
                      { borderTopColor: currentColors.border },
                    ]}
                  >
                    <TextDefault
                      style={[
                        detailsStyles.detailsTitle,
                        { color: currentColors.text },
                      ]}
                    >
                      Thông tin người thích bạn:
                    </TextDefault>
                    <View style={detailsStyles.detailRow}>
                      <User
                        size={16}
                        color={currentColors.textSecondary}
                        style={detailsStyles.detailIcon}
                      />
                      <TextDefault
                        style={[
                          detailsStyles.detailText,
                          { color: currentColors.textSecondary },
                        ]}
                      >
                        Người thích: {notification.details.user}
                      </TextDefault>
                    </View>
                    <TouchableOpacity
                      style={[
                        detailsStyles.viewProfileButton,
                        { backgroundColor: currentColors.backgroundBlueLite },
                      ]}
                      onPress={() =>
                        handleViewProfile(notification.details.user)
                      }
                    >
                      <TextDefault
                        style={[
                          detailsStyles.viewProfileButtonText,
                          { color: currentColors.info },
                        ]}
                      >
                        Xem hồ sơ
                      </TextDefault>
                    </TouchableOpacity>
                  </View>
                )}

                {notification.type === "appointment_accepted" &&
                  notification.details && (
                    <View
                      style={[
                        detailsStyles.detailsSection,
                        { borderTopColor: currentColors.border },
                      ]}
                    >
                      <TextDefault
                        style={[
                          detailsStyles.detailsTitle,
                          { color: currentColors.text },
                        ]}
                      >
                        Thông tin cuộc hẹn:
                      </TextDefault>
                      <View style={detailsStyles.detailRow}>
                        <User
                          size={16}
                          color={currentColors.textSecondary}
                          style={detailsStyles.detailIcon}
                        />
                        <TextDefault
                          style={[
                            detailsStyles.detailText,
                            { color: currentColors.textSecondary },
                          ]}
                        >
                          Với: {notification.details.to}
                        </TextDefault>
                      </View>
                      <View style={detailsStyles.detailRow}>
                        <Calendar
                          size={16}
                          color={currentColors.textSecondary}
                          style={detailsStyles.detailIcon}
                        />
                        <TextDefault
                          style={[
                            detailsStyles.detailText,
                            { color: currentColors.textSecondary },
                          ]}
                        >
                          Hoạt động: {notification.details.activity}
                        </TextDefault>
                      </View>
                      <TextDefault
                        style={[
                          detailsStyles.acceptedStatusText,
                          { color: currentColors.success },
                        ]}
                      >
                        Đã được chấp nhận!
                      </TextDefault>
                    </View>
                  )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const detailsStyles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  headerSubtitle: { fontSize: 16, marginTop: 4 },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  card: {
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerText: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  cardTime: { fontSize: 14 },
  cardBody: {},
  cardMessage: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsSection: {
    marginTop: 16,
    borderTopWidth: 1,
    paddingTop: 16,
  },
  detailsTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  detailIcon: { marginRight: 12 },
  detailText: { fontSize: 15 },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  featureBullet: { fontSize: 15, marginRight: 8 },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
    borderTopWidth: 1,
    paddingTop: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
  },
  buttonIcon: { marginRight: 8 },
  buttonText: { fontSize: 16, fontWeight: "600", color: "white" },
  buttonTextSecondary: { fontSize: 16, fontWeight: "600" },
  acceptButton: {}, // Bg handled by theme
  declineButton: { borderWidth: 1 }, // Border color handled by theme
  viewProfileButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 16,
    alignSelf: "flex-start",
  },
  viewProfileButtonText: { fontSize: 15, fontWeight: "600" },
  acceptedStatusText: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    borderRadius: 8,
    margin: 24,
    // Shadow color handled by theme
  },
  emptyText: { fontSize: 16, marginTop: 16, textAlign: "center" },
  emptyButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
