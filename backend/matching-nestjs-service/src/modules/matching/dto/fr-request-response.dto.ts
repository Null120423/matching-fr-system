import { UserDto } from 'src/dto';
import { FriendRequestEntity } from 'src/entities';

export class FriendRequestResponseDto {
  requests: Array<FriendRequestEntity & { sendRequestPerson: UserDto }>;
}
