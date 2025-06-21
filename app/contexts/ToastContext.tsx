import SheetCustom, { BottomSheetMethods } from "@/components/@core/Toast";
import Toast from "@/components/@core/Toast/toast";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTheme } from "./ThemeContext";
import {
  listenForToast,
  listenForToastError,
  listenForToastInfo,
  listenForToastSuccess,
} from "./ToastEventEmitter";

interface ToastContextValue {
  showToast: (params: {
    title: string;
    type: "ERROR" | "SUCCESS" | "WARN" | "INFO";
    message?: string;
  }) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface PropsType {
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: PropsType) => {
  const topSheetRef = useRef<BottomSheetMethods>(null);
  const [toast, setToast] = useState({
    type: "WARN" as "ERROR" | "SUCCESS" | "WARN" | "INFO",
    title: "",
    message: "",
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showToast = ({
    title,
    type,
    message = "",
  }: {
    title: string;
    type: "ERROR" | "SUCCESS" | "WARN" | "INFO";
    message?: string;
  }) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToast({ title, type, message });
    topSheetRef?.current?.expand();

    timeoutRef.current = setTimeout(() => {
      topSheetRef.current?.close();
    }, 3000);
  };

  useEffect(() => {
    listenForToast((msg: string) => {
      showToast({
        title: "Request failed",
        type: "ERROR",
        message: msg,
      });
    });

    listenForToastError((msg: string) => {
      showToast({
        title: "Request failed",
        type: "ERROR",
        message: msg,
      });
    });

    listenForToastInfo((msg: string) => {
      showToast({
        title: "Notification",
        type: "INFO",
        message: msg,
      });
    });

    listenForToastSuccess((msg: string) => {
      showToast({
        title: "Notification",
        type: "SUCCESS",
        message: msg,
      });
    });
    return () => {
      // if (timeoutRef.current) {
      //   clearTimeout(timeoutRef.current);
      // }
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <SheetCustom ref={topSheetRef} themeName={theme}>
        {toast.type === "ERROR" && (
          <Toast
            onClose={() => topSheetRef.current?.close()}
            type="error"
            title={toast.title}
            message={toast.message}
          />
        )}
        {toast.type === "INFO" && (
          <Toast
            onClose={() => topSheetRef.current?.close()}
            type="info"
            title={toast.title}
            message={toast.message}
          />
        )}
        {toast.type === "SUCCESS" && (
          <Toast
            onClose={() => topSheetRef.current?.close()}
            type="success"
            title={toast.title}
            message={toast.message}
          />
        )}
        {toast.type === "WARN" && (
          <Toast
            onClose={() => topSheetRef.current?.close()}
            type="warning"
            title={toast.title}
            message={toast.message}
          />
        )}
      </SheetCustom>
    </ToastContext.Provider>
  );
};
