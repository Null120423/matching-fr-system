import React from "react";
import { ActivityIndicator, View } from "react-native";
import { styleGlobal } from "./styles";

function LoadingView() {
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
