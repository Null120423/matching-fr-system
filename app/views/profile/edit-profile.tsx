"use client";

import { ButtonOutlined, ButtonPrimary } from "@/components/@core/button";
import Loading from "@/components/@core/loading";
import DatePicker from "@/components/@core/Picker/DatePicker";
import FreeTimePicker from "@/components/@core/Picker/FreeTimePicker";
import RangePicker from "@/components/@core/Picker/RangerPicker";
import TextDefault from "@/components/@core/text-default";
import TimePicker from "@/components/@core/TimePicker";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import type { GENDER_CONST } from "@/dto";
import { normalize, scale } from "@/helper/helpers";
import useProfileMe from "@/services/hooks/user/useProfileMe";
import useUpdateProfile from "@/services/hooks/user/useUpdateProfile";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { Clock, Heart, MapPin, Plus, Save, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EditableUserData {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: keyof typeof GENDER_CONST;
  location: string;
  bio: string;
  interests: string[];
  avatarUrl: string;
  minAgePreference: number;
  maxAgePreference: number;
  preferredGender: keyof typeof GENDER_CONST;
  activities: string[];
  availableTimeSlots: string[];
  // New fields
  specificTimes: string[];
  freeTimes: any[];
  workingHours: { start: string; end: string };
  preferredMeetingTimes: string[];
  relationshipGoals: string[];
  lifestyle: string[];
  education: string;
  occupation: string;
  languages: string[];
}

// Component: AvatarEditSection
interface AvatarEditSectionProps {
  avatarUri: string;
  onChooseAvatar: () => void;
  currentColors: any;
}

function AvatarEditSection({
  avatarUri,
  onChooseAvatar,
  currentColors,
}: AvatarEditSectionProps) {
  return (
    <View style={editProfileStyles.avatarSection}>
      <Image
        source={{ uri: avatarUri }}
        style={[
          editProfileStyles.editAvatarImage,
          { borderColor: currentColors.secondary },
        ]}
      />
      <TouchableOpacity
        style={[
          editProfileStyles.changeAvatarButton,
          { backgroundColor: currentColors.backgroundLightBlue },
        ]}
        onPress={onChooseAvatar}
      >
        <TextDefault
          style={[
            editProfileStyles.changeAvatarButtonText,
            { color: currentColors.info },
          ]}
        >
          Thay đổi ảnh đại diện
        </TextDefault>
      </TouchableOpacity>
    </View>
  );
}

// Component: BasicInfoSection
interface BasicInfoSectionProps {
  state: any;
  handleChangeState: (key: string, value: any) => void;
  currentColors: any;
}

function BasicInfoSection({
  state,
  handleChangeState,
  currentColors,
}: BasicInfoSectionProps) {
  return (
    <View
      style={[
        editProfileStyles.formCard,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
      <TextDefault
        style={[editProfileStyles.sectionTitle, { color: currentColors.text }]}
      >
        Thông tin cơ bản
      </TextDefault>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Họ
        </TextDefault>
        <TextInput
          style={[
            editProfileStyles.input,
            {
              borderColor: currentColors.border,
              color: currentColors.text,
              backgroundColor: currentColors.backgroundCard,
            },
          ]}
          value={state.firstName}
          onChangeText={(val) => handleChangeState("firstName", val)}
          placeholderTextColor={currentColors.textLight}
          placeholder="Nhập họ của bạn"
        />
      </View>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Tên
        </TextDefault>
        <TextInput
          style={[
            editProfileStyles.input,
            {
              borderColor: currentColors.border,
              color: currentColors.text,
              backgroundColor: currentColors.backgroundCard,
            },
          ]}
          value={state.lastName}
          onChangeText={(val) => handleChangeState("lastName", val)}
          placeholderTextColor={currentColors.textLight}
          placeholder="Nhập tên của bạn"
        />
      </View>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Email
        </TextDefault>
        <TextInput
          style={[
            editProfileStyles.input,
            {
              borderColor: currentColors.border,
              color: currentColors.text,
              backgroundColor: currentColors.backgroundCard,
            },
          ]}
          value={state.email}
          onChangeText={(val) => handleChangeState("email", val)}
          placeholderTextColor={currentColors.textLight}
          placeholder="Nhập email của bạn"
          keyboardType="email-address"
        />
      </View>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Giới tính
        </TextDefault>
        <View
          style={[
            editProfileStyles.pickerContainer,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.backgroundCard,
            },
          ]}
        >
          <Picker
            selectedValue={state.gender}
            onValueChange={(itemValue) =>
              handleChangeState("gender", itemValue)
            }
            style={[editProfileStyles.picker, { color: currentColors.text }]}
          >
            <Picker.Item label="Chọn giới tính" value="" />
            <Picker.Item label="Nam" value="male" />
            <Picker.Item label="Nữ" value="female" />
            <Picker.Item label="Khác" value="other" />
          </Picker>
        </View>
      </View>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Vị trí
        </TextDefault>
        <View style={editProfileStyles.inputWithIcon}>
          <MapPin
            size={scale(20)}
            color={currentColors.textLight}
            style={editProfileStyles.inputIcon}
          />
          <TextInput
            style={[
              editProfileStyles.input,
              editProfileStyles.inputWithIconText,
              {
                borderColor: currentColors.border,
                color: currentColors.text,
                backgroundColor: currentColors.backgroundCard,
              },
            ]}
            value={state.location}
            onChangeText={(val) => handleChangeState("location", val)}
            placeholderTextColor={currentColors.textLight}
            placeholder="Nhập địa chỉ của bạn"
          />
        </View>
      </View>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Giới thiệu bản thân
        </TextDefault>
        <TextInput
          style={[
            editProfileStyles.input,
            editProfileStyles.textArea,
            {
              borderColor: currentColors.border,
              color: currentColors.text,
              backgroundColor: currentColors.backgroundCard,
            },
          ]}
          value={state.bio}
          onChangeText={(val) => handleChangeState("bio", val)}
          multiline
          numberOfLines={4}
          placeholderTextColor={currentColors.textLight}
          placeholder="Viết vài dòng về bản thân bạn..."
        />
      </View>
    </View>
  );
}

// Component: InterestsSection
interface InterestsSectionProps {
  state: any;
  handleChangeState: (key: string, value: any) => void;
  handleAddInterest: () => void;
  handleRemoveInterest: (interest: string) => void;
  currentColors: any;
}

function InterestsSection({
  state,
  handleChangeState,
  handleAddInterest,
  handleRemoveInterest,
  currentColors,
}: InterestsSectionProps) {
  return (
    <View
      style={[
        editProfileStyles.formCard,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
      <TextDefault
        style={[editProfileStyles.sectionTitle, { color: currentColors.text }]}
      >
        Sở thích & Hoạt động
      </TextDefault>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Sở thích
        </TextDefault>
        <View style={editProfileStyles.interestsInputContainer}>
          <TextInput
            style={[
              editProfileStyles.input,
              editProfileStyles.newInterestInput,
              {
                borderColor: currentColors.border,
                color: currentColors.text,
                backgroundColor: currentColors.backgroundCard,
              },
            ]}
            placeholder="Thêm sở thích mới..."
            value={state.newInterest}
            onChangeText={(val) => handleChangeState("newInterest", val)}
            onSubmitEditing={handleAddInterest}
            placeholderTextColor={currentColors.textLight}
          />
          <TouchableOpacity
            onPress={handleAddInterest}
            style={[
              editProfileStyles.addInterestButton,
              { backgroundColor: currentColors.info },
            ]}
          >
            <Plus size={scale(20)} color={currentColors.backgroundCard} />
          </TouchableOpacity>
        </View>
        <View style={editProfileStyles.interestsTagsContainer}>
          {(state.interests || []).map((interest: string, index: number) => (
            <View
              key={index}
              style={[
                editProfileStyles.interestTag,
                { backgroundColor: currentColors.backgroundLightBlue },
              ]}
            >
              <TextDefault
                style={[
                  editProfileStyles.interestTagText,
                  { color: currentColors.info },
                ]}
              >
                {interest}
              </TextDefault>
              <TouchableOpacity
                onPress={() => handleRemoveInterest(interest)}
                style={editProfileStyles.removeInterestButton}
              >
                <X size={scale(14)} color={currentColors.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Hoạt động yêu thích
        </TextDefault>
        <View
          style={[
            editProfileStyles.pickerContainer,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.backgroundCard,
            },
          ]}
        >
          <Picker
            selectedValue={state.selectedActivity}
            onValueChange={(itemValue) => {
              if (itemValue && !state.activities.includes(itemValue)) {
                handleChangeState("activities", [
                  ...(state.activities || []),
                  itemValue,
                ]);
              }
            }}
            style={[editProfileStyles.picker, { color: currentColors.text }]}
          >
            <Picker.Item label="Chọn hoạt động" value="" />
            <Picker.Item label="Thể thao" value="sports" />
            <Picker.Item label="Du lịch" value="travel" />
            <Picker.Item label="Âm nhạc" value="music" />
            <Picker.Item label="Điện ảnh" value="movies" />
            <Picker.Item label="Đọc sách" value="reading" />
            <Picker.Item label="Nấu ăn" value="cooking" />
            <Picker.Item label="Nhiếp ảnh" value="photography" />
            <Picker.Item label="Yoga" value="yoga" />
            <Picker.Item label="Gym" value="gym" />
            <Picker.Item label="Khiêu vũ" value="dancing" />
          </Picker>
        </View>
        <View style={editProfileStyles.interestsTagsContainer}>
          {(state.activities || []).map((activity: string, index: number) => (
            <View
              key={index}
              style={[
                editProfileStyles.interestTag,
                { backgroundColor: currentColors.success + "20" },
              ]}
            >
              <TextDefault
                style={[
                  editProfileStyles.interestTagText,
                  { color: currentColors.success },
                ]}
              >
                {activity}
              </TextDefault>
              <TouchableOpacity
                onPress={() => {
                  const newActivities = state.activities.filter(
                    (a: string) => a !== activity
                  );
                  handleChangeState("activities", newActivities);
                }}
                style={editProfileStyles.removeInterestButton}
              >
                <X size={scale(14)} color={currentColors.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// Component: TimePreferencesSection
interface TimePreferencesSectionProps {
  state: any;
  handleChangeState: (key: string, value: any) => void;
  currentColors: any;
}

function TimePreferencesSection({
  state,
  handleChangeState,
  currentColors,
}: TimePreferencesSectionProps) {
  return (
    <View
      style={[
        editProfileStyles.formCard,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
      <TextDefault
        style={[editProfileStyles.sectionTitle, { color: currentColors.text }]}
      >
        <Clock size={scale(18)} color={currentColors.text} /> Thời gian & Lịch
        trình
      </TextDefault>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Ngày sinh
        </TextDefault>
        <DatePicker
          selectedDate={state.dateOfBirth || new Date()}
          onDateChange={(date: any) => handleChangeState("dateOfBirth", date)}
          title="Chọn ngày sinh"
        />
      </View>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Thời gian cụ thể có thể gặp
        </TextDefault>
        <TimePicker
          selectedTimes={state.specificTimes || []}
          onTimesChange={(times: any) =>
            handleChangeState("specificTimes", times)
          }
          title="Chọn thời gian cụ thể"
        />
      </View>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Thời gian rảnh trong ngày
        </TextDefault>
        <FreeTimePicker
          freeTimes={state.freeTimes || []}
          onFreeTimesChange={(times: any) =>
            handleChangeState("freeTimes", times)
          }
          title="Chọn thời gian rảnh"
        />
      </View>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Thời gian làm việc ưa thích
        </TextDefault>
        <View
          style={[
            editProfileStyles.pickerContainer,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.backgroundCard,
            },
          ]}
        >
          <Picker
            selectedValue={state.workingHoursPreference}
            onValueChange={(itemValue) =>
              handleChangeState("workingHoursPreference", itemValue)
            }
            style={[editProfileStyles.picker, { color: currentColors.text }]}
          >
            <Picker.Item label="Chọn thời gian làm việc" value="" />
            <Picker.Item
              label="Sáng sớm (6:00 - 10:00)"
              value="early_morning"
            />
            <Picker.Item label="Buổi sáng (8:00 - 12:00)" value="morning" />
            <Picker.Item label="Buổi trưa (12:00 - 16:00)" value="afternoon" />
            <Picker.Item label="Buổi chiều (16:00 - 20:00)" value="evening" />
            <Picker.Item label="Buổi tối (20:00 - 24:00)" value="night" />
            <Picker.Item label="Linh hoạt" value="flexible" />
          </Picker>
        </View>
      </View>
    </View>
  );
}

// Component: PreferencesSection
interface PreferencesSectionProps {
  state: any;
  handleChangeState: (key: string, value: any) => void;
  currentColors: any;
}

function PreferencesSection({
  state,
  handleChangeState,
  currentColors,
}: PreferencesSectionProps) {
  return (
    <View
      style={[
        editProfileStyles.formCard,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
      <TextDefault
        style={[editProfileStyles.sectionTitle, { color: currentColors.text }]}
      >
        <Heart size={scale(18)} color={currentColors.text} /> Sở thích hẹn hò
      </TextDefault>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Độ tuổi mong muốn
        </TextDefault>
        <RangePicker
          minValue={state.minAgePreference || 18}
          maxValue={state.maxAgePreference || 35}
          onRangeChange={(min: any, max: any) => {
            handleChangeState("minAgePreference", min);
            handleChangeState("maxAgePreference", max);
          }}
          min={18}
          max={60}
          title="Chọn độ tuổi mong muốn"
        />
      </View>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Giới tính mong muốn
        </TextDefault>
        <View
          style={[
            editProfileStyles.pickerContainer,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.backgroundCard,
            },
          ]}
        >
          <Picker
            selectedValue={state.preferredGender}
            onValueChange={(itemValue) =>
              handleChangeState("preferredGender", itemValue)
            }
            style={[editProfileStyles.picker, { color: currentColors.text }]}
          >
            <Picker.Item label="Chọn giới tính mong muốn" value="" />
            <Picker.Item label="Nam" value="male" />
            <Picker.Item label="Nữ" value="female" />
            <Picker.Item label="Tất cả" value="all" />
          </Picker>
        </View>
      </View>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Mục tiêu mối quan hệ
        </TextDefault>
        <View
          style={[
            editProfileStyles.pickerContainer,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.backgroundCard,
            },
          ]}
        >
          <Picker
            selectedValue={state.relationshipGoal}
            onValueChange={(itemValue) => {
              if (itemValue && !state.relationshipGoals?.includes(itemValue)) {
                handleChangeState("relationshipGoals", [
                  ...(state.relationshipGoals || []),
                  itemValue,
                ]);
              }
            }}
            style={[editProfileStyles.picker, { color: currentColors.text }]}
          >
            <Picker.Item label="Chọn mục tiêu" value="" />
            <Picker.Item label="Tìm hiểu" value="casual" />
            <Picker.Item label="Hẹn hò nghiêm túc" value="serious" />
            <Picker.Item label="Kết hôn" value="marriage" />
            <Picker.Item label="Bạn bè" value="friendship" />
            <Picker.Item label="Mạng lưới xã hội" value="networking" />
          </Picker>
        </View>
        <View style={editProfileStyles.interestsTagsContainer}>
          {(state.relationshipGoals || []).map(
            (goal: string, index: number) => (
              <View
                key={index}
                style={[
                  editProfileStyles.interestTag,
                  { backgroundColor: currentColors.warning + "20" },
                ]}
              >
                <TextDefault
                  style={[
                    editProfileStyles.interestTagText,
                    { color: currentColors.warning },
                  ]}
                >
                  {goal}
                </TextDefault>
                <TouchableOpacity
                  onPress={() => {
                    const newGoals = state.relationshipGoals.filter(
                      (g: string) => g !== goal
                    );
                    handleChangeState("relationshipGoals", newGoals);
                  }}
                  style={editProfileStyles.removeInterestButton}
                >
                  <X size={scale(14)} color={currentColors.danger} />
                </TouchableOpacity>
              </View>
            )
          )}
        </View>
      </View>
    </View>
  );
}

// Component: AdditionalInfoSection
interface AdditionalInfoSectionProps {
  state: any;
  handleChangeState: (key: string, value: any) => void;
  currentColors: any;
}

function AdditionalInfoSection({
  state,
  handleChangeState,
  currentColors,
}: AdditionalInfoSectionProps) {
  return (
    <View
      style={[
        editProfileStyles.formCard,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
      <TextDefault
        style={[editProfileStyles.sectionTitle, { color: currentColors.text }]}
      >
        Thông tin bổ sung
      </TextDefault>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Trình độ học vấn
        </TextDefault>
        <View
          style={[
            editProfileStyles.pickerContainer,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.backgroundCard,
            },
          ]}
        >
          <Picker
            selectedValue={state.education}
            onValueChange={(itemValue) =>
              handleChangeState("education", itemValue)
            }
            style={[editProfileStyles.picker, { color: currentColors.text }]}
          >
            <Picker.Item label="Chọn trình độ học vấn" value="" />
            <Picker.Item label="Trung học phổ thông" value="high_school" />
            <Picker.Item label="Cao đẳng" value="college" />
            <Picker.Item label="Đại học" value="university" />
            <Picker.Item label="Thạc sĩ" value="master" />
            <Picker.Item label="Tiến sĩ" value="phd" />
            <Picker.Item label="Khác" value="other" />
          </Picker>
        </View>
      </View>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Nghề nghiệp
        </TextDefault>
        <TextInput
          style={[
            editProfileStyles.input,
            {
              borderColor: currentColors.border,
              color: currentColors.text,
              backgroundColor: currentColors.backgroundCard,
            },
          ]}
          value={state.occupation}
          onChangeText={(val) => handleChangeState("occupation", val)}
          placeholderTextColor={currentColors.textLight}
          placeholder="Nhập nghề nghiệp của bạn"
        />
      </View>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Lối sống
        </TextDefault>
        <View
          style={[
            editProfileStyles.pickerContainer,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.backgroundCard,
            },
          ]}
        >
          <Picker
            selectedValue={state.selectedLifestyle}
            onValueChange={(itemValue) => {
              if (itemValue && !state.lifestyle?.includes(itemValue)) {
                handleChangeState("lifestyle", [
                  ...(state.lifestyle || []),
                  itemValue,
                ]);
              }
            }}
            style={[editProfileStyles.picker, { color: currentColors.text }]}
          >
            <Picker.Item label="Chọn lối sống" value="" />
            <Picker.Item label="Tích cực" value="active" />
            <Picker.Item label="Thư giãn" value="relaxed" />
            <Picker.Item label="Phiêu lưu" value="adventurous" />
            <Picker.Item label="Gia đình" value="family_oriented" />
            <Picker.Item label="Sự nghiệp" value="career_focused" />
            <Picker.Item label="Sáng tạo" value="creative" />
            <Picker.Item label="Xã hội" value="social" />
            <Picker.Item label="Nội tâm" value="introverted" />
          </Picker>
        </View>
        <View style={editProfileStyles.interestsTagsContainer}>
          {(state.lifestyle || []).map((style: string, index: number) => (
            <View
              key={index}
              style={[
                editProfileStyles.interestTag,
                { backgroundColor: currentColors.info + "20" },
              ]}
            >
              <TextDefault
                style={[
                  editProfileStyles.interestTagText,
                  { color: currentColors.info },
                ]}
              >
                {style}
              </TextDefault>
              <TouchableOpacity
                onPress={() => {
                  const newLifestyle = state.lifestyle.filter(
                    (s: string) => s !== style
                  );
                  handleChangeState("lifestyle", newLifestyle);
                }}
                style={editProfileStyles.removeInterestButton}
              >
                <X size={scale(14)} color={currentColors.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// Component: ActionButtons
interface ActionButtonsProps {
  onSave: () => void;
  onCancel: () => void;
  currentColors: any;
  isLoading?: boolean;
}

function ActionButtons({
  onSave,
  onCancel,
  currentColors,
  isLoading = false,
}: ActionButtonsProps) {
  return (
    <View style={editProfileStyles.actionButtonsContainer}>
      <ButtonOutlined
        title="Hủy"
        iconLeft={<X size={scale(24)} color={currentColors.primary} />}
        onPress={onCancel}
        disabled={isLoading}
      />
      <ButtonPrimary
        onPress={onSave}
        title={isLoading ? "Đang lưu..." : "Lưu"}
        iconLeft={<Save size={scale(24)} color={currentColors.text} />}
        disabled={isLoading}
      />
    </View>
  );
}

// Main Component: EditProfileView
export default function EditProfileView() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const { data: user, isLoading, onLoadProfileMe } = useProfileMe();

  const [state, setState] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: new Date(),
    gender: "",
    location: "",
    bio: "",
    interests: [],
    newInterest: "",
    activities: [],
    specificTimes: [],
    freeTimes: [],
    workingHoursPreference: "",
    minAgePreference: 18,
    maxAgePreference: 35,
    preferredGender: "",
    relationshipGoals: [],
    education: "",
    occupation: "",
    lifestyle: [],
    avatarUrl: "https://example.com/default-avatar.png",
  });

  const { onUpdate, isLoading: isLoadingUpdate } = useUpdateProfile();

  const handleChangeState = (key: string, value: any) => {
    setState((prevState: any) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleAddInterest = () => {
    if (
      state?.newInterest?.trim() !== "" &&
      !state?.interests?.includes(state?.newInterest?.trim())
    ) {
      handleChangeState("interests", [
        ...(state?.interests || []),
        state?.newInterest.trim(),
      ]);
      handleChangeState("newInterest", "");
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    const newInterests = state.interests.filter(
      (interest: string) => interest !== interestToRemove
    );
    handleChangeState("interests", newInterests);
  };

  const handleSave = async () => {
    const updatedData: EditableUserData = {
      ...state,
      dateOfBirth: state.dateOfBirth.toISOString(),
      specificTimes: state.specificTimes.map((time: any) => time.toISOString()),
      freeTimes: state.freeTimes.map((time: any) => time.toISOString()),
    };
    await onUpdate(updatedData);
  };

  const handleCancel = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to cancel? Changes will not be saved.",
      [
        { text: "Continue editing", style: "cancel" },
        { text: "Cancel", style: "destructive", onPress: () => router.back() },
      ]
    );
  };

  const handleChooseAvatar = () => {
    Alert.alert("Thay đổi ảnh", "Chức năng chọn ảnh chưa được triển khai.");
  };

  useEffect(() => {
    if (user) {
      setState({
        ...user,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
        interests: user.interests || [],
        activities: user.activities || [],
        specificTimes: user.availableTimeSlots || [],
        freeTimes: [],
        relationshipGoals: [],
        lifestyle: [],
      });
    }
  }, [user]);

  useEffect(() => {
    onLoadProfileMe();
  }, []);

  if (isLoading) {
    return (
      <View
        style={[
          editProfileStyles.safeArea,
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
          Đang tải dữ liệu...
        </TextDefault>
      </View>
    );
  }

  if (!user) {
    return (
      <View
        style={[
          editProfileStyles.safeArea,
          {
            backgroundColor: currentColors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <TextDefault style={{ color: currentColors.text }}>
          Không thể tải hồ sơ để chỉnh sửa.
        </TextDefault>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            editProfileStyles.backButton,
            { backgroundColor: currentColors.primary, marginTop: scale(20) },
          ]}
        >
          <TextDefault style={{ color: currentColors.backgroundCard }}>
            Quay lại
          </TextDefault>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        editProfileStyles.safeArea,
        { backgroundColor: currentColors.background },
      ]}
    >
      <ScrollView style={editProfileStyles.scrollView}>
        <View style={editProfileStyles.content}>
          <AvatarEditSection
            avatarUri={state.avatarUrl}
            onChooseAvatar={handleChooseAvatar}
            currentColors={currentColors}
          />

          <BasicInfoSection
            state={state}
            handleChangeState={handleChangeState}
            currentColors={currentColors}
          />

          <InterestsSection
            state={state}
            handleChangeState={handleChangeState}
            handleAddInterest={handleAddInterest}
            handleRemoveInterest={handleRemoveInterest}
            currentColors={currentColors}
          />

          <TimePreferencesSection
            state={state}
            handleChangeState={handleChangeState}
            currentColors={currentColors}
          />

          <PreferencesSection
            state={state}
            handleChangeState={handleChangeState}
            currentColors={currentColors}
          />

          <AdditionalInfoSection
            state={state}
            handleChangeState={handleChangeState}
            currentColors={currentColors}
          />
        </View>

        <ActionButtons
          onSave={handleSave}
          onCancel={handleCancel}
          currentColors={currentColors}
          isLoading={isLoadingUpdate}
        />
      </ScrollView>
    </View>
  );
}

const editProfileStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(24),
    gap: scale(20),
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: scale(24),
  },
  editAvatarImage: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    borderWidth: scale(3),
    marginBottom: scale(12),
  },
  changeAvatarButton: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(25),
  },
  changeAvatarButtonText: {
    fontSize: scale(14),
    fontWeight: "600",
  },
  formCard: {
    borderRadius: scale(12),
    padding: scale(20),
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: scale(18),
    fontWeight: "bold",
    marginBottom: scale(16),
    flexDirection: "row",
    alignItems: "center",
  },
  formGroup: {
    marginBottom: scale(16),
  },
  label: {
    fontSize: scale(14),
    fontWeight: "600",
    marginBottom: scale(8),
  },
  input: {
    borderWidth: 1,
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: scale(12),
    fontSize: scale(16),
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: scale(12),
    zIndex: 1,
  },
  inputWithIconText: {
    paddingLeft: scale(40),
  },
  textArea: {
    height: scale(100),
    textAlignVertical: "top",
    paddingVertical: scale(12),
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: scale(8),
    overflow: "hidden",
  },
  picker: {
    height: scale(50),
    width: "100%",
  },
  interestsInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(8),
  },
  newInterestInput: {
    flex: 1,
    marginRight: scale(8),
  },
  addInterestButton: {
    borderRadius: scale(8),
    padding: scale(12),
    justifyContent: "center",
    alignItems: "center",
  },
  interestsTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
    marginTop: scale(8),
  },
  interestTag: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: scale(20),
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
  },
  interestTagText: {
    fontSize: scale(14),
    marginRight: scale(6),
    fontWeight: "500",
  },
  removeInterestButton: {
    padding: scale(2),
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(12),
    padding: normalize(20),
    paddingBottom: normalize(50),
  },
  backButton: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(24),
    borderRadius: scale(8),
  },
});
