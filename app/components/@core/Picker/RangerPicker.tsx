"use client";

import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { scale } from "@/helper/helpers";
import React, { useState } from "react";
import { Dimensions, PanResponder, StyleSheet, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const SLIDER_WIDTH = screenWidth - 120;

const RangePicker = ({
  minValue,
  maxValue,
  onRangeChange,
  min = 0,
  max = 100,
  title = "Chọn khoảng giá trị",
}: any) => {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  const [sliderWidth, setSliderWidth] = useState(SLIDER_WIDTH);

  const getPositionFromValue = (value: any) => {
    return ((value - min) / (max - min)) * sliderWidth;
  };

  const getValueFromPosition = (position: any) => {
    const value = (position / sliderWidth) * (max - min) + min;
    return Math.round(Math.max(min, Math.min(max, value)));
  };

  const createPanResponder = (isMin: any) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const position = Math.max(
          0,
          Math.min(sliderWidth, gestureState.moveX - 60)
        );
        const newValue = getValueFromPosition(position);

        if (isMin) {
          if (newValue < maxValue) {
            onRangeChange(newValue, maxValue);
          }
        } else {
          if (newValue > minValue) {
            onRangeChange(minValue, newValue);
          }
        }
      },
    });
  };

  const minPanResponder = createPanResponder(true);
  const maxPanResponder = createPanResponder(false);

  const minPosition = getPositionFromValue(minValue);
  const maxPosition = getPositionFromValue(maxValue);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundCard },
      ]}
    >
      <View style={styles.valuesContainer}>
        <View
          style={[
            styles.valueBox,
            { backgroundColor: currentColors.background },
          ]}
        >
          <TextDefault
            style={[styles.valueLabel, { color: currentColors.textLight }]}
          >
            Min
          </TextDefault>
          <TextDefault
            style={[styles.valueText, { color: currentColors.primary }]}
          >
            {minValue}
          </TextDefault>
        </View>
        <View
          style={[
            styles.valueBox,
            { backgroundColor: currentColors.background },
          ]}
        >
          <TextDefault
            style={[styles.valueLabel, { color: currentColors.textLight }]}
          >
            Max
          </TextDefault>
          <TextDefault
            style={[styles.valueText, { color: currentColors.primary }]}
          >
            {maxValue}
          </TextDefault>
        </View>
      </View>

      <View style={styles.sliderContainer}>
        <View
          style={styles.sliderTrack}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setSliderWidth(width);
          }}
        >
          <View
            style={[
              styles.trackBackground,
              { backgroundColor: currentColors.border },
            ]}
          />

          <View
            style={[
              styles.trackSelected,
              {
                left: minPosition,
                width: maxPosition - minPosition,
                backgroundColor: currentColors.primary,
              },
            ]}
          />

          <View
            style={[
              styles.thumb,
              {
                left: minPosition - 10,
              },
            ]}
            {...minPanResponder.panHandlers}
          >
            <View
              style={[
                styles.thumbInner,
                { backgroundColor: currentColors.primary },
              ]}
            />
          </View>

          <View
            style={[
              styles.thumb,
              {
                left: maxPosition - 10,
              },
            ]}
            {...maxPanResponder.panHandlers}
          >
            <View
              style={[
                styles.thumbInner,
                { backgroundColor: currentColors.primary },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.labelsContainer}>
        <TextDefault
          style={[styles.labelText, { color: currentColors.textLight }]}
        >
          {min}
        </TextDefault>
        <TextDefault
          style={[styles.labelText, { color: currentColors.textLight }]}
        >
          {max}
        </TextDefault>
      </View>

      <View
        style={[
          styles.rangeDisplay,
          { backgroundColor: currentColors.background },
        ]}
      >
        <TextDefault
          style={[styles.rangeText, { color: currentColors.primary }]}
        >
          Khoảng đã chọn: {minValue} - {maxValue}
        </TextDefault>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(8),
    padding: scale(15),
    marginVertical: scale(8),
  },
  valuesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: scale(20),
  },
  valueBox: {
    padding: scale(12),
    borderRadius: scale(8),
    alignItems: "center",
    flex: 1,
    marginHorizontal: scale(5),
  },
  valueLabel: {
    fontSize: scale(12),
    marginBottom: scale(4),
  },
  valueText: {
    fontSize: scale(18),
    fontWeight: "bold",
  },
  sliderContainer: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(20),
  },
  sliderTrack: {
    height: scale(40),
    justifyContent: "center",
    position: "relative",
  },
  trackBackground: {
    height: scale(4),
    borderRadius: scale(2),
  },
  trackSelected: {
    position: "absolute",
    height: scale(4),
    borderRadius: scale(2),
  },
  thumb: {
    position: "absolute",
    width: scale(20),
    height: scale(20),
    justifyContent: "center",
    alignItems: "center",
    top: scale(10),
  },
  thumbInner: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    borderWidth: scale(2),
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(10),
    marginTop: scale(10),
  },
  labelText: {
    fontSize: scale(12),
  },
  rangeDisplay: {
    padding: scale(12),
    borderRadius: scale(8),
    alignItems: "center",
    marginTop: scale(15),
  },
  rangeText: {
    fontSize: scale(14),
    fontWeight: "600",
  },
});

export default RangePicker;
