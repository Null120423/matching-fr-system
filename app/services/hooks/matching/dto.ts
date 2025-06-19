import { BaseResponseDTO, FriendRequestDTO } from "@/dto";
export interface UseSwipeRequest {
  userId: string;
  action: "LIKE" | "PASS";
}

export interface SwipeCreateResponse extends BaseResponseDTO {
  success: boolean;
  match: boolean;
}

export interface SendRequestFrResponse extends BaseResponseDTO {
  success: boolean;
}

export interface UploadsAvatarRequest {
  File: File;
}
export interface UploadsAvatarResponse extends BaseResponseDTO {
  url: string;
}
export interface UpdateFriendRequest {
  id: string;
  newStatus: string;
}

export interface UpdateFriendResponse
  extends BaseResponseDTO,
    FriendRequestDTO {}
