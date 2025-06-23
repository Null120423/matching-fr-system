"use client";

import { Clock, MapPin, Search, Star } from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";

interface LocationPickerProps {
  selectedLocation?: {
    name: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  onSelect: (location: {
    name: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  }) => void;
}

const popularLocations = [
  {
    name: "Highlands Coffee",
    address: "Tầng 1, Vincom Center, Bà Triệu, Hà Nội",
    type: "Cà phê",
    rating: 4.5,
    coordinates: { lat: 21.0285, lng: 105.8542 },
  },
  {
    name: "Lotte Center Hanoi",
    address: "54 Liễu Giai, Ba Đình, Hà Nội",
    type: "Trung tâm thương mại",
    rating: 4.3,
    coordinates: { lat: 21.0245, lng: 105.8412 },
  },
  {
    name: "Hồ Gươm",
    address: "Hoàn Kiếm, Hà Nội",
    type: "Địa điểm du lịch",
    rating: 4.7,
    coordinates: { lat: 21.0285, lng: 105.8542 },
  },
  {
    name: "CGV Vincom Bà Triệu",
    address: "Tầng 5, Vincom Center, Bà Triệu, Hà Nội",
    type: "Rạp chiếu phim",
    rating: 4.2,
    coordinates: { lat: 21.0285, lng: 105.8542 },
  },
];

const recentLocations = [
  {
    name: "The Coffee House",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    type: "Cà phê",
    coordinates: { lat: 10.7769, lng: 106.7009 },
  },
  {
    name: "Saigon Centre",
    address: "65 Lê Lợi, Quận 1, TP.HCM",
    type: "Trung tâm thương mại",
    coordinates: { lat: 10.7769, lng: 106.7009 },
  },
];

export default function LocationPicker({
  selectedLocation,
  onSelect,
}: LocationPickerProps) {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const [searchText, setSearchText] = useState("");

  const handleLocationSelect = (location: any) => {
    onSelect({
      name: location.name,
      address: location.address,
      coordinates: location.coordinates,
    });
  };

  const renderLocationItem = (location: any, isRecent = false) => {
    const isSelected = selectedLocation?.name === location.name;

    return (
      <TouchableOpacity
        key={location.name}
        style={[
          styles.locationItem,
          {
            backgroundColor: isSelected
              ? `${currentColors.primary}15`
              : currentColors.backgroundCard,
            borderColor: isSelected
              ? currentColors.primary
              : currentColors.border,
          },
        ]}
        onPress={() => handleLocationSelect(location)}
      >
        <View style={styles.locationContent}>
          <View
            style={[
              styles.locationIcon,
              { backgroundColor: `${currentColors.primary}20` },
            ]}
          >
            <MapPin size={20} color={currentColors.primary} />
          </View>

          <View style={styles.locationInfo}>
            <TextDefault
              style={[styles.locationName, { color: currentColors.text }]}
            >
              {location.name}
            </TextDefault>
            <TextDefault
              style={[
                styles.locationAddress,
                { color: currentColors.textSecondary },
              ]}
            >
              {location.address}
            </TextDefault>
            <View style={styles.locationMeta}>
              <TextDefault
                style={[
                  styles.locationType,
                  { color: currentColors.textLight },
                ]}
              >
                {location.type}
              </TextDefault>
              {location.rating && (
                <>
                  <TextDefault
                    style={[
                      styles.separator,
                      { color: currentColors.textLight },
                    ]}
                  >
                    •
                  </TextDefault>
                  <View style={styles.rating}>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                    <TextDefault
                      style={[
                        styles.ratingText,
                        { color: currentColors.textLight },
                      ]}
                    >
                      {location.rating}
                    </TextDefault>
                  </View>
                </>
              )}
            </View>
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
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: currentColors.backgroundCard,
            borderColor: currentColors.border,
          },
        ]}
      >
        <Search size={20} color={currentColors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: currentColors.text }]}
          placeholder="Tìm kiếm địa điểm..."
          placeholderTextColor={currentColors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Recent Locations */}
      {recentLocations.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={18} color={currentColors.textSecondary} />
            <TextDefault
              style={[styles.sectionTitle, { color: currentColors.text }]}
            >
              Gần đây
            </TextDefault>
          </View>
          {recentLocations.map((location) =>
            renderLocationItem(location, true)
          )}
        </View>
      )}

      {/* Popular Locations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Star size={18} color={currentColors.textSecondary} />
          <TextDefault
            style={[styles.sectionTitle, { color: currentColors.text }]}
          >
            Địa điểm phổ biến
          </TextDefault>
        </View>
        {popularLocations.map((location) => renderLocationItem(location))}
      </View>

      {/* Custom Location */}
      <TouchableOpacity
        style={[
          styles.customLocationButton,
          {
            backgroundColor: currentColors.backgroundCard,
            borderColor: currentColors.border,
          },
        ]}
        onPress={() => {
          // Handle custom location input
          onSelect({
            name: "Địa điểm tùy chỉnh",
            address: "Nhập địa chỉ cụ thể...",
          });
        }}
      >
        <MapPin size={20} color={currentColors.primary} />
        <TextDefault
          style={[styles.customLocationText, { color: currentColors.primary }]}
        >
          Thêm địa điểm khác
        </TextDefault>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  locationItem: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  locationContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    marginBottom: 4,
  },
  locationMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationType: {
    fontSize: 12,
  },
  separator: {
    marginHorizontal: 6,
    fontSize: 12,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
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
  customLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    gap: 8,
  },
  customLocationText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
