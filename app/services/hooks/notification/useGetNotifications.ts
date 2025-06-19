import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useQuery } from "@tanstack/react-query";
import { GetNotificationsResponse } from "./dto";

const useGetNotifications = () => {
  const { data, isLoading, error } = useQuery<GetNotificationsResponse, Error>({
    queryKey: [ENDPOINTS.NOTIFICATION.GET_NOTIFICATIONS],
    queryFn: () =>
      rootApi.get<null, GetNotificationsResponse>(
        ENDPOINTS.NOTIFICATION.GET_NOTIFICATIONS
      ),
  });

  return {
    data: data ?? null,
    isLoading: isLoading,
    error,
  };
};

export default useGetNotifications;
