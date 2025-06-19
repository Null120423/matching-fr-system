import { useAuth } from "@/contexts/AuthContext";
import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { SignInRequest, SignInResponse } from "./dto";

const useLogin = () => {
  const { onSignIn } = useAuth();
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: (variables: SignInRequest) => {
      return rootApi.post<SignInRequest, SignInResponse>(
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
    onSuccess: async (data: SignInResponse) => {
      Alert.alert("Login successful", "Welcome back!");
      onSignIn({
        user: data.user,
        tokens: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
      });
    },
  });
  return {
    isLoading: isPending,
    isError,
    data,
    error,
    onSignIn: mutateAsync,
  };
};

export default useLogin;
