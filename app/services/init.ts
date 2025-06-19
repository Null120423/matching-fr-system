// import { showToastError } from "@helper/ToastEventEmitter";
import { AuthTokenService } from "@/helper";
import axios from "axios";
import * as Updates from "expo-updates";
import { Alert } from "react-native";

const initApi = (url?: string, headers = {}) => {
  if (url == null) throw new Error("URL is required");
  const { runtimeVersion, createdAt } = Updates;
  const api = axios.create({
    baseURL: url,
    timeout: 100000,
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
      ...headers,
      version: runtimeVersion,
      environment: process.env.EXPO_PUBLIC_APP_VARIANT,
      updateDate: createdAt?.toString() || "2024-11-11",
    },
  });

  api.interceptors.request.use(async (config: any) => {
    try {
      const token = await AuthTokenService.getAccessToken();
      if (token != null) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${token}`;
      }

      // config langue
      // config.headers["x-lang"] = "en";
    } catch (error) {
      console.log("AsyncStorage error:", error);
    }
    return config;
  });

  api.interceptors.response.use(
    (response: any) => response?.data,
    (error: any) => {
      // Accessing the URL and the body of the request
      console.log("\x1b[31m", error.config?.headers?.Authorization);
      console.log(
        "\x1b[31m",
        "ERROR REQUEST URL:",
        error.config?.baseURL + "/" + error.config.url
      );
      console.log("\x1b[31m", "ERROR REQUEST BODY:", error.config.data);
      console.log("=====>", error?.response?.data);
      console.log(error?.response?.data?.httpCode);
      let message = "";

      switch (error?.response?.data?.httpCode) {
        case 401: {
          message =
            "Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại!";
          /// xử lý thông báo ở hàm user Info
          return Promise.reject(error);
        }
        case 500: {
          message =
            "Hiện tại chúng tôi đang bảo trì để nâng cấp hệ thống. Quý khách vui lòng quay lại sau ít phút!";
          break;
        }
        default: {
          message =
            error?.response?.data?.errors || error?.response?.data?.message;
        }
      }

      // showToastError(message);
      Alert.alert("Thông báo", message);
      return Promise.reject(error);
    }
  );

  return api;
};

export default initApi;
