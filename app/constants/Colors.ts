// constants/Colors.ts

// Định nghĩa các màu sắc cơ bản và biến thể light/dark
export const tints = {
  primary: "#745AFF", // Your primary purple/pink color for buttons, active states
  secondary: "#EC4899", // A vibrant pink
  success: "#22C55E", // Green
  warning: "#F59E0B", // Amber/Orange
  danger: "#EF4444", // Red
  info: "#3B82F6", // Blue for invites etc.
  text: "#111827", // Dark gray for main text
  textSecondary: "#4B5563", // Medium gray for subtitles
  textLight: "#6B7280", // Lighter gray for info text
  border: "#E5E7EB", // Light gray for borders
  backgroundLight: "#F9FAFB", // Very light gray for screen background
  backgroundCard: "#FFFFFF", // White for cards
  backgroundLightBlue: "#EFF6FF", // Blue-50 for quick action buttons
  backgroundLightGreen: "#ECFDF5", // Green-50 for quick action buttons
  backgroundLightGray: "#F3F4F6", // Gray-100 for badges, light elements
  backgroundLightPink: "#FCE7F3", // Pink-50 for some elements
  backgroundOrangeLite: "#FEF3C7", // Amber-100 for pending status
  backgroundBlueLite: "#DBEAFE", // Blue-100 for some elements
  backgroundRedLite: "#FEE2E2", // Red-100 for declined status
};

