// DiscoverView.tsx
import Loading from "@/components/@core/loading";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { normalize } from "@/helper/helpers";
import DefaultLayout from "@/layouts/default-layout";
import useSwipe from "@/services/hooks/matching/useSwipe";
import useDiscover from "@/services/hooks/user/useDiscover";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import DiscoverItem from "./discover-item";

function DiscoverView() {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const {
    isLoading,
    data: discovers,
    onRefetch,
    isRefetching,
  } = useDiscover({});
  const { onSwipe, isLoading: isLoadingSwipe } = useSwipe();
  const backgroundFlash = useRef(new Animated.Value(0)).current;

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();

  const flashAnim = useRef(new Animated.Value(0)).current;
  const [swipeColor, setSwipeColor] = useState(currentColors.background);

  const flashBackground = (color: string) => {
    setSwipeColor(color);
    flashAnim.setValue(1);
    Animated.timing(flashAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const animatedBackgroundColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [currentColors.background, swipeColor],
  });

  const handleSwipeLeft = async (userId: string) => {
    flashBackground("#e74c3c");
    await onSwipe({
      userId,
      action: "PASS",
    });
    flatListRef.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
  };

  const handleSwipeRight = async (userId: string) => {
    flashBackground("#2ecc71");
    await onSwipe({
      userId,
      action: "LIKE",
    });
    flatListRef.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: currentColors.background },
        ]}
      >
        <Loading />
      </View>
    );
  }

  return (
    <DefaultLayout isLoading={isLoadingSwipe || isLoading}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: animatedBackgroundColor,
          justifyContent: "center",
          alignItems: "center",
          width: width,
        }}
      >
        <FlatList
          data={discovers || []}
          ref={flatListRef}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          style={{
            paddingTop: normalize(60),
          }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: normalize(10) }}
          renderItem={({ item, index }) => (
            <DiscoverItem
              data={item}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              index={index}
              currentIndex={currentIndex}
            />
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                onRefetch();
                setCurrentIndex(0);
              }}
              tintColor={currentColors.primary}
            />
          }
        />
      </Animated.View>
    </DefaultLayout>
  );
}

export default DiscoverView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
