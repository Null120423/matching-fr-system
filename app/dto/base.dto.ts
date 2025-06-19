export interface BaseDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  updateBy: string | null;
  deleteBy: string | null;
  createdBy: string | null;
  createdByName: string | null;
  isDelete: boolean;
}

export interface BaseResponseDTO {
  message?: string;
}
