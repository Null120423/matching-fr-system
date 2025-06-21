import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useQuery } from "@tanstack/react-query";
import { UserProfileResponse } from "./dto";

const useProfile = (id: string) => {
  const { data, isLoading, error, isRefetching } = useQuery<
    UserProfileResponse,
    Error
  >({
    queryKey: [ENDPOINTS.USER.GET_PROFILE("")],
    queryFn: () =>
      rootApi.get<null, UserProfileResponse>(ENDPOINTS.USER.GET_PROFILE(id)),
    staleTime: 0,
  });

  return {
    data: data ?? null,
    isLoading: isLoading,
    isRefetching,
    error,
  };
};

export default useProfile;
