import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ButtonPrimary } from "./button";

const TimePicker = ({
  selectedTimes,
  onTimesChange,
  title = "Select Time",
}: any) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedSecond, setSelectedSecond] = useState(0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const seconds = Array.from({ length: 60 }, (_, i) => i);

  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  const formatTime = (hour: number, minute: number, second: number) =>
    `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;

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

  const NumberPicker = ({ data, selected, onSelect, label, color }: any) => (
    <View style={styles.pickerColumn}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <ScrollView
        style={styles.pickerScroll}
        showsVerticalScrollIndicator={false}
      >
        {data.map((item: any) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.pickerItem,
              selected === item && {
                backgroundColor: color,
              },
            ]}
            onPress={() => onSelect(item)}
          >
            <Text
              style={[
                styles.pickerItemText,
                selected === item && styles.selectedPickerItemText,
              ]}
            >
              {item.toString().padStart(2, "0")}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Selected Times */}
      <View style={styles.selectedTimesContainer}>
        {selectedTimes.length === 0 ? (
          <Text style={styles.emptyText}>No time selected</Text>
        ) : (
          selectedTimes.map(
            (time: any, index: React.Key | null | undefined) => (
              <View
                key={index}
                style={[
                  styles.timeChip,
                  {
                    backgroundColor: currentColors.primary,
                  },
                ]}
              >
                <Text style={styles.timeChipText}>{time}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeTime(time)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            )
          )
        )}
      </View>

      {/* Add Time Button */}
      <TouchableOpacity
        style={[
          styles.addButton,
          {
            backgroundColor: currentColors.primary,
          },
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.addButtonText}>+ Add Time</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={showPicker} transparent animationType="slide">
        <View
          style={styles.modalOverlay}
          onTouchEnd={() => setShowPicker(false)}
        >
          <View
            style={styles.modalContent}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Select Time</Text>

            <View style={styles.pickerContainer}>
              <NumberPicker
                data={hours}
                selected={selectedHour}
                onSelect={setSelectedHour}
                label="Hour"
                color={currentColors.primary}
              />
              <NumberPicker
                data={minutes}
                selected={selectedMinute}
                onSelect={setSelectedMinute}
                label="Minute"
                color={currentColors.primary}
              />
              <NumberPicker
                data={seconds}
                selected={selectedSecond}
                onSelect={setSelectedSecond}
                label="Second"
                color={currentColors.primary}
              />
            </View>

            <View style={styles.previewContainer}>
              <Text style={styles.previewText}>
                Selected Time:{" "}
                {formatTime(selectedHour, selectedMinute, selectedSecond)}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <ButtonPrimary
                title="Confirm"
                minWidth={"100%"}
                onPress={addTime}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  selectedTimesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  timeChipText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  removeButton: {
    marginLeft: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 200,
  },
  pickerColumn: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    color: "#666",
  },
  pickerScroll: {
    flex: 1,
    width: "100%",
  },
  pickerItem: {
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 2,
  },
  selectedPickerItem: {},
  pickerItemText: {
    fontSize: 16,
    color: "#333",
  },
  selectedPickerItemText: {
    color: "white",
    fontWeight: "bold",
  },
  previewContainer: {
    backgroundColor: "#f0f8ff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 15,
    alignItems: "center",
  },
  previewText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default TimePicker;
