import { useAuth } from "@/contexts/AuthContext";
import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation } from "@tanstack/react-query";
import { RefreshTokenRequest } from "expo-auth-session";
import { Alert } from "react-native";
import { RefreshTokenResponse } from "./dto";

const useRefreshToken = () => {
  const { onSignIn } = useAuth();
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: (variables: RefreshTokenRequest) => {
      return rootApi.post<RefreshTokenRequest, RefreshTokenResponse>(
        ENDPOINTS.AUTH.SIGNIN,
        variables
      );
    },
    onError: (e: any) => {
      Alert.alert(
        "Login failed",
        e?.response?.data?.message || "Đã có lỗi xảy ra"
      );
    },
    onSuccess: async (data: RefreshTokenResponse) => {
      Alert.alert(data?.message || "", "Welcome back!");
    },
  });
  return {
    isLoading: isPending,
    isError,
    data,
    error,
    onRefreshToken: mutateAsync,
  };
};

export default useRefreshToken;
