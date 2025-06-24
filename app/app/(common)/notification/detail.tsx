import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Icons
import {
  AlarmClock,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Package,
  User,
} from "lucide-react-native";

// Core components
import TextDefault from "@/components/@core/text-default";

// Theme Context
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import useGetNotificationById from "@/services/hooks/notification/useGetNotificationById";
import moment from "moment";
import React from "react";

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  android: {
    elevation: 2,
  },
});

// Mock user data for the appointment due notification
const mockUsers = {
  "4813c767-0af0-4a39-8845-db1181e1fcf6": {
    firstName: "John",
    lastName: "Doe",
    avatarUrl:
      "https://hoseiki.vn/wp-content/uploads/2025/03/gai-xinh-tu-suong-28.jpg",
    username: "user123",
  },
};

export default function NotificationDetailsScreen() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const [isSnoozing, setIsSnoozing] = useState(false);

  const params = useRoute()?.params as { id: string };
  const notificationId = params?.id;
  const { currentUser } = useAuth();
  const { data: notification, isLoading } =
    useGetNotificationById(notificationId);

  const friendId = "4813c767-0af0-4a39-8845-db1181e1fcf6";
  const friend = mockUsers[friendId];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "APPOINTMENT_DUE":
        return <Clock size={24} color={currentColors.warning} />;
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

  const handleViewAppointment = () => {
    // router.push({ pathname: "/(common)/appointment/detail", params: { id: detail.id } })
    Alert.alert("Navigate", "Go to appointment details");
  };

  const handleMessageFriend = () => {
    console.log("Opening chat with friend:", friendId);
    // router.push({ pathname: "/(common)/chat/conversation", params: { friendId } })
    Alert.alert("Message", `Open conversation with ${friend.firstName}`);
  };

  const handleGetDirections = () => {};

  const handleSnoozeReminder = () => {
    setIsSnoozing(true);
    Alert.alert("Snooze", "Choose snooze time:", [
      { text: "5 minutes", onPress: () => snoozeFor(5) },
      { text: "15 minutes", onPress: () => snoozeFor(15) },
      { text: "30 minutes", onPress: () => snoozeFor(30) },
      { text: "Cancel", style: "cancel", onPress: () => setIsSnoozing(false) },
    ]);
  };

  const snoozeFor = (minutes: number) => {
    console.log(`Snoozing appointment reminder for ${minutes} minutes`);
    Alert.alert("Snoozed", `Will remind again in ${minutes} minutes`);
    setIsSnoozing(false);
    // Here you would typically call an API to schedule the reminder
  };

  const handleMarkAsDone = () => {
    Alert.alert("Confirm", "Mark this appointment as completed?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Complete",
        onPress: () => {
          console.log("Marking appointment as completed");
          Alert.alert("Success", "Appointment marked as completed");
          router.back();
        },
      },
    ]);
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours} hours ${remainingMinutes} minutes`
        : `${hours} hours`;
    }
  };

  return (
    <View
      style={[styles.safeArea, { backgroundColor: currentColors.background }]}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Main Notification Card */}
          <View
            style={[
              styles.card,
              shadowStyle,
              {
                backgroundColor: currentColors.backgroundCard,
                borderColor: currentColors.border,
                shadowColor: currentColors.text,
              },
            ]}
          >
            {/* Urgent Status Bar */}
            <View
              style={[
                styles.urgentBar,
                { backgroundColor: currentColors.warning },
              ]}
            />

            <View
              style={[
                styles.cardHeader,
                { borderBottomColor: currentColors.border },
              ]}
            >
              <View
                style={[
                  styles.iconBackground,
                  { backgroundColor: `${currentColors.warning}20` },
                ]}
              >
                {getNotificationIcon(notification?.type ?? "")}
              </View>
              <View style={styles.headerText}>
                <TextDefault
                  style={[styles.cardTitle, { color: currentColors.text }]}
                >
                  {notification?.title}
                </TextDefault>
                <TextDefault
                  style={[
                    styles.cardTime,
                    { color: currentColors.textSecondary },
                  ]}
                >
                  {moment(notification?.createdAt).format("HH:mm, DD/MM/YYYY")}
                </TextDefault>
              </View>
            </View>

            <View style={styles.cardBody}>
              <TextDefault
                style={[
                  styles.cardMessage,
                  { color: currentColors.textSecondary },
                ]}
              >
                {notification?.body}
              </TextDefault>

              {/* Appointment Details Section */}
              <View
                style={[
                  styles.detailsSection,
                  { borderTopColor: currentColors.border },
                ]}
              >
                <TextDefault
                  style={[styles.detailsTitle, { color: currentColors.text }]}
                >
                  Appointment details:
                </TextDefault>

                <View style={styles.detailRow}>
                  <User
                    size={16}
                    color={currentColors.textSecondary}
                    style={styles.detailIcon}
                  />
                  <TextDefault
                    style={[
                      styles.detailText,
                      { color: currentColors.textSecondary },
                    ]}
                  >
                    With: {friend.firstName} {friend.lastName}
                  </TextDefault>
                </View>

                <View style={styles.detailRow}>
                  <Calendar
                    size={16}
                    color={currentColors.textSecondary}
                    style={styles.detailIcon}
                  />
                  <TextDefault
                    style={[
                      styles.detailText,
                      { color: currentColors.textSecondary },
                    ]}
                  >
                    Activity:
                    {/* {notification?.activity} */}
                  </TextDefault>
                </View>

                <View style={styles.detailRow}>
                  <Clock
                    size={16}
                    color={currentColors.textSecondary}
                    style={styles.detailIcon}
                  />
                  <TextDefault
                    style={[
                      styles.detailText,
                      { color: currentColors.textSecondary },
                    ]}
                  >
                    Time:
                    {/* {formatTime(detail.time)} ({formatDuration(detail.duration)}
                    ) */}
                  </TextDefault>
                </View>

                <View style={styles.detailRow}>
                  <MapPin
                    size={16}
                    color={currentColors.textSecondary}
                    style={styles.detailIcon}
                  />
                  <View style={styles.locationDetails}>
                    <TextDefault
                      style={[
                        styles.detailText,
                        { color: currentColors.textSecondary },
                      ]}
                    >
                      {/* {detail.location.name} */}
                    </TextDefault>
                    <TextDefault
                      style={[
                        styles.locationAddress,
                        { color: currentColors.textLight },
                      ]}
                    >
                      {/* {detail.location.address} */}
                    </TextDefault>
                  </View>
                </View>

                {/* Status Indicator */}
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: currentColors.warning },
                    ]}
                  />
                  <TextDefault
                    style={[
                      styles.statusText,
                      { color: currentColors.warning },
                    ]}
                  >
                    Ongoing
                  </TextDefault>
                </View>
              </View>

              {/* Action Buttons */}
              <View
                style={[
                  styles.actionButtonsContainer,
                  { borderTopColor: currentColors.border },
                ]}
              >
                {/* Primary Actions */}
                <View style={styles.primaryActions}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.primaryButton,
                      { backgroundColor: currentColors.primary },
                    ]}
                    onPress={handleViewAppointment}
                  >
                    <Calendar
                      size={16}
                      color="white"
                      style={styles.buttonIcon}
                    />
                    <TextDefault style={styles.buttonText}>
                      View details
                    </TextDefault>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.primaryButton,
                      { backgroundColor: currentColors.success },
                    ]}
                    onPress={handleMessageFriend}
                  >
                    <MessageCircle
                      size={16}
                      color="white"
                      style={styles.buttonIcon}
                    />
                    <TextDefault style={styles.buttonText}>Message</TextDefault>
                  </TouchableOpacity>
                </View>

                {/* Secondary Actions */}
                <View style={styles.secondaryActions}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.secondaryButton,
                      {
                        backgroundColor: currentColors.backgroundCard,
                        borderColor: currentColors.border,
                      },
                    ]}
                    onPress={handleGetDirections}
                  >
                    <Navigation
                      size={16}
                      color={currentColors.text}
                      style={styles.buttonIcon}
                    />
                    <TextDefault
                      style={[
                        styles.buttonTextSecondary,
                        { color: currentColors.text },
                      ]}
                    >
                      Directions
                    </TextDefault>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.secondaryButton,
                      {
                        backgroundColor: currentColors.backgroundCard,
                        borderColor: currentColors.border,
                      },
                    ]}
                    onPress={handleSnoozeReminder}
                    disabled={isSnoozing}
                  >
                    <AlarmClock
                      size={16}
                      color={currentColors.text}
                      style={styles.buttonIcon}
                    />
                    <TextDefault
                      style={[
                        styles.buttonTextSecondary,
                        { color: currentColors.text },
                      ]}
                    >
                      {isSnoozing ? "Snoozing..." : "Snooze"}
                    </TextDefault>
                  </TouchableOpacity>
                </View>

                {/* Mark as Done */}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.doneButton,
                    {
                      backgroundColor: `${currentColors.success}15`,
                      borderColor: currentColors.success,
                    },
                  ]}
                  onPress={handleMarkAsDone}
                >
                  <CheckCircle
                    size={16}
                    color={currentColors.success}
                    style={styles.buttonIcon}
                  />
                  <TextDefault
                    style={[
                      styles.buttonTextSecondary,
                      { color: currentColors.success },
                    ]}
                  >
                    Mark as completed
                  </TextDefault>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  backButton: {
    padding: 16,
  },
  backText: {
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  headerSubtitle: { fontSize: 16 },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  urgentBar: {
    height: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
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
  cardBody: {
    padding: 20,
  },
  cardMessage: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsSection: {
    borderTopWidth: 1,
    paddingTop: 20,
    marginBottom: 20,
  },
  detailsTitle: { fontSize: 16, fontWeight: "600", marginBottom: 16 },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  detailIcon: { marginRight: 12, marginTop: 2 },
  detailText: { fontSize: 15, flex: 1 },
  locationDetails: {
    flex: 1,
  },
  locationAddress: {
    fontSize: 13,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionButtonsContainer: {
    borderTopWidth: 1,
    paddingTop: 20,
    gap: 12,
  },
  primaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
  },
  doneButton: {
    borderWidth: 1,
  },
  buttonIcon: { marginRight: 8 },
  buttonText: { fontSize: 15, fontWeight: "600", color: "white" },
  buttonTextSecondary: { fontSize: 15, fontWeight: "600" },
});
