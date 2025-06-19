import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useQuery } from "@tanstack/react-query";
import { UnReadCountResponse } from "./dto";

const useCountUnRead = () => {
  const { data, isLoading, error } = useQuery<UnReadCountResponse, Error>({
    queryKey: [ENDPOINTS.NOTIFICATION.UNREAD_COUNT],
    queryFn: () =>
      rootApi.get<null, UnReadCountResponse>(
        ENDPOINTS.NOTIFICATION.UNREAD_COUNT
      ),
  });

  return {
    data: data ?? null,
    isLoading: isLoading,
    error,
  };
};

export default useCountUnRead;
