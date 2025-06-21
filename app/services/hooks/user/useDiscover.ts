import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useQuery } from "@tanstack/react-query";
import { DiscoverUsersRequest, DiscoverUsersResponse } from "./dto";

const useDiscover = (variables: DiscoverUsersRequest) => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery<
    DiscoverUsersResponse,
    Error
  >({
    queryKey: [ENDPOINTS.USER.DISCOVER(variables)],
    queryFn: () =>
      rootApi.get<null, DiscoverUsersResponse>(
        ENDPOINTS.USER.DISCOVER(variables)
      ),
  });

  return {
    data: data,
    isLoading: isLoading,
    error,
    onRefetch: refetch,
    isRefetching: isRefetching,
  };
};

export default useDiscover;
