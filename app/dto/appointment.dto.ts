import { BaseDTO } from "./base.dto";
import { UserDTO } from "./user.dto";

export interface AppointmentDTO extends UserDTO, BaseDTO {
  id: string;
  activity: string;
  time: Date | string;
  location: string | any;
  fromUserId: string;
  toUserId: string;
  status: string;
  statusName?: string;
  statusColor?: string;
  fromUser?: UserDTO;
  toUser?: UserDTO;
  activityType?: string;
  date: Date | string;
  duration: number; // Duration in minutes
  friend?: any;
}
