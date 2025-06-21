import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useQuery } from "@tanstack/react-query";
import { GetFriendRequestResponse } from "./dto";

const useFriendRequestList = () => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery<
    GetFriendRequestResponse,
    Error
  >({
    queryKey: [
      ENDPOINTS.MATCHING.GET_FRIEND_REQUEST({
        status: "pending",
      }),
    ],
    queryFn: async () => {
      const response = await rootApi.get<any, GetFriendRequestResponse>(
        ENDPOINTS.MATCHING.GET_FRIEND_REQUEST({
          status: "pending",
        })
      );
      return response;
    },
  });

  return {
    data: data?.requests || [],
    isLoading: isLoading,
    isRefetching,
    error,
    onRefetch: refetch,
  };
};

export default useFriendRequestList;
