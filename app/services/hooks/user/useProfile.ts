import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useQuery } from "@tanstack/react-query";
import { UserProfileResponse } from "./dto";

const useProfile = (id: string) => {
  const { data, isLoading, error } = useQuery<UserProfileResponse, Error>({
    queryKey: [ENDPOINTS.USER.GET_PROFILE(id)],
    queryFn: () =>
      rootApi.get<null, UserProfileResponse>(ENDPOINTS.USER.GET_PROFILE(id)),
  });

  return {
    data: data ?? null,
    isLoading: isLoading,
    error,
  };
};

export default useProfile;
