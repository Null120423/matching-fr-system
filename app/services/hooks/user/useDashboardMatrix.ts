import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useQuery } from "@tanstack/react-query";
import { DashboardMatrixResponse } from "./dto";

const useDashboardMatrix = () => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery<
    DashboardMatrixResponse,
    Error
  >({
    queryKey: [ENDPOINTS.USER.DASHBOARD_MATRIX],
    queryFn: () =>
      rootApi.get<null, DashboardMatrixResponse>(
        ENDPOINTS.USER.DASHBOARD_MATRIX
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

export default useDashboardMatrix;
