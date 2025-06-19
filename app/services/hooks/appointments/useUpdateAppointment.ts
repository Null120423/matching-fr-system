import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import {
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  UpdateAppointmentResponse,
} from "./dto";

const useUpdateAppointment = (id: string) => {
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: (variables: UpdateAppointmentRequest) => {
      return rootApi.put<CreateAppointmentRequest, UpdateAppointmentResponse>(
        ENDPOINTS.APPOINTMENT.UPDATE_STATUS(id),
        variables
      );
    },
    onError: (e: any) => {
      Alert.alert(
        "Login failed",
        e?.response?.data?.message || "Đã có lỗi xảy ra"
      );
    },
    onSuccess: async (data: UpdateAppointmentResponse) => {
      Alert.alert(
        data?.message || "NOTI",
        data?.message || "Appointment updated successfully"
      );
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

export default useUpdateAppointment;
