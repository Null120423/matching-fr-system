import Loading from "@/components/@core/loading"; // Import Loading component
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors"; // Import Colors
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme
import { UserDTO } from "@/dto";
import { scale } from "@/helper/helpers";
import useProfileMe from "@/services/hooks/user/useProfileMe";
import { router } from "expo-router";
import {
  Briefcase,
  Calendar,
  ChevronRight,
  Clock,
  Edit,
  Gift,
  Heart,
  MapPin,
  Settings,
  Users,
} from "lucide-react-native";
import React, { useEffect } from "react"; // Import useEffect, useState
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Define User Interface (should match your mock data structure)
interface MyProfileData {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  avatar: string;
  friendsCount: number;
  activitiesCount: number;
  interests: string[];
  freeTime: string;
  recentActivities: { id: number; title: string; date: string }[];
  isPremium: boolean;
}

// Helper for platform-specific shadows (now uses currentColors)
const getShadowStyle = (currentColors: any) =>
  Platform.select({
    ios: {
      shadowColor: currentColors.shadow, // Themed shadow color
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
  });

// -----------------------------------------------------
// Component con: ProfileHeader
// -----------------------------------------------------
interface ProfileHeaderProps {
  userName: string;
  onEditPress: () => void;
  currentColors: any;
}

function ProfileHeader({
  userName,
  onEditPress,
  currentColors,
}: ProfileHeaderProps) {
  return (
    <View
      style={[
        profileStyles.header,
        { borderBottomColor: currentColors.border },
      ]}
    >
      <TextDefault
        style={[profileStyles.headerTitle, { color: currentColors.text }]}
      >
        Hồ sơ của tôi
      </TextDefault>
      <TouchableOpacity
        style={profileStyles.editProfileButton}
        onPress={onEditPress}
      >
        <Edit size={scale(20)} color={currentColors.primary} />
      </TouchableOpacity>
    </View>
  );
}

// -----------------------------------------------------
// Component con: ProfileSummaryCard
// -----------------------------------------------------
interface ProfileSummaryCardProps {
  profile: UserDTO;
  currentColors: any;
  shadowStyle: any;
}

function ProfileSummaryCard({
  profile,
  currentColors,
  shadowStyle,
}: ProfileSummaryCardProps) {
  return (
    <View
      style={[
        profileStyles.profileCard,
        shadowStyle,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
      <View style={profileStyles.avatarContainer}>
        <Image
          source={{ uri: profile.avatarUrl }}
          style={[
            profileStyles.avatarImage,
            { borderColor: currentColors.secondary },
          ]}
        />
      </View>
      <TextDefault
        style={[profileStyles.profileName, { color: currentColors.text }]}
      >
        {profile.username}
      </TextDefault>
      <TextDefault
        style={[
          profileStyles.profileInfo,
          { color: currentColors.textSecondary },
        ]}
      >
        {profile.gender} Gender •{" "}
        <MapPin size={scale(14)} color={currentColors.textSecondary} />
        {profile.location}
      </TextDefault>
      <TextDefault
        style={[
          profileStyles.profileBio,
          { color: currentColors.textSecondary },
        ]}
      >
        {profile.bio}
      </TextDefault>

      <View
        style={[
          profileStyles.statsRow,
          { borderTopColor: currentColors.border },
        ]}
      >
        <View style={profileStyles.statItem}>
          <Users size={scale(20)} color={currentColors.info} />
          <TextDefault
            style={[profileStyles.statValue, { color: currentColors.text }]}
          >
            {10}
          </TextDefault>
          <TextDefault
            style={[
              profileStyles.statLabel,
              { color: currentColors.textLight },
            ]}
          >
            Bạn bè
          </TextDefault>
        </View>
        <View style={profileStyles.statItem}>
          <Briefcase size={scale(20)} color={currentColors.success} />
          <TextDefault
            style={[profileStyles.statValue, { color: currentColors.text }]}
          >
            {profile.activities?.length || 0}
          </TextDefault>
          <TextDefault
            style={[
              profileStyles.statLabel,
              { color: currentColors.textLight },
            ]}
          >
            Hoạt động
          </TextDefault>
        </View>
      </View>
    </View>
  );
}

// -----------------------------------------------------
// Component con: ProfileSectionCard (Reusable)
// -----------------------------------------------------
interface ProfileSectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  currentColors: any;
  shadowStyle: any;
}

function ProfileSectionCard({
  title,
  icon,
  children,
  currentColors,
  shadowStyle,
}: ProfileSectionCardProps) {
  return (
    <View
      style={[
        profileStyles.sectionCard,
        shadowStyle,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
      <TextDefault
        style={[profileStyles.sectionTitle, { color: currentColors.text }]}
      >
        {icon}
        {title}
      </TextDefault>
      {children}
    </View>
  );
}

// -----------------------------------------------------
// Component con: ProfileOptionsCard
// -----------------------------------------------------
interface ProfileOptionsCardProps {
  onPremiumPress: () => void;
  onSettingsPress: () => void;
  currentColors: any;
  shadowStyle: any;
}

function ProfileOptionsCard({
  onPremiumPress,
  onSettingsPress,
  currentColors,
  shadowStyle,
}: ProfileOptionsCardProps) {
  return (
    <View
      style={[
        profileStyles.optionsCard,
        shadowStyle,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
      <TouchableOpacity
        style={profileStyles.optionItem}
        onPress={onPremiumPress}
      >
        <View
          style={[
            profileStyles.optionIconContainer,
            { backgroundColor: currentColors.backgroundLightGray },
          ]}
        >
          <Gift size={scale(20)} color={currentColors.warning} />
        </View>
        <TextDefault
          style={[profileStyles.optionText, { color: currentColors.text }]}
        >
          Nâng cấp tài khoản Premium
        </TextDefault>
        <ChevronRight size={scale(20)} color={currentColors.border} />
      </TouchableOpacity>

      <View
        style={[
          profileStyles.optionSeparator,
          { backgroundColor: currentColors.border },
        ]}
      />

      <TouchableOpacity
        style={profileStyles.optionItem}
        onPress={onSettingsPress}
      >
        <View
          style={[
            profileStyles.optionIconContainer,
            { backgroundColor: currentColors.backgroundLightGray },
          ]}
        >
          <Settings size={scale(20)} color={currentColors.textLight} />
        </View>
        <TextDefault
          style={[profileStyles.optionText, { color: currentColors.text }]}
        >
          Cài đặt ứng dụng
        </TextDefault>
        <ChevronRight size={scale(20)} color={currentColors.border} />
      </TouchableOpacity>
    </View>
  );
}

// -----------------------------------------------------
// Main Component: ProfileView
// -----------------------------------------------------
export default function ProfileView({ navigation }: any) {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const shadowStyle = getShadowStyle(currentColors); // Get themed shadow style
  const { data: profile, isLoading, onLoadProfileMe } = useProfileMe();

  useEffect(() => {
    onLoadProfileMe();
  }, []);

  if (isLoading) {
    return (
      <View
        style={[
          profileStyles.safeArea,
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

  console.log(profile);
  if (!profile) {
    return (
      <View
        style={[
          profileStyles.safeArea,
          {
            backgroundColor: currentColors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <TextDefault style={{ color: currentColors.text }}>
          Không thể tải hồ sơ của bạn.
        </TextDefault>
        <TextDefault
          style={{ color: currentColors.textSecondary, marginTop: scale(5) }}
        >
          Vui lòng thử lại sau.
        </TextDefault>
      </View>
    );
  }

  return (
    <View
      style={[
        profileStyles.safeArea,
        { backgroundColor: currentColors.background },
      ]}
    >
      <Separator height={Platform.OS === "ios" ? scale(55) : scale(30)} />
      <ProfileHeader
        userName={profile.username}
        onEditPress={() =>
          router.navigate({
            pathname: "/(common)/profile/edit",
            params: { id: profile.id },
          })
        }
        currentColors={currentColors}
      />
      <ScrollView style={profileStyles.scrollView}>
        <View style={profileStyles.content}>
          {/* Profile Card */}
          <ProfileSummaryCard
            profile={profile}
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          />

          {/* Interests Section */}
          <ProfileSectionCard
            title="Sở thích"
            icon={
              <Heart
                size={scale(18)}
                color={currentColors.text}
                style={profileStyles.iconMargin}
              />
            }
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          >
            <View style={profileStyles.interestsContainer}>
              {profile.interests?.map((interest, index) => (
                <View
                  key={index}
                  style={[
                    profileStyles.interestBadge,
                    { backgroundColor: currentColors.backgroundLightGray },
                  ]}
                >
                  <TextDefault
                    style={[
                      profileStyles.interestBadgeText,
                      { color: currentColors.textSecondary },
                    ]}
                  >
                    {interest}
                  </TextDefault>
                </View>
              ))}
            </View>
          </ProfileSectionCard>

          {/* Free Time Section */}
          <ProfileSectionCard
            title="Thời gian rảnh"
            icon={
              <Clock
                size={scale(18)}
                color={currentColors.text}
                style={profileStyles.iconMargin}
              />
            }
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          >
            <TextDefault
              style={[
                profileStyles.sectionContentText,
                { color: currentColors.textSecondary },
              ]}
            >
              {"10 am - 12 pm, Thứ 2 đến Thứ 6"}
            </TextDefault>
          </ProfileSectionCard>

          {/* Activity History Section */}
          <ProfileSectionCard
            title="Lịch sử hoạt động"
            icon={
              <Calendar
                size={scale(18)}
                color={currentColors.text}
                style={profileStyles.iconMargin}
              />
            }
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          >
            <View style={profileStyles.activitiesList}>
              {profile?.activities?.map((activity, _index) => (
                <View
                  key={_index}
                  style={[
                    profileStyles.activityHistoryItem,
                    { borderBottomColor: currentColors.border },
                  ]}
                >
                  <TextDefault
                    style={[
                      profileStyles.activityHistoryTitle,
                      { color: currentColors.text },
                    ]}
                  >
                    {activity}
                  </TextDefault>
                  <TextDefault
                    style={[
                      profileStyles.activityHistoryDate,
                      { color: currentColors.textLight },
                    ]}
                  >
                    {/* {activity} */}
                    {new Date().toLocaleDateString("vi-VN", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}
                  </TextDefault>
                </View>
              ))}
            </View>
          </ProfileSectionCard>

          {/* Settings & Upgrade Options */}
          <ProfileOptionsCard
            onPremiumPress={() => navigation.navigate("PremiumSubscription")} // Adjust navigation as per your setup
            onSettingsPress={() => router.navigate("/(common)/setting")}
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          />
        </View>
        <Separator height={scale(100)} />
      </ScrollView>
    </View>
  );
}

const profileStyles = StyleSheet.create({
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
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
    paddingBottom: scale(16),
    borderBottomWidth: 1, // Will be themed
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: "bold",
  },
  editProfileButton: {
    padding: scale(8),
  },
  content: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(24),
    gap: scale(24),
  },
  profileCard: {
    borderRadius: scale(12),
    padding: scale(24),
    alignItems: "center",
    borderWidth: 1,
  },
  avatarContainer: {
    marginBottom: scale(16),
  },
  avatarImage: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    borderWidth: scale(3),
  },
  profileName: {
    fontSize: scale(24),
    fontWeight: "bold",
    marginBottom: scale(4),
  },
  profileInfo: {
    fontSize: scale(16),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(12),
  },
  profileBio: {
    fontSize: scale(14),
    textAlign: "center",
    marginBottom: scale(20),
    lineHeight: scale(20),
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingTop: scale(16),
    borderTopWidth: 1,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: scale(20),
    fontWeight: "bold",
    marginTop: scale(4),
  },
  statLabel: {
    fontSize: scale(12),
  },
  sectionCard: {
    borderRadius: scale(12),
    padding: scale(20),
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: scale(18),
    fontWeight: "600",
    marginBottom: scale(16),
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
    paddingVertical: scale(6),
    paddingHorizontal: scale(12),
  },
  interestBadgeText: {
    fontSize: scale(14),
    fontWeight: "500",
  },
  sectionContentText: {
    fontSize: scale(16),
    lineHeight: scale(24),
  },
  activitiesList: {
    gap: scale(12),
  },
  activityHistoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: scale(8),
    borderBottomWidth: 1,
  },
  activityHistoryTitle: {
    fontSize: scale(16),
    fontWeight: "500",
  },
  activityHistoryDate: {
    fontSize: scale(14),
  },
  optionsCard: {
    borderRadius: scale(12),
    borderWidth: 1,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
  },
  optionIconContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  optionText: {
    flex: 1,
    fontSize: scale(16),
    fontWeight: "500",
  },
  optionSeparator: {
    height: 1,
    marginHorizontal: scale(16),
  },
});
