"use client";
import { Calendar, Clock } from "lucide-react-native";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";

interface TimePickerProps {
  selectedDate?: Date;
  selectedTime?: string;
  onSelect: (date: Date, time: string) => void;
}

export default function TimePicker({
  selectedDate,
  selectedTime,
  onSelect,
}: TimePickerProps) {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  // Generate next 7 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const dates = generateDates();
  const timeSlots = generateTimeSlots();

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
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    }
  };

  const handleDateSelect = (date: Date) => {
    onSelect(date, selectedTime || "");
  };

  const handleTimeSelect = (time: string) => {
    onSelect(selectedDate || new Date(), time);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Date Selection */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Calendar size={20} color={currentColors.primary} />
          <TextDefault
            style={[styles.sectionTitle, { color: currentColors.text }]}
          >
            Chọn ngày
          </TextDefault>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateScroll}
        >
          <View style={styles.dateContainer}>
            {dates &&
              dates.map((date, index) => {
                const isSelected =
                  selectedDate?.toDateString() === date.toDateString();
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateButton,
                      {
                        backgroundColor: isSelected
                          ? currentColors.primary
                          : currentColors.backgroundCard,
                        borderColor: isSelected
                          ? currentColors.primary
                          : currentColors.border,
                      },
                    ]}
                    onPress={() => handleDateSelect(date)}
                  >
                    <TextDefault
                      style={[
                        styles.dateText,
                        { color: isSelected ? "white" : currentColors.text },
                      ]}
                    >
                      {formatDate(date)}
                    </TextDefault>
                    <TextDefault
                      style={[
                        styles.dayText,
                        {
                          color: isSelected
                            ? "white"
                            : currentColors.textSecondary,
                        },
                      ]}
                    >
                      {date.getDate()}
                    </TextDefault>
                  </TouchableOpacity>
                );
              })}
          </View>
        </ScrollView>
      </View>

      {/* Time Selection */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Clock size={20} color={currentColors.primary} />
          <TextDefault
            style={[styles.sectionTitle, { color: currentColors.text }]}
          >
            Chọn giờ
          </TextDefault>
        </View>

        <View style={styles.timeGrid}>
          {timeSlots &&
            timeSlots.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    {
                      backgroundColor: isSelected
                        ? currentColors.primary
                        : currentColors.backgroundCard,
                      borderColor: isSelected
                        ? currentColors.primary
                        : currentColors.border,
                    },
                  ]}
                  onPress={() => handleTimeSelect(time)}
                >
                  <TextDefault
                    style={[
                      styles.timeText,
                      { color: isSelected ? "white" : currentColors.text },
                    ]}
                  >
                    {time}
                  </TextDefault>
                </TouchableOpacity>
              );
            })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  dateScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  dateContainer: {
    flexDirection: "row",
    gap: 12,
    paddingRight: 20,
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    minWidth: 80,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 70,
    alignItems: "center",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
