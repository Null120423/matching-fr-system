import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation } from "@tanstack/react-query";
import { SwipeCreateResponse, UseSwipeRequest } from "./dto";

const useSwipe = () => {
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: (variables: UseSwipeRequest) => {
      return rootApi.post<UseSwipeRequest, SwipeCreateResponse>(
        ENDPOINTS.MATCHING.SWIPE(variables.userId),
        {
          action: variables.action,
        }
      );
    },
  });
  return {
    isLoading: isPending,
    isError,
    data,
    error,
    onSwipe: mutateAsync,
  };
};

export default useSwipe;
