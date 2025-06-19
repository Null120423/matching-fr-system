import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useQuery } from "@tanstack/react-query";
import { GetAppointmentsRequest, GetAppointmentsResponse } from "./dto";

const useGetAppointments = (variables: GetAppointmentsRequest) => {
  const { data, isLoading, error } = useQuery<GetAppointmentsResponse, Error>({
    queryKey: [ENDPOINTS.APPOINTMENT.GET_APPOINTMENTS(variables)],
    queryFn: () =>
      rootApi.get<null, GetAppointmentsResponse>(
        ENDPOINTS.APPOINTMENT.GET_APPOINTMENTS(variables)
      ),
  });

  return {
    data: data ?? null,
    isLoading: isLoading,
    error,
  };
};

export default useGetAppointments;
