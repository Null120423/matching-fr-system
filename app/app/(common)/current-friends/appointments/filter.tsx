"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  List,
} from "lucide-react-native";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";

interface AppointmentFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  appointmentsCount: {
    all: number;
    upcoming: number;
    past: number;
    pending: number;
    confirmed: number;
  };
}

const filters = [
  {
    key: "all",
    label: "Tất cả",
    icon: List,
    color: "#6B7280",
  },
  {
    key: "upcoming",
    label: "Sắp tới",
    icon: Calendar,
    color: "#3B82F6",
  },
  {
    key: "past",
    label: "Đã qua",
    icon: Clock,
    color: "#6B7280",
  },
  {
    key: "pending",
    label: "Chờ xác nhận",
    icon: AlertCircle,
    color: "#F59E0B",
  },
  {
    key: "confirmed",
    label: "Đã xác nhận",
    icon: CheckCircle,
    color: "#10B981",
  },
];

export default function AppointmentFilters({
  selectedFilter,
  onFilterChange,
  appointmentsCount,
}: AppointmentFiltersProps) {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isSelected = selectedFilter === filter.key;
          const count =
            appointmentsCount[filter.key as keyof typeof appointmentsCount] ||
            0;

          return (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                {
                  backgroundColor: isSelected
                    ? `${filter.color}15`
                    : "transparent",
                  borderColor: isSelected ? filter.color : currentColors.border,
                },
              ]}
              onPress={() => onFilterChange(filter.key)}
            >
              <Icon
                size={18}
                color={isSelected ? filter.color : currentColors.textSecondary}
              />
              <TextDefault
                style={[
                  styles.filterLabel,
                  {
                    color: isSelected ? filter.color : currentColors.text,
                  },
                ]}
              >
                {filter.label}
              </TextDefault>
              {count > 0 && (
                <View
                  style={[styles.countBadge, { backgroundColor: filter.color }]}
                >
                  <TextDefault style={styles.countText}>{count}</TextDefault>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
    minWidth: 100,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  countText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
