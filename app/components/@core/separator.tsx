import React from "react";
import { View } from "react-native";
import { styleGlobal } from "./styles";

function Separator({
  height,
  width,
  style,
}: {
  height?: number;
  width?: number;
  style?: any;
}) {
  return (
    <View
      style={[
        styleGlobal.separator,
        { height: height, width: width, ...style },
      ]}
    />
  );
}

export default Separator;
