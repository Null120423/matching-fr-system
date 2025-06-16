import { BaseDto } from './base.dto';
export class UserDto extends BaseDto {
  username: string;
  email: string;
  password: string;
  emailVerificationCode: string;
  isEmailVerified: boolean;
  resetPasswordCode: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  location: string;
  bio: string;
  avatarUrl: string;
  interests: string[];
  minAgePreference: number;
  maxAgePreference: number;
  preferredGender: string;
  activities: string[];
}
