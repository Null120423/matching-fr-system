import Loading from "@/components/@core/loading";
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { UserDTO } from "@/dto";
import { scale } from "@/helper/helpers";
import useProfileMe from "@/services/hooks/user/useProfileMe";
import { router } from "expo-router";
import {
  Briefcase,
  Camera,
  ChevronRight,
  Edit,
  Gift,
  Heart,
  MapPin,
  Settings,
  Star,
  Users,
  Verified,
} from "lucide-react-native";
import React, { useEffect, useMemo } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Helper for platform-specific shadows
const getShadowStyle = (currentColors: any) =>
  Platform.select({
    ios: {
      shadowColor: currentColors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
  });

// Enhanced Profile Header with gradient background
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
    <View style={[styles.header]}>
      <View style={styles.headerContent}>
        <TextDefault
          style={[
            styles.headerTitle,
            {
              color: currentColors.text,
            },
          ]}
        >
          My Profile
        </TextDefault>
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: "rgba(0,0,0,0.1)" }]}
          onPress={onEditPress}
          activeOpacity={0.7}
        >
          <Edit size={scale(20)} color={currentColors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Enhanced Profile Card with better visual hierarchy
interface ProfileCardProps {
  profile: UserDTO;
  currentColors: any;
  shadowStyle: any;
}

function ProfileCard({
  profile,
  currentColors,
  shadowStyle,
}: ProfileCardProps) {
  const age = useMemo(() => {
    if (profile.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(profile.dateOfBirth);
      return today.getFullYear() - birthDate.getFullYear();
    }
    return null;
  }, [profile.dateOfBirth]);

  return (
    <View
      style={[
        styles.profileCard,
        shadowStyle,
        { backgroundColor: currentColors.backgroundCard },
      ]}
    >
      {/* Avatar Section with Camera Icon */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: profile.avatarUrl }}
            style={[styles.avatarImage, { borderColor: currentColors.primary }]}
          />
          <TouchableOpacity
            style={[
              styles.cameraButton,
              { backgroundColor: currentColors.primary },
            ]}
            activeOpacity={0.7}
          >
            <Camera size={scale(16)} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.nameRow}>
          <TextDefault style={[styles.userName, { color: currentColors.text }]}>
            {profile.firstName} {profile.lastName}
          </TextDefault>
          {profile.isEmailVerified && (
            <Verified size={scale(20)} color={currentColors.success} />
          )}
        </View>

        <TextDefault
          style={[styles.username, { color: currentColors.textSecondary }]}
        >
          @{profile.username}
        </TextDefault>

        <View style={styles.locationRow}>
          <MapPin size={scale(16)} color={currentColors.textSecondary} />
          <TextDefault
            style={[styles.location, { color: currentColors.textSecondary }]}
          >
            {profile.location}
          </TextDefault>
          {age && (
            <>
              <View
                style={[
                  styles.ageDot,
                  { backgroundColor: currentColors.textSecondary },
                ]}
              />
              <TextDefault
                style={[styles.age, { color: currentColors.textSecondary }]}
              >
                {age} years old
              </TextDefault>
            </>
          )}
        </View>

        <TextDefault style={[styles.bio, { color: currentColors.text }]}>
          {profile.bio}
        </TextDefault>
      </View>

      {/* Stats Row */}
      <View
        style={[
          styles.statsContainer,
          { borderTopColor: currentColors.border },
        ]}
      >
        <View style={styles.statItem}>
          <View
            style={[
              styles.statIconContainer,
              { backgroundColor: currentColors.info + "20" },
            ]}
          >
            <Users size={scale(20)} color={currentColors.info} />
          </View>
          <TextDefault
            style={[styles.statValue, { color: currentColors.text }]}
          >
            156
          </TextDefault>
          <TextDefault
            style={[styles.statLabel, { color: currentColors.textLight }]}
          >
            Friends
          </TextDefault>
        </View>

        <View
          style={[
            styles.statDivider,
            { backgroundColor: currentColors.border },
          ]}
        />

        <View style={styles.statItem}>
          <View
            style={[
              styles.statIconContainer,
              { backgroundColor: currentColors.success + "20" },
            ]}
          >
            <Briefcase size={scale(20)} color={currentColors.success} />
          </View>
          <TextDefault
            style={[styles.statValue, { color: currentColors.text }]}
          >
            {profile.activities?.length || 0}
          </TextDefault>
          <TextDefault
            style={[styles.statLabel, { color: currentColors.textLight }]}
          >
            Activities
          </TextDefault>
        </View>

        <View
          style={[
            styles.statDivider,
            { backgroundColor: currentColors.border },
          ]}
        />

        <View style={styles.statItem}>
          <View
            style={[
              styles.statIconContainer,
              { backgroundColor: currentColors.warning + "20" },
            ]}
          >
            <Star size={scale(20)} color={currentColors.warning} />
          </View>
          <TextDefault
            style={[styles.statValue, { color: currentColors.text }]}
          >
            4.8
          </TextDefault>
          <TextDefault
            style={[styles.statLabel, { color: currentColors.textLight }]}
          >
            Rating
          </TextDefault>
        </View>
      </View>
    </View>
  );
}

