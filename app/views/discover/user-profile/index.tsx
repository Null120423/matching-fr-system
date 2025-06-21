import { ButtonPrimary } from "@/components/@core/button";
import Loading from "@/components/@core/loading";
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors"; // Import Colors
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme
import { UserDTO } from "@/dto";
import { scale } from "@/helper/helpers";
import useSendFriendRequest from "@/services/hooks/matching/useSendFriendRequest";
import useProfile from "@/services/hooks/user/useProfile";
import { Ionicons } from "@expo/vector-icons"; // Dùng Ionicons thay cho HomeIcon trong nhiều trường hợp
import { router, useLocalSearchParams } from "expo-router"; // Import useLocalSearchParams
import React, { useEffect } from "react"; // Import useEffect, useState
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// -----------------------------------------------------
// Component con: ProfileHeader
// -----------------------------------------------------
interface ProfileHeaderProps {
  userName: string;
  onBackPress: () => void;
  currentColors: any;
}

function ProfileHeader({
  userName,
  onBackPress,
  currentColors,
}: ProfileHeaderProps) {
  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: currentColors.background },
      ]}
    >
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons
          name="arrow-back"
          size={scale(24)}
          color={currentColors.text}
        />
      </TouchableOpacity>
      <View style={styles.headerTextContainer}>
        <TextDefault
          style={[styles.headerTitle, { color: currentColors.text }]}
        >
          Chi tiết hồ sơ
        </TextDefault>
      </View>
    </View>
  );
}

function ProfileImageCard({ avatar, compatibility, currentColors }: any) {
  return (
    <View
      style={[
        styles.profileCard,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: avatar }} style={styles.profileImage} />
        <View
          style={[
            styles.compatibilityBadge,
            { backgroundColor: currentColors.success },
          ]}
        >
          <TextDefault
            style={[
              styles.compatibilityBadgeText,
              { color: currentColors.backgroundCard },
            ]}
          >
            {compatibility}% phù hợp
          </TextDefault>
        </View>
      </View>
    </View>
  );
}
interface ProfileInfoSectionProps {
  user: UserDTO;
  currentColors: any;
}

