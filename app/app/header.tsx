import Row from "@/components/@core/row";
import TextDefault from "@/components/@core/text-default";
import { normalize } from "@/helper/helpers";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  title?: string;
  onBack?: () => void;
  styleTitle?: StyleProp<TextStyle> | TextStyle[];
}

function Header({ title, onBack, styleTitle }: Props) {
  const router = useRouter();
  return (
    <Row full between style={styles.header} colGap={10}>
      <Row
        between
        full
        style={{
          alignItems: "center",
        }}
        colGap={20}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <TextDefault>Back</TextDefault>
        </TouchableOpacity>
        {title && (
          <TextDefault size={normalize(14)} bold style={[styleTitle]}>
            {title}
          </TextDefault>
        )}
        <View
          style={{
            width: normalize(32),
            height: normalize(32),
          }}
        />
      </Row>
    </Row>
  );
}
const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(10),
    zIndex: 1000000,
    paddingVertical: normalize(5),
    paddingTop: normalize(50),
  },
  iconContainer: {
    width: 50,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    borderRadius: 100,
    borderWidth: 2,
  },
});

export default Header;
