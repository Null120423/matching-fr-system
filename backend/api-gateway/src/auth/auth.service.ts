import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import {
  LoginReplyDTO,
  LoginRequestDTO,
  RefreshTokenReplyDTO,
  RefreshTokenRequestDTO,
  SignUpReplyDTO,
  SignUpRequestDTO,
} from './dto';

interface AuthServiceImpl {
  SignIn(data: LoginRequestDTO): Observable<LoginReplyDTO>;
  SignUp(data: SignUpRequestDTO): Observable<SignUpReplyDTO>;
  RefreshToken(data: RefreshTokenRequestDTO): Observable<RefreshTokenReplyDTO>;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthServiceImpl;

  constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceImpl>('AuthService');
    console.log(
      '[Mapped GRPC] AuthService methods:',
      Object.keys(this.authService),
    );
  }

  // Method for user login
  async signIn(data: LoginRequestDTO): Promise<LoginReplyDTO> {
    const response = lastValueFrom(this.authService.SignIn(data));
    return response;
  }

  // Method for user sign-up
  async signUp(data: SignUpRequestDTO): Promise<SignUpReplyDTO> {
    const response = lastValueFrom(this.authService.SignUp(data));
    return response;
  }

  // Method for refreshing the access token
  async refreshToken(
    data: RefreshTokenRequestDTO,
  ): Promise<RefreshTokenReplyDTO> {
    const response = lastValueFrom(this.authService.RefreshToken(data));
    return response;
  }
}
