import {
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react-native";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { AppointmentData } from "./appointment-modal";

interface AppointmentCardProps {
  appointment: AppointmentData & {
    friend: {
      firstName: string;
      lastName: string;
      avatarUrl: string;
      username: string;
    };
  };
  onPress: () => void;
  onMessage: () => void;
  onMore: () => void;
}

export default function AppointmentCard({
  appointment,
  onPress,
  onMessage,
  onMore,
}: AppointmentCardProps) {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return currentColors.success;
      case "pending":
        return currentColors.warning;
      case "cancelled":
        return currentColors.error;
      default:
        return currentColors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Ngày mai";
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "short",
      });
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}p`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}h${remainingMinutes}p`
        : `${hours}h`;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Status Bar */}
      <View
        style={[
          styles.statusBar,
          { backgroundColor: getStatusColor(appointment.status) },
        ]}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.friendInfo}>
            <Image
              source={{ uri: appointment.friend.avatarUrl }}
              style={styles.avatar}
            />
            <View style={styles.friendDetails}>
              <TextDefault
                style={[styles.friendName, { color: currentColors.text }]}
              >
                {appointment.friend.firstName} {appointment.friend.lastName}
              </TextDefault>
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(appointment.status) },
                  ]}
                />
                <TextDefault
                  style={[
                    styles.statusText,
                    { color: getStatusColor(appointment.status) },
                  ]}
                >
                  {getStatusText(appointment.status)}
                </TextDefault>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={onMore} style={styles.moreButton}>
            <MoreHorizontal size={20} color={currentColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Activity */}
        <View style={styles.activitySection}>
          <TextDefault
            style={[styles.activityTitle, { color: currentColors.text }]}
          >
            {appointment.activity}
          </TextDefault>
        </View>

        {/* Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Calendar size={16} color={currentColors.textSecondary} />
            <TextDefault
              style={[
                styles.detailText,
                { color: currentColors.textSecondary },
              ]}
            >
              {formatDate(appointment.date)} • {appointment.time}
            </TextDefault>
          </View>

          <View style={styles.detailItem}>
            <Clock size={16} color={currentColors.textSecondary} />
            <TextDefault
              style={[
                styles.detailText,
                { color: currentColors.textSecondary },
              ]}
            >
              {formatDuration(appointment.duration)}
            </TextDefault>
          </View>

          <View style={styles.detailItem}>
            <MapPin size={16} color={currentColors.textSecondary} />
            <TextDefault
              style={[
                styles.detailText,
                { color: currentColors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {appointment.location.name}
            </TextDefault>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.messageButton,
              { backgroundColor: currentColors.primary },
            ]}
            onPress={onMessage}
          >
            <MessageCircle size={16} color="white" />
            <TextDefault style={styles.messageButtonText}>Nhắn tin</TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  statusBar: {
    height: 4,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  moreButton: {
    padding: 4,
  },
  activitySection: {
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detailsSection: {
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  messageButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});
