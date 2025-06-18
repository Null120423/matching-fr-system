import { Column, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';

export enum FriendRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}
export const FriendRequestStatusData = {
  [FriendRequestStatus.PENDING]: {
    value: FriendRequestStatus.PENDING,
    label: 'Pending',
    name: 'Pending',
    color: '#FFA500',
  },
  [FriendRequestStatus.ACCEPTED]: {
    value: FriendRequestStatus.ACCEPTED,
    label: 'Accepted',
    name: 'Accepted',
    color: '#008000',
  },
  [FriendRequestStatus.REJECTED]: {
    value: FriendRequestStatus.REJECTED,
    label: 'Rejected',
    name: 'Rejected',
    color: '#FF0000',
  },
};

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
