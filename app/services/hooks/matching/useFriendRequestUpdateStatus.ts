import { showToastSuccess } from "@/contexts/ToastEventEmitter";
import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateFriendRequest, UpdateFriendResponse } from "./dto";

const useFriendRequestUpdateStatus = () => {
  const queryClient = useQueryClient();
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: (variables: UpdateFriendRequest) => {
      return rootApi.put<UpdateFriendRequest, UpdateFriendResponse>(
        ENDPOINTS.MATCHING.UPDATE_STATUS_FRIEND_REQUEST(variables.id),
        variables
      );
    },
    onSuccess: async (data: UpdateFriendResponse) => {
      queryClient.invalidateQueries({
        queryKey: [
          ENDPOINTS.MATCHING.GET_FRIEND_REQUEST({
            status: "pending",
          }),
        ],
      });
      showToastSuccess(data?.message || "Friend request updated successfully!");
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
