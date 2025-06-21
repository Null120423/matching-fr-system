import { BaseResponseDTO, UserDTO } from "@/dto";

export interface MyProfileResponse extends UserDTO {}
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  interests?: string[];
  minAgePreference?: number;
  maxAgePreference?: number;
  preferredGender?: string;
  activities?: string[];
}

export interface UpdateProfileResponse extends UserDTO, BaseResponseDTO {}

export interface DiscoverUsersRequest {
  minAge?: number;
  maxAge?: number;
  gender?: string;
  activities?: string[];
}
export interface DiscoverUsersResponse extends Array<UserDTO> {}

export interface UserProfileResponse extends UserDTO {
  dateOfBirth: string | number | Date;
}
