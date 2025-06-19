import { BaseDTO } from "./base.dto";

export interface NotificationDTO extends BaseDTO {
  id: string;
  userId: string;
  type: string;
  content: string;
  isRead: boolean;
}
