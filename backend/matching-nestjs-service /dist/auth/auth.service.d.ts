import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/entities';
import { LoginRequestDTO, RefreshTokenRequestDTO, SignUpRequestDTO } from './dto';
export declare class AuthService {
    private repo;
    private jwtService;
    private readonly configService;
    constructor(repo: UserRepository, jwtService: JwtService, configService: ConfigService);
    JWT_SECRET: string;
    signIn(signInDto: LoginRequestDTO): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    signUp(signUpDTO: SignUpRequestDTO): Promise<{
        message: string;
    }>;
    checkUserExist(username: string): Promise<boolean>;
    refreshToken(data: RefreshTokenRequestDTO): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    getUserById(id: string): Promise<UserEntity>;
    private generateTokens;
}
