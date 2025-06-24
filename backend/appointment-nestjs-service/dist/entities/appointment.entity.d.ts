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
    activityType: string;
    date: Date;
    time: string;
    datetime: Date;
    duration: number;
    fromUserId: string;
    toUserId: string;
    friendId: string;
    notes: string;
    status: AppointmentStatus;
    location: {
        address: string;
        name: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
}
