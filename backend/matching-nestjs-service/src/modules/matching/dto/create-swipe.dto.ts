import { IsNotEmpty } from 'class-validator';
import { SwipeAction } from 'src/entities';

export class CreateSwipeDto {
  action: SwipeAction;

  @IsNotEmpty()
  swiperId: string;
  @IsNotEmpty()
  swipedId: string;
}

export class FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}
