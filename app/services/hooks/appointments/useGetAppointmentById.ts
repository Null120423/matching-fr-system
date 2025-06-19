import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useQuery } from "@tanstack/react-query";
import { GetAppointmentRequest, GetAppointmentResponse } from "./dto";

const useGetAppointmentById = (
  variables: GetAppointmentRequest,
  id: string
) => {
  const { data, isLoading, error } = useQuery<GetAppointmentResponse, Error>({
    queryKey: [ENDPOINTS.APPOINTMENT.DETAIL(id, variables)],
    queryFn: () =>
      rootApi.get<null, GetAppointmentResponse>(
        ENDPOINTS.APPOINTMENT.DETAIL(id, variables)
      ),
  });

  return {
    data: data ?? null,
    isLoading: isLoading,
    error,
  };
};

export default useGetAppointmentById;
