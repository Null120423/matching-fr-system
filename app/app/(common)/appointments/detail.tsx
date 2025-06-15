import Loading from "@/components/@core/loading"; // Import Loading component
import Row from "@/components/@core/row";
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default"; // Sử dụng TextDefault
import { Colors } from "@/constants/Colors"; // Import Colors
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme
import { scale } from "@/helper/helpers";
import { getAppointmentById } from "@/services/appointments"; // Import getAppointmentById API
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  Edit,
  MapPin,
  Trash2,
  Users,
  XCircle,
} from "lucide-react-native";
import React, { useEffect, useState } from "react"; // Import useEffect, useState
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Define Appointment Type (should match your mock data structure)
interface AppointmentDetail {
  id: string;
  activity: string;
  time: string;
  location: string;
  status: "pending" | "confirmed" | "accepted" | "declined" | "cancelled";
  createdAt: string;
  updatedAt: string;
  creator: {
    name: string;
    avatar: string;
  };
  participants: {
    name: string;
    avatar: string;
  }[];
  isCreator: boolean;
  isPending: boolean;
  isConfirmed: boolean;
  isDeclined: boolean;
  isCancelled: boolean;
  // Add other boolean flags if they exist in your mock data
  isCompleted?: boolean;
  isRescheduled?: boolean;
  isExpired?: boolean;
  isNoShow?: boolean;
  isInProgress?: boolean;
  isPast?: boolean;
  isFuture?: boolean;
  isToday?: boolean;
  isTomorrow?: boolean;
}

type AppointmentRouteType = "received" | "sent" | "upcoming" | "history";

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
// Component con: AppointmentDetailHeader
// -----------------------------------------------------
interface AppointmentDetailHeaderProps {
  activityTitle: string;
  currentColors: any;
  onBackPress: () => void;
}

function AppointmentDetailHeader({
  activityTitle,
  currentColors,
  onBackPress,
}: AppointmentDetailHeaderProps) {
  return (
    <>
      <Row
        between
        full
        style={{ alignItems: "center", paddingHorizontal: scale(16) }}
      >
        <TouchableOpacity
          style={{ paddingVertical: scale(8) }}
          onPress={onBackPress}
        >
          <TextDefault
            style={{ fontSize: scale(16), color: currentColors.textSecondary }}
          >
            Quay lại
          </TextDefault>
        </TouchableOpacity>
        <View style={detailsStyles.header}>
          <TextDefault
            style={[detailsStyles.headerTitle, { color: currentColors.text }]}
          >
            Chi tiết cuộc hẹn
          </TextDefault>
          <TextDefault
            style={[
              detailsStyles.headerSubtitle,
              { color: currentColors.textSecondary },
            ]}
          >
            {activityTitle}
          </TextDefault>
        </View>
      </Row>
    </>
  );
}

// -----------------------------------------------------
// Component con: AppointmentInfoCard
// -----------------------------------------------------
interface AppointmentInfoCardProps {
  appointment: AppointmentDetail;
  currentColors: any;
  shadowStyle: any;
}

