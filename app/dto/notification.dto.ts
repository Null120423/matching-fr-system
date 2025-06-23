import { BaseDTO } from "./base.dto";

export interface NotificationDTO extends BaseDTO {
  id: string;
  userId: string;
  type: string;
  content: string;
  title: string;
  createdAt: Date;
  isRead: boolean;
  body: string;
}
