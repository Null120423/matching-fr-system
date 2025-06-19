import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useQuery } from "@tanstack/react-query";
import { UserProfileResponse } from "./dto";

const useProfileMe = () => {
  const { data, isLoading, error } = useQuery<UserProfileResponse, Error>({
    queryKey: [ENDPOINTS.USER.GET_SELF_PROFILE],
    queryFn: () =>
      rootApi.get<null, UserProfileResponse>(ENDPOINTS.USER.GET_SELF_PROFILE),
  });

  return {
    data: data ?? null,
    isLoading: isLoading,
    error,
  };
};

export default useProfileMe;
