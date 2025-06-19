import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useQuery } from "@tanstack/react-query";
import { GetNotificationByIdResponse } from "./dto";

const useGetNotificationById = (id: string) => {
  const { data, isLoading, error } = useQuery<
    GetNotificationByIdResponse,
    Error
  >({
    queryKey: [ENDPOINTS.NOTIFICATION.DETAIL(id)],
    queryFn: () =>
      rootApi.get<null, GetNotificationByIdResponse>(
        ENDPOINTS.NOTIFICATION.DETAIL(id)
      ),
  });

  return {
    data: data ?? null,
    isLoading: isLoading,
    error,
  };
};

export default useGetNotificationById;
