import { BaseEntityCustom } from './base.entity';
export declare enum AppointmentStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    DECLINED = "declined",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}
export declare class AppointmentEntity extends BaseEntityCustom {
    activity: string;
    time: Date;
    location: string;
    fromUserId: string;
    toUserId: string;
    status: AppointmentStatus;
}
