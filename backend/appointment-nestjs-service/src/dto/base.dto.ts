export abstract class BaseDto {
  id: string;
  createdAt: Date;
  createdBy: string;
  createdByName: string;
  updatedAt: Date;
  updatedBy: string;
  deleteBy: string;
  isDeleted: boolean;
}
