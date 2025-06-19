import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { SwipeCreateResponse, UseSwipeRequest } from "./dto";

const useSwipe = (variables: UseSwipeRequest) => {
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: () => {
      return rootApi.post<UseSwipeRequest, SwipeCreateResponse>(
        ENDPOINTS.MATCHING.SWIPE(variables.userId, {
          action: variables.action,
        })
      );
    },
    onError: (e: any) => {
      Alert.alert("failed", e?.response?.data?.message || "Đã có lỗi xảy ra");
    },
    onSuccess: async (data: SwipeCreateResponse) => {
      Alert.alert(data?.message || "NOTI", data?.message || "");
    },
  });
  return {
    isLoading: isPending,
    isError,
    data,
    error,
    onSwipe: mutateAsync,
  };
};

export default useSwipe;
