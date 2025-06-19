import { BaseDTO } from "./base.dto";

export interface UserDTO extends BaseDTO {
  id: string;
  username: string;
  email: string;
  gender?: string;
  dob?: string;
  avatarUrl?: string;
  favoriteActivities?: string[];
  availableTimeSlots?: string[];
  location?: string;
  bio?: string;
}
