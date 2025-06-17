import { FriendRequestEntity, SwipeEntity } from 'src/entities';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(SwipeEntity)
export class SwipeRepository extends Repository<SwipeEntity> {}

@CustomRepository(FriendRequestEntity)
export class FriendRequestRepository extends Repository<FriendRequestEntity> {}
