import { IsIn, IsNotEmpty } from 'class-validator';
import { SwipeAction } from 'src/entities';

export class CreateSwipeDto {
  @IsNotEmpty()
  @IsIn([SwipeAction.LIKE, SwipeAction.PASS])
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
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
