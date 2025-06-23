"use client";

import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { scale } from "@/helper/helpers";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const TimePicker = ({
  selectedTimes,
  onTimesChange,
  title = "Chọn thời gian",
}: any) => {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  const [showPicker, setShowPicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedSecond, setSelectedSecond] = useState(0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const seconds = Array.from({ length: 60 }, (_, i) => i);

  const formatTime = (hour: number, minute: number, second: number) => {
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
  };

  const addTime = () => {
    const timeString = formatTime(selectedHour, selectedMinute, selectedSecond);
    if (!selectedTimes.includes(timeString)) {
      onTimesChange([...selectedTimes, timeString].sort());
    }
    setShowPicker(false);
  };

  const removeTime = (timeToRemove: any) => {
    onTimesChange(selectedTimes.filter((time: any) => time !== timeToRemove));
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
        {data.map((item: any) => (
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
              {item.toString().padStart(2, "0")}
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
      <View style={styles.selectedTimesContainer}>
        {selectedTimes.map((time: any, index: number) => (
          <View
            key={index}
            style={[
              styles.timeChip,
              { backgroundColor: currentColors.primary },
            ]}
          >
            <TextDefault
              style={[
                styles.timeChipText,
                { color: currentColors.backgroundCard },
              ]}
            >
              {time}
            </TextDefault>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeTime(time)}
            >
              <TextDefault
                style={[
                  styles.removeButtonText,
                  { color: currentColors.backgroundCard },
                ]}
              >
                ×
              </TextDefault>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: currentColors.success }]}
        onPress={() => setShowPicker(true)}
      >
        <TextDefault
          style={[
            styles.addButtonText,
            { color: currentColors.backgroundCard },
          ]}
        >
          + Thêm thời gian
        </TextDefault>
      </TouchableOpacity>

      <Modal visible={showPicker} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: currentColors.backgroundCard },
            ]}
          >
            <TextDefault
              style={[styles.modalTitle, { color: currentColors.text }]}
            >
              Chọn thời gian
            </TextDefault>

            <View style={styles.pickerContainer}>
              <NumberPicker
                data={hours}
                selected={selectedHour}
                onSelect={setSelectedHour}
                label="Giờ"
              />
              <NumberPicker
                data={minutes}
                selected={selectedMinute}
                onSelect={setSelectedMinute}
                label="Phút"
              />
              <NumberPicker
                data={seconds}
                selected={selectedSecond}
                onSelect={setSelectedSecond}
                label="Giây"
              />
            </View>

            <View
              style={[
                styles.previewContainer,
                { backgroundColor: currentColors.background },
              ]}
            >
              <TextDefault
                style={[styles.previewText, { color: currentColors.primary }]}
              >
                Thời gian:
                {formatTime(selectedHour, selectedMinute, selectedSecond)}
              </TextDefault>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: currentColors.textLight },
                ]}
                onPress={() => setShowPicker(false)}
              >
                <TextDefault
                  style={[
                    styles.cancelButtonText,
                    { color: currentColors.text },
                  ]}
                >
                  Hủy
                </TextDefault>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: currentColors.primary },
                ]}
                onPress={addTime}
              >
                <TextDefault
                  style={[
                    styles.confirmButtonText,
                    { color: currentColors.backgroundCard },
                  ]}
                >
                  Thêm
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
    padding: scale(12),
    marginVertical: scale(8),
  },
  selectedTimesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: scale(10),
  },
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: scale(20),
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    margin: scale(4),
  },
  timeChipText: {
    fontSize: scale(14),
    fontWeight: "500",
  },
  removeButton: {
    marginLeft: scale(8),
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    fontSize: scale(16),
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
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: scale(20),
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: scale(200),
  },
  pickerColumn: {
    flex: 1,
    alignItems: "center",
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
    padding: scale(10),
    alignItems: "center",
    borderRadius: scale(5),
    marginVertical: scale(2),
  },
  pickerItemText: {
    fontSize: scale(16),
  },
  previewContainer: {
    padding: scale(15),
    borderRadius: scale(8),
    marginVertical: scale(15),
    alignItems: "center",
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

export default TimePicker;
