import Loading from "@/components/@core/loading"; // Import Loading component
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default"; // Sử dụng TextDefault
import { Colors } from "@/constants/Colors"; // Import Colors
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme
import { scale } from "@/helper/helpers";
import { fetchMyProfile, updateMyProfile } from "@/services/users"; // Import fetch and update mock API
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { Plus, Save, X } from "lucide-react-native";
import React, { useEffect, useState } from "react"; // Import useEffect
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Define User Interface (should match your MOCK_MY_PROFILE_DATA)
interface EditableUserData {
  id: string;
  name: string;
  gender: string;
  age: number;
  location: string;
  bio: string;
  avatar: string;
  interests: string[];
  freeTime: string;
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
// Component con: EditProfileHeader
// -----------------------------------------------------
interface EditProfileHeaderProps {
  currentColors: any;
}

function EditProfileHeader({ currentColors }: EditProfileHeaderProps) {
  return (
    <View style={editProfileStyles.header}>
      <TextDefault
        style={[editProfileStyles.headerTitle, { color: currentColors.text }]}
      >
        Chỉnh sửa hồ sơ
      </TextDefault>
      <TextDefault
        style={[
          editProfileStyles.headerSubtitle,
          { color: currentColors.textSecondary },
        ]}
      >
        Cập nhật thông tin cá nhân của bạn
      </TextDefault>
    </View>
  );
}

// -----------------------------------------------------
// Component con: AvatarEditSection
// -----------------------------------------------------
interface AvatarEditSectionProps {
  avatarUri: string;
  onChooseAvatar: () => void; // Placeholder for image picker logic
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

// -----------------------------------------------------
// Component con: ProfileFormSection
// -----------------------------------------------------
interface ProfileFormSectionProps {
  name: string;
  setName: (text: string) => void;
  age: string;
  setAge: (text: string) => void;
  gender: string;
  setGender: (value: string) => void;
  location: string;
  setLocation: (text: string) => void;
  bio: string;
  setBio: (text: string) => void;
  interests: string[];
  handleRemoveInterest: (interest: string) => void;
  newInterest: string;
  setNewInterest: (text: string) => void;
  handleAddInterest: () => void;
  freeTime: string;
  setFreeTime: (text: string) => void;
  currentColors: any;
  shadowStyle: any;
}

function ProfileFormSection({
  name,
  setName,
  age,
  setAge,
  gender,
  setGender,
  location,
  setLocation,
  bio,
  setBio,
  interests,
  handleRemoveInterest,
  newInterest,
  setNewInterest,
  handleAddInterest,
  freeTime,
  setFreeTime,
  currentColors,
  shadowStyle,
}: ProfileFormSectionProps) {
  return (
    <View
      style={[
        editProfileStyles.formCard,
        shadowStyle,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
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
          value={name}
          onChangeText={setName}
          placeholderTextColor={currentColors.textLight}
        />
      </View>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Tuổi
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
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholderTextColor={currentColors.textLight}
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
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(String(itemValue))}
            style={[editProfileStyles.picker, { color: currentColors.text }]}
            // itemStyle={editProfileStyles.pickerItem} // itemStyle is only for iOS
          >
            <Picker.Item
              label="Chọn giới tính"
              value=""
              style={{ color: currentColors.text }}
            />
            <Picker.Item
              label="Nam"
              value="Nam"
              style={{ color: currentColors.text }}
            />
            <Picker.Item
              label="Nữ"
              value="Nữ"
              style={{ color: currentColors.text }}
            />
            <Picker.Item
              label="Khác"
              value="Khác"
              style={{ color: currentColors.text }}
            />
          </Picker>
        </View>
      </View>

      <View style={editProfileStyles.formGroup}>
        <TextDefault
          style={[editProfileStyles.label, { color: currentColors.text }]}
        >
          Vị trí
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
          value={location}
          onChangeText={setLocation}
          placeholderTextColor={currentColors.textLight}
        />
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
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          placeholderTextColor={currentColors.textLight}
        />
      </View>

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
            value={newInterest}
            onChangeText={setNewInterest}
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
          {interests.map((interest, index) => (
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
          Thời gian rảnh
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
          value={freeTime}
          onChangeText={setFreeTime}
          multiline
          numberOfLines={3}
          placeholderTextColor={currentColors.textLight}
        />
      </View>
    </View>
  );
}

// -----------------------------------------------------
// Component con: ActionButtons
// -----------------------------------------------------
interface ActionButtonsProps {
  onSave: () => void;
  onCancel: () => void;
  currentColors: any;
}

function ActionButtons({
  onSave,
  onCancel,
  currentColors,
}: ActionButtonsProps) {
  return (
    <View style={editProfileStyles.actionButtonsContainer}>
      <TouchableOpacity
        style={[
          editProfileStyles.cancelButton,
          {
            borderColor: currentColors.border,
            backgroundColor: currentColors.backgroundCard,
          },
        ]}
        onPress={onCancel}
      >
        <X
          size={scale(20)}
          color={currentColors.text}
          style={editProfileStyles.buttonIcon}
        />
        <TextDefault
          style={[
            editProfileStyles.cancelButtonText,
            { color: currentColors.text },
          ]}
        >
          Hủy
        </TextDefault>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          editProfileStyles.saveButton,
          { backgroundColor: currentColors.success },
        ]}
        onPress={onSave}
      >
        <Save
          size={scale(20)}
          color={currentColors.backgroundCard}
          style={editProfileStyles.buttonIcon}
        />
        <TextDefault
          style={[
            editProfileStyles.saveButtonText,
            { color: currentColors.backgroundCard },
          ]}
        >
          Lưu
        </TextDefault>
      </TouchableOpacity>
    </View>
  );
}

// -----------------------------------------------------
// Main Component: EditProfileView
// -----------------------------------------------------
export default function EditProfileView() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const shadowStyle = getShadowStyle(currentColors);

  const params = useRoute()?.params as { id: string };
  const userId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<EditableUserData | null>(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [freeTime, setFreeTime] = useState("");
  const [avatarUri, setAvatarUri] = useState("");

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const fetchedUser = (await fetchMyProfile()) as EditableUserData; // Adjust based on your API
        if (fetchedUser) {
          setUser(fetchedUser);
          setName(fetchedUser.name);
          setAge(String(fetchedUser.age));
          setGender(fetchedUser.gender);
          setLocation(fetchedUser.location);
          setBio(fetchedUser.bio);
          setInterests(fetchedUser.interests);
          setFreeTime(fetchedUser.freeTime);
          setAvatarUri(fetchedUser.avatar);
        } else {
          Alert.alert("Lỗi", "Không tìm thấy hồ sơ để chỉnh sửa.");
          router.back();
        }
      } catch (error) {
        console.error("Failed to load user profile for editing:", error);
        Alert.alert("Lỗi", "Không thể tải hồ sơ. Vui lòng thử lại.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId]); // Depend on userId if you are fetching specific user data

  const handleAddInterest = () => {
    if (newInterest.trim() !== "" && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter((interest) => interest !== interestToRemove));
  };

  const handleSave = async () => {
    const updatedUser: EditableUserData = {
      ...user!, // Use fetched user as base
      name,
      age: parseInt(age) || 0,
      gender,
      location,
      bio,
      interests,
      freeTime,
      avatar: avatarUri,
    };

    try {
      await updateMyProfile(updatedUser); // Call mock update API
      Alert.alert("Thành công", "Hồ sơ của bạn đã được cập nhật.");
      router.back();
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Lỗi", "Không thể lưu hồ sơ. Vui lòng thử lại.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Placeholder for image picker logic
  const handleChooseAvatar = () => {
    Alert.alert("Thay đổi ảnh", "Chức năng chọn ảnh chưa được triển khai.");
    // Implement image picker here (e.g., using expo-image-picker)
  };

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
        <TextDefault
          style={{ color: currentColors.textSecondary, marginTop: scale(5) }}
        >
          Vui lòng kiểm tra lại ID hoặc thử lại.
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
      <Separator height={Platform.OS === "ios" ? scale(55) : scale(10)} />
      <EditProfileHeader currentColors={currentColors} />
      <ScrollView style={editProfileStyles.scrollView}>
        <View style={editProfileStyles.content}>
          <AvatarEditSection
            avatarUri={avatarUri}
            onChooseAvatar={handleChooseAvatar}
            currentColors={currentColors}
          />

          <ProfileFormSection
            name={name}
            setName={setName}
            age={age}
            setAge={setAge}
            gender={gender}
            setGender={setGender}
            location={location}
            setLocation={setLocation}
            bio={bio}
            setBio={setBio}
            interests={interests}
            handleRemoveInterest={handleRemoveInterest}
            newInterest={newInterest}
            setNewInterest={setNewInterest}
            handleAddInterest={handleAddInterest}
            freeTime={freeTime}
            setFreeTime={setFreeTime}
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          />

          <ActionButtons
            onSave={handleSave}
            onCancel={handleCancel}
            currentColors={currentColors}
          />
        </View>
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
  content: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(24),
    gap: scale(24),
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: scale(24),
  },
  editAvatarImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    borderWidth: scale(2),
    marginBottom: scale(12),
  },
  changeAvatarButton: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    borderRadius: scale(20),
  },
  changeAvatarButtonText: {
    fontSize: scale(14),
    fontWeight: "600",
  },
  formCard: {
    borderRadius: scale(8),
    padding: scale(20),
    borderWidth: 1,
  },
  formGroup: {
    marginBottom: scale(16),
  },
  label: {
    fontSize: scale(14),
    fontWeight: "500",
    marginBottom: scale(8),
  },
  input: {
    borderWidth: 1,
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    fontSize: scale(16),
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
    height: scale(40),
    width: "100%",
  },
  // pickerItem is only for iOS, not used in cross-platform StyleSheet
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
    padding: scale(10),
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
    paddingVertical: scale(6),
    paddingHorizontal: scale(10),
  },
  interestTagText: {
    fontSize: scale(14),
    marginRight: scale(4),
  },
  removeInterestButton: {
    padding: scale(2),
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(12),
    marginTop: scale(16),
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(8),
    paddingVertical: scale(12),
  },
  saveButtonText: {
    fontSize: scale(16),
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(8),
    paddingVertical: scale(12),
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: scale(16),
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: scale(8),
  },
  backButton: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
  },
});
