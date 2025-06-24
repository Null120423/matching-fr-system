export interface BaseDTO {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | null | string;
  updateBy: string | null;
  deleteBy: string | null;
  createdBy: string | null;
  createdByName: string | null;
  isDelete: boolean;
}

export interface BaseResponseDTO {
  message?: string;
}
