"use client";

import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { scale } from "@/helper/helpers";
import moment from "moment";
import React, {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const FreeTimePicker = ({
  freeTimes,
  onFreeTimesChange,
  title = "Chọn thời gian rảnh",
}: any) => {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  const [showPicker, setShowPicker] = useState(false);
  const [startHour, setStartHour] = useState(9);
  const [startMinute, setStartMinute] = useState(0);
  const [durationHours, setDurationHours] = useState(1);
  const [durationMinutes, setDurationMinutes] = useState(0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const durationHourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const durationMinuteOptions = Array.from({ length: 60 }, (_, i) => i);

  const calculateEndTime = (
    startH: number,
    startM: number,
    durH: moment.DurationInputArg1,
    durM: moment.DurationInputArg1
  ) => {
    const startMoment = moment().hour(startH).minute(startM).second(0);
    const endMoment = startMoment
      .clone()
      .add(durH, "hours")
      .add(durM, "minutes");
    return endMoment;
  };

  const formatTimeRange = (
    startH: number,
    startM: number,
    durH: moment.DurationInputArg1,
    durM: moment.DurationInputArg1
  ) => {
    const startTime = moment().hour(startH).minute(startM).format("HH:mm");
    const endTime = calculateEndTime(startH, startM, durH, durM).format(
      "HH:mm"
    );
    const safeDurH = typeof durH === "number" ? durH : Number(durH) || 0;
    const safeDurM = typeof durM === "number" ? durM : Number(durM) || 0;
    const durationText =
      safeDurH > 0 && safeDurM > 0
        ? `${safeDurH}h ${safeDurM}p`
        : safeDurH > 0
        ? `${safeDurH}h`
        : `${safeDurM}p`;

    return {
      display: `${startTime} - ${endTime} (${durationText})`,
      start: startTime,
      end: endTime,
      duration: durationText,
    };
  };

  const addFreeTime = () => {
    const timeRange = formatTimeRange(
      startHour,
      startMinute,
      durationHours,
      durationMinutes
    );
    const exists = freeTimes.some(
      (ft: { start: string; end: string }) =>
        ft.start === timeRange.start && ft.end === timeRange.end
    );
    if (!exists) {
      onFreeTimesChange([...freeTimes, timeRange]);
    }
    setShowPicker(false);
  };

  const removeFreeTime = (index: any) => {
    onFreeTimesChange(freeTimes.filter((_: any, i: any) => i !== index));
  };

  const NumberPicker = ({ data, selected, onSelect, label }: any) => (
    <View style={styles.pickerColumn}>
      <TextDefault style={[styles.pickerLabel, { color: currentColors.text }]}>
        {label}
      </TextDefault>
      <ScrollView
        style={styles.pickerScroll}
        showsVerticalScrollIndicator={false}
      >
        {data.map((item: Key | null | undefined) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.pickerItem,
              selected === item && { backgroundColor: currentColors.primary },
            ]}
            onPress={() => onSelect(item)}
          >
            <TextDefault
              style={[
                styles.pickerItemText,
                {
                  color:
                    selected === item
                      ? currentColors.backgroundCard
                      : currentColors.text,
                },
              ]}
            >
              {(item ?? "").toString().padStart(2, "0")}
            </TextDefault>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundCard },
      ]}
    >
      <View style={styles.freeTimesContainer}>
        {freeTimes.map(
          (
            freeTime: {
              display:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | null
                | undefined;
            },
            index: Key | null | undefined
          ) => (
            <View
              key={index}
              style={[
                styles.freeTimeChip,
                { backgroundColor: currentColors.background },
              ]}
            >
              <View style={styles.freeTimeInfo}>
                <TextDefault
                  style={[styles.freeTimeText, { color: currentColors.text }]}
                >
                  {freeTime.display}
                </TextDefault>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFreeTime(index)}
              >
                <TextDefault
                  style={[
                    styles.removeButtonText,
                    { color: currentColors.danger },
                  ]}
                >
                  ×
                </TextDefault>
              </TouchableOpacity>
            </View>
          )
        )}
      </View>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: currentColors.primary }]}
        onPress={() => setShowPicker(true)}
      >
        <TextDefault
          style={[
            styles.addButtonText,
            { color: currentColors.backgroundCard },
          ]}
        >
          + Add Free Time
        </TextDefault>
      </TouchableOpacity>

      <Modal visible={showPicker} transparent={true} animationType="slide">
        <View
          style={styles.modalOverlay}
          onTouchEnd={() => setShowPicker(false)}
        >
          <View
            onTouchEnd={(e) => e.stopPropagation()}
            style={[
              styles.modalContent,
              { backgroundColor: currentColors.backgroundCard },
            ]}
          >
            <TextDefault
              style={[styles.modalTitle, { color: currentColors.text }]}
            >
              Pick Free Time
            </TextDefault>

            <TextDefault
              style={[styles.sectionTitle, { color: currentColors.text }]}
            >
              Start time
            </TextDefault>
            <View style={styles.pickerRow}>
              <NumberPicker
                data={hours}
                selected={startHour}
                onSelect={setStartHour}
                label="Hours"
              />
              <NumberPicker
                data={minutes}
                selected={startMinute}
                onSelect={setStartMinute}
                label="Minutes"
              />
            </View>

            <TextDefault
              style={[styles.sectionTitle, { color: currentColors.text }]}
            >
              Duration free time
            </TextDefault>
            <View style={styles.pickerRow}>
              <NumberPicker
                data={durationHourOptions}
                selected={durationHours}
                onSelect={setDurationHours}
                label="Hours"
              />
              <NumberPicker
                data={durationMinuteOptions}
                selected={durationMinutes}
                onSelect={setDurationMinutes}
                label="Minutes"
              />
            </View>

            <View
              style={[
                styles.previewContainer,
                { backgroundColor: currentColors.background },
              ]}
            >
              <TextDefault
                style={[
                  styles.previewLabel,
                  { color: currentColors.textLight },
                ]}
              >
                Free Time Preview
              </TextDefault>
              <TextDefault
                style={[styles.previewText, { color: currentColors.primary }]}
              >
                {
                  formatTimeRange(
                    startHour,
                    startMinute,
                    durationHours,
                    durationMinutes
                  ).display
                }
              </TextDefault>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: currentColors.background },
                ]}
                onPress={() => setShowPicker(false)}
              >
                <TextDefault
                  style={[
                    styles.cancelButtonText,
                    { color: currentColors.text },
                  ]}
                >
                  Cancel
                </TextDefault>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: currentColors.primary },
                ]}
                onPress={addFreeTime}
              >
                <TextDefault
                  style={[
                    styles.confirmButtonText,
                    { color: currentColors.backgroundCard },
                  ]}
                >
                  Add
                </TextDefault>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(8),
  },
  freeTimesContainer: {
    marginBottom: scale(10),
  },
  freeTimeChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: scale(10),
    padding: scale(12),
    marginVertical: scale(4),
  },
  freeTimeInfo: {
    flex: 1,
  },
  freeTimeText: {
    fontSize: scale(14),
    fontWeight: "500",
  },
  removeButton: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: scale(10),
  },
  removeButtonText: {
    fontSize: scale(18),
    fontWeight: "bold",
  },
  addButton: {
    padding: scale(12),
    borderRadius: scale(8),
    alignItems: "center",
  },
  addButtonText: {
    fontSize: scale(14),
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: scale(15),
    padding: scale(20),
    width: "100%",
    maxHeight: "90%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: scale(20),
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: "600",
    marginBottom: scale(10),
    marginTop: scale(10),
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: scale(150),
    marginBottom: scale(10),
  },
  pickerColumn: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: scale(5),
  },
  pickerLabel: {
    fontSize: scale(14),
    fontWeight: "600",
    marginBottom: scale(10),
  },
  pickerScroll: {
    flex: 1,
    width: "100%",
  },
  pickerItem: {
    padding: scale(8),
    alignItems: "center",
    borderRadius: scale(5),
    marginVertical: scale(1),
  },
  pickerItemText: {
    fontSize: scale(14),
  },
  previewContainer: {
    padding: scale(15),
    borderRadius: scale(8),
    marginVertical: scale(15),
    alignItems: "center",
  },
  previewLabel: {
    fontSize: scale(14),
    marginBottom: scale(5),
  },
  previewText: {
    fontSize: scale(16),
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    flex: 1,
    padding: scale(15),
    borderRadius: scale(8),
    alignItems: "center",
    marginHorizontal: scale(5),
  },
  cancelButtonText: {
    fontWeight: "600",
  },
  confirmButtonText: {
    fontWeight: "600",
  },
});

export default FreeTimePicker;
