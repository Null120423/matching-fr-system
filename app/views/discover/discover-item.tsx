import { Badge } from "@/components/@core";
import Button from "@/components/@core/button"; // Đảm bảo import Button đã được chỉnh sửa
import Card from "@/components/@core/card";
import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors"; // Import Colors
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme
import { scale } from "@/helper/helpers";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

// Animation imports
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface DiscoverUser {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  compatibility: number;
  interests: string[];
  bio: string;
  activities: string[];
  freeTime: string;
}

interface DiscoverItemProps {
  data: DiscoverUser;
  onSwipeLeft: (userId: string) => void;
  onSwipeRight: (userId: string) => void;
}

function DiscoverItem({ data, onSwipeLeft, onSwipeRight }: DiscoverItemProps) {
  const { theme } = useTheme(); // Lấy theme hiện tại
  const currentColors = Colors[theme || "light"]; // Lấy màu sắc tương ứng

  // Animated values for swipe gesture
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Constants for swipe thresholds
  const SWIPE_THRESHOLD = 150; // Distance to swipe to trigger action

  // Animated style for the card
  const animatedCardStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
      [-10, 0, 10], // Rotate -10 deg to 10 deg
      "clamp"
    );
    return {
      transform: [
        { translateX: translateX.value },
        { rotateZ: `${rotateZ}deg` },
      ],
    };
  });

  // Gesture handler
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      rotation.value = interpolate(
        translateX.value,
        [-SWIPE_THRESHOLD, SWIPE_THRESHOLD],
        [-10, 10],
        "clamp"
      );
    },
    onEnd: (event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        // Swiped right (Like)
        translateX.value = withSpring(500, {}, () => {
          runOnJS(onSwipeRight)(data.id);
        });
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swiped left (Pass)
        translateX.value = withSpring(-500, {}, () => {
          runOnJS(onSwipeLeft)(data.id);
        });
      } else {
        // Not swiped enough, reset position
        translateX.value = withSpring(0);
      }
    },
  });

  const handleDetail = () => {
    router.push({
      pathname: "/discover/user-profile",
      params: { userId: data.id },
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, width: "100%" }}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[animatedCardStyle, styles.animatedCardWrapper]}>
          <Card
            style={[
              styles.cardOverflowHidden,
              { backgroundColor: currentColors.backgroundCard },
            ]} // Themed Card background
            onClick={handleDetail}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: data.avatar || "https://via.placeholder.com/300",
                }}
                style={styles.mainImage}
                accessibilityLabel={data.name}
              />
              <View style={styles.badgeAbsolute}>
                <Badge variant="default">{data.compatibility}% phù hợp</Badge>
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.spaceBetweenRow}>
                <View>
                  <TextDefault
                    style={[styles.userNameAge, { color: currentColors.text }]}
                  >
                    {data.name}, {data.age}
                  </TextDefault>
                  <TextDefault
                    style={[
                      styles.userLocation,
                      { color: currentColors.textSecondary },
                    ]}
                  >
                    <Ionicons
                      name="location-outline"
                      size={scale(16)}
                      color={currentColors.textSecondary} // Themed icon color
                    />
                    {data.location}
                  </TextDefault>
                </View>
              </View>

              <View style={styles.mb4}>
                <TextDefault
                  style={[
                    styles.bioText,
                    { color: currentColors.textSecondary },
                  ]}
                >
                  {data.bio}
                </TextDefault>
                <View style={styles.flexWrapGap}>
                  {data.interests.map((interest: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </View>
              </View>

              <View style={styles.swipeButtonsContainer}>
                <Button
                  size="lg"
                  variant="outline"
                  style={{
                    borderColor: currentColors.danger, // Themed red border for pass
                  }}
                  onPress={() => onSwipeLeft(data.id)} // Call parent's handler
                >
                  <Ionicons
                    name="close-outline"
                    size={scale(25)}
                    color={currentColors.danger}
                  />
                </Button>
                <Button
                  size="lg"
                  variant="default" // Use default variant to pick up primary color
                  onPress={() => onSwipeRight(data.id)} // Call parent's handler
                >
                  <Ionicons
                    name="heart"
                    size={scale(25)}
                    color={currentColors.backgroundCard}
                  />
                  {/* White heart on primary background */}
                </Button>
              </View>
            </View>
          </Card>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

export default DiscoverItem;

const styles = StyleSheet.create({
  animatedCardWrapper: {
    // Để card có thể nằm trên cùng một lớp và di chuyển
    width: "100%", // Đảm bảo chiếm đủ chiều rộng của parent
    position: "absolute", // Quan trọng để các card xếp chồng lên nhau
  },
  cardOverflowHidden: {
    overflow: "hidden",
  },
  cardContent: {
    padding: scale(15),
  },
  imageContainer: {
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: scale(384),
    resizeMode: "cover",
  },
  profileImage: {
    width: "100%",
    height: scale(256),
    resizeMode: "cover",
  },
  badgeAbsolute: {
    position: "absolute",
    top: scale(16),
    right: scale(16),
  },
  userNameAge: {
    fontSize: scale(20),
    fontWeight: "bold",
  },
  userLocation: {
    fontSize: scale(16),
    flexDirection: "row",
    alignItems: "center",
  },
  bioText: {
    fontSize: scale(16),
    marginBottom: scale(12),
  },
  flexWrapGap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
  },
  swipeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: scale(24),
    gap: scale(16),
  },
  redBorderButton: {
    // This style is now mostly handled by `Button` component's variant and themed colors
  },
  pinkButton: {
    // This style is now mostly handled by `Button` component's variant and themed colors
  },
  buttonBase: {
    borderRadius: scale(8),
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  mb4: {
    marginBottom: scale(16),
  },
  spaceBetweenRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(16),
  },
});
