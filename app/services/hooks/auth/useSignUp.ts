import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";
import { SignUpRequest, SignUpResponse } from "./dto";

const useSignUp = () => {
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: (variables: SignUpRequest) => {
      return rootApi.post<SignUpRequest, SignUpResponse>(
        ENDPOINTS.AUTH.SIGNUP,
        variables
      );
    },
    onError: (e: any) => {
      Alert.alert(
        "Login failed",
        e?.response?.data?.message || "Đã có lỗi xảy ra"
      );
    },
    onSuccess: async (data: SignUpResponse) => {
      Alert.alert(data?.message || "", "Welcome back!");
      router.navigate("/(auth)/sign-in");
    },
  });
  return {
    isLoading: isPending,
    isError,
    data,
    error,
    onRegister: mutateAsync,
  };
};

export default useSignUp;
