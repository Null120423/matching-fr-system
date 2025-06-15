import Row from "@/components/@core/row";
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default"; // Sử dụng TextDefault
import { Colors } from "@/constants/Colors"; // Import Colors
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme
import { scale } from "@/helper/helpers";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import {
  Bell,
  ChevronRight,
  FileText,
  Globe,
  HelpCircle,
  LogOut,
  MapPin,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

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
// Component con: SettingsHeader
// -----------------------------------------------------
interface SettingsHeaderProps {
  currentColors: any;
  onBackPress: () => void;
}

function SettingsHeader({ currentColors, onBackPress }: SettingsHeaderProps) {
  return (
    <>
      <Row between full style={{ paddingHorizontal: scale(16) }}>
        <TouchableOpacity onPress={onBackPress}>
          <TextDefault style={{ color: currentColors.text }}>
            Quay lại
          </TextDefault>
        </TouchableOpacity>
      </Row>
      <View style={settingStyles.header}>
        <TextDefault
          style={[settingStyles.headerTitle, { color: currentColors.text }]}
        >
          Cài đặt ứng dụng
        </TextDefault>
        <TextDefault
          style={[
            settingStyles.headerSubtitle,
            { color: currentColors.textSecondary },
          ]}
        >
          Quản lý các tùy chọn và quyền riêng tư của bạn
        </TextDefault>
      </View>
    </>
  );
}

// -----------------------------------------------------
// Component con: SettingSectionCard (Reusable)
// -----------------------------------------------------
interface SettingSectionCardProps {
  title: string;
  children: React.ReactNode;
  currentColors: any;
  shadowStyle: any;
}

function SettingSectionCard({
  title,
  children,
  currentColors,
  shadowStyle,
}: SettingSectionCardProps) {
  return (
    <View
      style={[
        settingStyles.sectionCard,
        shadowStyle,
        {
          backgroundColor: currentColors.backgroundCard,
          borderColor: currentColors.border,
        },
      ]}
    >
      <TextDefault
        style={[settingStyles.sectionTitle, { color: currentColors.text }]}
      >
        {title}
      </TextDefault>
      {children}
    </View>
  );
}

// -----------------------------------------------------
// Component con: ToggleSettingItem
// -----------------------------------------------------
interface ToggleSettingItemProps {
  icon: React.ReactNode;
  label: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  currentColors: any;
}

function ToggleSettingItem({
  icon,
  label,
  isEnabled,
  onToggle,
  currentColors,
}: ToggleSettingItemProps) {
  return (
    <View style={settingStyles.settingItem}>
      <View style={settingStyles.settingTextContainer}>
        {React.cloneElement(icon as React.ReactElement, {
          color: currentColors.iconDefault,
        })}
        <TextDefault
          style={[settingStyles.settingLabel, { color: currentColors.text }]}
        >
          {label}
        </TextDefault>
      </View>
      <Switch
        trackColor={{
          false: currentColors.switchTrackFalse,
          true: currentColors.switchTrackTrue,
        }}
        thumbColor={
          isEnabled
            ? currentColors.switchThumbActive
            : currentColors.switchThumb
        }
        ios_backgroundColor={currentColors.switchTrackFalse}
        onValueChange={onToggle}
        value={isEnabled}
      />
    </View>
  );
}

// -----------------------------------------------------
// Component con: PickerSettingItem
// -----------------------------------------------------
interface PickerSettingItemProps {
  icon: React.ReactNode;
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  currentColors: any;
}

function PickerSettingItem({
  icon,
  label,
  selectedValue,
  onValueChange,
  options,
  currentColors,
}: PickerSettingItemProps) {
  return (
    <View style={settingStyles.settingItem}>
      <View style={settingStyles.settingTextContainer}>
        {React.cloneElement(icon as React.ReactElement, {
          color: currentColors.iconDefault,
        })}
        <TextDefault
          style={[settingStyles.settingLabel, { color: currentColors.text }]}
        >
          {label}
        </TextDefault>
      </View>
      <View
        style={[
          settingStyles.pickerContainer,
          {
            borderColor: currentColors.border,
            backgroundColor: currentColors.backgroundCard,
          },
        ]}
      >
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={[settingStyles.picker, { color: currentColors.text }]}
          // itemStyle={settingStyles.pickerItem} // Only for iOS, handled by style prop for cross-platform
        >
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              style={{ color: currentColors.text }} // Apply color for Android items
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

// -----------------------------------------------------
// Component con: LinkSettingItem
// -----------------------------------------------------
interface LinkSettingItemProps {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
  currentColors: any;
}

function LinkSettingItem({
  icon,
  text,
  onPress,
  currentColors,
}: LinkSettingItemProps) {
  return (
    <TouchableOpacity style={settingStyles.linkItem} onPress={onPress}>
      {React.cloneElement(icon as React.ReactElement, {
        color: currentColors.iconDefault,
      })}
      <TextDefault
        style={[settingStyles.linkText, { color: currentColors.linkText }]}
      >
        {text}
      </TextDefault>
      <ChevronRight size={scale(20)} color={currentColors.border} />
    </TouchableOpacity>
  );
}

// -----------------------------------------------------
// Main Component: SettingScreen
// -----------------------------------------------------
export default function SettingScreen() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const shadowStyle = getShadowStyle(currentColors);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationSharingEnabled, setLocationSharingEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("vi");

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng xuất", onPress: () => console.log("User logged out") }, // Implement logout logic here
    ]);
  };

  const handlePolicyPress = () => {
    Alert.alert(
      "Chính sách bảo mật",
      "Điều hướng đến màn hình/web Chính sách bảo mật."
    );
  };

  const handleTermsPress = () => {
    Alert.alert(
      "Điều khoản sử dụng",
      "Điều hướng đến màn hình/web Điều khoản sử dụng."
    );
  };

  const languageOptions = [
    { label: "Tiếng Việt", value: "vi" },
    { label: "English", value: "en" },
  ];

  return (
    <View
      style={[
        settingStyles.safeArea,
        { backgroundColor: currentColors.background },
      ]}
    >
      <Separator height={Platform.OS === "ios" ? scale(55) : scale(10)} />
      <SettingsHeader
        onBackPress={() => router.back()}
        currentColors={currentColors}
      />

      <ScrollView style={settingStyles.scrollView}>
        <View style={settingStyles.content}>
          {/* Notification Settings */}
          <SettingSectionCard
            title="Cài đặt thông báo"
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          >
            <ToggleSettingItem
              icon={<Bell size={scale(20)} />}
              label="Bật thông báo"
              isEnabled={notificationsEnabled}
              onToggle={setNotificationsEnabled}
              currentColors={currentColors}
            />
          </SettingSectionCard>

          {/* Privacy Settings */}
          <SettingSectionCard
            title="Cài đặt quyền riêng tư"
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          >
            <ToggleSettingItem
              icon={<MapPin size={scale(20)} />}
              label="Chia sẻ vị trí"
              isEnabled={locationSharingEnabled}
              onToggle={setLocationSharingEnabled}
              currentColors={currentColors}
            />
          </SettingSectionCard>

          {/* General Settings */}
          <SettingSectionCard
            title="Cài đặt chung"
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          >
            <PickerSettingItem
              icon={<Globe size={scale(20)} />}
              label="Ngôn ngữ"
              selectedValue={selectedLanguage}
              onValueChange={setSelectedLanguage}
              options={languageOptions}
              currentColors={currentColors}
            />
          </SettingSectionCard>

          {/* Legal & Support */}
          <SettingSectionCard
            title="Thông tin & Hỗ trợ"
            currentColors={currentColors}
            shadowStyle={shadowStyle}
          >
            <LinkSettingItem
              icon={<FileText size={scale(20)} />}
              text="Chính sách bảo mật"
              onPress={handlePolicyPress}
              currentColors={currentColors}
            />
            <View
              style={[
                settingStyles.linkSeparator,
                { backgroundColor: currentColors.linkSeparator },
              ]}
            />
            <LinkSettingItem
              icon={<HelpCircle size={scale(20)} />}
              text="Điều khoản sử dụng"
              onPress={handleTermsPress}
              currentColors={currentColors}
            />
          </SettingSectionCard>

          {/* Logout */}
          <TouchableOpacity
            style={[
              settingStyles.logoutButton,
              shadowStyle,
              {
                backgroundColor: currentColors.backgroundCard,
                borderColor: currentColors.danger,
              },
            ]}
            onPress={handleLogout}
          >
            <LogOut
              size={scale(20)}
              color={currentColors.iconDanger}
              style={settingStyles.buttonIcon}
            />
            <TextDefault
              style={[
                settingStyles.logoutButtonText,
                { color: currentColors.iconDanger },
              ]}
            >
              Đăng xuất
            </TextDefault>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const settingStyles = StyleSheet.create({
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
  sectionCard: {
    borderRadius: scale(8),
    padding: scale(16),
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: "600",
    marginBottom: scale(12),
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: scale(8),
  },
  settingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: scale(12),
  },
  settingLabel: {
    fontSize: scale(16),
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: scale(8),
    overflow: "hidden",
    width: scale(120),
  },
  picker: {
    height: scale(40),
    width: "100%",
  },
  // pickerItem: { // This style is primarily for iOS and handled by style prop on Picker.Item now
  //   height: scale(40),
  // },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(12),
    justifyContent: "space-between",
  },
  linkText: {
    flex: 1,
    fontSize: scale(16),
    fontWeight: "500",
  },
  linkSeparator: {
    height: 1,
    marginVertical: scale(4),
    marginHorizontal: 0, // Reset default margin if any
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(8),
    paddingVertical: scale(14),
    borderWidth: 1,
  },
  logoutButtonText: {
    fontSize: scale(16),
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: scale(8),
  },
});
