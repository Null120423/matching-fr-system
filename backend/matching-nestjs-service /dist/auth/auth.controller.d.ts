import { AuthService } from './auth.service';
import { LoginRequestDTO, RefreshTokenRequestDTO, SignUpRequestDTO } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(data: LoginRequestDTO): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
        message: string;
    }>;
    signUp(data: SignUpRequestDTO): Promise<{
        message: string;
    }>;
    refreshToken(data: RefreshTokenRequestDTO): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
        message: string;
    }>;
    checkUserExist(data: {
        username: string;
    }): Promise<{
        exists: boolean;
    }>;
    getUserById(data: {
        id: string;
    }): Promise<{
        id: string;
        username: string;
    }>;
}
