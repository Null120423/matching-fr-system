import { AppointmentDTO, BaseResponseDTO } from "@/dto";

export interface CreateAppointmentRequest {
  activity: string;
  time: Date;
  location: string;
  toUserId: string;
}
export interface CreateAppointmentResponse
  extends AppointmentDTO,
    BaseResponseDTO {}

export interface GetAppointmentsRequest {
  type: string;
}

export interface GetAppointmentsResponse extends Array<AppointmentDTO> {}

export interface GetAppointmentRequest {
  id: string;
}
export interface GetAppointmentResponse extends AppointmentDTO {}
export interface UpdateAppointmentRequest {
  status: string;
}

export interface UpdateAppointmentResponse
  extends AppointmentDTO,
    BaseResponseDTO {}
