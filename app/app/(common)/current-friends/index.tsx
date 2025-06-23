"use client";

import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Icons
import {
  Activity,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Search,
  Users,
} from "lucide-react-native";

// Core components
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default";
import { scale } from "@/helper/helpers";

// Theme Context
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";

const { width } = Dimensions.get("window");

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  android: {
    elevation: 6,
  },
});

// Mock friends data
const friendsData = [
  {
    activities: ["CF", "Shopping"],
    avatarUrl:
      "https://hoseiki.vn/wp-content/uploads/2025/03/gai-xinh-tu-suong-28.jpg",
    bio: "I love traveling and exploring new cultures.",
    createdAt: {},
    dateOfBirth: {},
    email: "user123@example.com",
    firstName: "John",
    gender: "male",
    id: "4813c767-0af0-4a39-8845-db1181e1fcf6",
    interests: ["Hiking", "Photography", "Cooking"],
    isEmailVerified: true,
    lastName: "Doe",
    location: "Hanoi, Vietnam",
    maxAgePreference: 35,
    minAgePreference: 25,
    preferredGender: "female",
    updatedAt: {},
    username: "user123",
  },
  {
    avatarUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfc3BOBQ_ip3jGGzbVU8Yj_p-KymP7DO86r-ZlTcc9kxGjw4aXWBZP_NNnxPOC5q_Zn1w&usqp=CAU",
    createdAt: {},
    email: "user1232@example.com",
    id: "9a02dc2b-413a-462a-9908-1bc0a27cfa2a",
    interests: ["Hiking", "Photography", "Cooking"],
    isEmailVerified: true,
    maxAgePreference: 100,
    minAgePreference: 0,
    resetPasswordCode: "s",
    updatedAt: {},
    username: "user1232",
    firstName: "Sarah",
    lastName: "Wilson",
    bio: "Adventure seeker and coffee enthusiast ☕",
    location: "Ho Chi Minh City, Vietnam",
    activities: ["Yoga", "Reading"],
  },
  {
    activities: ["sports"],
    createdAt: {},
    dateOfBirth: {},
    email: "khoa123@gmail.com",
    id: "f939a573-d463-4606-9ccf-84b1eb21511a",
    interests: ["Football"],
    isEmailVerified: false,
    maxAgePreference: 100,
    minAgePreference: 0,
    updatedAt: {},
    username: "khoadt",
    firstName: "Khoa",
    lastName: "Dang",
    bio: "Football lover and fitness enthusiast ⚽",
    location: "Da Nang, Vietnam",
    avatarUrl: "/placeholder.svg?height=120&width=120",
  },
];

