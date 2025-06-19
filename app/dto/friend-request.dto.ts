import { BaseDTO } from "./base.dto";

export interface FriendRequestDTO extends BaseDTO {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  statusColor?: string;
  statusName?: string;
}
