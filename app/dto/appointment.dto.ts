import { UserDTO } from "./user.dto";

export interface AppointmentDTO extends UserDTO {
  id: string;
  activity: string;
  time: Date;
  location: string;
  fromUserId: string;
  toUserId: string;
  status: string;
  statusName?: string;
  statusColor?: string;
  fromUser?: UserDTO;
  toUser?: UserDTO;
}
