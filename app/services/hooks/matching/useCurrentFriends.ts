import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useQuery } from "@tanstack/react-query";
import { CurrentFriendsResponse } from "./dto";

const useCurrentFriends = () => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery<
    CurrentFriendsResponse,
    Error
  >({
    queryKey: [ENDPOINTS.MATCHING.CURRENT_FRIENDS],
    queryFn: async () => {
      const response = await rootApi.get<any, CurrentFriendsResponse>(
        ENDPOINTS.MATCHING.CURRENT_FRIENDS
      );
      return response;
    },
  });

  return {
    data: data?.friends || [],
    total: data?.total || 0,
    isLoading: isLoading,
    isRefetching,
    error,
    onRefetch: refetch,
  };
};

export default useCurrentFriends;
