import { normalize } from "@/helper/helpers";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Row from "./row";
import { styleGlobal } from "./styles";
import TextDefault from "./text-default";

type InputProps = {
  onChangeText?: (text: string) => void;
  text: string | undefined;
  label?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  multiple?: boolean;
  isCenterLabel?: boolean;
  width?: string | number;
  rounded?: number;
  keyBroadType?: "default" | "email-address" | "numeric" | "phone-pad";
  required?: boolean;
  editable?: boolean;
  error?: string;
  onChangeValue?: (date: Date) => void;
  isWithoutInput?: boolean;
  size?: number;
};
const Input = ({
  onChangeText,
  text,
  label,
  placeholder,
  leftIcon,
  multiple,
  isCenterLabel = false,
  width = "100%",
  rounded = normalize(14),
  keyBroadType,
  required,
  editable = true,
  size = normalize(14),
}: InputProps) => {
  return (
    <Row
      style={{
        width: width as any,
      }}
      full
      direction="column"
      start
      rowGap={5}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {label && (
        <Row start={!isCenterLabel} center={isCenterLabel} full>
          {required && (
            <TextDefault style={[styles.label, { color: "red" }]}>
              {"* "}
            </TextDefault>
          )}
          <TextDefault bold style={[styles.label, { color: "black" }]}>
            {label}
          </TextDefault>
        </Row>
      )}

      <Row
        full
        start
        style={{
          alignItems: "center",
        }}
      >
        {leftIcon && leftIcon}
        <TextInput
          style={[
            styleGlobal.input,
            {
              backgroundColor: editable ? "#fff" : "#f0f0f0",
              width: "100%",
              borderRadius: rounded,
              fontSize: size,
              ...styleGlobal.border,
              borderColor: editable ? "rgba(116, 90, 255, 0.3)" : "gray",
              color: "black",
            },
          ]}
          editable={editable}
          selectionColor={"black"}
          cursorColor={"black"}
          multiline={multiple}
          autoCapitalize="none"
          keyboardType={keyBroadType}
          placeholder={placeholder}
          placeholderTextColor={"gray"}
          onChangeText={onChangeText}
          value={text}
        />
      </Row>
    </Row>
  );
};

const InputPassword = ({
  onChangeText,
  text,
  label,
  placeholder,
  leftIcon,
  isCenterLabel,
  rounded = 10,
  required,
}: InputProps) => {
  const [isPass, setIsPass] = useState(true);

  return (
    <Row
      full
      direction="column"
      start
      rowGap={5}
      style={[{ position: "relative" }]}
    >
      {label && (
        <Row start={!isCenterLabel} center={isCenterLabel} full>
          {required && (
            <TextDefault style={[styles.label, { color: "red" }]}>
              {"* "}
            </TextDefault>
          )}
          <TextDefault style={[styles.label, { color: "black" }]}>
            {label}
          </TextDefault>
        </Row>
      )}

      <Row
        full
        start
        style={{
          alignItems: "center",
          backgroundColor: "#fff",
          ...styleGlobal.input,
          padding: 0,
          ...styleGlobal.border,
          borderColor: "rgba(116, 90, 255, 0.3)",
        }}
      >
        {leftIcon && leftIcon}
        <TextInput
          autoCapitalize="none"
          keyboardType="default"
          selectionColor={"black"}
          cursorColor={"black"}
          secureTextEntry={isPass}
          placeholder={placeholder}
          placeholderTextColor={"gray"}
          style={[
            styles.input,
            { width: "100%", borderRadius: rounded, color: "black" },
          ]}
          onChangeText={onChangeText}
          value={text}
        />
      </Row>

      <TouchableOpacity
        style={styles.iconShowPass}
        onPress={() => setIsPass(!isPass)}
      >
        <Feather name={!isPass ? "eye" : "eye-off"} size={18} color={"black"} />
      </TouchableOpacity>
    </Row>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 10,
    paddingVertical: 12,
    fontSize: normalize(14),
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  iconShowPass: {
    position: "absolute",
    right: 10,
    bottom: normalize(15),
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderStyle: "solid",
  },
  errorText: {
    color: "red",
  },
  container: {
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  relative: {
    position: "relative",
  },
  inputContainer: {
    alignItems: "center",
    padding: 0,
    borderRadius: 10,
  },
});

export { Input, InputPassword };
