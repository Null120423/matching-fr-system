import { router } from "expo-router";
import {
  ArrowLeft,
  Check,
  Clock,
  Eye,
  Heart,
  Loader,
  MapPin,
  UserCheck,
  Users,
  UserX,
  X,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Import components
import LoadingView from "@/components/@core/loading";
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { FriendRequestDTO } from "@/dto";
import { scale } from "@/helper/helpers";
import useFriendRequestList from "@/services/hooks/matching/useFriendRequestList";
import useFriendRequestUpdateStatus from "@/services/hooks/matching/useFriendRequestUpdateStatus";

interface FriendRequestsResponse {
  requests: FriendRequestDTO[];
}

// Helper functions
const getShadowStyle = (currentColors: any) =>
  Platform.select({
    ios: {
      shadowColor: currentColors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
  });

const formatTimeAgo = (dateString: Date): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};

// Friend Request Card Component
interface FriendRequestCardProps {
  request: FriendRequestDTO;
  currentColors: any;
  shadowStyle: any;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onViewDetails: (userId: string) => void;
  isProcessing: boolean;
}

function FriendRequestCard({
  request,
  currentColors,
  shadowStyle,
  onAccept,
  onReject,
  onViewDetails,
  isProcessing,
}: FriendRequestCardProps) {
  const { sendRequestPerson } = request;
  const [cardAnimation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(cardAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const getAge = () => {
    if (sendRequestPerson?.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(sendRequestPerson.dateOfBirth);
      return today.getFullYear() - birthDate.getFullYear();
    }
    return null;
  };

  return (
    <Animated.View
      style={[
        {
          opacity: cardAnimation,
          transform: [
            {
              translateY: cardAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      {sendRequestPerson && (
        <View
          style={[
            styles.requestCard,
            shadowStyle,
            {
              backgroundColor: currentColors.backgroundCard,
              borderColor: currentColors.border,
            },
          ]}
        >
          {/* Header with Avatar and Basic Info */}
          <View style={styles.cardHeader}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => onViewDetails(sendRequestPerson.id)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: sendRequestPerson.avatarUrl }}
                style={[styles.avatar, { borderColor: currentColors.primary }]}
              />
              <View
                style={[
                  styles.onlineIndicator,
                  { backgroundColor: currentColors.success },
                ]}
              />
            </TouchableOpacity>

            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <TextDefault
                  style={[styles.userName, { color: currentColors.text }]}
                >
                  {sendRequestPerson.firstName} {sendRequestPerson.lastName}
                </TextDefault>
                {sendRequestPerson.isEmailVerified && (
                  <View
                    style={[
                      styles.verifiedBadge,
                      { backgroundColor: currentColors.success },
                    ]}
                  >
                    <Check size={scale(12)} color="white" />
                  </View>
                )}
              </View>

              <TextDefault
                style={[
                  styles.username,
                  { color: currentColors.textSecondary },
                ]}
              >
                @{sendRequestPerson.username}
              </TextDefault>

              <View style={styles.locationRow}>
                <MapPin size={scale(14)} color={currentColors.textLight} />
                <TextDefault
                  style={[styles.location, { color: currentColors.textLight }]}
                >
                  {sendRequestPerson.location}
                </TextDefault>
                <TextDefault
                  style={[styles.age, { color: currentColors.textLight }]}
                >
                  {getAge()}
                  <TextDefault
                    style={[styles.age, { color: currentColors.textLight }]}
                  >
                    years
                  </TextDefault>
                </TextDefault>
              </View>

              <View style={styles.timeRow}>
                <Clock size={scale(12)} color={currentColors.textLight} />
                <TextDefault
                  style={[styles.timeAgo, { color: currentColors.textLight }]}
                >
                  {formatTimeAgo(request.createdAt)}
                </TextDefault>
              </View>
            </View>
          </View>

          {/* Bio */}
          <TextDefault
            style={[styles.bio, { color: currentColors.textSecondary }]}
          >
            {sendRequestPerson.bio}
          </TextDefault>

          {/* Interests Preview */}
          <View style={styles.interestsContainer}>
            <View style={styles.interestsHeader}>
              <Heart size={scale(14)} color={currentColors.primary} />
              <TextDefault
                style={[styles.interestsTitle, { color: currentColors.text }]}
              >
                Interests
              </TextDefault>
            </View>
            <View style={styles.interestsTags}>
              {sendRequestPerson.interests
                ?.slice(0, 3)
                .map((interest, index) => (
                  <View
                    key={index}
                    style={[
                      styles.interestTag,
                      {
                        backgroundColor: currentColors.primary + "15",
                        borderColor: currentColors.primary + "30",
                      },
                    ]}
                  >
                    <TextDefault
                      style={[
                        styles.interestText,
                        { color: currentColors.primary },
                      ]}
                    >
                      {interest}
                    </TextDefault>
                  </View>
                ))}
              {sendRequestPerson.interests &&
                sendRequestPerson.interests.length > 3 && (
                  <View
                    style={[
                      styles.moreInterestsTag,
                      { backgroundColor: currentColors.textLight + "20" },
                    ]}
                  >
                    <TextDefault
                      style={[
                        styles.moreInterestsText,
                        { color: currentColors.textLight },
                      ]}
                    >
                      +{sendRequestPerson.interests.length - 3}
                    </TextDefault>
                  </View>
                )}
            </View>
          </View>

          {/* Activities Preview */}
          <View style={styles.activitiesContainer}>
            <View style={styles.activitiesHeader}>
              <Users size={scale(14)} color={currentColors.success} />
              <TextDefault
                style={[styles.activitiesTitle, { color: currentColors.text }]}
              >
                Activities
              </TextDefault>
            </View>
            <View style={styles.activitiesList}>
              {sendRequestPerson.activities
                ?.slice(0, 2)
                .map((activity, index) => (
                  <View key={index} style={styles.activityItem}>
                    <View
                      style={[
                        styles.activityDot,
                        { backgroundColor: currentColors.success },
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
              {sendRequestPerson.activities &&
                sendRequestPerson.activities.length > 2 && (
                  <TextDefault
                    style={[
                      styles.moreActivities,
                      { color: currentColors.textLight },
                    ]}
                  >
                    and {sendRequestPerson.activities.length - 2} more...
                  </TextDefault>
                )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.rejectButton,
                {
                  backgroundColor: currentColors.danger + "15",
                  borderColor: currentColors.danger + "30",
                },
              ]}
              onPress={() => onReject(request.id)}
              disabled={isProcessing}
              activeOpacity={0.7}
            >
              {isProcessing ? (
                <Loader size={scale(18)} color={currentColors.danger} />
              ) : (
                <X size={scale(18)} color={currentColors.danger} />
              )}
              <TextDefault
                style={[
                  styles.rejectButtonText,
                  { color: currentColors.danger },
                ]}
              >
                Reject
              </TextDefault>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.detailsButton,
                {
                  backgroundColor: currentColors.info + "15",
                  borderColor: currentColors.info + "30",
                },
              ]}
              onPress={() => onViewDetails(sendRequestPerson.id)}
              activeOpacity={0.7}
            >
              <Eye size={scale(18)} color={currentColors.info} />
              <TextDefault
                style={[
                  styles.detailsButtonText,
                  { color: currentColors.info },
                ]}
              >
                Details
              </TextDefault>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.acceptButton,
                { backgroundColor: currentColors.success },
              ]}
              onPress={() => onAccept(request.id)}
              disabled={isProcessing}
              activeOpacity={0.7}
            >
              {isProcessing ? (
                <Loader size={scale(18)} color="white" />
              ) : (
                <Check size={scale(18)} color="white" />
              )}
              <TextDefault style={styles.acceptButtonText}>Accept</TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

// Main Component
export default function Index() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const shadowStyle = getShadowStyle(currentColors);
  const { onUpdate, isLoading: isLoadingUpdate } =
    useFriendRequestUpdateStatus();
  const {
    data: requests,
    isLoading,
    isRefetching,
    onRefetch,
  } = useFriendRequestList();
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(
    new Set()
  );

  const handleAccept = useCallback(async (requestId: string) => {
    onUpdate({
      id: requestId,
      newStatus: "accepted",
    });
  }, []);

  const handleReject = useCallback(async (requestId: string) => {
    Alert.alert(
      "Reject Friend Request",
      "Are you sure you want to reject this friend request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            onUpdate({
              id: requestId,
              newStatus: "rejected",
            });
          },
        },
      ]
    );
  }, []);

  const handleViewDetails = useCallback((userId: string) => {
    router.push({
      pathname: "/(common)/user-profile",
      params: { userId: userId },
    });
  }, []);

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <>
      <View
        style={[
          styles.container,
          { backgroundColor: currentColors.background },
        ]}
      >
        <Separator height={Platform.OS === "ios" ? scale(55) : scale(30)} />

        {/* Header */}
        <View
          style={[styles.header, { borderBottomColor: currentColors.border }]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={scale(24)} color={currentColors.text} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <TextDefault
              style={[styles.headerTitle, { color: currentColors.text }]}
            >
              Friend Requests
            </TextDefault>
            <TextDefault
              style={[
                styles.headerSubtitle,
                { color: currentColors.textSecondary },
              ]}
            >
              {requests.length} pending request
              {requests.length !== 1 ? "s" : ""}
            </TextDefault>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.headerActionButton,
                { backgroundColor: currentColors.primary + "15" },
              ]}
              // onPress={() => router.push("/(common)/friends/sent-requests")}
            >
              <UserCheck size={scale(20)} color={currentColors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefetch}
              colors={[currentColors.primary]}
              tintColor={currentColors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {requests.length > 0 ? (
            <View style={styles.requestsList}>
              {requests.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  request={request}
                  currentColors={currentColors}
                  shadowStyle={shadowStyle}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onViewDetails={handleViewDetails}
                  isProcessing={processingRequests.has(request.id)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <UserX size={scale(64)} color={currentColors.textLight} />
              <TextDefault
                style={[styles.emptyStateTitle, { color: currentColors.text }]}
              >
                No Friend Requests
              </TextDefault>
              <TextDefault
                style={[
                  styles.emptyStateSubtitle,
                  { color: currentColors.textSecondary },
                ]}
              >
                You don't have any pending friend requests at the moment.
              </TextDefault>
              <TouchableOpacity
                style={[
                  styles.emptyStateButton,
                  { backgroundColor: currentColors.primary },
                ]}
                onPress={() => router.push("/(home)/discover")}
              >
                <TextDefault style={styles.emptyStateButtonText}>
                  Discover People
                </TextDefault>
              </TouchableOpacity>
            </View>
          )}

          <Separator height={scale(100)} />
        </ScrollView>
      </View>
      {isLoadingUpdate && <LoadingView />}
    </>
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
    gap: scale(16),
  },
  loadingText: {
    fontSize: scale(16),
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    gap: scale(16),
  },
  backButton: {
    padding: scale(8),
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: scale(24),
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: scale(14),
    marginTop: scale(2),
  },
  headerActions: {
    flexDirection: "row",
    gap: scale(8),
  },
  headerActionButton: {
    padding: scale(12),
    borderRadius: scale(12),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  requestsList: {
    padding: scale(20),
    gap: scale(20),
  },

  // Request Card Styles
  requestCard: {
    borderRadius: scale(16),
    padding: scale(20),
    borderWidth: 1,
    gap: scale(16),
  },
  cardHeader: {
    flexDirection: "row",
    gap: scale(16),
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    borderWidth: scale(2),
  },
  onlineIndicator: {
    position: "absolute",
    bottom: scale(2),
    right: scale(2),
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    borderWidth: scale(2),
    borderColor: "white",
  },
  userInfo: {
    flex: 1,
    gap: scale(4),
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  userName: {
    fontSize: scale(18),
    fontWeight: "bold",
  },
  verifiedBadge: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    fontSize: scale(14),
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
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
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
  },
  timeAgo: {
    fontSize: scale(12),
  },
  bio: {
    fontSize: scale(14),
    lineHeight: scale(20),
  },

  // Interests Styles
  interestsContainer: {
    gap: scale(8),
  },
  interestsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  interestsTitle: {
    fontSize: scale(14),
    fontWeight: "600",
  },
  interestsTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(6),
  },
  interestTag: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    borderWidth: 1,
  },
  interestText: {
    fontSize: scale(12),
    fontWeight: "500",
  },
  moreInterestsTag: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(12),
  },
  moreInterestsText: {
    fontSize: scale(12),
    fontWeight: "500",
  },

  // Activities Styles
  activitiesContainer: {
    gap: scale(8),
  },
  activitiesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  activitiesTitle: {
    fontSize: scale(14),
    fontWeight: "600",
  },
  activitiesList: {
    gap: scale(4),
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  activityDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
  },
  activityText: {
    fontSize: scale(14),
  },
  moreActivities: {
    fontSize: scale(12),
    fontStyle: "italic",
    marginLeft: scale(14),
  },

  // Action Buttons
  actionButtons: {
    flexDirection: "row",
    gap: scale(12),
    marginTop: scale(8),
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
    gap: scale(6),
    borderWidth: 1,
  },
  rejectButton: {
    flex: 0.8,
  },
  detailsButton: {
    flex: 0.8,
  },
  acceptButton: {
    flex: 1.2,
  },
  rejectButtonText: {
    fontSize: scale(14),
    fontWeight: "600",
  },
  detailsButtonText: {
    fontSize: scale(14),
    fontWeight: "600",
  },
  acceptButtonText: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "white",
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(40),
    gap: scale(16),
  },
  emptyStateTitle: {
    fontSize: scale(20),
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: scale(16),
    textAlign: "center",
    lineHeight: scale(24),
  },
  emptyStateButton: {
    paddingHorizontal: scale(32),
    paddingVertical: scale(12),
    borderRadius: scale(12),
    marginTop: scale(8),
  },
  emptyStateButtonText: {
    color: "white",
    fontSize: scale(16),
    fontWeight: "600",
  },
});
