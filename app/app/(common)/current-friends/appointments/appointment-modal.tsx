import { Activity, Calendar, Clock, MapPin, X } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";

import React from "react";
import ActivityPicker from "./activity-picker";
import AppointmentSummary from "./appointment-summary";
import DurationPicker from "./duration-picker";
import LocationPicker from "./location-picker";
import TimePicker from "./time-picker";

interface AppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  friend: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    username: string;
  };
  onCreateAppointment: (appointment: AppointmentData) => void;
}

export interface AppointmentData {
  toUserId: string;
  activity: string;
  activityType: string;
  date: Date;
  time: string;
  duration: number;
  location: {
    name: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
}

export default function AppointmentModal({
  visible,
  onClose,
  friend,
  onCreateAppointment,
}: AppointmentModalProps) {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  const [currentStep, setCurrentStep] = useState(0);
  const [appointmentData, setAppointmentData] = useState<
    Partial<AppointmentData>
  >({
    toUserId: friend.id,
    status: "pending",
  });

  const steps = [
    { title: "Choose activity", icon: Activity },
    { title: "Choose time", icon: Clock },
    { title: "Choose duration", icon: Calendar },
    { title: "Choose location", icon: MapPin },
    { title: "Confirm", icon: Calendar },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateAppointment = () => {
    if (
      appointmentData.activity &&
      appointmentData.date &&
      appointmentData.time &&
      appointmentData.location
    ) {
      onCreateAppointment(appointmentData as AppointmentData);
      onClose();
      setCurrentStep(0);
      setAppointmentData({ toUserId: friend.id, status: "pending" });
    }
  };

  const updateAppointmentData = (data: Partial<AppointmentData>) => {
    setAppointmentData((prev) => ({ ...prev, ...data }));
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return !!appointmentData.activity;
      case 1:
        return !!appointmentData.date && !!appointmentData.time;
      case 2:
        return !!appointmentData.duration;
      case 3:
        return !!appointmentData.location;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ActivityPicker
            selectedActivity={appointmentData.activity}
            selectedType={appointmentData.activityType}
            onSelect={(activity, type) =>
              updateAppointmentData({ activity, activityType: type })
            }
          />
        );
      case 1:
        return (
          <TimePicker
            selectedDate={appointmentData.date}
            selectedTime={appointmentData.time}
            onSelect={(date: any, time: any) =>
              updateAppointmentData({ date, time })
            }
          />
        );
      case 2:
        return (
          <DurationPicker
            selectedDuration={appointmentData.duration}
            onSelect={(duration) => updateAppointmentData({ duration })}
          />
        );
      case 3:
        return (
          <LocationPicker
            selectedLocation={appointmentData.location}
            onSelect={(location) => updateAppointmentData({ location })}
          />
        );
      case 4:
        return (
          <AppointmentSummary
            appointment={appointmentData as AppointmentData}
            friend={friend}
            onNotesChange={(notes) => updateAppointmentData({ notes })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[
          styles.container,
          { backgroundColor: currentColors.background },
        ]}
      >
        {/* Header */}
        <View
          style={[styles.header, { borderBottomColor: currentColors.border }]}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={currentColors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <TextDefault
              style={[styles.headerTitle, { color: currentColors.text }]}
            >
              Create appointment
            </TextDefault>
            <TextDefault
              style={[
                styles.headerSubtitle,
                { color: currentColors.textSecondary },
              ]}
            >
              with {friend.firstName} {friend.lastName}
            </TextDefault>
          </View>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = isStepComplete(index);

            return (
              <View key={index} style={styles.progressStep}>
                <View
                  style={[
                    styles.progressIcon,
                    {
                      backgroundColor: isActive
                        ? currentColors.primary
                        : isCompleted
                        ? currentColors.success
                        : currentColors.backgroundLightGray,
                    },
                  ]}
                >
                  <Icon
                    size={16}
                    color={
                      isActive || isCompleted
                        ? "white"
                        : currentColors.textSecondary
                    }
                  />
                </View>
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.progressLine,
                      {
                        backgroundColor: isCompleted
                          ? currentColors.success
                          : currentColors.backgroundLightGray,
                      },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>

        {/* Step Title */}
        <View style={styles.stepHeader}>
          <TextDefault
            style={[styles.stepTitle, { color: currentColors.text }]}
          >
            {steps[currentStep].title}
          </TextDefault>
          <TextDefault
            style={[styles.stepCounter, { color: currentColors.textSecondary }]}
          >
            {currentStep + 1} / {steps.length}
          </TextDefault>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStepContent()}
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: currentColors.border }]}>
          <TouchableOpacity
            style={[
              styles.footerButton,
              styles.backButton,
              { backgroundColor: currentColors.backgroundLightGray },
            ]}
            onPress={handleBack}
            disabled={currentStep === 0}
          >
            <TextDefault
              style={[
                styles.backButtonText,
                {
                  color:
                    currentStep === 0
                      ? currentColors.textLight
                      : currentColors.text,
                },
              ]}
            >
              Quay lại
            </TextDefault>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.footerButton,
              styles.nextButton,
              {
                backgroundColor: isStepComplete(currentStep)
                  ? currentColors.primary
                  : currentColors.backgroundLightGray,
              },
            ]}
            onPress={
              currentStep === steps.length - 1
                ? handleCreateAppointment
                : handleNext
            }
            disabled={!isStepComplete(currentStep)}
          >
            <TextDefault
              style={[
                styles.nextButtonText,
                {
                  color: isStepComplete(currentStep)
                    ? "white"
                    : currentColors.textLight,
                },
              ]}
            >
              {currentStep === steps.length - 1 ? "Tạo cuộc hẹn" : "Tiếp tục"}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  closeButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  progressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  progressLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
  },
  stepHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  stepCounter: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    gap: 12,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  backButton: {},
  nextButton: {},
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
