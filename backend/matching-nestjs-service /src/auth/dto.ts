export class LoginRequestDTO {
  username: string;
  password: string;
}
export class LoginReplyDTO {
  accessToken: string;

  refreshToken: string;

  message: string;

  user: UserDTO;
}

export class UserDTO {
  id: string;
  username: string;
  favoriteActivities: string[];
  availableTimeSlots: string[];
  location: string;
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
