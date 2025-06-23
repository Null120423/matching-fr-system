// DiscoverItem.tsx
import { Badge } from "@/components/@core";
import { IconButton } from "@/components/@core/button";
import Card from "@/components/@core/card";
import { styleGlobal } from "@/components/@core/styles";
import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { UserDTO } from "@/dto";
import { deviceWidth } from "@/helper";
import { scale } from "@/helper/helpers";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface DiscoverItemProps {
  data: UserDTO;
  onSwipeLeft: (userId: string) => void;
  onSwipeRight: (userId: string) => void;
  index: number;
  currentIndex: number;
}

function DiscoverItem({
  data,
  onSwipeLeft,
  onSwipeRight,
  index,
  currentIndex,
}: DiscoverItemProps) {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  const inputRange = [index - 1, index, index + 1];
  const animatedStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(currentIndex, inputRange, [0.8, 1, 0.8]);
    const rotateZValue = interpolate(currentIndex, inputRange, [-10, 0, 10]);
    return {
      transform: [
        { scale: withTiming(scaleValue) },
        { rotateZ: withTiming(`${rotateZValue}deg`) },
      ],
    };
  }, [currentIndex]);

  const handleDetail = () => {
    router.push({
      pathname: "/(common)/user-profile",
      params: { userId: data.id },
    });
  };

  return (
    <Animated.View
      style={[styles.cardContainer, styleGlobal.shadow, animatedStyle]}
    >
      <Card
        style={[
          styles.cardOverflowHidden,
          { backgroundColor: currentColors.backgroundCard },
        ]}
        onClick={handleDetail}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: data.avatarUrl,
            }}
            style={styles.mainImage}
            accessibilityLabel={data.username}
          />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.spaceBetweenRow}>
            <View>
              <TextDefault
                style={[styles.userNameAge, { color: currentColors.text }]}
              >
                {data.username}
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
                  color={currentColors.textSecondary}
                />
                {data.location}
              </TextDefault>
            </View>
          </View>

          <View style={styles.mb4}>
            <TextDefault
              numberOfLines={1}
              style={[styles.bioText, { color: currentColors.textSecondary }]}
            >
              {data.bio}
            </TextDefault>
            <View style={styles.flexWrapGap}>
              {data.activities?.map((interest: string, index: number) => (
                <Badge key={index} variant="default">
                  {interest}
                </Badge>
              ))}
            </View>
          </View>

          <View style={styles.swipeButtonsContainer}>
            <IconButton
              icon={
                <Ionicons
                  name="close-outline"
                  size={scale(25)}
                  color={currentColors.text}
                />
              }
              onPress={() => onSwipeLeft(data.id)}
            />
            <IconButton
              backgroundColor={currentColors.primary}
              icon={
                <Ionicons
                  name="heart"
                  size={scale(25)}
                  color={currentColors.text}
                />
              }
              onPress={() => onSwipeRight(data.id)}
            />
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

export default DiscoverItem;

const styles = StyleSheet.create({
  cardContainer: {
    width: deviceWidth * 0.85,
    marginHorizontal: deviceWidth * 0.075,
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
