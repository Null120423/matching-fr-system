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
  @ApiProperty({ description: 'ID của người dùng', example: '1' })
  id: string;

  @ApiProperty({ description: 'Tên đăng nhập', example: 'user123' })
  username: string;

  @ApiProperty({
    description: 'Email của người dùng',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({ description: 'Họ', example: 'Nguyen', required: false })
  firstName?: string;

  @ApiProperty({ description: 'Tên', example: 'An', required: false })
  lastName?: string;

  @ApiProperty({
    description: 'Ngày sinh',
    example: '1990-01-01',
    required: false,
  })
  dateOfBirth?: Date;

  @ApiProperty({ description: 'Giới tính', example: 'male', required: false })
  gender?: string;

  @ApiProperty({
    description: 'Vị trí địa lý của người dùng',
    example: 'Hà Nội, Việt Nam',
    required: false,
  })
  location?: string;

  @ApiProperty({
    description: 'Tiểu sử người dùng',
    example: 'Tôi thích du lịch và đọc sách.',
    required: false,
  })
  bio?: string;

  @ApiProperty({
    description: 'URL ảnh đại diện',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatarUrl?: string;

  @ApiProperty({
    description: 'Danh sách sở thích (interests)',
    example: ['du lịch', 'âm nhạc'],
    required: false,
    type: [String],
  })
  interests?: string[];

  @ApiProperty({
    description: 'Danh sách hoạt động yêu thích (activities)',
    example: ['bơi', 'chạy bộ'],
    required: false,
    type: [String],
  })
  activities?: string[];

  @ApiProperty({
    description: 'Giới tính mong muốn của đối tượng tương tác',
    example: 'female',
    required: false,
  })
  preferredGender?: string;

  @ApiProperty({
    description: 'Độ tuổi tối thiểu của người muốn kết nối',
    example: 18,
    required: false,
  })
  minAgePreference?: number;

  @ApiProperty({
    description: 'Độ tuổi tối đa của người muốn kết nối',
    example: 30,
    required: false,
  })
  maxAgePreference?: number;

  // Nếu muốn mapping luôn thành tên đầy đủ
  get fullName(): string {
    return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
  }
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
