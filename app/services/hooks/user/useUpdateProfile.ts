import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { UpdateProfileRequest, UpdateProfileResponse } from "./dto";

const useUpdateProfile = () => {
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: (variables: UpdateProfileRequest) => {
      return rootApi.put<UpdateProfileRequest, UpdateProfileResponse>(
        ENDPOINTS.USER.UPDATE_PROFILE,
        variables
      );
    },
    onError: (e: any) => {
      Alert.alert(
        "Login failed",
        e?.response?.data?.message || "Đã có lỗi xảy ra"
      );
    },
    onSuccess: async (data: UpdateProfileResponse) => {
      Alert.alert(data?.message || "", "Welcome back!");
    },
  });
  return {
    isLoading: isPending,
    isError,
    data,
    error,
    onUpdate: mutateAsync,
  };
};

export default useUpdateProfile;
