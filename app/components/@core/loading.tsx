import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { styleGlobal } from "./styles";

function LoadingView() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: currentColors.background,
      }}
    >
      <ActivityIndicator
        style={styleGlobal.shadow}
        size="large"
        color="#745AFF"
      />
    </View>
  );
}

export default LoadingView;