export const darkTints = {
  primary: "#9C27B0", // Darker purple for dark mode primary
  secondary: "#E91E63", // Darker pink
  success: "#4CAF50",
  warning: "#FFC107",
  danger: "#F44336",
  info: "#2196F3",
  text: "#E0E0E0", // Light gray for text
  textSecondary: "#B0B0B0",
  textLight: "#909090",
  border: "#424242",
  backgroundLight: "#121212", // Dark background
  backgroundCard: "#1E1E1E", // Darker card background
  backgroundLightBlue: "#2A2A3A",
  backgroundLightGreen: "#1A2A1A",
  backgroundLightGray: "#2C2C2C",
  backgroundLightPink: "#3A2A3A",
  backgroundOrangeLite: "#3A3A2A",
  backgroundBlueLite: "#2A2A3A",
  backgroundRedLite: "#3A2A2A",
};

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    switchTrackFalse: "#767577",
    switchTrackTrue: "#81b0ff", // Hoặc màu primary của bạn
    switchThumb: "#f4f3f4",
    switchThumbActive: "#f5dd4b", // Màu vàng cho thumb active

    // Màu cho các icon/text cụ thể
    iconDefault: tints.text, // Màu icon mặc định
    iconAccent: tints.primary, // Màu icon nhấn mạnh
    iconDanger: tints.danger, // Màu icon nguy hiểm (logout)
    iconInfo: tints.info, // Màu icon thông tin (bell, map-pin)

    // Màu cho link/separator
    linkText: tints.text,
    linkSeparator: tints.border,
    text: tints.text,
    background: tints.backgroundLight,
    tint: tintColorLight,
    icon: tints.textLight,
    tabIconDefault: tints.textLight,
    tabIconSelected: tints.backgroundLight,
    tabBackground: tints.backgroundLight, // Background for tab bar
    tabSelectedBackground: tints.primary, // Background for selected tab
    // Add all custom colors for light theme here
    primary: tints.primary,
    secondary: tints.secondary,
    success: tints.success,
    warning: tints.warning,
    danger: tints.danger,
    info: tints.info,
    textSecondary: tints.textSecondary,
    textLight: tints.textLight,
    border: tints.border,
    backgroundCard: tints.backgroundCard,
    backgroundLightBlue: tints.backgroundLightBlue,
    backgroundLightGreen: tints.backgroundLightGreen,
    backgroundLightGray: tints.backgroundLightGray,
    backgroundLightPink: tints.backgroundLightPink,
    backgroundOrangeLite: tints.backgroundOrangeLite,
    backgroundBlueLite: tints.backgroundBlueLite,
    backgroundRedLite: tints.backgroundRedLite,
    tabActive: tints.secondary, // Màu tab active
    tabInactive: tints.textLight, // Màu tab inactive
    tabUnderline: tints.secondary, // Màu gạch chân tab

    // Màu cho AppointmentCard
    cardBackground: tints.backgroundCard,
    cardBorder: tints.border,
    cardAvatarPlaceholder: "#D1D5DB", // Xám cho placeholder
    cardAvatarPlaceholderText: "#fff",
    cardTitle: tints.text,
    cardSubtitle: tints.textSecondary,
    cardInfoText: tints.textLight,
    infoIcon: tints.textLight, // Màu icon thông tin

    // Màu cho status badges
    statusPendingBg: tints.backgroundOrangeLite,
    statusPendingText: tints.warning,
    statusAcceptedBg: tints.backgroundLightGreen,
    statusAcceptedText: tints.success,
    statusDeclinedBg: tints.backgroundRedLite,
    statusDeclinedText: tints.danger,
    statusUpcomingBg: tints.backgroundBlueLite,
    statusUpcomingText: tints.info,

    // Màu empty state
    emptyStateIcon: "#D1D5DB",
    emptyStateText: tints.textLight,
  },
  dark: {
    switchTrackFalse: "#555555",
    switchTrackTrue: "#4B0082", // Màu primary tối hơn cho dark mode
    switchThumb: "#cccccc",
    switchThumbActive: "#FFD700", // Màu vàng cho thumb active

    // Màu cho các icon/text cụ thể
    iconDefault: darkTints.text,
    iconAccent: darkTints.primary,
    iconDanger: darkTints.danger,
    iconInfo: darkTints.info,

    // Màu cho link/separator
    linkText: darkTints.text,
    linkSeparator: darkTints.border,
    text: darkTints.text,
    background: darkTints.backgroundLight,
    tint: tintColorDark,
    icon: darkTints.textLight,
    tabIconDefault: darkTints.textLight,
    tabIconSelected: darkTints.backgroundLight,
    tabBackground: darkTints.backgroundLight,
    tabSelectedBackground: tints.primary,
    primary: darkTints.primary,
    secondary: darkTints.secondary,
    success: darkTints.success,
    warning: darkTints.warning,
    danger: darkTints.danger,
    info: darkTints.info,
    textSecondary: darkTints.textSecondary,
    textLight: darkTints.textLight,
    border: darkTints.border,
    backgroundCard: darkTints.backgroundCard,
    backgroundLightBlue: darkTints.backgroundLightBlue,
    backgroundLightGreen: darkTints.backgroundLightGreen,
    backgroundLightGray: darkTints.backgroundLightGray,
    backgroundLightPink: darkTints.backgroundLightPink,
    backgroundOrangeLite: darkTints.backgroundOrangeLite,
    backgroundBlueLite: darkTints.backgroundBlueLite,
    backgroundRedLite: darkTints.backgroundRedLite,
    tabActive: darkTints.secondary,
    tabInactive: darkTints.textLight,
    tabUnderline: darkTints.secondary,

    // Màu cho AppointmentCard
    cardBackground: darkTints.backgroundCard,
    cardBorder: darkTints.border,
    cardAvatarPlaceholder: "#555555",
    cardAvatarPlaceholderText: "#fff",
    cardTitle: darkTints.text,
    cardSubtitle: darkTints.textSecondary,
    cardInfoText: darkTints.textLight,
    infoIcon: darkTints.textLight,

    // Màu cho status badges
    statusPendingBg: "#3A3A2A",
    statusPendingText: darkTints.warning,
    statusAcceptedBg: "#1A2A1A",
    statusAcceptedText: darkTints.success,
    statusDeclinedBg: "#3A2A2A",
    statusDeclinedText: darkTints.danger,
    statusUpcomingBg: "#2A2A3A",
    statusUpcomingText: darkTints.info,

    // Màu empty state
    emptyStateIcon: "#555555",
    emptyStateText: darkTints.textLight,
  },
};
