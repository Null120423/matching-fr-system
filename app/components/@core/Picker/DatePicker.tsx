"use client";

import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { scale } from "@/helper/helpers";
import moment from "moment";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const DatePicker = ({
  selectedDate,
  onDateChange,
  title = "Chọn ngày",
}: any) => {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  const [showPicker, setShowPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(moment(selectedDate).year());
  const [selectedMonth, setSelectedMonth] = useState(
    moment(selectedDate).month()
  );
  const [selectedDay, setSelectedDay] = useState(moment(selectedDate).date());

  const currentYear = moment().year();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: moment().month(i).format("MMMM"),
  }));

  const getDaysInMonth = (year: number, month: number) => {
    const daysCount = moment({ year, month }).daysInMonth();
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  };

  const days = getDaysInMonth(selectedYear, selectedMonth);

  const confirmDate = () => {
    const newDate = moment({
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
    }).toDate();
    onDateChange(newDate);
    setShowPicker(false);
  };

  const NumberPicker = ({
    data,
    selected,
    onSelect,
    label,
    renderItem,
  }: any) => (
    <View style={styles.pickerColumn}>
      <TextDefault style={[styles.pickerLabel, { color: currentColors.text }]}>
        {label}
      </TextDefault>
      <ScrollView
        style={styles.pickerScroll}
        showsVerticalScrollIndicator={false}
      >
        {data.map((item: any) => {
          const value = typeof item === "object" ? item.value : item;
          const displayText = renderItem ? renderItem(item) : item.toString();

          return (
            <TouchableOpacity
              key={value}
              style={[
                styles.pickerItem,
                selected === value && {
                  backgroundColor: currentColors.primary,
                },
              ]}
              onPress={() => onSelect(value)}
            >
              <TextDefault
                style={[
                  styles.pickerItemText,
                  {
                    color:
                      selected === value
                        ? currentColors.backgroundCard
                        : currentColors.text,
                  },
                ]}
              >
                {displayText}
              </TextDefault>
            </TouchableOpacity>
          );
        })}
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
      <TouchableOpacity
        style={[styles.dateButton, { backgroundColor: currentColors.primary }]}
        onPress={() => setShowPicker(true)}
      >
        <TextDefault
          style={[
            styles.dateButtonText,
            { color: currentColors.backgroundCard },
          ]}
        >
          {moment(selectedDate).format("DD/MM/YYYY - dddd")}
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
              Chọn ngày
            </TextDefault>

            <View style={styles.pickerContainer}>
              <NumberPicker
                data={years}
                selected={selectedYear}
                onSelect={setSelectedYear}
                label="Năm"
              />
              <NumberPicker
                data={months}
                selected={selectedMonth}
                onSelect={setSelectedMonth}
                label="Tháng"
                renderItem={(item: { label: any }) => item.label}
              />
              <NumberPicker
                data={days}
                selected={selectedDay}
                onSelect={setSelectedDay}
                label="Ngày"
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
                {moment({
                  year: selectedYear,
                  month: selectedMonth,
                  day: selectedDay,
                }).format("DD/MM/YYYY - dddd")}
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
                onPress={confirmDate}
              >
                <TextDefault
                  style={[
                    styles.confirmButtonText,
                    { color: currentColors.backgroundCard },
                  ]}
                >
                  Chọn
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
  dateButton: {
    padding: scale(15),
    borderRadius: scale(8),
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: scale(16),
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

export default DatePicker;
