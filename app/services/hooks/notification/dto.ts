import { BaseResponseDTO, NotificationDTO } from "@/dto";

export interface GetNotificationsResponse extends Array<NotificationDTO> {}

export interface UnReadCountResponse extends BaseResponseDTO {
  count: number;
}

export interface GetNotificationByIdResponse extends NotificationDTO {}

export interface MarkAsReadResponse extends BaseResponseDTO, NotificationDTO {}
