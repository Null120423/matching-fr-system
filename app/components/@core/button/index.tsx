import { Colors } from "@/constants/Colors"; // Import Colors
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme
import { normalize, scale } from "@/helper/helpers";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Row from "../row";
import { styleGlobal } from "../styles";
import TextDefault from "../text-default";
interface ButtonPrimaryProps {
  round?: number;
  onPress: () => void;
  title?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
  minWidth?: number | "100%" | "80%" | "90%";
  disabled?: boolean;
  full?: boolean;
  borderColor?: string;
  textColor?: string;
  activeOutlined?: boolean;
  bgColor?: string | any;
  styleTitle?: StyleProp<TextStyle>;
  styleButton?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  height?: number;
  register?: boolean;
}
interface IconButtonProps extends ButtonPrimaryProps {
  icon: React.ReactNode;
  border?: boolean;
}

const ButtonPrimary = ({
  full,
  round = normalize(15),
  onPress,
  isLoading,
  title,
  iconLeft,
  iconRight,
  minWidth = 100,
  disabled = false,
  bgColor,
  styleTitle,
  styleButton,
  height = normalize(50),
  register = false,
  backgroundColor,
}: ButtonPrimaryProps) => {
  return (
    <TouchableOpacity
      onPress={isLoading ? () => {} : onPress}
      disabled={disabled || isLoading}
      style={[
        styles.btn,
        styleGlobal.shadow,
        {
          minWidth: minWidth,
          borderRadius: round,
          backgroundColor: "#5451D6",
          padding: normalize(5),
          width: "48%",
          height,
        },
        bgColor && { backgroundColor: bgColor },
        disabled && styles.disabled,
        styleButton && styleButton,
        full && { width: "100%" },
        backgroundColor && { backgroundColor: backgroundColor },
      ]}
    >
      {isLoading && <ActivityIndicator color={"white"} />}
      {!isLoading && iconLeft && iconLeft}
      <TextDefault
        style={[
          {
            color: "white",
            fontWeight: 600,
            textAlign: "center",
            fontSize: normalize(13),
          },
          styleTitle,
        ]}
      >
        {title}
      </TextDefault>

      {!isLoading && iconRight && iconRight}
    </TouchableOpacity>
  );
};

const ButtonOutlined = ({
  full,
  round = normalize(15),
  onPress,
  isLoading,
  title,
  iconLeft,
  iconRight,
  minWidth = 100,
  disabled = false,
  activeOutlined = false,
  borderColor,
  height = normalize(32),
}: ButtonPrimaryProps) => {
  return (
    <TouchableOpacity
      onPress={isLoading ? () => {} : onPress}
      disabled={disabled || isLoading}
      style={[
        styles.btn,
        styleGlobal.border,
        styleGlobal.shadow,
        {
          borderRadius: round,
          borderColor: "#5451D6",
          width: 100,
          minWidth,
          height,
          backgroundColor: "rgba(0,0,0,0.05)",
        },
        full && { width: "100%" },
        disabled && styles.disabled,
      ]}
    >
      <Row center style={{ height: "100%" }}>
        {isLoading && <ActivityIndicator color={"blue"} />}
        {!isLoading && iconLeft && iconLeft}
        <TextDefault
          style={[
            {
              color: "#5451D6",
              fontWeight: 600,
            },
            styles.txt,
          ]}
        >
          {title}
        </TextDefault>
        {!isLoading && iconRight && iconRight}
      </Row>
    </TouchableOpacity>
  );
};

const IconButton = ({
  round = 100,
  onPress,
  isLoading,
  iconLeft,
  iconRight,
  disabled = false,
  icon,
  backgroundColor,
  borderColor = "rgba(116, 90, 255, 0.3)",
}: IconButtonProps) => {
  return (
    <TouchableOpacity
      onPress={isLoading ? () => {} : onPress}
      disabled={disabled}
      style={[
        styleGlobal.centerChild,
        styleGlobal.border,
        styleGlobal.shadow,
        {
          borderRadius: round,
          width: normalize(45),
          height: normalize(45),
          backgroundColor: backgroundColor,
          borderColor: borderColor || "black",
        },
        disabled && styles.disabled,
        disabled && styles.disabled,
      ]}
    >
      {isLoading && <ActivityIndicator color={"blue"} />}
      {!isLoading && iconLeft && iconLeft}
      {icon && icon}
      {!isLoading && iconRight && iconRight}
    </TouchableOpacity>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: "default" | "outline";
  size?: "default" | "lg" | "sm";
  style?: object;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = "default",
  size = "default",
  style,
}) => {
  const { theme } = useTheme(); // Lấy theme hiện tại
  const currentColors = Colors[theme || "light"]; // Lấy màu sắc tương ứng

  const buttonStyles: any = [styles.buttonBase];
  const textStyles: any = [styles.buttonTextBase];

  if (variant === "default") {
    // Sử dụng màu primary từ theme
    buttonStyles.push({ backgroundColor: currentColors.primary });
    textStyles.push({ color: currentColors.backgroundCard }); // Thường là màu text trắng hoặc gần trắng
  } else if (variant === "outline") {
    buttonStyles.push({
      backgroundColor: "transparent",
      borderColor: currentColors.border, // Màu border từ theme
      borderWidth: 1,
    });
    textStyles.push({ color: currentColors.text }); // Màu text từ theme
  }

  if (size === "lg") {
    buttonStyles.push(styles.buttonLg);
  } else if (size === "sm") {
    buttonStyles.push(styles.buttonSm);
  }

  // Kết hợp với style tùy chỉnh được truyền vào
  if (style) {
    buttonStyles.push(style);
  }

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyles}>
      {typeof children === "string" ? (
        <TextDefault style={textStyles}>{children}</TextDefault>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: scale(8),
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonTextBase: {
    fontSize: scale(16),
    fontWeight: "600",
  },
  buttonLg: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
  },
  buttonSm: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
  },
  btn: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    columnGap: 10,
    height: normalize(30),
    minWidth: normalize(42),
  },
  disabled: {
    opacity: 0.5,
  },
  txt: {
    fontSize: normalize(12),
    textTransform: "capitalize",
  },
});

export { ButtonOutlined, ButtonPrimary, IconButton };
