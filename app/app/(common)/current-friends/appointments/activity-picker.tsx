import {
  Camera,
  Heart,
  MapPin,
  Music,
  ShoppingBag,
  Utensils,
} from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";

interface ActivityPickerProps {
  selectedActivity?: string;
  selectedType?: string;
  onSelect: (activity: string, type: string) => void;
}

const activities = [
  {
    type: "food",
    title: "Food & Drink",
    icon: Utensils,
    color: "#FF6B6B",
    activities: ["Coffee", "Dinner", "Lunch", "Drinks", "Breakfast"],
  },
  {
    type: "entertainment",
    title: "Entertainment",
    icon: Music,
    color: "#4ECDC4",
    activities: ["Movie", "Karaoke", "Bowling", "Game", "Live music"],
  },
  {
    type: "outdoor",
    title: "Outdoor",
    icon: Camera,
    color: "#45B7D1",
    activities: ["Stroll", "Photography", "Park", "Beach", "Hiking"],
  },
  {
    type: "shopping",
    title: "Shopping",
    icon: ShoppingBag,
    color: "#96CEB4",
    activities: ["Mall", "Market", "Outlet", "Fashion", "Electronics"],
  },
  {
    type: "sports",
    title: "Sports",
    icon: Heart,
    color: "#FFEAA7",
    activities: ["Gym", "Swimming", "Tennis", "Badminton", "Jogging"],
  },
  {
    type: "culture",
    title: "Culture",
    icon: MapPin,
    color: "#DDA0DD",
    activities: ["Museum", "Exhibition", "Books", "Art", "History"],
  },
];

export default function ActivityPicker({
  selectedActivity,
  selectedType,
  onSelect,
}: ActivityPickerProps) {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  return (
    <View style={styles.container}>
      {activities.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedType === category.type;

        return (
          <View key={category.type} style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: `${category.color}20` },
                ]}
              >
                <Icon size={20} color={category.color} />
              </View>
              <TextDefault
                style={[styles.categoryTitle, { color: currentColors.text }]}
              >
                {category.title}
              </TextDefault>
            </View>

            <View style={styles.activitiesGrid}>
              {category.activities.map((activity) => (
                <TouchableOpacity
                  key={activity}
                  style={[
                    styles.activityButton,
                    {
                      backgroundColor:
                        selectedActivity === activity
                          ? category.color
                          : currentColors.backgroundCard,
                      borderColor:
                        selectedActivity === activity
                          ? category.color
                          : currentColors.border,
                    },
                  ]}
                  onPress={() => onSelect(activity, category.type)}
                >
                  <TextDefault
                    style={[
                      styles.activityText,
                      {
                        color:
                          selectedActivity === activity
                            ? "white"
                            : currentColors.text,
                      },
                    ]}
                  >
                    {activity}
                  </TextDefault>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  activitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  activityButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  activityText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
