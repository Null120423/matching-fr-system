import { ApiProperty } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { UserDto } from 'src/dto';

/** Enums */
export enum SwipeAction {
  LIKE = 'LIKE',
  PASS = 'PASS',
}

export enum FriendRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

/** DTOs */
export class RecordSwipeRequest {
  @ApiProperty()
  swiperId: string;

  @ApiProperty()
  swipedId: string;

  @ApiProperty({ enum: SwipeAction })
  action: SwipeAction;
}

export class SendFriendRequestRequest {
  @ApiProperty()
  senderId: string;

  @ApiProperty()
  receiverId: string;
}

export class UpdateFriendRequestStatusRequest {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: FriendRequestStatus })
  newStatus: FriendRequestStatus;
}

/** Interfaces */
export interface RecordSwipeResponse {
  success: boolean;
  match: boolean;
}

export interface SendFriendRequestResponse {
  success: boolean;
  message: string;
}

export interface UploadAvatarResponse {
  url: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt: string;
  sendRequestPerson: UserDto | null;
}

/** gRPC Service Interfaces */
export interface MatchingServiceGrpc {
  recordSwipe(data: RecordSwipeRequest): Observable<RecordSwipeResponse>;
  sendFriendRequest(
    data: SendFriendRequestRequest,
  ): Observable<SendFriendRequestResponse>;
  updateFriendRequestStatus(
    data: UpdateFriendRequestStatusRequest,
  ): Observable<FriendRequest>;

  getFriendRequests(data: {
    userId: string;
    status?: FriendRequestStatus;
  }): Observable<{
    requests: FriendRequest[];
  }>;
}

export interface UploadServiceGrpc {
  uploadAvatar(data: {
    userId: string;
    fileData: Buffer;
    contentType: string;
    originalFileName: string;
  }): Observable<UploadAvatarResponse>;
}
