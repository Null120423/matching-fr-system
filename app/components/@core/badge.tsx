import { scale } from "@/helper/helpers";
import { StyleSheet, Text, View } from "react-native";
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary";
  style?: object;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  style,
}) => {
  const badgeStyles: any = [styles.badgeBase];
  const textStyles: any = [styles.badgeTextBase];

  if (variant === "default") {
    badgeStyles.push(styles.badgeDefault);
    textStyles.push(styles.badgeTextDefault);
  } else if (variant === "secondary") {
    badgeStyles.push(styles.badgeSecondary);
    textStyles.push(styles.badgeTextSecondary);
  }
  return (
    <View style={[badgeStyles, style]}>
      <Text style={textStyles}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeAbsolute: {
    position: "absolute",
    top: scale(16), // top-4
    right: scale(16), // right-4
  },

  badgeBase: {
    borderRadius: scale(16),
    paddingVertical: scale(4),
    paddingHorizontal: scale(10),
    alignSelf: "flex-start", // Để không kéo dài toàn bộ chiều rộng
  },
  badgeDefault: {
    backgroundColor: "#22c55e", // bg-green-500
  },
  badgeSecondary: {
    backgroundColor: "#e5e7eb", // bg-gray-200
  },
  badgeTextBase: {
    fontSize: scale(14),
    fontWeight: "600", // semibold
  },
  badgeTextDefault: {
    color: "white",
  },
  badgeTextSecondary: {
    color: "#374151", // gray-700
  },
});
