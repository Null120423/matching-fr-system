import { showToastSuccess } from "@/contexts/ToastEventEmitter";
import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SendRequestFrResponse } from "./dto";

const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: (userId: string) => {
      return rootApi.post<null, SendRequestFrResponse>(
        ENDPOINTS.MATCHING.FRIEND_REQUEST(userId)
      );
    },
    onSuccess: async (data: SendRequestFrResponse) => {
      showToastSuccess(data.message || "");
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.USER.GET_PROFILE("")],
      });
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
