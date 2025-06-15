import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginReplyDTO,
  LoginRequestDTO,
  RefreshTokenReplyDTO,
  RefreshTokenRequestDTO,
  SignUpReplyDTO,
  SignUpRequestDTO,
} from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user and generate tokens' })
  @ApiBody({ type: LoginRequestDTO })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    schema: {
      example: {
        accessToken: 'access_token_example',
        refreshToken: 'refresh_token_example',
        message: 'Login successful',
        user: {
          id: 'user_id_example',
          username: 'example_user',
          favoriteActivities: ['Reading', 'Gaming'],
          availableTimeSlots: ['09:00 AM - 11:00 AM'],
          location: 'New York',
        },
      },
    },
  })
  async login(@Body() loginDto: LoginRequestDTO): Promise<LoginReplyDTO> {
    return await this.authService.signIn(loginDto);
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up user and create an account' })
  @ApiBody({ type: SignUpRequestDTO })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        message: 'User registered successfully!',
      },
    },
  })
  async signUp(@Body() signUpDto: SignUpRequestDTO): Promise<SignUpReplyDTO> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiBody({ type: RefreshTokenRequestDTO })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    schema: {
      example: {
        accessToken: 'new_access_token_example',
        refreshToken: 'new_refresh_token_example',
      },
    },
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenRequestDTO,
  ): Promise<RefreshTokenReplyDTO> {
    return await this.authService.refreshToken(refreshTokenDto);
  }
}
