import LoadingView from "@/components/@core/loading";
import { deviceHeight, deviceWidth } from "@/helper/utils";
import React from "react";
import { Image, View } from "react-native";

function DefaultLayout({
  isHeader = true,
  children,
  imgBackground,
  isLoading = false,
}: {
  isHeader?: boolean;
  children: React.ReactNode;
  imgBackground?: any;
  isLoading?: boolean;
}) {
  return (
    <View style={{ flex: 1 }}>
      {imgBackground && (
        <Image
          source={imgBackground}
          style={{
            position: "absolute",
            width: deviceWidth,
            height: deviceHeight * 1.2,
          }}
        />
      )}
      {children}
      {isLoading && <LoadingView />}
    </View>
  );
}

export default DefaultLayout;
