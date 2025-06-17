import { Column, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('appointment')
export class AppointmentEntity extends BaseEntityCustom {
  @Column()
  activity: string;

  @Column({ type: 'timestamp with time zone' })
  time: Date;

  @Column()
  location: string;

  @Column()
  fromUserId: string; // Người gửi lời mời hẹn

  @Column()
  toUserId: string; // Người nhận lời mời hẹn (hoặc ID của 1 trong các participants nếu là group)

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;
}
