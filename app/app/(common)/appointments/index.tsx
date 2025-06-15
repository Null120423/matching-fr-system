import Loading from "@/components/@core/loading"; // Import Loading component
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default"; // Sử dụng TextDefault
import { Colors } from "@/constants/Colors"; // Import Colors
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme
import { scale } from "@/helper/helpers";
import { fetchAppointments } from "@/services/appointments"; // Import fetchAppointments API
import { router } from "expo-router";
import {
  Bell,
  Calendar,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Clock,
  MapPin,
  XCircle,
} from "lucide-react-native";
import React, { useEffect, useState } from "react"; // Import useEffect
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

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

// Define Appointment Type
interface Appointment {
  id: string;
  from?: string; // For received
  to?: string; // For sent
  with?: string; // For upcoming/history
  activity: string;
  time: string;
  status?: "pending" | "accepted" | "declined"; // For received/sent/history
  location: string;
  avatar: string;
}

type AppointmentType = "received" | "sent" | "upcoming" | "history";

// -----------------------------------------------------
// Component con: AppointmentTabs
// -----------------------------------------------------
interface AppointmentTabsProps {
  activeTab: AppointmentType;
  setActiveTab: (tab: AppointmentType) => void;
  currentColors: any;
}

function AppointmentTabs({
  activeTab,
  setActiveTab,
  currentColors,
}: AppointmentTabsProps) {
  const tabs = [
    { key: "received", label: "Lời mời nhận được" },
    { key: "sent", label: "Lời mời đã gửi" },
    { key: "upcoming", label: "Lịch hẹn sắp tới" },
    { key: "history", label: "Lịch sử cuộc hẹn" },
  ];

  return (
    <View
      style={[
        appointmentsStyles.tabsContainer,
        { borderBottomColor: currentColors.border },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={appointmentsStyles.tabsScrollView}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              appointmentsStyles.tabButton,
              activeTab === tab.key && {
                borderBottomColor: currentColors.tabUnderline,
              },
            ]}
            onPress={() => setActiveTab(tab.key as AppointmentType)}
          >
            <TextDefault
              style={[
                appointmentsStyles.tabButtonText,
                activeTab === tab.key
                  ? { color: currentColors.tabActive }
                  : { color: currentColors.tabInactive },
              ]}
            >
              {tab.label}
            </TextDefault>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// -----------------------------------------------------
// Component con: AppointmentCard
// -----------------------------------------------------
interface AppointmentCardProps {
  appointment: Appointment;
  type: AppointmentType;
  currentColors: any;
  shadowStyle: any;
}

function AppointmentCard({
  appointment,
  type,
  currentColors,
  shadowStyle,
}: AppointmentCardProps) {
  const getParticipantName = () => {
    if (type === "sent") return appointment.to;
    if (type === "received") return appointment.from;
    return appointment.with; // For upcoming and history
  };

  const getStatusBadge = () => {
    if (appointment.status === "pending") {
      return (
        <View
          style={[
            appointmentsStyles.pendingStatus,
            { backgroundColor: currentColors.statusPendingBg },
          ]}
        >
          <Bell
            size={scale(14)}
            color={currentColors.statusPendingText}
            style={appointmentsStyles.statusIcon}
          />
          <TextDefault
            style={[
              appointmentsStyles.pendingStatusText,
              { color: currentColors.statusPendingText },
            ]}
          >
            Đang chờ
          </TextDefault>
        </View>
      );
    }
    if (appointment.status === "accepted") {
      return (
        <View
          style={[
            appointmentsStyles.acceptedStatus,
            { backgroundColor: currentColors.statusAcceptedBg },
          ]}
        >
          <CheckCircle
            size={scale(14)}
            color={currentColors.statusAcceptedText}
            style={appointmentsStyles.statusIcon}
          />
          <TextDefault
            style={[
              appointmentsStyles.acceptedStatusText,
              { color: currentColors.statusAcceptedText },
            ]}
          >
            Đã chấp nhận
          </TextDefault>
        </View>
      );
    }
    if (appointment.status === "declined") {
      return (
        <View
          style={[
            appointmentsStyles.declinedStatus,
            { backgroundColor: currentColors.statusDeclinedBg },
          ]}
        >
          <XCircle
            size={scale(14)}
            color={currentColors.statusDeclinedText}
            style={appointmentsStyles.statusIcon}
          />
          <TextDefault
            style={[
              appointmentsStyles.declinedStatusText,
              { color: currentColors.statusDeclinedText },
            ]}
          >
            Đã từ chối
          </TextDefault>
        </View>
      );
    }
    if (type === "upcoming") {
      return (
        <View
          style={[
            appointmentsStyles.upcomingStatus,
            { backgroundColor: currentColors.statusUpcomingBg },
          ]}
        >
          <Calendar
            size={scale(14)}
            color={currentColors.statusUpcomingText}
            style={appointmentsStyles.statusIcon}
          />
          <TextDefault
            style={[
              appointmentsStyles.upcomingStatusText,
              { color: currentColors.statusUpcomingText },
            ]}
          >
            Sắp tới
          </TextDefault>
        </View>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity
      style={[
        appointmentsStyles.appointmentCard,
        shadowStyle,
        {
          backgroundColor: currentColors.cardBackground,
          borderColor: currentColors.cardBorder,
        },
      ]}
      onPress={() => {
        router.push({
          pathname: "/appointments/detail",
          params: { id: appointment.id, type },
        });
      }}
    >
      <View
        style={[
          appointmentsStyles.cardAvatarPlaceholder,
          { backgroundColor: currentColors.cardAvatarPlaceholder },
        ]}
      >
        <TextDefault
          style={[
            appointmentsStyles.cardAvatarPlaceholderText,
            { color: currentColors.cardAvatarPlaceholderText },
          ]}
        >
          {getParticipantName() && getParticipantName()!.length > 0
            ? getParticipantName()![0]
            : "?"}
        </TextDefault>
      </View>
      {/* Details */}
      <View style={appointmentsStyles.cardDetails}>
        <TextDefault
          style={[
            appointmentsStyles.cardTitle,
            { color: currentColors.cardTitle },
          ]}
        >
          {appointment.activity}
        </TextDefault>
        <TextDefault
          style={[
            appointmentsStyles.cardSubtitle,
            { color: currentColors.cardSubtitle },
          ]}
        >
          {type === "received" && `Từ: ${appointment.from}`}
          {type === "sent" && `Đến: ${appointment.to}`}
          {type === "upcoming" && `Với: ${appointment.with}`}
          {type === "history" && `Với: ${appointment.with}`}
        </TextDefault>
        <View style={appointmentsStyles.cardInfoRow}>
          <Clock
            size={scale(14)}
            color={currentColors.infoIcon}
            style={appointmentsStyles.infoIcon}
          />
          <TextDefault
            style={[
              appointmentsStyles.cardInfoText,
              { color: currentColors.cardInfoText },
            ]}
          >
            {appointment.time}
          </TextDefault>
        </View>
        <View style={appointmentsStyles.cardInfoRow}>
          <MapPin
            size={scale(14)}
            color={currentColors.infoIcon}
            style={appointmentsStyles.infoIcon}
          />
          <TextDefault
            style={[
              appointmentsStyles.cardInfoText,
              { color: currentColors.cardInfoText },
            ]}
          >
            {appointment.location}
          </TextDefault>
        </View>
      </View>

      {/* Status / Actions */}
      <View style={appointmentsStyles.cardStatusContainer}>
        {getStatusBadge()}
        <ChevronRight size={scale(20)} color={currentColors.border} />
      </View>
    </TouchableOpacity>
  );
}

// -----------------------------------------------------
// Component con: AppointmentList
// -----------------------------------------------------
interface AppointmentListProps {
  appointments: Appointment[];
  type: AppointmentType;
  isLoading: boolean;
  currentColors: any;
  shadowStyle: any;
}

function AppointmentList({
  appointments,
  type,
  isLoading,
  currentColors,
  shadowStyle,
}: AppointmentListProps) {
  if (isLoading) {
    return (
      <View
        style={[
          appointmentsStyles.emptyState,
          {
            backgroundColor: currentColors.backgroundCard,
            borderColor: currentColors.cardBorder,
          },
        ]}
      >
        <Loading />
        <TextDefault
          style={{ color: currentColors.emptyStateText, marginTop: scale(10) }}
        >
          Đang tải cuộc hẹn...
        </TextDefault>
      </View>
    );
  }

  if (appointments.length === 0) {
    let emptyText = "";
    if (type === "received") emptyText = "Không có lời mời nào.";
    else if (type === "sent") emptyText = "Bạn chưa gửi lời mời nào.";
    else if (type === "upcoming") emptyText = "Không có lịch hẹn sắp tới.";
    else if (type === "history") emptyText = "Chưa có lịch sử cuộc hẹn.";

    return (
      <View
        style={[
          appointmentsStyles.emptyState,
          {
            backgroundColor: currentColors.backgroundCard,
            borderColor: currentColors.cardBorder,
          },
        ]}
      >
        <ClipboardList size={scale(50)} color={currentColors.emptyStateIcon} />
        <TextDefault
          style={[
            appointmentsStyles.emptyStateText,
            { color: currentColors.emptyStateText },
          ]}
        >
          {emptyText}
        </TextDefault>
      </View>
    );
  }

  return (
    <View style={appointmentsStyles.listContainer}>
      {appointments.map((app) => (
        <AppointmentCard
          key={app.id}
          appointment={app}
          type={type}
          currentColors={currentColors}
          shadowStyle={shadowStyle}
        />
      ))}
    </View>
  );
}

// -----------------------------------------------------
// Main Component: Appointments
// -----------------------------------------------------
export default function Appointments() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const shadowStyle = getShadowStyle(currentColors);

  const [activeTab, setActiveTab] = useState<AppointmentType>("received");
  const [receivedAppointments, setReceivedAppointments] = useState<
    Appointment[]
  >([]);
  const [sentAppointments, setSentAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [historyAppointments, setHistoryAppointments] = useState<Appointment[]>(
    []
  );

  const [isLoadingReceived, setIsLoadingReceived] = useState(true);
  const [isLoadingSent, setIsLoadingSent] = useState(true);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Fetch data for the active tab
  useEffect(() => {
    const loadAppointments = async () => {
      let data: Appointment[] = [];
      try {
        if (activeTab === "received") {
          setIsLoadingReceived(true);
          data = (await fetchAppointments("received")) as Appointment[];
          setReceivedAppointments(data);
        } else if (activeTab === "sent") {
          setIsLoadingSent(true);
          data = (await fetchAppointments("sent")) as Appointment[];
          setSentAppointments(data);
        } else if (activeTab === "upcoming") {
          setIsLoadingUpcoming(true);
          data = (await fetchAppointments("upcoming")) as Appointment[];
          setUpcomingAppointments(data);
        } else if (activeTab === "history") {
          setIsLoadingHistory(true);
          data = (await fetchAppointments("history")) as Appointment[];
          setHistoryAppointments(data);
        }
      } catch (error) {
        console.error(`Failed to fetch ${activeTab} appointments:`, error);
        // Handle error (e.g., show an alert)
      } finally {
        if (activeTab === "received") setIsLoadingReceived(false);
        else if (activeTab === "sent") setIsLoadingSent(false);
        else if (activeTab === "upcoming") setIsLoadingUpcoming(false);
        else if (activeTab === "history") setIsLoadingHistory(false);
      }
    };

    loadAppointments();
  }, [activeTab]); // Re-fetch when activeTab changes

  const getCurrentAppointments = () => {
    if (activeTab === "received") return receivedAppointments;
    if (activeTab === "sent") return sentAppointments;
    if (activeTab === "upcoming") return upcomingAppointments;
    if (activeTab === "history") return historyAppointments;
    return [];
  };

  const getIsLoadingCurrentTab = () => {
    if (activeTab === "received") return isLoadingReceived;
    if (activeTab === "sent") return isLoadingSent;
    if (activeTab === "upcoming") return isLoadingUpcoming;
    if (activeTab === "history") return isLoadingHistory;
    return false;
  };

  return (
    <View
      style={[
        appointmentsStyles.safeArea,
        { backgroundColor: currentColors.background },
      ]}
    >
      <Separator height={Platform.OS === "ios" ? scale(55) : scale(10)} />
      <AppointmentTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentColors={currentColors}
      />

      <ScrollView style={appointmentsStyles.scrollView}>
        <View style={appointmentsStyles.content}>
          <AppointmentList
            appointments={getCurrentAppointments()}
            type={activeTab}
            isLoading={getIsLoadingCurrentTab()}
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const appointmentsStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
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
    fontSize: scale(14),
    marginTop: scale(4),
  },
  tabsContainer: {
    borderBottomWidth: 1,
    marginBottom: scale(16),
  },
  tabsScrollView: {
    paddingHorizontal: scale(16),
    alignItems: "center",
  },
  tabButton: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginHorizontal: scale(4),
  },
  tabButtonText: {
    fontSize: scale(14),
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(24),
  },
  listContainer: {
    gap: scale(12),
  },
  appointmentCard: {
    flexDirection: "row",
    borderRadius: scale(8),
    padding: scale(16),
    borderWidth: 1,
    alignItems: "center",
  },
  cardAvatarPlaceholder: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    marginRight: scale(12),
    justifyContent: "center",
    alignItems: "center",
  },
  cardAvatarPlaceholderText: {
    fontSize: scale(20),
    fontWeight: "bold",
  },
  cardDetails: {
    flex: 1,
    marginRight: scale(8),
  },
  cardTitle: {
    fontSize: scale(16),
    fontWeight: "600",
    marginBottom: scale(4),
  },
  cardSubtitle: {
    fontSize: scale(13),
    marginBottom: scale(4),
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(2),
  },
  infoIcon: {
    marginRight: scale(4),
  },
  cardInfoText: {
    fontSize: scale(12),
  },
  cardStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  statusIcon: {
    marginRight: scale(4),
  },
  pendingStatus: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: scale(4),
    paddingVertical: scale(4),
    paddingHorizontal: scale(8),
  },
  pendingStatusText: {
    fontSize: scale(12),
    fontWeight: "500",
  },
  acceptedStatus: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: scale(4),
    paddingVertical: scale(4),
    paddingHorizontal: scale(8),
  },
  acceptedStatusText: {
    fontSize: scale(12),
    fontWeight: "500",
  },
  declinedStatus: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: scale(4),
    paddingVertical: scale(4),
    paddingHorizontal: scale(8),
  },
  declinedStatusText: {
    fontSize: scale(12),
    fontWeight: "500",
  },
  upcomingStatus: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: scale(4),
    paddingVertical: scale(4),
    paddingHorizontal: scale(8),
  },
  upcomingStatusText: {
    fontSize: scale(12),
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scale(40),
    borderRadius: scale(8),
    borderWidth: 1,
  },
  emptyStateText: {
    fontSize: scale(16),
    marginTop: scale(16),
    textAlign: "center",
  },
});
