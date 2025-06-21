import { DeviceEventEmitter } from "react-native";

export const showToast = (message: string) => {
  DeviceEventEmitter.emit("showToast", message);
};

export const showToastError = (message: string) => {
  DeviceEventEmitter.emit("showToastError", message);
};

export const showToastInfo = (message: string) => {
  DeviceEventEmitter.emit("showToastInfo", message);
};

export const showToastSuccess = (message: string) => {
  DeviceEventEmitter.emit("showToastSuccess", message);
};
export const showToastCustom = (
  data: {
    title?: string;
    message: string;
    type: "ERROR" | "SUCCESS" | "WARN" | "INFO";
  } = { title: "Thông báo", message: "", type: "SUCCESS" }
) => {
  DeviceEventEmitter.emit("showToastCustom", data);
};
export const listenForToast = (callback: (message: string) => void) => {
  const subscription = DeviceEventEmitter.addListener("showToast", callback);
  return () => subscription.remove();
};

export const listenForToastError = (callback: (message: string) => void) => {
  const subscription = DeviceEventEmitter.addListener(
    "showToastError",
    callback
  );
  return () => subscription.remove();
};

export const listenForToastInfo = (callback: (message: string) => void) => {
  const subscription = DeviceEventEmitter.addListener(
    "showToastInfo",
    callback
  );
  return () => subscription.remove();
};

export const listenForToastSuccess = (callback: (message: string) => void) => {
  const subscription = DeviceEventEmitter.addListener(
    "showToastSuccess",
    callback
  );
  return () => subscription.remove();
};
