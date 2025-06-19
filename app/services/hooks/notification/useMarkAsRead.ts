import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { MarkAsReadResponse } from "./dto";

const useMarkAsRead = (id: string) => {
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: () => {
      return rootApi.put<null, MarkAsReadResponse>(
        ENDPOINTS.NOTIFICATION.MARK_AS_READ(id)
      );
    },
    onError: (e: any) => {
      Alert.alert(
        "Login failed",
        e?.response?.data?.message || "Đã có lỗi xảy ra"
      );
    },
    onSuccess: async (data: MarkAsReadResponse) => {
      Alert.alert(data?.message || "NOTI", data?.message || "");
    },
  });
  return {
    isLoading: isPending,
    isError,
    data,
    error,
    onMaskAsRead: mutateAsync,
  };
};

export default useMarkAsRead;
