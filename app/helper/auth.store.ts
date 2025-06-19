// app/services/AuthTokenService.ts
import * as SecureStore from "expo-secure-store";
import { keys } from "../helper/keys";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const AuthTokenService = {
  // Lưu Access Token vào SecureStore
  saveAccessToken: async (token: string) => {
    await SecureStore.setItemAsync(keys.ACCESS_TOKEN, token);
  },

  // Lấy Access Token từ SecureStore
  getAccessToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(keys.ACCESS_TOKEN);
  },

  // Xóa Access Token khỏi SecureStore
  deleteAccessToken: async () => {
    await SecureStore.deleteItemAsync(keys.ACCESS_TOKEN);
  },

  // Lưu Refresh Token vào SecureStore
  saveRefreshToken: async (token: string) => {
    await SecureStore.setItemAsync(keys.REFRESH_TOKEN, token);
  },

  // Lấy Refresh Token từ SecureStore
  getRefreshToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(keys.REFRESH_TOKEN);
  },

  // Xóa Refresh Token khỏi SecureStore
  deleteRefreshToken: async () => {
    await SecureStore.deleteItemAsync(keys.REFRESH_TOKEN);
  },

  // Xóa tất cả token
  clearAllTokens: async () => {
    await AuthTokenService.deleteAccessToken();
    await AuthTokenService.deleteRefreshToken();
  },

  // Gửi yêu cầu làm mới token đến API Gateway
  //   refreshTokens: async (): Promise<Tokens> => {
  //     const refreshToken = await AuthTokenService.getRefreshToken();

  //     if (!refreshToken) {
  //       throw new Error("No refresh token available.");
  //     }

  //     try {
  //       // Sử dụng một instance axios riêng để tránh bị loop bởi interceptor chính
  //       const refreshAxios = axios.create({ baseURL });
  //       const response = await refreshAxios.post("/auth/refresh-token", {
  //         refreshToken,
  //       });

  //       const newAccessToken = response.data.accessToken;
  //       const newRefreshToken = response.data.refreshToken;

  //       // Lưu các token mới
  //       await AuthTokenService.saveAccessToken(newAccessToken);
  //       await AuthTokenService.saveRefreshToken(newRefreshToken);

  //       return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  //     } catch (error) {
  //       console.error("Failed to refresh token:", error);
  //       // Nếu refresh token thất bại, xóa tất cả token và ném lỗi
  //       await AuthTokenService.clearAllTokens();
  //       throw error; // Ném lỗi để interceptor hoặc component caller xử lý đăng xuất
  //     }
  //   },
};
