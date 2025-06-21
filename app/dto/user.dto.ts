import { BaseDTO } from "./base.dto";

export interface UserDTO extends BaseDTO {
  id: string;
  username: string;
  email: string;
  gender?: string;
  dob?: string;
  avatarUrl: string;
  activities?: string[];
  interests?: string[];
  availableTimeSlots?: string[];
  location?: string;
  bio?: string;
}

export const GENDER_CONST = {
  MALE: "MALE",
  FEMALE: "FEMALE",
};
