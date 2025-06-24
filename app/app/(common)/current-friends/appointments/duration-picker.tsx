import { Clock } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";

interface DurationPickerProps {
  selectedDuration?: number;
  onSelect: (duration: number) => void;
}

const durations = [
  { value: 30, label: "30 min", description: "Quick" },
  { value: 60, label: "1 hour", description: "Moderate" },
  { value: 90, label: "1.5 hours", description: "Comfortable" },
  { value: 120, label: "2 hours", description: "Long" },
  { value: 180, label: "3 hours", description: "Half day" },
  { value: 240, label: "4 hours", description: "Half a day" },
];

export default function DurationPicker({
  selectedDuration,
  onSelect,
}: DurationPickerProps) {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Clock size={20} color={currentColors.primary} />
        <TextDefault style={[styles.title, { color: currentColors.text }]}>
          Appointment Duration
        </TextDefault>
      </View>

      <TextDefault
        style={[styles.subtitle, { color: currentColors.textSecondary }]}
      >
        Choose how much time you want to spend for this appointment
      </TextDefault>

      <View style={styles.durationList}>
        {durations.map((duration) => {
          const isSelected = selectedDuration === duration.value;
          return (
            <TouchableOpacity
              key={duration.value}
              style={[
                styles.durationButton,
                {
                  backgroundColor: isSelected
                    ? `${currentColors.primary}15`
                    : currentColors.backgroundCard,
                  borderColor: isSelected
                    ? currentColors.primary
                    : currentColors.border,
                },
              ]}
              onPress={() => onSelect(duration.value)}
            >
              <View style={styles.durationContent}>
                <View style={styles.durationMain}>
                  <TextDefault
                    style={[
                      styles.durationLabel,
                      {
                        color: isSelected
                          ? currentColors.primary
                          : currentColors.text,
                      },
                    ]}
                  >
                    {duration.label}
                  </TextDefault>
                  <TextDefault
                    style={[
                      styles.durationDescription,
                      { color: currentColors.textSecondary },
                    ]}
                  >
                    {duration.description}
                  </TextDefault>
                </View>
                {isSelected && (
                  <View
                    style={[
                      styles.selectedIndicator,
                      { backgroundColor: currentColors.primary },
                    ]}
                  >
                    <TextDefault style={styles.checkmark}>✓</TextDefault>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View
        style={[styles.tip, { backgroundColor: `${currentColors.info}15` }]}
      >
        <TextDefault style={[styles.tipText, { color: currentColors.info }]}>
          💡 You can change the duration after creating the appointment
        </TextDefault>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  durationList: {
    gap: 12,
    marginBottom: 24,
  },
  durationButton: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  durationContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  durationMain: {
    flex: 1,
  },
  durationLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  durationDescription: {
    fontSize: 14,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  tip: {
    padding: 16,
    borderRadius: 12,
  },
  tipText: {
    fontSize: 14,
    textAlign: "center",
  },
});
