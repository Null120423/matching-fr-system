import { Calendar, Clock, Filter, Plus } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { showToastInfo } from "@/contexts/ToastEventEmitter";
import { AppointmentDTO } from "@/dto";
import DefaultLayout from "@/layouts/default-layout";
import useGetAppointments from "@/services/hooks/appointments/useGetAppointments";
import React from "react";
import AppointmentCard from "./appointment-card";
import AppointmentFilters from "./filter";

export default function AppointmentsScreen() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const { currentUser } = useAuth();
  const currentUserId = currentUser?.id || "";
  const {
    data: appointmentsData = [],
    isLoading,
    refetch,
    isRefetching,
  } = useGetAppointments({
    type: "all",
  });

  // Transform appointments data to include friend information
  const transformedAppointments = useMemo(() => {
    return appointmentsData.map((appointment) => {
      const friendId =
        appointment.fromUserId === currentUserId
          ? appointment.toUserId
          : appointment.fromUserId;

      return {
        ...appointment,
        friendId,
        isCreatedByMe: appointment.fromUserId === currentUserId,
      };
    });
  }, [currentUserId]);

  // Filter appointments based on selected filter
  const filteredAppointments = useMemo(() => {
    const now = new Date();

    switch (selectedFilter) {
      case "upcoming":
        return transformedAppointments.filter(
          (apt) => new Date(apt.date) >= now
        );
      case "past":
        return transformedAppointments.filter(
          (apt) => new Date(apt.date) < now
        );
      case "pending":
        return transformedAppointments.filter(
          (apt) => apt.status === "pending"
        );
      case "confirmed":
        return transformedAppointments.filter(
          (apt) => apt.status === "confirmed"
        );
      default:
        return transformedAppointments;
    }
  }, [transformedAppointments, selectedFilter]);

  // Group appointments by date
  const groupedAppointments = useMemo(() => {
    const groups: {
      [key: string]: {
        date: Date;
        appointments: AppointmentDTO[];
      };
    } = {};

    filteredAppointments.forEach((appointment) => {
      const date = new Date(appointment.date);
      const dateKey = date.toDateString();

      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: date,
          appointments: [],
        };
      }

      groups[dateKey].appointments.push(appointment);
    });

    // Sort groups by date
    return Object.values(groups).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }, [filteredAppointments]);

  const getDateLabel = (date: {
    toDateString: () => string;
    toLocaleDateString: (
      arg0: string,
      arg1: { weekday: string; day: string; month: string }
    ) => any;
  }) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Ngày mai";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    } else {
      return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    }
  };

  const handleAppointmentPress = (appointment: AppointmentDTO) => {
    // Navigate to appointment details
    console.log("View appointment details:", appointment.id);
  };

  const handleMessagePress = (appointment: AppointmentDTO) => {
    // Navigate to chat with friend
    showToastInfo("Feature coming soon!");
    console.log("Message friend:", appointment.fromUserId);
  };

  const handleMorePress = (appointment: AppointmentDTO) => {
    // Show appointment options (edit, cancel, etc.)
    console.log("Show appointment options:", appointment.id);
  };

  return (
    <DefaultLayout isLoading={isLoading}>
      <View
        style={[styles.safeArea, { backgroundColor: currentColors.background }]}
      >
        <View style={styles.header}>
          <View>
            <TextDefault
              style={[styles.headerTitle, { color: currentColors.text }]}
            >
              Cuộc hẹn
            </TextDefault>
            <TextDefault
              style={[
                styles.headerSubtitle,
                { color: currentColors.textSecondary },
              ]}
            >
              {filteredAppointments.length} cuộc hẹn
            </TextDefault>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.headerAction,
                { backgroundColor: currentColors.backgroundCard },
              ]}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} color={currentColors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.headerAction,
                { backgroundColor: currentColors.primary },
              ]}
            >
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        {showFilters && (
          <AppointmentFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            appointmentsCount={{
              all: transformedAppointments.length,
              upcoming: transformedAppointments.filter(
                (apt) => new Date(apt.date) >= new Date()
              ).length,
              past: transformedAppointments.filter(
                (apt) => new Date(apt.date) < new Date()
              ).length,
              pending: transformedAppointments.filter(
                (apt) => apt.status === "pending"
              ).length,
              confirmed: transformedAppointments.filter(
                (apt) => apt.status === "confirmed"
              ).length,
            }}
          />
        )}

        {/* Stats Bar */}
        <View
          style={[
            styles.statsBar,
            { backgroundColor: currentColors.backgroundCard },
          ]}
        >
          <View style={styles.statItem}>
            <Calendar size={18} color={currentColors.primary} />
            <TextDefault
              style={[styles.statText, { color: currentColors.text }]}
            >
              {
                transformedAppointments.filter(
                  (apt) => new Date(apt.date) >= new Date()
                ).length
              }{" "}
              Sắp tới
            </TextDefault>
          </View>
          <View style={styles.statItem}>
            <Clock size={18} color={currentColors.warning} />
            <TextDefault
              style={[styles.statText, { color: currentColors.text }]}
            >
              {
                transformedAppointments.filter(
                  (apt) => apt.status === "pending"
                ).length
              }{" "}
              Chờ xác nhận
            </TextDefault>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {groupedAppointments.length > 0 ? (
              groupedAppointments.map((group, groupIndex) => (
                <View key={group.date.toDateString()} style={styles.dateGroup}>
                  {/* Date Header */}
                  <View style={styles.dateHeader}>
                    <TextDefault
                      style={[styles.dateLabel, { color: currentColors.text }]}
                    >
                      {getDateLabel(group.date)}
                    </TextDefault>
                    <TextDefault
                      style={[
                        styles.dateSubLabel,
                        { color: currentColors.textSecondary },
                      ]}
                    >
                      {group.appointments.length} cuộc hẹn
                    </TextDefault>
                  </View>

                  {/* Appointments for this date */}
                  {group.appointments.map((appointment, idx) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onPress={() => handleAppointmentPress(appointment)}
                      onMessage={() => handleMessagePress(appointment)}
                      onMore={() => handleMorePress(appointment)}
                    />
                  ))}
                </View>
              ))
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
                  <Calendar size={48} color={currentColors.textLight} />
                </View>
                <TextDefault
                  style={[styles.emptyTitle, { color: currentColors.text }]}
                >
                  {selectedFilter === "all"
                    ? "Chưa có cuộc hẹn nào"
                    : `Không có cuộc hẹn ${getFilterLabel(selectedFilter)}`}
                </TextDefault>
                <TextDefault
                  style={[
                    styles.emptySubtitle,
                    { color: currentColors.textSecondary },
                  ]}
                >
                  Tạo cuộc hẹn mới với bạn bè để bắt đầu
                </TextDefault>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </DefaultLayout>
  );
}

const getFilterLabel = (filter: string) => {
  switch (filter) {
    case "upcoming":
      return "sắp tới";
    case "past":
      return "đã qua";
    case "pending":
      return "chờ xác nhận";
    case "confirmed":
      return "đã xác nhận";
    default:
      return "";
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  headerAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  statsBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    justifyContent: "space-around",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  dateLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  dateSubLabel: {
    fontSize: 14,
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
});
