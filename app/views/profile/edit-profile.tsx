import { ButtonOutlined, ButtonPrimary } from "@/components/@core/button";
import Loading from "@/components/@core/loading";
import DatePicker from "@/components/@core/Picker/DatePicker";
import FreeTimePicker from "@/components/@core/Picker/FreeTimePicker";
import RangePicker from "@/components/@core/Picker/RangerPicker";
import GenericModalPicker from "@/components/@core/Picker/Select";
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default";
import TimePicker from "@/components/@core/TimePicker";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import type { GENDER_CONST } from "@/dto";
import { normalize, scale } from "@/helper/helpers";
import useProfileMe from "@/services/hooks/user/useProfileMe";
import useUpdateProfile from "@/services/hooks/user/useUpdateProfile";
import { router } from "expo-router";
import { Clock, Heart, MapPin, Plus, Save, X } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

interface BaseComponentProps {
  currentColors: any;
}

interface AvatarEditSectionProps extends BaseComponentProps {
  avatarUri: string;
  onChooseAvatar: () => void;
}

interface FormSectionProps extends BaseComponentProps {
  state: any;
  handleChangeState: (key: string, value: any) => void;
}

interface InterestsSectionProps extends FormSectionProps {
  handleAddInterest: () => void;
  handleRemoveInterest: (interest: string) => void;
}

interface ActionButtonsProps extends BaseComponentProps {
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Constants
const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
] as const;

const ACTIVITY_OPTIONS = [
  { label: "Sports", value: "sports" },
  { label: "Travel", value: "travel" },
  { label: "Music", value: "music" },
  { label: "Movies", value: "movies" },
  { label: "Reading", value: "reading" },
  { label: "Cooking", value: "cooking" },
  { label: "Photography", value: "photography" },
  { label: "Yoga", value: "yoga" },
  { label: "Gym", value: "gym" },
  { label: "Dancing", value: "dancing" },
] as const;

const RELATIONSHIP_GOALS = [
  { label: "Casual", value: "casual" },
  { label: "Serious dating", value: "serious" },
  { label: "Marriage", value: "marriage" },
  { label: "Friendship", value: "friendship" },
  { label: "Networking", value: "networking" },
] as const;

const EDUCATION_LEVELS = [
  { label: "High School", value: "highschool" },
  { label: "College", value: "college" },
  { label: "University", value: "university" },
  { label: "Master's", value: "masters" },
  { label: "PhD", value: "phd" },
  { label: "Other", value: "other" },
] as const;

const MAJOR_OPTIONS = [
  { label: "IT", value: "IT" },
  { label: "Business", value: "business" },
  { label: "Engineering", value: "engineering" },
  { label: "Medicine", value: "medicine" },
  { label: "Arts", value: "arts" },
  { label: "Other", value: "other" },
] as const;

// Component: AvatarEditSection
const AvatarEditSection = React.memo<AvatarEditSectionProps>(
  ({ avatarUri, onChooseAvatar, currentColors }) => (
    <View style={styles.avatarSection}>
      <Image
        source={{ uri: avatarUri }}
        style={[
          styles.editAvatarImage,
          { borderColor: currentColors.secondary },
        ]}
      />
      <TouchableOpacity
        style={[
          styles.changeAvatarButton,
          { backgroundColor: currentColors.backgroundLightBlue },
        ]}
        onPress={onChooseAvatar}
        activeOpacity={0.7}
      >
        <TextDefault
          style={[styles.changeAvatarButtonText, { color: currentColors.info }]}
        >
          Change Avatar
        </TextDefault>
      </TouchableOpacity>
    </View>
  )
);

