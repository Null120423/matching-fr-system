import { Column, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export const MapNumberStatusToNumber = {
  [0]: AppointmentStatus.PENDING,
  [1]: AppointmentStatus.ACCEPTED,
  [2]: AppointmentStatus.DECLINED,
  [3]: AppointmentStatus.CANCELLED,
  [4]: AppointmentStatus.COMPLETED,
};

@Entity('appointment')
export class AppointmentEntity extends BaseEntityCustom {
  @Column()
  activity: string;

  @Column({ nullable: true })
  activityType: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  date: Date; // Original datetime (e.g., 2025-06-24T12:54:19.774Z)

  @Column()
  time: string; // Separate time (e.g., "13:00")

  @Column({ type: 'timestamp with time zone', nullable: true })
  datetime: Date;

  @Column({ type: 'int', nullable: true })
  duration: number; // Duration in minutes

  @Column()
  fromUserId: string;

  @Column()
  toUserId: string;

  @Column({ type: 'uuid', nullable: true })
  friendId: string;

  @Column({ nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ type: 'jsonb', nullable: true })
  location: {
    address: string;
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}
