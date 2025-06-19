import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { SendRequestFrResponse } from "./dto";

const useSendFriendRequest = (userId: string) => {
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: () => {
      return rootApi.post<null, SendRequestFrResponse>(
        ENDPOINTS.MATCHING.FRIEND_REQUEST(userId)
      );
    },
    onError: (e: any) => {
      Alert.alert("failed", e?.response?.data?.message || "Đã có lỗi xảy ra");
    },
    onSuccess: async (data: SendRequestFrResponse) => {
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

export default useSendFriendRequest;
