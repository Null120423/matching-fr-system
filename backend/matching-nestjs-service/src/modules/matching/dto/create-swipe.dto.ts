import { IsIn, IsNotEmpty } from 'class-validator';
import { SwipeAction } from 'src/entities';

export class CreateSwipeDto {
  @IsNotEmpty()
  @IsIn([SwipeAction.LIKE, SwipeAction.PASS])
  action: SwipeAction;
}