// Component: BasicInfoSection
const BasicInfoSection = React.memo<FormSectionProps>(
  ({ state, handleChangeState, currentColors }) => {
    const inputStyle = useMemo(
      () => [
        styles.input,
        {
          borderColor: currentColors.border,
          color: currentColors.text,
          backgroundColor: currentColors.backgroundCard,
        },
      ],
      [currentColors]
    );

    return (
      <View
        style={[
          styles.formCard,
          {
            backgroundColor: currentColors.backgroundCard,
            borderColor: currentColors.border,
          },
        ]}
      >
        <TextDefault
          style={[styles.sectionTitle, { color: currentColors.text }]}
        >
          Basic Information
        </TextDefault>

        <View style={styles.formGroup}>
          <TextDefault style={[styles.label, { color: currentColors.text }]}>
            First Name
          </TextDefault>
          <TextInput
            style={inputStyle}
            value={state.firstName}
            onChangeText={(val) => handleChangeState("firstName", val)}
            placeholderTextColor={currentColors.textLight}
            placeholder="Enter your first name"
          />
        </View>

        <View style={styles.formGroup}>
          <TextDefault style={[styles.label, { color: currentColors.text }]}>
            Last Name
          </TextDefault>
          <TextInput
            style={inputStyle}
            value={state.lastName}
            onChangeText={(val) => handleChangeState("lastName", val)}
            placeholderTextColor={currentColors.textLight}
            placeholder="Enter your last name"
          />
        </View>

        <View style={styles.formGroup}>
          <TextDefault style={[styles.label, { color: currentColors.text }]}>
            Email
          </TextDefault>
          <TextInput
            style={inputStyle}
            value={state.email}
            onChangeText={(val) => handleChangeState("email", val)}
            placeholderTextColor={currentColors.textLight}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <TextDefault style={[styles.label, { color: currentColors.text }]}>
            Gender
          </TextDefault>
          <View
            style={[
              styles.pickerContainer,
              {
                borderColor: currentColors.border,
                backgroundColor: currentColors.backgroundCard,
              },
            ]}
          >
            <GenericModalPicker<string>
              selectedValue={state.gender}
              onValueChange={(itemValue) =>
                handleChangeState("gender", itemValue)
              }
              options={GENDER_OPTIONS.slice()}
              placeholder="Select gender"
              modalTitle="Select Gender"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <TextDefault style={[styles.label, { color: currentColors.text }]}>
            Location
          </TextDefault>
          <View style={styles.inputWithIcon}>
            <MapPin
              size={scale(20)}
              color={currentColors.textLight}
              style={styles.inputIcon}
            />
            <TextInput
              style={[inputStyle, styles.inputWithIconText, { width: "100%" }]}
              value={state.location}
              onChangeText={(val) => handleChangeState("location", val)}
              placeholderTextColor={currentColors.textLight}
              placeholder="Enter your address"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <TextDefault style={[styles.label, { color: currentColors.text }]}>
            Bio
          </TextDefault>
          <TextInput
            style={[inputStyle, styles.textArea]}
            value={state.bio}
            onChangeText={(val) => handleChangeState("bio", val)}
            multiline
            numberOfLines={4}
            placeholderTextColor={currentColors.textLight}
            placeholder="Write a few lines about yourself..."
            textAlignVertical="top"
          />
        </View>
      </View>
    );
  }
);

