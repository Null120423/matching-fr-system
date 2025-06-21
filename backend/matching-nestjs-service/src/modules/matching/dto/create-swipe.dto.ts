import { IsNotEmpty } from 'class-validator';

export class CreateSwipeDto {
  action: string;

  @IsNotEmpty()
  swiperId: string;
  @IsNotEmpty()
  swipedId: string;
}

export class FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
