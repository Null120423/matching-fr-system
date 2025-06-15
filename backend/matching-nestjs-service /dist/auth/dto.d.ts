export declare class LoginRequestDTO {
    username: string;
    password: string;
}
export declare class LoginReplyDTO {
    accessToken: string;
    refreshToken: string;
    message: string;
    user: UserDTO;
}
export declare class UserDTO {
    id: string;
    username: string;
    favoriteActivities: string[];
    availableTimeSlots: string[];
    location: string;
}
export declare class RefreshTokenRequestDTO {
    refreshToken: string;
}
export declare class RefreshTokenReplyDTO {
    refreshToken: string;
    accessToken: string;
}
export declare class SignUpRequestDTO {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
}
export declare class SignUpReplyDTO {
    message: string;
}
