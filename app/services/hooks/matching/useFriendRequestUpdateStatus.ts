import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { UpdateFriendRequest, UpdateFriendResponse } from "./dto";

const useFriendRequestUpdateStatus = () => {
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: (variables: UpdateFriendRequest) => {
      return rootApi.put<UpdateFriendRequest, UpdateFriendResponse>(
        ENDPOINTS.MATCHING.UPDATE_STATUS_FRIEND_REQUEST(variables.id),
        variables
      );
    },
    onError: (e: any) => {
      Alert.alert(
        "Login failed",
        e?.response?.data?.message || "Đã có lỗi xảy ra"
      );
    },
    onSuccess: async (data: UpdateFriendResponse) => {
      Alert.alert(data?.message || "", "!");
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

export default useFriendRequestUpdateStatus;