function ProfileInfoSection({ user, currentColors }: ProfileInfoSectionProps) {
  const { onSend, isLoading } = useSendFriendRequest();

  return (
    <View style={[styles.cardContent]}>
      <TextDefault style={[styles.profileName, { color: currentColors.text }]}>
        {user.username}, {user.gender}
      </TextDefault>
      <TextDefault
        style={[styles.profileLocation, { color: currentColors.textSecondary }]}
      >
        {user.location}
      </TextDefault>
      <TextDefault
        style={[styles.profileBio, { color: currentColors.textSecondary }]}
      >
        {user.bio}
      </TextDefault>
      <View style={styles.section}>
        <TextDefault
          style={[styles.sectionTitle, { color: currentColors.text }]}
        >
          <Ionicons
            name="sparkles"
            size={scale(16)}
            color={currentColors.primary}
          />
          Sở thích
        </TextDefault>
        <View style={styles.interestsContainer}>
          {user?.interests?.map((interest: string, index: number) => (
            <View
              key={index}
              style={[
                styles.interestBadge,
                { backgroundColor: currentColors.backgroundLightGray },
              ]}
            >
              <TextDefault
                style={[
                  styles.interestBadgeText,
                  { color: currentColors.textSecondary },
                ]}
              >
                {interest}
              </TextDefault>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TextDefault
          style={[styles.sectionTitle, { color: currentColors.text }]}
        >
          <Ionicons
            name="walk"
            size={scale(16)}
            color={currentColors.primary}
          />
          Hoạt động thường xuyên
        </TextDefault>
        <View style={styles.activitiesList}>
          {user.activities &&
            user.activities?.map((activity: string, index: number) => (
              <View key={index} style={styles.activityItem}>
                <View
                  style={[
                    styles.bulletPoint,
                    { backgroundColor: currentColors.primary },
                  ]}
                />
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

      <View style={styles.section}>
        <TextDefault
          style={[styles.sectionTitle, { color: currentColors.text }]}
        >
          <Ionicons
            name="time"
            size={scale(16)}
            color={currentColors.primary}
          />
          Thời gian rảnh
        </TextDefault>
        <TextDefault
          style={[styles.freeTimeText, { color: currentColors.textSecondary }]}
        >
          {user.availableTimeSlots
            ? user.availableTimeSlots.join(", ")
            : "Chưa cập nhật"}
        </TextDefault>
      </View>

      <View style={styles.actionButtonsContainer}>
        <ButtonPrimary
          minWidth={"90%"}
          onPress={() => onSend(user.id)}
          title="Send Request Friend"
          styleTitle={{
            fontSize: scale(12),
          }}
          isLoading={isLoading}
          iconLeft={
            <Ionicons name="person-add" size={scale(24)} color={"white"} />
          }
        />
      </View>
    </View>
  );
}
// -----------------------------------------------------
// Main Component: UserProfileView
// -----------------------------------------------------
export default function UserProfileView() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const { data: user, isLoading, isRefetching } = useProfile(userId);
  const [currentUser, setCurrentUser] = React.useState<UserDTO | null>(null);

  useEffect(() => {
    if (!isLoading && !isRefetching && user) {
      setCurrentUser(user);
    }
  }, [isRefetching, isLoading, user]);

  if (isLoading || !currentUser || !user || isRefetching) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: currentColors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Loading />
        <TextDefault
          style={{ color: currentColors.text, marginTop: scale(10) }}
        >
          Đang tải hồ sơ...
        </TextDefault>
      </View>
    );
  }

  if (!currentUser || !user) {
    return (
      <View
        style={[
          styles.emptyProfileContainer,
          { backgroundColor: currentColors.backgroundCard },
        ]}
      >
        <Ionicons
          name="person-circle-outline"
          size={scale(64)}
          color={currentColors.textSecondary}
          style={styles.emptyProfileIcon}
        />
        <TextDefault
          style={[styles.emptyProfileTitle, { color: currentColors.text }]}
        >
          Chưa chọn hồ sơ
        </TextDefault>
        <TextDefault
          style={[
            styles.emptyProfileSubtitle,
            { color: currentColors.textSecondary },
          ]}
        >
          Vui lòng chọn một người dùng để xem chi tiết hồ sơ.
        </TextDefault>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backToDiscoverButton,
            { backgroundColor: currentColors.primary },
          ]}
        >
          <TextDefault style={{ color: currentColors.backgroundCard }}>
            Quay lại Khám phá
          </TextDefault>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[styles.safeArea, { backgroundColor: currentColors.background }]}
    >
      <Separator height={Platform.OS === "ios" ? scale(55) : scale(10)} />
      <ProfileHeader
        userName={user.username}
        onBackPress={() => router.back()}
        currentColors={currentColors}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <ProfileImageCard
            avatar={user.avatarUrl}
            compatibility={10}
            currentColors={currentColors}
          />
          <Separator height={scale(16)} />
          <ProfileInfoSection user={user} currentColors={currentColors} />
        </View>
        <Separator height={scale(120)} />
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Left align back button
    paddingHorizontal: scale(16),
    paddingTop: scale(30),
    paddingBottom: scale(10),
    borderBottomWidth: 1,
  },
  backButton: {
    paddingRight: scale(10),
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "flex-end", // Right align titles
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: scale(14),
    marginTop: scale(4),
  },
  content: {
    paddingHorizontal: scale(16),
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: scale(8),
    overflow: "hidden",
    borderWidth: 1,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: scale(256),
    resizeMode: "cover",
    borderTopLeftRadius: scale(8),
    borderTopRightRadius: scale(8),
  },
  compatibilityBadge: {
    position: "absolute",
    top: scale(16),
    right: scale(16),
    borderRadius: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
  },
  compatibilityBadgeText: {
    fontSize: scale(12),
    fontWeight: "600",
  },
  cardContent: {},
  profileName: {
    fontSize: scale(24),
    fontWeight: "bold",
    marginBottom: scale(8),
  },
  profileLocation: {
    fontSize: scale(16),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(16),
  },
  profileBio: {
    fontSize: scale(16),
    marginBottom: scale(16),
  },
  section: {
    marginBottom: scale(16),
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: "600",
    marginBottom: scale(12),
    flexDirection: "row",
    alignItems: "center",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
  },
  interestBadge: {
    borderRadius: scale(9999),
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
  },
  interestBadgeText: {
    fontSize: scale(14),
  },
  activitiesList: {
    gap: scale(8),
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  bulletPoint: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginRight: scale(12),
  },
  activityText: {
    fontSize: scale(16),
  },
  freeTimeText: {
    fontSize: scale(16),
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: scale(16),
  },
  inviteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(8),
    padding: scale(12),
  },
  inviteButtonText: {
    fontSize: scale(16),
    fontWeight: "600",
  },
  addFriendButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent", // For outline variant
    borderRadius: scale(8),
    paddingVertical: scale(12),
    borderWidth: 1,
  },
  addFriendButtonText: {
    fontSize: scale(16),
    fontWeight: "600",
  },
  container: {
    flex: 1,
  },
  emptyProfileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: scale(24),
    borderRadius: scale(8),
    margin: scale(24),
  },
  emptyProfileIcon: {
    marginBottom: scale(16),
  },
  emptyProfileTitle: {
    fontSize: scale(18),
    fontWeight: "600",
    marginBottom: scale(8),
  },
  emptyProfileSubtitle: {
    fontSize: scale(14),
    textAlign: "center",
    lineHeight: scale(20),
    marginBottom: scale(20),
  },
  backToDiscoverButton: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(24),
    borderRadius: scale(8),
  },
});
