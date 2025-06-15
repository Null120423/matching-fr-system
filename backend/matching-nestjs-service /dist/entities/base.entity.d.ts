import { BaseEntity } from 'typeorm';
export declare abstract class BaseEntityCustom extends BaseEntity {
    id: string;
    createdAt: Date;
    createdBy: string;
    createdByName: string;
    updatedAt: Date;
    updatedBy: string;
    deleteBy: string;
    isDeleted: boolean;
}
