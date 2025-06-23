/* eslint-disable no-useless-catch */
import { Controller } from '@nestjs/common';
import { GrpcLog, GrpcMethod } from 'src/decorators';
import { AuthService } from './auth.service';
import {
  LoginRequestDTO,
  RefreshTokenRequestDTO,
  SignOutRequestDTO,
  SignUpRequestDTO,
} from './dto';
GrpcLog();
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'SignOut')
  async signOut(data: SignOutRequestDTO) {
    await this.authService.signOut(data);
    return {
      message: 'Sign Out successful',
    };
  }

  @GrpcMethod('AuthService', 'SignIn')
  async signIn(data: LoginRequestDTO) {
    const result = await this.authService.signIn(data);
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
      message: 'Login successful',
    };
  }

  // gRPC method for signing up
  @GrpcMethod('AuthService', 'SignUp')
  async signUp(data: SignUpRequestDTO) {
    try {
      const result = await this.authService.signUp(data);
      return {
        message: result.message,
      };
    } catch (error) {
      throw error;
    }
  }

  // gRPC method for refreshing token
  @GrpcMethod('AuthService', 'RefreshToken')
  async refreshToken(data: RefreshTokenRequestDTO) {
    try {
      const result = await this.authService.refreshToken(data);
      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
        message: 'Token refreshed successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  // gRPC method to check if a user exists by username
  @GrpcMethod('AuthService', 'CheckUserExist')
  async checkUserExist(data: { username: string }) {
    try {
      const exists = await this.authService.checkUserExist(data.username);
      return { exists };
    } catch (error) {
      throw error;
    }
  }

  // gRPC method to get user by ID
  @GrpcMethod('AuthService', 'GetUserById')
  async getUserById(data: { id: string }) {
    try {
      const user = await this.authService.getUserById(data.id);
      return {
        id: user.id,
        username: user.username,
      };
    } catch (error) {
      throw error;
    }
  }
}
