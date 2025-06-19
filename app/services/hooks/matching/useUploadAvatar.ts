import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { UploadsAvatarRequest, UploadsAvatarResponse } from "./dto";

const useUploadAvatar = (variables: UploadsAvatarRequest) => {
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: () => {
      return rootApi.post<UploadsAvatarRequest, UploadsAvatarResponse>(
        ENDPOINTS.UPLOAD.UPLOAD_AVATAR,
        variables
      );
    },
    onError: (e: any) => {
      Alert.alert("failed", e?.response?.data?.message || "Đã có lỗi xảy ra");
    },
    onSuccess: async (data: UploadsAvatarResponse) => {
      Alert.alert(data?.message || "NOTI", data?.message || "");
    },
  });
  return {
    isLoading: isPending,
    isError,
    data,
    error,
    onSend: mutateAsync,
  };
};

export default useUploadAvatar;
