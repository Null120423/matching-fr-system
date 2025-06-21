import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

// Generic type definitions
interface PickerOption<T = string> {
  label: string;
  value: T;
}

interface GenericModalPickerProps<T> {
  selectedValue: T;
  onValueChange: (value: T) => void;
  options: PickerOption<T>[];
  placeholder?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  modalTitle?: string;
  disabled?: boolean;
  renderOption?: (
    option: PickerOption<T>,
    isSelected: boolean
  ) => React.ReactNode;
}

// Generic Modal Picker Component
function GenericModalPicker<T = string>({
  selectedValue,
  onValueChange,
  options,
  placeholder = "Select an option",
  style,
  textStyle,
  modalTitle = "Select Option",
  disabled = false,
  renderOption,
}: GenericModalPickerProps<T>): JSX.Element {
  const [visible, setVisible] = useState<boolean>(false);

  const handleSelect = (value: T): void => {
    onValueChange(value);
    setVisible(false);
  };

  const getSelectedLabel = (): string => {
    const selected = options.find(
      (opt: PickerOption<T>) => opt.value === selectedValue
    );
    return selected ? selected.label : placeholder;
  };

  const openModal = (): void => {
    if (!disabled) {
      setVisible(true);
    }
  };

  const defaultRenderOption = (
    option: PickerOption<T>,
    isSelected: boolean
  ): React.ReactNode => (
    <>
      <Text style={[styles.optionTitle, isSelected && styles.selectedText]}>
        {option.label}
      </Text>
      {isSelected && <Text style={styles.checkmark}>✓</Text>}
    </>
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.trigger, style, disabled && styles.disabled]}
        onPress={openModal}
        disabled={disabled}
      >
        <Text
          style={[
            styles.triggerText,
            textStyle,
            disabled && styles.disabledText,
          ]}
        >
          {getSelectedLabel()}
        </Text>
        <Text style={[styles.dropdownIcon, disabled && styles.disabledText]}>
          ▼
        </Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsContainer}>
              {options.map((option: PickerOption<T>, index: number) => {
                const isSelected = selectedValue === option.value;
                return (
                  <TouchableOpacity
                    key={String(option.value)}
                    style={[
                      styles.optionItem,
                      isSelected && styles.selectedOption,
                      index === options.length - 1 && styles.lastOption,
                    ]}
                    onPress={() => handleSelect(option.value)}
                  >
                    {renderOption
                      ? renderOption(option, isSelected)
                      : defaultRenderOption(option, isSelected)}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.005)",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  triggerText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownIcon: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
  disabled: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ddd",
  },
  disabledText: {
    color: "#999",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: "70%",
    paddingBottom: 10,
    overflow: "hidden",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  closeButton: {
    padding: 6,
  },
  closeButtonText: {
    fontSize: 22,
    color: "#666",
  },

  optionsContainer: {
    paddingHorizontal: 10,
  },

  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastOption: {
    borderBottomWidth: 0,
  },

  optionTitle: {
    fontSize: 16,
    color: "#444",
  },
  selectedOption: {
    backgroundColor: "#007AFF22",
  },
  selectedText: {
    color: "#007AFF",
    fontWeight: "700",
  },

  checkmark: {
    fontSize: 18,
    color: "#007AFF",
  },
});

export default GenericModalPicker;
export type { GenericModalPickerProps, PickerOption };
