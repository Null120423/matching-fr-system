// views/discover/user-profile/index.tsx
import Loading from "@/components/@core/loading"; // Import Loading component
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors"; // Import Colors
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme
import { scale } from "@/helper/helpers";
import { Ionicons } from "@expo/vector-icons"; // Dùng Ionicons thay cho HomeIcon trong nhiều trường hợp
import { router, useLocalSearchParams } from "expo-router"; // Import useLocalSearchParams
import React, { useEffect, useState } from "react"; // Import useEffect, useState
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Define User Interface
interface DiscoverUser {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  compatibility: number;
  interests: string[];
  bio: string;
  activities: string[];
  freeTime: string;
}

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
        <TextDefault
          style={[
            styles.headerSubtitle,
            { color: currentColors.textSecondary },
          ]}
        >
          Thông tin chi tiết về {userName}
        </TextDefault>
      </View>
    </View>
  );
}

// -----------------------------------------------------
// Component con: ProfileImageCard
// -----------------------------------------------------
interface ProfileImageCardProps {
  avatar: string;
  compatibility: number;
  currentColors: any;
}

function ProfileImageCard({
  avatar,
  compatibility,
  currentColors,
}: ProfileImageCardProps) {
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

// -----------------------------------------------------
// Component con: ProfileInfoSection
// -----------------------------------------------------
interface ProfileInfoSectionProps {
  user: DiscoverUser;
  currentColors: any;
}

function ProfileInfoSection({ user, currentColors }: ProfileInfoSectionProps) {
  return (
    <View style={[styles.cardContent]}>
      <TextDefault style={[styles.profileName, { color: currentColors.text }]}>
        {user.name}, {user.age}
      </TextDefault>
      <TextDefault
        style={[styles.profileLocation, { color: currentColors.textSecondary }]}
      >
        <Ionicons
          name="location-outline"
          size={scale(16)}
          color={currentColors.textSecondary}
        />
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
            style={styles.iconMargin}
          />
          Sở thích
        </TextDefault>
        <View style={styles.interestsContainer}>
          {user.interests.map((interest: string, index: number) => (
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
            style={styles.iconMargin}
          />
          Hoạt động thường xuyên
        </TextDefault>
        <View style={styles.activitiesList}>
          {user.activities.map((activity: string, index: number) => (
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
            style={styles.iconMargin}
          />
          Thời gian rảnh
        </TextDefault>
        <TextDefault
          style={[styles.freeTimeText, { color: currentColors.textSecondary }]}
        >
          {user.freeTime}
        </TextDefault>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.inviteButton,
            { backgroundColor: currentColors.primary },
          ]}
        >
          <Ionicons
            name="mail"
            size={scale(16)}
            color={currentColors.backgroundCard}
            style={styles.iconMargin}
          />
          <TextDefault
            style={[
              styles.inviteButtonText,
              { color: currentColors.backgroundCard },
            ]}
          >
            Gửi lời mời hẹn
          </TextDefault>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.addFriendButton,
            { borderColor: currentColors.border },
          ]}
        >
          <Ionicons
            name="person-add"
            size={scale(16)}
            color={currentColors.text}
            style={styles.iconMargin}
          />
          <TextDefault
            style={[styles.addFriendButtonText, { color: currentColors.text }]}
          >
            Kết bạn
          </TextDefault>
        </TouchableOpacity>
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
  const params = useLocalSearchParams(); // Lấy params từ URL
  const userId = params.userId as string; // Đảm bảo bạn truyền userId qua router push

  const [user, setUser] = useState<DiscoverUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // const fetchUserProfile = async () => {
    //   if (userId) {
    //     setIsLoading(true);
    //     try {
    //       const users = (await fetchDiscoverUsers()) as DiscoverUser[];
    //       const foundUser = users.find((u) => u.id === userId);
    //       setUser(foundUser || null);
    //     } catch (error) {
    //       console.error("Failed to fetch user profile:", error);
    //       setUser(null); // Clear user data on error
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   } else {
    //     setIsLoading(false); // No userId provided
    //     setUser(null);
    //   }
    // };
    // fetchUserProfile();
  }, [userId]);

  if (isLoading) {
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

  if (!user) {
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
        userName={user.name}
        onBackPress={() => router.back()}
        currentColors={currentColors}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <ProfileImageCard
            avatar={user.avatar}
            compatibility={user.compatibility}
            currentColors={currentColors}
          />
          <ProfileInfoSection user={user} currentColors={currentColors} />
        </View>
        <Separator height={scale(70)} />
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
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB", // will be themed
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
    paddingVertical: scale(24),
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
  cardContent: {
    padding: scale(24),
    gap: scale(24), // space-y-6
  },
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
  iconMargin: {
    marginRight: scale(8),
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
    gap: scale(12),
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
