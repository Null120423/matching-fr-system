import { deviceHeight } from "@/helper";
import { normalize } from "@/helper/helpers";
import React, { forwardRef, useCallback, useImperativeHandle } from "react";
import {
  ColorSchemeName,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  themeName: ColorSchemeName;
};

export interface BottomSheetMethods {
  expand: () => void;
  close: () => void;
}

// eslint-disable-next-line react/display-name
const SheetCustom = forwardRef<BottomSheetMethods, Props>(
  ({ children, themeName }, ref) => {
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();
    const OPEN = 0;
    const CLOSE = -deviceHeight / 2;
    const translateY = useSharedValue(CLOSE);

    const expand = useCallback(() => {
      translateY.value = withTiming(OPEN);
    }, [translateY, OPEN]);

    const close = useCallback(() => {
      translateY.value = withTiming(CLOSE);
    }, [translateY, CLOSE]);

    useImperativeHandle(
      ref,
      () => ({
        expand,
        close,
      }),
      [expand, close]
    );

    const animationStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: translateY.value }],
      };
    }, [translateY]);

    const pan = Gesture.Pan()
      .onUpdate((event) => {
        if (event.translationY > 0) {
          translateY.value = withSpring(OPEN, {
            damping: 200,
            stiffness: 800,
          });
        } else {
          translateY.value = withSpring(event.translationY, {
            damping: 100,
            stiffness: 400,
          });
        }
      })
      .onEnd(() => {
        if (translateY.value < -50) {
          translateY.value = withSpring(CLOSE, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          translateY.value = withSpring(OPEN, {
            damping: 100,
            stiffness: 400,
          });
        }
      });

    return (
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.container,
            {
              width: width * 0.92,
              top: insets.top,
            },
            animationStyle,
          ]}
          onLayout={({ nativeEvent }) => {
            // const { height } = nativeEvent.layout;
            // if (height) {
            //   setTopSheetHeight(height);
            //   translateY.value = withTiming(-height - insets.top);
            // }
          }}
        >
          <View
            style={{
              borderRadius: normalize(12),
              overflow: "hidden",
            }}
          >
            {children}
          </View>
        </Animated.View>
      </GestureDetector>
    );
  }
);

export default SheetCustom;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    zIndex: 100000000,
  },
  line: {
    position: "absolute",
    bottom: 8,
    width: 40,
    height: 4,
    borderRadius: 8,
  },
  textTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 14,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
});
