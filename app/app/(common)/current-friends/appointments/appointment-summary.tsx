import {
  Activity,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
} from "lucide-react-native";
import { useState } from "react";
import { Image, StyleSheet, TextInput, View } from "react-native";

import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import type { AppointmentData } from "./appointment-modal";

interface AppointmentSummaryProps {
  appointment: AppointmentData;
  friend: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    username: string;
  };
  onNotesChange: (notes: string) => void;
}

export default function AppointmentSummary({
  appointment,
  friend,
  onNotesChange,
}: AppointmentSummaryProps) {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const [notes, setNotes] = useState(appointment.notes || "");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  const handleNotesChange = (text: string) => {
    setNotes(text);
    onNotesChange(text);
  };

  return (
    <View style={styles.container}>
      {/* Friend Info */}
      <View
        style={[
          styles.friendCard,
          {
            backgroundColor: currentColors.backgroundCard,
            borderColor: currentColors.border,
          },
        ]}
      >
        <Image source={{ uri: friend.avatarUrl }} style={styles.friendAvatar} />
        <View style={styles.friendInfo}>
          <TextDefault
            style={[styles.friendName, { color: currentColors.text }]}
          >
            {friend.firstName} {friend.lastName}
          </TextDefault>
          <TextDefault
            style={[
              styles.friendUsername,
              { color: currentColors.textSecondary },
            ]}
          >
            @{friend.username}
          </TextDefault>
        </View>
      </View>

      {/* Appointment Details */}
      <View
        style={[
          styles.detailsCard,
          {
            backgroundColor: currentColors.backgroundCard,
            borderColor: currentColors.border,
          },
        ]}
      >
        <TextDefault style={[styles.cardTitle, { color: currentColors.text }]}>
          Appointment Details
        </TextDefault>

        <View style={styles.detailsList}>
          <View style={styles.detailItem}>
            <View
              style={[
                styles.detailIcon,
                { backgroundColor: `${currentColors.primary}15` },
              ]}
            >
              <Activity size={18} color={currentColors.primary} />
            </View>
            <View style={styles.detailContent}>
              <TextDefault
                style={[
                  styles.detailLabel,
                  { color: currentColors.textSecondary },
                ]}
              >
                Activity
              </TextDefault>
              <TextDefault
                style={[styles.detailValue, { color: currentColors.text }]}
              >
                {appointment.activity}
              </TextDefault>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View
              style={[
                styles.detailIcon,
                { backgroundColor: `${currentColors.success}15` },
              ]}
            >
              <Calendar size={18} color={currentColors.success} />
            </View>
            <View style={styles.detailContent}>
              <TextDefault
                style={[
                  styles.detailLabel,
                  { color: currentColors.textSecondary },
                ]}
              >
                Date
              </TextDefault>
              <TextDefault
                style={[styles.detailValue, { color: currentColors.text }]}
              >
                {appointment.date && formatDate(appointment.date)}
              </TextDefault>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View
              style={[
                styles.detailIcon,
                { backgroundColor: `${currentColors.info}15` },
              ]}
            >
              <Clock size={18} color={currentColors.info} />
            </View>
            <View style={styles.detailContent}>
              <TextDefault
                style={[
                  styles.detailLabel,
                  { color: currentColors.textSecondary },
                ]}
              >
                Time
              </TextDefault>
              <TextDefault
                style={[styles.detailValue, { color: currentColors.text }]}
              >
                {appointment.time} (
                {appointment.duration && formatDuration(appointment.duration)})
              </TextDefault>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View
              style={[
                styles.detailIcon,
                { backgroundColor: `${currentColors.secondary}15` },
              ]}
            >
              <MapPin size={18} color={currentColors.secondary} />
            </View>
            <View style={styles.detailContent}>
              <TextDefault
                style={[
                  styles.detailLabel,
                  { color: currentColors.textSecondary },
                ]}
              >
                Location
              </TextDefault>
              <TextDefault
                style={[styles.detailValue, { color: currentColors.text }]}
              >
                {appointment.location?.name}
              </TextDefault>
              <TextDefault
                style={[
                  styles.detailSubValue,
                  { color: currentColors.textLight },
                ]}
              >
                {appointment.location?.address}
              </TextDefault>
            </View>
          </View>
        </View>
      </View>

      {/* Notes */}
      <View
        style={[
          styles.notesCard,
          {
            backgroundColor: currentColors.backgroundCard,
            borderColor: currentColors.border,
          },
        ]}
      >
        <View style={styles.notesHeader}>
          <MessageSquare size={18} color={currentColors.textSecondary} />
          <TextDefault
            style={[styles.cardTitle, { color: currentColors.text }]}
          >
            Notes (optional)
          </TextDefault>
        </View>

        <TextInput
          style={[
            styles.notesInput,
            {
              backgroundColor: currentColors.backgroundLightGray,
              color: currentColors.text,
              borderColor: currentColors.border,
            },
          ]}
          placeholder="Add notes for the appointment..."
          placeholderTextColor={currentColors.textSecondary}
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={handleNotesChange}
          textAlignVertical="top"
        />
      </View>

      {/* Confirmation Message */}
      <View
        style={[
          styles.confirmationCard,
          { backgroundColor: `${currentColors.success}15` },
        ]}
      >
        <TextDefault
          style={[styles.confirmationText, { color: currentColors.success }]}
        >
          🎉 The appointment will be sent to {friend.firstName} for confirmation
        </TextDefault>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  friendUsername: {
    fontSize: 14,
  },
  detailsCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  detailsList: {
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  detailSubValue: {
    fontSize: 13,
    marginTop: 2,
  },
  notesCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  notesInput: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
  },
  confirmationCard: {
    padding: 16,
    borderRadius: 12,
  },
  confirmationText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
});
