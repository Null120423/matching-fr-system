import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { CreateAppointmentRequest, CreateAppointmentResponse } from "./dto";

const useCreateAppointment = () => {
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: (variables: CreateAppointmentRequest) => {
      return rootApi.post<CreateAppointmentRequest, CreateAppointmentResponse>(
        ENDPOINTS.APPOINTMENT.CREATE,
        variables
      );
    },
    onError: (e: any) => {
      Alert.alert(
        "Login failed",
        e?.response?.data?.message || "Đã có lỗi xảy ra"
      );
    },
    onSuccess: async (data: CreateAppointmentResponse) => {
      Alert.alert(
        data?.message || "NOTI",
        data?.message || "Appointment created successfully"
      );
    },
  });
  return {
    isLoading: isPending,
    isError,
    data,
    error,
    onCreate: mutateAsync,
  };
};

export default useCreateAppointment;
