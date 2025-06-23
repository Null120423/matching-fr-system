import { BaseResponseDTO, UserDTO } from "@/dto";

export interface SignInRequest {
  username: string;
  password: string;
  expoToken?: string;
}
export interface SignInResponse extends BaseResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}

export interface SignUpRequest {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export interface SignUpResponse extends BaseResponseDTO {}

export interface RefreshTokenRequest {
  refreshToken: string;
}
export interface RefreshTokenResponse extends BaseResponseDTO {
  accessToken: string;
  refreshToken: string;
}
