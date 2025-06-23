import { Optional } from '@nestjs/common';

export class LoginRequestDTO {
  username: string;
  password: string;
  @Optional()
  expoToken?: string;
}
export class SignOutRequestDTO {
  userId: string;
}
export class LoginReplyDTO {
  accessToken: string;

  refreshToken: string;

  message: string;

  user: UserDTO;
}

export class UserDTO {
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
  expoToken: string;
  isFriend?: boolean;
}

export class RefreshTokenRequestDTO {
  refreshToken: string;
}
export class RefreshTokenReplyDTO {
  refreshToken: string;
  accessToken: string;
}
export class SignUpRequestDTO {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}
export class SignUpReplyDTO {
  message: string;
}