// Component: InterestsSection
const InterestsSection = React.memo<InterestsSectionProps>(
  ({
    state,
    handleChangeState,
    handleAddInterest,
    handleRemoveInterest,
    currentColors,
  }) => {
    const handleActivitySelect = useCallback(
      (itemValue: string) => {
        if (itemValue && !state.activities?.includes(itemValue)) {
          handleChangeState("activities", [
            ...(state.activities || []),
            itemValue,
          ]);
        }
      },
      [state.activities, handleChangeState]
    );

    const handleRemoveActivity = useCallback(
      (activity: string) => {
        const newActivities =
          state.activities?.filter((a: string) => a !== activity) || [];
        handleChangeState("activities", newActivities);
      },
      [state.activities, handleChangeState]
    );

    return (
      <View
        style={[
          styles.formCard,
          {
            backgroundColor: currentColors.backgroundCard,
            borderColor: currentColors.border,
          },
        ]}
      >
        <TextDefault
          style={[styles.sectionTitle, { color: currentColors.text }]}
        >
          Interests & Activities
        </TextDefault>

        <View style={styles.formGroup}>
          <TextDefault style={[styles.label, { color: currentColors.text }]}>
            Interests
          </TextDefault>
          <View style={styles.interestsInputContainer}>
            <TextInput
              style={[
                styles.input,
                styles.newInterestInput,
                {
                  borderColor: currentColors.border,
                  color: currentColors.text,
                  backgroundColor: currentColors.backgroundCard,
                },
              ]}
              placeholder="Add new interest..."
              value={state.newInterest}
              onChangeText={(val) => handleChangeState("newInterest", val)}
              onSubmitEditing={handleAddInterest}
              placeholderTextColor={currentColors.textLight}
            />
            <TouchableOpacity
              onPress={handleAddInterest}
              style={[
                styles.addInterestButton,
                { backgroundColor: currentColors.info },
              ]}
              activeOpacity={0.7}
            >
              <Plus size={scale(20)} color={currentColors.backgroundCard} />
            </TouchableOpacity>
          </View>
          <View style={styles.interestsTagsContainer}>
            {(state.interests || []).map((interest: string, index: number) => (
              <View
                key={`interest-${index}`}
                style={[
                  styles.interestTag,
                  { backgroundColor: currentColors.backgroundLightBlue },
                ]}
              >
                <TextDefault
                  style={[
                    styles.interestTagText,
                    { color: currentColors.info },
                  ]}
                >
                  {interest}
                </TextDefault>
                <TouchableOpacity
                  onPress={() => handleRemoveInterest(interest)}
                  style={styles.removeInterestButton}
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  <X size={scale(14)} color={currentColors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <TextDefault style={[styles.label, { color: currentColors.text }]}>
            Favorite Activities
          </TextDefault>
          <View
            style={[
              styles.pickerContainer,
              {
                borderColor: currentColors.border,
                backgroundColor: currentColors.backgroundCard,
              },
            ]}
          >
            <GenericModalPicker<string>
              selectedValue=""
              onValueChange={handleActivitySelect}
              options={[...ACTIVITY_OPTIONS]}
              placeholder="Select activity"
              modalTitle="Select Activity"
            />
          </View>
          <View style={styles.interestsTagsContainer}>
            {(state.activities || []).map((activity: string, index: number) => (
              <View
                key={`activity-${index}`}
                style={[
                  styles.interestTag,
                  { backgroundColor: currentColors.success + "20" },
                ]}
              >
                <TextDefault
                  style={[
                    styles.interestTagText,
                    { color: currentColors.success },
                  ]}
                >
                  {activity}
                </TextDefault>
                <TouchableOpacity
                  onPress={() => handleRemoveActivity(activity)}
                  style={styles.removeInterestButton}
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
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
);

// Component: TimePreferencesSection
const TimePreferencesSection = React.memo<FormSectionProps>(
  ({ state, handleChangeState, currentColors }) => (
    <View
      style={[
        styles.formCard,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
      <TextDefault style={[styles.sectionTitle, { color: currentColors.text }]}>
        <Clock size={scale(18)} color={currentColors.text} /> Time & Schedule
      </TextDefault>

      <View style={styles.formGroup}>
        <TextDefault style={[styles.label, { color: currentColors.text }]}>
          Birthday
        </TextDefault>
        <DatePicker
          selectedDate={state.dateOfBirth || new Date()}
          onDateChange={(date: any) => handleChangeState("dateOfBirth", date)}
          title="Select your birthday"
        />
      </View>

      <View style={styles.formGroup}>
        <TextDefault style={[styles.label, { color: currentColors.text }]}>
          Available Times for Activities
        </TextDefault>
        <TimePicker
          selectedTimes={state.specificTimes || []}
          onTimesChange={(times: any) =>
            handleChangeState("specificTimes", times)
          }
          title="Select specific times"
        />
      </View>

      <View style={styles.formGroup}>
        <TextDefault style={[styles.label, { color: currentColors.text }]}>
          Free Times
        </TextDefault>
        <FreeTimePicker
          freeTimes={state.freeTimes || []}
          onFreeTimesChange={(times: any) =>
            handleChangeState("freeTimes", times)
          }
          title="Select free times"
        />
      </View>
    </View>
  )
);

// Component: PreferencesSection
const PreferencesSection = React.memo<FormSectionProps>(
  ({ state, handleChangeState, currentColors }) => (
    <View
      style={[
        styles.formCard,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
      <TextDefault style={[styles.sectionTitle, { color: currentColors.text }]}>
        <Heart size={scale(18)} color={currentColors.text} /> Dating Preferences
      </TextDefault>

      <View style={styles.formGroup}>
        <TextDefault style={[styles.label, { color: currentColors.text }]}>
          Preferred Age Range
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
          title="Select preferred age range"
        />
      </View>

      <View style={styles.formGroup}>
        <TextDefault style={[styles.label, { color: currentColors.text }]}>
          Preferred Gender
        </TextDefault>
        <GenericModalPicker<string>
          selectedValue={state.preferredGender}
          onValueChange={(itemValue) =>
            handleChangeState("preferredGender", itemValue)
          }
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "All", value: "all" },
          ]}
          placeholder="Select gender"
          modalTitle="Select Gender"
        />
      </View>

      <View style={styles.formGroup}>
        <TextDefault style={[styles.label, { color: currentColors.text }]}>
          Relationship Goals
        </TextDefault>
        <GenericModalPicker<string>
          selectedValue={state.relationshipGoal}
          onValueChange={(itemValue) =>
            handleChangeState("relationshipGoal", itemValue)
          }
          options={[...RELATIONSHIP_GOALS]}
          placeholder="Select relationship goal"
          modalTitle="Relationship Goals"
        />
      </View>
    </View>
  )
);

// Component: AdditionalInfoSection
const AdditionalInfoSection = React.memo<FormSectionProps>(
  ({ state, handleChangeState, currentColors }) => (
    <View
      style={[
        styles.formCard,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
      <TextDefault style={[styles.sectionTitle, { color: currentColors.text }]}>
        Additional Information
      </TextDefault>

      <View style={styles.formGroup}>
        <TextDefault style={[styles.label, { color: currentColors.text }]}>
          Education Level
        </TextDefault>
        <GenericModalPicker<string>
          selectedValue={state.educationLevel}
          onValueChange={(itemValue) =>
            handleChangeState("educationLevel", itemValue)
          }
          options={[...EDUCATION_LEVELS]}
          placeholder="Select education level"
          modalTitle="Education Level"
        />
      </View>

      <View style={styles.formGroup}>
        <TextDefault style={[styles.label, { color: currentColors.text }]}>
          Major
        </TextDefault>
        <GenericModalPicker<string>
          selectedValue={state.major}
          onValueChange={(itemValue) => handleChangeState("major", itemValue)}
          options={[...MAJOR_OPTIONS]}
          placeholder="Select major"
          modalTitle="Major"
        />
      </View>
    </View>
  )
);

// Component: ActionButtons
const ActionButtons = React.memo<ActionButtonsProps>(
  ({ onSave, onCancel, currentColors, isLoading = false }) => (
    <View style={styles.actionButtonsContainer}>
      <ButtonOutlined
        title="Cancel"
        iconLeft={<X size={scale(24)} color={currentColors.primary} />}
        onPress={onCancel}
        disabled={isLoading}
      />
      <ButtonPrimary
        onPress={onSave}
        title={isLoading ? "Saving..." : "Save"}
        iconLeft={<Save size={scale(20)} color="white" />}
        disabled={isLoading}
      />
    </View>
  )
);

// Main Component: EditProfileView
export default function EditProfileView() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const { data: user, isLoading, onLoadProfileMe } = useProfileMe();
  const { onUpdate, isLoading: isLoadingUpdate } = useUpdateProfile();

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

  const handleChangeState = useCallback((key: string, value: any) => {
    setState((prevState: any) => ({
      ...prevState,
      [key]: value,
    }));
  }, []);

  const handleAddInterest = useCallback(() => {
    if (
      state?.newInterest?.trim() &&
      !state?.interests?.includes(state.newInterest.trim())
    ) {
      handleChangeState("interests", [
        ...(state?.interests || []),
        state.newInterest.trim(),
      ]);
      handleChangeState("newInterest", "");
    }
  }, [state.newInterest, state.interests, handleChangeState]);

  const handleRemoveInterest = useCallback(
    (interestToRemove: string) => {
      const newInterests =
        state.interests?.filter(
          (interest: string) => interest !== interestToRemove
        ) || [];
      handleChangeState("interests", newInterests);
    },
    [state.interests, handleChangeState]
  );

  const handleSave = useCallback(async () => {
    const updatedData: EditableUserData = { ...state };
    await onUpdate(updatedData);
  }, [state, onUpdate]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      "Confirm Cancel",
      "Are you sure you want to cancel? All changes will be lost.",
      [
        { text: "Continue Editing", style: "cancel" },
        { text: "Cancel", style: "destructive", onPress: () => router.back() },
      ]
    );
  }, []);

  const handleChooseAvatar = useCallback(() => {
    Alert.alert(
      "Change Avatar",
      "Avatar selection feature not implemented yet."
    );
  }, []);

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
  }, [onLoadProfileMe]);

  const loadingView = useMemo(
    () => (
      <View
        style={[
          styles.safeArea,
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
          Loading profile data...
        </TextDefault>
      </View>
    ),
    [currentColors]
  );

  const errorView = useMemo(
    () => (
      <View
        style={[
          styles.safeArea,
          {
            backgroundColor: currentColors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <TextDefault style={{ color: currentColors.text }}>
          Unable to load profile for editing.
        </TextDefault>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: currentColors.primary, marginTop: scale(20) },
          ]}
          activeOpacity={0.7}
        >
          <TextDefault style={{ color: currentColors.backgroundCard }}>
            Go Back
          </TextDefault>
        </TouchableOpacity>
      </View>
    ),
    [currentColors]
  );

  if (isLoading) return loadingView;
  if (!user) return errorView;

  return (
    <View
      style={[styles.safeArea, { backgroundColor: currentColors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
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
        <Separator height={normalize(120)} />
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
    minHeight: scale(48),
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
  interestsInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(8),
    gap: scale(8),
  },
  newInterestInput: {
    flex: 1,
  },
  addInterestButton: {
    borderRadius: scale(8),
    padding: scale(12),
    justifyContent: "center",
    alignItems: "center",
    minWidth: scale(48),
    minHeight: scale(48),
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
    minWidth: scale(20),
    minHeight: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(12),
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(20),
    paddingTop: normalize(10),
  },
  backButton: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(24),
    borderRadius: scale(8),
    minHeight: scale(48),
    justifyContent: "center",
    alignItems: "center",
  },
});