// Enhanced Section Card with better styling
interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  currentColors: any;
  shadowStyle: any;
  headerAction?: React.ReactNode;
}

function SectionCard({
  title,
  icon,
  children,
  currentColors,
  shadowStyle,
  headerAction,
}: SectionCardProps) {
  return (
    <View
      style={[
        styles.sectionCard,
        shadowStyle,
        { backgroundColor: currentColors.backgroundCard },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <View
            style={[
              styles.sectionIconContainer,
              { backgroundColor: currentColors.primary + "15" },
            ]}
          >
            {icon}
          </View>
          <TextDefault
            style={[styles.sectionTitle, { color: currentColors.text }]}
          >
            {title}
          </TextDefault>
        </View>
        {headerAction}
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

// Enhanced Interests Display
interface InterestsCardProps {
  interests: string[];
  currentColors: any;
  shadowStyle: any;
}

function InterestsCard({
  interests,
  currentColors,
  shadowStyle,
}: InterestsCardProps) {
  return (
    <SectionCard
      title="Interests"
      icon={<Heart size={scale(18)} color={currentColors.primary} />}
      currentColors={currentColors}
      shadowStyle={shadowStyle}
    >
      <View style={styles.interestsGrid}>
        {interests?.map((interest, index) => (
          <View
            key={index}
            style={[
              styles.interestChip,
              {
                backgroundColor: currentColors.primary + "15",
                borderColor: currentColors.primary + "30",
              },
            ]}
          >
            <TextDefault
              style={[styles.interestText, { color: currentColors.primary }]}
            >
              {interest}
            </TextDefault>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

// Activities Card
interface ActivitiesCardProps {
  activities: string[];
  currentColors: any;
  shadowStyle: any;
}

function ActivitiesCard({
  activities,
  currentColors,
  shadowStyle,
}: ActivitiesCardProps) {
  return (
    <SectionCard
      title="Activities"
      icon={<Briefcase size={scale(18)} color={currentColors.success} />}
      currentColors={currentColors}
      shadowStyle={shadowStyle}
    >
      <View style={styles.activitiesList}>
        {activities?.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <View
              style={[
                styles.activityDot,
                { backgroundColor: currentColors.success },
              ]}
            />
            <TextDefault
              style={[styles.activityText, { color: currentColors.text }]}
            >
              {activity}
            </TextDefault>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

// Preferences Card
interface PreferencesCardProps {
  profile: UserDTO;
  currentColors: any;
  shadowStyle: any;
}

function PreferencesCard({
  profile,
  currentColors,
  shadowStyle,
}: PreferencesCardProps) {
  return (
    <SectionCard
      title="Dating Preferences"
      icon={<Heart size={scale(18)} color={currentColors.danger} />}
      currentColors={currentColors}
      shadowStyle={shadowStyle}
    >
      <View style={styles.preferencesContainer}>
        <View style={styles.preferenceItem}>
          <TextDefault
            style={[
              styles.preferenceLabel,
              { color: currentColors.textSecondary },
            ]}
          >
            Age Range
          </TextDefault>
          <TextDefault
            style={[styles.preferenceValue, { color: currentColors.text }]}
          >
            {profile.minAgePreference} - {profile.maxAgePreference} years
          </TextDefault>
        </View>

        <View style={styles.preferenceItem}>
          <TextDefault
            style={[
              styles.preferenceLabel,
              { color: currentColors.textSecondary },
            ]}
          >
            Looking for
          </TextDefault>
          <TextDefault
            style={[styles.preferenceValue, { color: currentColors.text }]}
          >
            {profile.preferredGender === "all"
              ? "Everyone"
              : profile.preferredGender === "male"
              ? "Men"
              : "Women"}
          </TextDefault>
        </View>
      </View>
    </SectionCard>
  );
}

// Enhanced Options Card
interface OptionsCardProps {
  onPremiumPress: () => void;
  onSettingsPress: () => void;
  currentColors: any;
  shadowStyle: any;
}

function OptionsCard({
  onPremiumPress,
  onSettingsPress,
  currentColors,
  shadowStyle,
}: OptionsCardProps) {
  const options = [
    {
      icon: <Gift size={scale(22)} color={currentColors.warning} />,
      title: "Upgrade to Premium",
      subtitle: "Unlock exclusive features",
      onPress: onPremiumPress,
      showBadge: true,
    },
    {
      icon: <Settings size={scale(22)} color={currentColors.textSecondary} />,
      title: "App Settings",
      subtitle: "Customize your experience",
      onPress: onSettingsPress,
      showBadge: false,
    },
  ];

  return (
    <View
      style={[
        styles.optionsCard,
        shadowStyle,
        { backgroundColor: currentColors.backgroundCard },
      ]}
    >
      {options.map((option, index) => (
        <React.Fragment key={index}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={option.onPress}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.optionIconContainer,
                { backgroundColor: currentColors.backgroundLightGray },
              ]}
            >
              {option.icon}
            </View>
            <View style={styles.optionContent}>
              <View style={styles.optionTitleRow}>
                <TextDefault
                  style={[styles.optionTitle, { color: currentColors.text }]}
                >
                  {option.title}
                </TextDefault>
                {option.showBadge && (
                  <View
                    style={[
                      styles.premiumBadge,
                      { backgroundColor: currentColors.warning },
                    ]}
                  >
                    <TextDefault style={styles.premiumBadgeText}>
                      PRO
                    </TextDefault>
                  </View>
                )}
              </View>
              <TextDefault
                style={[
                  styles.optionSubtitle,
                  { color: currentColors.textSecondary },
                ]}
              >
                {option.subtitle}
              </TextDefault>
            </View>
            <ChevronRight size={scale(20)} color={currentColors.textLight} />
          </TouchableOpacity>
          {index < options.length - 1 && (
            <View
              style={[
                styles.optionDivider,
                { backgroundColor: currentColors.border },
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

// Main Component
export default function ProfileView({ navigation }: any) {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const shadowStyle = getShadowStyle(currentColors);
  const { data: profile, isLoading, onLoadProfileMe } = useProfileMe();

  useEffect(() => {
    onLoadProfileMe();
  }, []);

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: currentColors.background },
        ]}
      >
        <Loading />
        <TextDefault
          style={[styles.loadingText, { color: currentColors.text }]}
        >
          Loading profile...
        </TextDefault>
      </View>
    );
  }

  if (!profile) {
    return (
      <View
        style={[
          styles.errorContainer,
          { backgroundColor: currentColors.background },
        ]}
      >
        <TextDefault style={[styles.errorText, { color: currentColors.text }]}>
          Unable to load your profile.
        </TextDefault>
        <TextDefault
          style={[styles.errorSubtext, { color: currentColors.textSecondary }]}
        >
          Please try again later.
        </TextDefault>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: currentColors.background }]}
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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <ProfileCard
            profile={profile}
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          />

          <InterestsCard
            interests={profile.interests || []}
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          />

          <ActivitiesCard
            activities={profile.activities || []}
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          />

          <PreferencesCard
            profile={profile}
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          />

          <OptionsCard
            onPremiumPress={() => navigation?.navigate("PremiumSubscription")}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: scale(16),
    fontSize: scale(16),
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(32),
  },
  errorText: {
    fontSize: scale(18),
    fontWeight: "600",
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: scale(14),
    textAlign: "center",
    marginTop: scale(8),
  },
  header: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: scale(24),
    fontWeight: "bold",
  },
  editButton: {
    padding: scale(12),
    borderRadius: scale(12),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: scale(20),
    paddingTop: scale(20),
    gap: scale(20),
  },

  // Profile Card Styles
  profileCard: {
    borderRadius: scale(20),
    padding: scale(24),
    marginTop: scale(-40), // Overlap with header
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: scale(20),
  },
  avatarContainer: {
    position: "relative",
  },
  avatarImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    borderWidth: scale(4),
  },
  cameraButton: {
    position: "absolute",
    bottom: scale(4),
    right: scale(4),
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: scale(24),
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    marginBottom: scale(4),
  },
  userName: {
    fontSize: scale(24),
    fontWeight: "bold",
  },
  username: {
    fontSize: scale(16),
    marginBottom: scale(8),
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginBottom: scale(12),
  },
  location: {
    fontSize: scale(14),
  },
  ageDot: {
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
  },
  age: {
    fontSize: scale(14),
  },
  bio: {
    fontSize: scale(16),
    textAlign: "center",
    lineHeight: scale(24),
  },
  statsContainer: {
    flexDirection: "row",
    paddingTop: scale(20),
    borderTopWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(8),
  },
  statValue: {
    fontSize: scale(20),
    fontWeight: "bold",
    marginBottom: scale(4),
  },
  statLabel: {
    fontSize: scale(12),
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: scale(60),
    alignSelf: "center",
  },

  // Section Card Styles
  sectionCard: {
    borderRadius: scale(16),
    padding: scale(20),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(16),
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIconContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(8),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  sectionTitle: {
    fontSize: scale(18),
    fontWeight: "600",
  },
  sectionAction: {
    paddingVertical: scale(4),
    paddingHorizontal: scale(8),
  },
  sectionActionText: {
    fontSize: scale(14),
    fontWeight: "500",
  },
  sectionContent: {
    // Content styles
  },

  // Interests Styles
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
  },
  interestChip: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    borderRadius: scale(20),
    borderWidth: 1,
  },
  interestText: {
    fontSize: scale(14),
    fontWeight: "500",
  },

  // Activities Styles
  activitiesList: {
    gap: scale(12),
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  activityDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  activityText: {
    fontSize: scale(16),
    flex: 1,
  },

  // Preferences Styles
  preferencesContainer: {
    gap: scale(16),
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  preferenceLabel: {
    fontSize: scale(14),
    fontWeight: "500",
  },
  preferenceValue: {
    fontSize: scale(16),
    fontWeight: "600",
  },

  // Options Card Styles
  optionsCard: {
    borderRadius: scale(16),
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(20),
  },
  optionIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(16),
  },
  optionContent: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    marginBottom: scale(4),
  },
  optionTitle: {
    fontSize: scale(16),
    fontWeight: "600",
  },
  optionSubtitle: {
    fontSize: scale(14),
  },
  premiumBadge: {
    paddingVertical: scale(2),
    paddingHorizontal: scale(6),
    borderRadius: scale(4),
  },
  premiumBadgeText: {
    fontSize: scale(10),
    fontWeight: "bold",
    color: "white",
  },
  optionDivider: {
    height: 1,
    marginHorizontal: scale(20),
  },
});
