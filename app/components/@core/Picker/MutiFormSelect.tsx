import moment from "moment";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TimePicker from "../TimePicker";
import DatePicker from "./DatePicker";
import FreeTimePicker from "./FreeTimePicker";
import RangePicker from "./RangerPicker";

// Cấu hình moment để hiển thị tiếng Việt
moment.locale("vi");

type FreeTime = { display: string; [key: string]: any };

const MultiSelectForm = () => {
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [freeTimes, setFreeTimes] = useState<FreeTime[]>([]);
  const [minValue, setMinValue] = useState<number>(20);
  const [maxValue, setMaxValue] = useState<number>(80);

  const handleRangeChange = (
    min: React.SetStateAction<number>,
    max: React.SetStateAction<number>
  ) => {
    setMinValue(min);
    setMaxValue(max);
  };

  const handleSubmit = () => {
    const formData = {
      selectedTimes,
      selectedDate: moment(selectedDate).format("DD/MM/YYYY - dddd"),
      freeTimes,
      range: { min: minValue, max: maxValue },
    };

    Alert.alert("Dữ liệu form", JSON.stringify(formData, null, 2), [
      { text: "OK" },
    ]);
  };

  const resetForm = () => {
    setSelectedTimes([]);
    setSelectedDate(new Date());
    setFreeTimes([]);
    setMinValue(20);
    setMaxValue(80);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Form Chọn Thời Gian</Text>

      <TimePicker
        selectedTimes={selectedTimes}
        onTimesChange={setSelectedTimes}
        title="Chọn các thời điểm cụ thể"
      />

      <DatePicker
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        title="Chọn ngày"
      />

      <FreeTimePicker
        freeTimes={freeTimes}
        onFreeTimesChange={setFreeTimes}
        title="Chọn thời gian rảnh"
      />

      <RangePicker
        minValue={minValue}
        maxValue={maxValue}
        onRangeChange={handleRangeChange}
        min={0}
        max={100}
        title="Chọn khoảng giá trị"
      />

      {/* Tóm tắt dữ liệu */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Tóm tắt lựa chọn</Text>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Thời điểm:</Text>
          <Text style={styles.summaryValue}>
            {selectedTimes.length > 0 ? selectedTimes.join(", ") : "Chưa chọn"}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Ngày:</Text>
          <Text style={styles.summaryValue}>
            {moment(selectedDate).format("DD/MM/YYYY - dddd")}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Thời gian rảnh:</Text>
          <Text style={styles.summaryValue}>
            {freeTimes.length > 0
              ? freeTimes.map((ft) => ft.display).join("\n")
              : "Chưa chọn"}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Khoảng giá trị:</Text>
          <Text style={styles.summaryValue}>
            {minValue} - {maxValue}
          </Text>
        </View>
      </View>

      {/* Nút hành động */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
          <Text style={styles.resetButtonText}>Đặt lại</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Gửi form</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  summaryContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  summaryItem: {
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#6c757d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MultiSelectForm;
