import { BaseEntityCustom } from './base.entity';
export declare class UserEntity extends BaseEntityCustom {
    username: string;
    password: string;
    avatar: string;
    favoriteActivities: string[];
    availableTimeSlots: string[];
    location: Date;
    hashPassword(): Promise<void>;
    comparePassword(candidate: string): any;
}
