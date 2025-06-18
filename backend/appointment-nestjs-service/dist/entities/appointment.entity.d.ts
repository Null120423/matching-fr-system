import { BaseEntityCustom } from './base.entity';
export declare enum AppointmentStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    DECLINED = "declined",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}
export declare const MapNumberStatusToNumber: {
    0: AppointmentStatus;
    1: AppointmentStatus;
    2: AppointmentStatus;
    3: AppointmentStatus;
    4: AppointmentStatus;
};
export declare class AppointmentEntity extends BaseEntityCustom {
    activity: string;
    time: Date;
    location: string;
    fromUserId: string;
    toUserId: string;
    status: AppointmentStatus;
}
