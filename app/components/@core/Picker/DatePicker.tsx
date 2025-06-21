import TextDefault from "@/components/@core/text-default";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { scale } from "@/helper/helpers";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import moment from "moment";
import React, { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ButtonPrimary } from "../button";

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  title?: string;
  placeholder?: string;
}

interface MonthItem {
  label: string;
  value: number;
}

const NumberPicker = <T,>({
  data,
  selected,
  onSelect,
  label,
  renderItem,
}: {
  data: T[];
  selected: T;
  onSelect: (value: T) => void;
  label: string;
  renderItem?: (item: T) => string;
}) => {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];

  return (
    <View style={styles.pickerColumn}>
      <TextDefault style={[styles.pickerLabel, { color: currentColors.text }]}>
        {" "}
        {label}{" "}
      </TextDefault>
      <ScrollView
        style={styles.pickerScroll}
        showsVerticalScrollIndicator={false}
      >
        {data.map((item, index) => {
          const display = renderItem ? renderItem(item) : String(item);
          const isSelected = selected === item;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.pickerItem,
                isSelected && { backgroundColor: currentColors.primary },
              ]}
              onPress={() => onSelect(item)}
            >
              <TextDefault
                style={{
                  color: isSelected
                    ? currentColors.backgroundCard
                    : currentColors.text,
                  fontWeight: isSelected ? "bold" : "normal",
                }}
              >
                {display}
              </TextDefault>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const DatePicker = ({
  selectedDate,
  onDateChange,
  title = "Select Date",
  placeholder = "Select Date",
}: DatePickerProps) => {
  const { theme } = useTheme();
  const currentColors = Colors[theme || "light"];
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [selectedYear, setSelectedYear] = useState(
    moment(selectedDate || new Date()).year()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    moment(selectedDate || new Date()).month()
  );
  const [selectedDay, setSelectedDay] = useState(
    moment(selectedDate || new Date()).date()
  );

  const currentYear = moment().year();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);
  const months: MonthItem[] = moment
    .months()
    .map((label, i) => ({ value: i, label }));
  const days = Array.from(
    {
      length: moment({
        year: selectedYear,
        month: selectedMonth,
      }).daysInMonth(),
    },
    (_, i) => i + 1
  );

  const confirmDate = () => {
    const newDate = moment({
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
    }).toDate();
    onDateChange(newDate);
    bottomSheetRef.current?.close();
  };

  const openPicker = () => {
    const m = moment(selectedDate);
    setSelectedYear(m.year());
    setSelectedMonth(m.month());
    setSelectedDay(m.date());
    bottomSheetRef.current?.present();
  };

  const formatted =
    selectedDate && moment(selectedDate).isValid()
      ? moment(selectedDate).format("DD/MM/YYYY")
      : null;

  return (
    <>
      <Pressable
        onPress={openPicker}
        style={[styles.inputWrapper, { borderColor: currentColors.border }]}
      >
        <TextDefault
          style={{
            color: formatted ? currentColors.text : currentColors.textLight,
            fontSize: scale(16),
          }}
        >
          {formatted || placeholder}
        </TextDefault>
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={["60%"]}
        index={0}
        backgroundStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
      >
        <BottomSheetView style={{ padding: 20 }}>
          <TextDefault
            style={[styles.modalTitle, { color: currentColors.text }]}
          >
            {" "}
            {title}{" "}
          </TextDefault>

          <View style={styles.pickerContainer}>
            <NumberPicker
              data={years}
              selected={selectedYear}
              onSelect={setSelectedYear}
              label="Year"
            />
            <NumberPicker
              data={months}
              selected={months.find((m) => m.value === selectedMonth)!}
              onSelect={(m) => setSelectedMonth(m.value)}
              label="Month"
              renderItem={(m) => m.label}
            />
            <NumberPicker
              data={days}
              selected={selectedDay}
              onSelect={setSelectedDay}
              label="Day"
            />
          </View>

          <ButtonPrimary
            title="Confirm"
            onPress={confirmDate}
            minWidth={"100%"}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    borderWidth: 1,
    borderRadius: scale(8),
    paddingVertical: scale(12),
    paddingHorizontal: scale(14),
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
    marginBottom: scale(20),
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
    maxHeight: scale(150),
    width: "100%",
  },
  pickerItem: {
    padding: scale(10),
    alignItems: "center",
    borderRadius: scale(6),
    marginVertical: scale(2),
  },
  confirmButton: {
    padding: scale(15),
    borderRadius: scale(10),
    alignItems: "center",
  },
});

export default DatePicker;