function AppointmentInfoCard({
  appointment,
  currentColors,
  shadowStyle,
}: AppointmentInfoCardProps) {
  return (
    <View
      style={[
        detailsStyles.card,
        shadowStyle,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
      <View style={detailsStyles.detailRow}>
        <CalendarDays
          size={scale(20)}
          color={currentColors.iconDefault}
          style={detailsStyles.detailIcon}
        />
        <View>
          <TextDefault
            style={[
              detailsStyles.detailLabel,
              { color: currentColors.textLight },
            ]}
          >
            Hoạt động
          </TextDefault>
          <TextDefault
            style={[detailsStyles.detailText, { color: currentColors.text }]}
          >
            {appointment.activity}
          </TextDefault>
        </View>
      </View>

      <View style={detailsStyles.detailRow}>
        <Clock
          size={scale(20)}
          color={currentColors.iconDefault}
          style={detailsStyles.detailIcon}
        />
        <View>
          <TextDefault
            style={[
              detailsStyles.detailLabel,
              { color: currentColors.textLight },
            ]}
          >
            Thời gian
          </TextDefault>
          <TextDefault
            style={[detailsStyles.detailText, { color: currentColors.text }]}
          >
            {appointment.time}
          </TextDefault>
        </View>
      </View>

      <View style={detailsStyles.detailRow}>
        <MapPin
          size={scale(20)}
          color={currentColors.iconDefault}
          style={detailsStyles.detailIcon}
        />
        <View>
          <TextDefault
            style={[
              detailsStyles.detailLabel,
              { color: currentColors.textLight },
            ]}
          >
            Địa điểm
          </TextDefault>
          <TextDefault
            style={[detailsStyles.detailText, { color: currentColors.text }]}
          >
            {appointment.location}
          </TextDefault>
        </View>
      </View>
    </View>
  );
}

// -----------------------------------------------------
// Component con: ParticipantsSection
// -----------------------------------------------------
interface ParticipantsSectionProps {
  participants: { name: string; avatar: string }[];
  currentColors: any;
  shadowStyle: any;
}

function ParticipantsSection({
  participants,
  currentColors,
  shadowStyle,
}: ParticipantsSectionProps) {
  return (
    <View
      style={[
        detailsStyles.card,
        shadowStyle,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
          paddingTop: scale(24), // Ensure consistent padding top
        },
      ]}
    >
      <TextDefault
        style={[detailsStyles.participantsTitle, { color: currentColors.text }]}
      >
        <Users
          size={scale(20)}
          color={currentColors.iconDefault}
          style={detailsStyles.detailIcon}
        />
        Người tham gia
      </TextDefault>
      <View style={detailsStyles.participantsList}>
        {participants?.map((p, index) => (
          <View key={index} style={detailsStyles.participantItem}>
            <Image
              source={{ uri: p.avatar }}
              style={[
                detailsStyles.participantAvatar,
                { backgroundColor: currentColors.border },
              ]}
            />
            <TextDefault
              style={[
                detailsStyles.participantName,
                { color: currentColors.textSecondary },
              ]}
            >
              {p.name}
            </TextDefault>
          </View>
        ))}
      </View>
    </View>
  );
}

// -----------------------------------------------------
// Component con: AppointmentActionButtons
// -----------------------------------------------------
interface AppointmentActionButtonsProps {
  appointment: AppointmentDetail;
  type: AppointmentRouteType;
  onAccept: () => void;
  onDecline: () => void;
  onEdit: () => void;
  onCancel: () => void;
  currentColors: any;
}

function AppointmentActionButtons({
  appointment,
  type,
  onAccept,
  onDecline,
  onEdit,
  onCancel,
  currentColors,
}: AppointmentActionButtonsProps) {
  return (
    <View
      style={[
        detailsStyles.actionButtonsContainer,
        { borderTopColor: currentColors.border },
      ]}
    >
      {type === "received" && appointment.status === "pending" && (
        <>
          <TouchableOpacity
            style={[
              detailsStyles.actionButton,
              detailsStyles.acceptButton,
              { backgroundColor: currentColors.success },
            ]}
            onPress={onAccept}
          >
            <CheckCircle
              size={scale(18)}
              color={currentColors.backgroundCard}
              style={detailsStyles.buttonIcon}
            />
            <TextDefault
              style={[
                detailsStyles.buttonText,
                { color: currentColors.backgroundCard },
              ]}
            >
              Chấp nhận
            </TextDefault>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              detailsStyles.actionButton,
              detailsStyles.declineButton,
              {
                backgroundColor: currentColors.backgroundCard,
                borderColor: currentColors.border,
              },
            ]}
            onPress={onDecline}
          >
            <XCircle
              size={scale(18)}
              color={currentColors.text}
              style={detailsStyles.buttonIcon}
            />
            <TextDefault
              style={[
                detailsStyles.buttonTextSecondary,
                { color: currentColors.text },
              ]}
            >
              Từ chối
            </TextDefault>
          </TouchableOpacity>
        </>
      )}

      {appointment.isCreator && (
        <>
          <TouchableOpacity
            style={[
              detailsStyles.actionButton,
              detailsStyles.editButton,
              { backgroundColor: currentColors.info },
            ]}
            onPress={onEdit}
          >
            <Edit
              size={scale(18)}
              color={currentColors.backgroundCard}
              style={detailsStyles.buttonIcon}
            />
            <TextDefault
              style={[
                detailsStyles.buttonText,
                { color: currentColors.backgroundCard },
              ]}
            >
              Chỉnh sửa
            </TextDefault>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              detailsStyles.actionButton,
              detailsStyles.cancelButton,
              {
                backgroundColor: currentColors.backgroundCard,
                borderColor: currentColors.danger,
              },
            ]}
            onPress={onCancel}
          >
            <Trash2
              size={scale(18)}
              color={currentColors.danger}
              style={detailsStyles.buttonIcon}
            />
            <TextDefault
              style={[
                detailsStyles.buttonTextDanger,
                { color: currentColors.danger },
              ]}
            >
              Hủy
            </TextDefault>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// -----------------------------------------------------
// Main Component: currentAppointmentDetailsScreen
// -----------------------------------------------------
export default function currentAppointmentDetailsScreen() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const shadowStyle = getShadowStyle(currentColors);

  const params = useRoute().params as {
    id: string;
    type: AppointmentRouteType;
  };
  const { id, type } = params;

  const [currentAppointment, setCurrentAppointment] =
    useState<AppointmentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAppointmentDetails = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const fetchedAppointment = (await getAppointmentById(
            id
          )) as unknown as AppointmentDetail;
          if (fetchedAppointment) {
            // Adjust isCreator, isPending, etc. based on fetched data and route type
            // This is crucial as mock data might not provide these flags
            const processedAppointment = {
              ...fetchedAppointment,
              isCreator: type === "sent", // Assuming 'sent' type means current user is creator
              isPending: fetchedAppointment.status === "pending",
              isConfirmed: fetchedAppointment.status === "accepted", // Assuming accepted means confirmed
              isDeclined: fetchedAppointment.status === "declined",
              isCancelled: fetchedAppointment.status === "cancelled" || false,
            };
            setCurrentAppointment(processedAppointment);
          } else {
            Alert.alert("Lỗi", "Không tìm thấy cuộc hẹn này.");
          }
        } catch (error) {
          console.error("Failed to fetch appointment details:", error);
          Alert.alert(
            "Lỗi",
            "Không thể tải chi tiết cuộc hẹn. Vui lòng thử lại."
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false); // No ID provided
      }
    };

    loadAppointmentDetails();
  }, [id, type]); // Re-fetch if ID or type changes

  const handleAccept = () => {
    Alert.alert(
      "Chấp nhận",
      `Đã chấp nhận cuộc hẹn ${currentAppointment?.activity}`
    );
    // In a real app, update status via API
    router.back();
  };

  const handleDecline = () => {
    Alert.alert(
      "Từ chối",
      `Đã từ chối cuộc hẹn ${currentAppointment?.activity}`
    );
    // In a real app, update status via API
  };

  const handleEdit = () => {
    Alert.alert(
      "Chỉnh sửa",
      `Chuyển đến màn hình chỉnh sửa cuộc hẹn ${currentAppointment?.activity}`
    );
    // Navigate to edit screen with appointment ID
  };

  const handleCancel = () => {
    Alert.alert("Hủy", `Đã hủy cuộc hẹn ${currentAppointment?.activity}`);
    // In a real app, update status via API
  };

  if (isLoading) {
    return (
      <View
        style={[
          detailsStyles.emptyContainer,
          {
            backgroundColor: currentColors.background,
            borderColor: currentColors.border,
          },
        ]}
      >
        <Loading />
        <TextDefault
          style={{ color: currentColors.text, marginTop: scale(10) }}
        >
          Đang tải chi tiết cuộc hẹn...
        </TextDefault>
      </View>
    );
  }

  if (!currentAppointment) {
    return (
      <View
        style={[
          detailsStyles.emptyContainer,
          {
            backgroundColor: currentColors.backgroundCard,
            borderColor: currentColors.border,
          },
        ]}
      >
        <CalendarDays size={scale(64)} color={currentColors.emptyStateIcon} />
        <TextDefault
          style={[
            detailsStyles.emptyText,
            { color: currentColors.emptyStateText },
          ]}
        >
          Không tìm thấy chi tiết cuộc hẹn.
        </TextDefault>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            detailsStyles.emptyButton,
            { backgroundColor: currentColors.primary },
          ]}
        >
          <TextDefault
            style={[
              detailsStyles.emptyButtonText,
              { color: currentColors.backgroundCard },
            ]}
          >
            Quay lại
          </TextDefault>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        detailsStyles.safeArea,
        { backgroundColor: currentColors.background },
      ]}
    >
      <Separator height={Platform.OS === "ios" ? scale(55) : scale(10)} />
      <AppointmentDetailHeader
        activityTitle={currentAppointment.activity}
        onBackPress={() => router.back()}
        currentColors={currentColors}
      />
      <ScrollView style={detailsStyles.scrollView}>
        <View style={detailsStyles.content}>
          <AppointmentInfoCard
            appointment={currentAppointment}
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          />
          <Separator height={scale(20)} /> {/* Add separator between cards */}
          <ParticipantsSection
            participants={currentAppointment.participants}
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          />
          <AppointmentActionButtons
            appointment={currentAppointment}
            type={type}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onEdit={handleEdit}
            onCancel={handleCancel}
            currentColors={currentColors}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const detailsStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
    paddingBottom: scale(16),
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: scale(16),
    marginTop: scale(4),
  },
  content: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(24),
    // gap: scale(20), // Use gap for spacing between cards
  },
  card: {
    borderRadius: scale(8),
    padding: scale(24),
    borderWidth: 1,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(20),
  },
  detailIcon: {
    marginRight: scale(12),
  },
  detailLabel: {
    fontSize: scale(14),
    marginBottom: scale(4),
  },
  detailText: {
    fontSize: scale(16),
    fontWeight: "500",
  },
  participantsSection: {
    marginTop: scale(16), // Adjusted to be inside card content
    borderTopWidth: 1,
    paddingTop: scale(24),
  },
  participantsTitle: {
    fontSize: scale(18),
    fontWeight: "600",
    marginBottom: scale(16),
    flexDirection: "row",
    alignItems: "center",
  },
  participantsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(12),
  },
  participantItem: {
    alignItems: "center",
    marginRight: scale(16),
  },
  participantAvatar: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    marginBottom: scale(4),
  },
  participantName: {
    fontSize: scale(14),
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scale(24),
    gap: scale(12),
    borderTopWidth: 1,
    paddingTop: scale(24),
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(8),
    paddingVertical: scale(12),
  },
  buttonIcon: {
    marginRight: scale(8),
  },
  buttonText: {
    fontSize: scale(16),
    fontWeight: "600",
  },
  buttonTextSecondary: {
    fontSize: scale(16),
    fontWeight: "600",
  },
  buttonTextDanger: {
    fontSize: scale(16),
    fontWeight: "600",
  },
  acceptButton: {
    // Styles handled by currentColors
  },
  declineButton: {
    borderWidth: 1,
  },
  editButton: {
    // Styles handled by currentColors
  },
  cancelButton: {
    borderWidth: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: scale(24),
    borderRadius: scale(8),
    margin: scale(24),
    borderWidth: 1, // Add border to empty state card
  },
  emptyText: {
    fontSize: scale(16),
    marginTop: scale(16),
    textAlign: "center",
  },
  emptyButton: {
    marginTop: scale(20),
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
  },
  emptyButtonText: {
    fontSize: scale(16),
    fontWeight: "600",
  },
});
