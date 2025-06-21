import { showToastSuccess } from "@/contexts/ToastEventEmitter";
import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { UpdateProfileRequest, UpdateProfileResponse } from "./dto";

const useUpdateProfile = () => {
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: (variables: UpdateProfileRequest) => {
      return rootApi.put<UpdateProfileRequest, UpdateProfileResponse>(
        ENDPOINTS.USER.UPDATE_PROFILE,
        variables
      );
    },
    onSuccess: async (data: UpdateProfileResponse) => {
      showToastSuccess(data?.message || "Update profile successful");
      router.back();
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

export default useUpdateProfile;