export default function FriendsListScreen() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const [refreshing, setRefreshing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleFriendPress = (friendId: string) => {
    router.push({
      pathname: "/(common)/user-profile",
      params: { id: friendId },
    });
  };

  const handleMessagePress = (friendId: string) => {
    // router.push({
    //   pathname: "/(common)/chat/conversation",
    //   params: { friendId },
    // });
  };

  const renderInterestTag = (interest: string, index: number) => (
    <View
      key={index}
      style={[
        styles.interestTag,
        {
          backgroundColor: `${currentColors.primary}15`,
          borderColor: `${currentColors.primary}30`,
        },
      ]}
    >
      <TextDefault
        style={[styles.interestText, { color: currentColors.primary }]}
      >
        {interest}
      </TextDefault>
    </View>
  );

  const renderActivityIcon = (activity: string) => {
    const iconProps = { size: 16, color: currentColors.textSecondary };
    switch (activity.toLowerCase()) {
      case "cf":
      case "coffee":
        return "☕";
      case "shopping":
        return "🛍️";
      case "sports":
        return "⚽";
      case "yoga":
        return "🧘";
      case "reading":
        return "📚";
      default:
        return "🎯";
    }
  };

  return (
    <View
      style={[styles.safeArea, { backgroundColor: currentColors.background }]}
    >
      <Separator height={Platform.OS === "ios" ? scale(55) : scale(10)} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <TextDefault
            style={[styles.headerTitle, { color: currentColors.text }]}
          >
            Bạn bè
          </TextDefault>
          <TextDefault
            style={[
              styles.headerSubtitle,
              { color: currentColors.textSecondary },
            ]}
          >
            {friendsData.length} người bạn
          </TextDefault>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.headerAction,
              { backgroundColor: currentColors.backgroundCard },
            ]}
            onPress={() => setSearchVisible(!searchVisible)}
          >
            <Search size={20} color={currentColors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.headerAction,
              { backgroundColor: currentColors.backgroundCard },
            ]}
          >
            <MoreHorizontal size={20} color={currentColors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Bar */}
      <View
        style={[
          styles.statsBar,
          { backgroundColor: currentColors.backgroundCard },
        ]}
      >
        <View style={styles.statItem}>
          <Users size={18} color={currentColors.primary} />
          <TextDefault style={[styles.statText, { color: currentColors.text }]}>
            {friendsData.length} Bạn bè
          </TextDefault>
        </View>
        <View style={styles.statItem}>
          <Activity size={18} color={currentColors.success} />
          <TextDefault style={[styles.statText, { color: currentColors.text }]}>
            {friendsData.filter((f) => f.isEmailVerified).length} Hoạt động
          </TextDefault>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {friendsData.map((friend, index) => (
            <TouchableOpacity
              key={friend.id}
              style={[
                styles.friendCard,
                shadowStyle,
                {
                  backgroundColor: currentColors.backgroundCard,
                  borderColor: currentColors.border,
                  marginBottom: index === friendsData.length - 1 ? 20 : 16,
                },
              ]}
              onPress={() => handleFriendPress(friend.id)}
              activeOpacity={0.8}
            >
              {/* Profile Section */}
              <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: friend.avatarUrl }}
                    style={styles.avatar}
                  />
                  {friend.isEmailVerified && (
                    <View
                      style={[
                        styles.verifiedBadge,
                        { backgroundColor: currentColors.success },
                      ]}
                    >
                      <TextDefault style={styles.verifiedText}>✓</TextDefault>
                    </View>
                  )}
                </View>

                <View style={styles.profileInfo}>
                  <View style={styles.nameRow}>
                    <TextDefault
                      style={[styles.friendName, { color: currentColors.text }]}
                    >
                      {friend.firstName} {friend.lastName}
                    </TextDefault>
                    <TextDefault
                      style={[
                        styles.username,
                        { color: currentColors.textSecondary },
                      ]}
                    >
                      @{friend.username}
                    </TextDefault>
                  </View>

                  {friend.location && (
                    <View style={styles.locationRow}>
                      <MapPin size={14} color={currentColors.textSecondary} />
                      <TextDefault
                        style={[
                          styles.locationText,
                          { color: currentColors.textSecondary },
                        ]}
                      >
                        {friend.location}
                      </TextDefault>
                    </View>
                  )}

                  {friend.bio && (
                    <TextDefault
                      style={[
                        styles.bioText,
                        { color: currentColors.textSecondary },
                      ]}
                      numberOfLines={2}
                    >
                      {friend.bio}
                    </TextDefault>
                  )}
                </View>
              </View>

              {/* Activities Section */}
              {friend.activities && friend.activities.length > 0 && (
                <View style={styles.activitiesSection}>
                  <TextDefault
                    style={[styles.sectionTitle, { color: currentColors.text }]}
                  >
                    Hoạt động
                  </TextDefault>
                  <View style={styles.activitiesContainer}>
                    {friend.activities.map((activity, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.activityTag,
                          {
                            backgroundColor: currentColors.backgroundLightGray,
                          },
                        ]}
                      >
                        <TextDefault style={styles.activityEmoji}>
                          {renderActivityIcon(activity)}
                        </TextDefault>
                        <TextDefault
                          style={[
                            styles.activityText,
                            { color: currentColors.textSecondary },
                          ]}
                        >
                          {activity}
                        </TextDefault>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Interests Section */}
              {friend.interests && friend.interests.length > 0 && (
                <View style={styles.interestsSection}>
                  <TextDefault
                    style={[styles.sectionTitle, { color: currentColors.text }]}
                  >
                    Sở thích
                  </TextDefault>
                  <View style={styles.interestsContainer}>
                    {friend.interests
                      .slice(0, 3)
                      .map((interest, idx) => renderInterestTag(interest, idx))}
                    {friend.interests.length > 3 && (
                      <View
                        style={[
                          styles.moreTag,
                          {
                            backgroundColor: currentColors.backgroundLightGray,
                          },
                        ]}
                      >
                        <TextDefault
                          style={[
                            styles.moreText,
                            { color: currentColors.textSecondary },
                          ]}
                        >
                          +{friend.interests.length - 3}
                        </TextDefault>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.messageButton,
                    { backgroundColor: currentColors.primary },
                  ]}
                  onPress={() => handleMessagePress(friend.id)}
                >
                  <MessageCircle size={18} color="white" />
                  <TextDefault style={styles.messageButtonText}>
                    Nhắn tin
                  </TextDefault>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.likeButton,
                    {
                      backgroundColor: currentColors.backgroundLightGray,
                      borderColor: currentColors.border,
                    },
                  ]}
                >
                  <Heart size={18} color={currentColors.textSecondary} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

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
  friendCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    overflow: "hidden",
  },
  profileSection: {
    flexDirection: "row",
    marginBottom: 16,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  friendName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    opacity: 0.7,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
  },
  activitiesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  activitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  activityTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  activityEmoji: {
    fontSize: 14,
  },
  activityText: {
    fontSize: 13,
    fontWeight: "500",
  },
  interestsSection: {
    marginBottom: 20,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  interestText: {
    fontSize: 13,
    fontWeight: "500",
  },
  moreTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  moreText: {
    fontSize: 13,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  messageButton: {
    flex: 1,
  },
  messageButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  likeButton: {
    width: 48,
    borderWidth: 1,
  },
});
