import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TimePicker = ({
  selectedTimes,
  onTimesChange,
  title = "Chọn thời gian",
}: any) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedSecond, setSelectedSecond] = useState(0);

  // Tạo mảng giờ, phút, giây
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
              selected === item && styles.selectedPickerItem,
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

      {/* Hiển thị thời gian đã chọn */}
      <View style={styles.selectedTimesContainer}>
        {selectedTimes.map((time: any, index: React.Key | null | undefined) => (
          <View key={index} style={styles.timeChip}>
            <Text style={styles.timeChipText}>{time}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeTime(time)}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Nút thêm thời gian */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.addButtonText}>+ Thêm thời gian</Text>
      </TouchableOpacity>

      {/* Modal chọn thời gian */}
      <Modal visible={showPicker} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn thời gian</Text>

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

            <View style={styles.previewContainer}>
              <Text style={styles.previewText}>
                Thời gian:{" "}
                {formatTime(selectedHour, selectedMinute, selectedSecond)}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={addTime}
              >
                <Text style={styles.confirmButtonText}>Thêm</Text>
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
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
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
    backgroundColor: "#34C759",
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
    width: "90%",
    maxHeight: "80%",
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
  selectedPickerItem: {
    backgroundColor: "#007AFF",
  },
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
