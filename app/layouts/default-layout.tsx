import { deviceHeight, deviceWidth } from "@/helper/utils";
import { Image, View } from "react-native";

function DefaultLayout({
  isHeader = true,
  children,
  imgBackground,
}: {
  isHeader?: boolean;
  children: React.ReactNode;
  imgBackground?: any;
}) {
  return (
    <View style={{ flex: 1, position: "relative" }}>
      {/* Add your layout here */}
      {imgBackground && (
        <Image
          source={imgBackground}
          style={{
            position: "absolute",
            width: deviceWidth,
            height: deviceHeight,
          }}
        />
      )}
      {children}
    </View>
  );
}

export default DefaultLayout;
