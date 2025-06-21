import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation } from "@tanstack/react-query";
import { UserProfileResponse } from "./dto";

const useProfileMe = () => {
  const { data, isPending, error, mutateAsync } = useMutation<
    UserProfileResponse,
    Error
  >({
    mutationFn: () =>
      rootApi.get<null, UserProfileResponse>(ENDPOINTS.USER.UPDATE_PROFILE),
  });

  return {
    data: data,
    isLoading: isPending,
    error,
    onLoadProfileMe: mutateAsync,
  };
};

export default useProfileMe;
