import { Column, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';

export enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('friend_request')
export class FriendRequestEntity extends BaseEntityCustom {
  @Column()
  senderId: string; // Người gửi yêu cầu

  @Column()
  receiverId: string; // Người nhận yêu cầu

  @Column({
    type: 'enum',
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
  })
  status: FriendRequestStatus;
}
