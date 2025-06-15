import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDTO {
  @ApiProperty({
    description: 'The username of the user.',
    example: 'user123',
  })
  username: string;

  @ApiProperty({
    description: 'The password of the user.',
    example: 'password123',
  })
  password: string;
}

export class UserDTO {
  @ApiProperty({
    description: 'The ID of the user.',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'The username of the user.',
    example: 'user123',
  })
  username: string;

  @ApiProperty({
    description: 'The list of the user’s favorite activities.',
    example: ['Reading', 'Traveling'],
    type: [String],
  })
  favoriteActivities: string[];

  @ApiProperty({
    description: 'The list of available time slots for the user.',
    example: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'],
    type: [String],
  })
  availableTimeSlots: string[];

  @ApiProperty({
    description: 'The location of the user.',
    example: 'New York, USA',
  })
  location: string;
}

export class LoginReplyDTO {
  @ApiProperty({
    description: 'Access token generated after successful login.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSJ9',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token for generating new access tokens.',
    example: 'refreshTokenHere',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Message indicating the result of the login attempt.',
    example: 'Login successful.',
  })
  message: string;

  @ApiProperty({
    description: 'User information object.',
    type: UserDTO,
  })
  user: UserDTO;
}
export class RefreshTokenRequestDTO {
  @ApiProperty({
    description: 'The refresh token to request a new access token.',
    example: 'refreshTokenHere',
  })
  refreshToken: string;
}
export class RefreshTokenReplyDTO {
  @ApiProperty({
    description: 'The new refresh token generated.',
    example: 'newRefreshToken',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'The new access token generated.',
    example: 'newAccessToken',
  })
  accessToken: string;
}
export class SignUpRequestDTO {
  @ApiProperty({
    description: 'The username chosen by the user.',
    example: 'user123',
  })
  username: string;

  @ApiProperty({
    description: 'The password chosen by the user.',
    example: 'password123',
  })
  password: string;

  @ApiProperty({
    description: 'The password confirmation for the user.',
    example: 'password123',
  })
  confirmPassword: string;

  @ApiProperty({
    description: 'The email of the user.',
    example: 'user123@example.com',
  })
  email: string;
}
export class SignUpReplyDTO {
  @ApiProperty({
    description: 'The message returned after attempting to sign up.',
    example: 'User successfully created.',
  })
  message: string;
}
