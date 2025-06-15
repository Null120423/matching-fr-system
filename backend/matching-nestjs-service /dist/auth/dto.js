"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpReplyDTO = exports.SignUpRequestDTO = exports.RefreshTokenReplyDTO = exports.RefreshTokenRequestDTO = exports.UserDTO = exports.LoginReplyDTO = exports.LoginRequestDTO = void 0;
class LoginRequestDTO {
    username;
    password;
}
exports.LoginRequestDTO = LoginRequestDTO;
class LoginReplyDTO {
    accessToken;
    refreshToken;
    message;
    user;
}
exports.LoginReplyDTO = LoginReplyDTO;
class UserDTO {
    id;
    username;
    favoriteActivities;
    availableTimeSlots;
    location;
}
exports.UserDTO = UserDTO;
class RefreshTokenRequestDTO {
    refreshToken;
}
exports.RefreshTokenRequestDTO = RefreshTokenRequestDTO;
class RefreshTokenReplyDTO {
    refreshToken;
    accessToken;
}
exports.RefreshTokenReplyDTO = RefreshTokenReplyDTO;
class SignUpRequestDTO {
    username;
    password;
    confirmPassword;
    email;
}
exports.SignUpRequestDTO = SignUpRequestDTO;
class SignUpReplyDTO {
    message;
}
exports.SignUpReplyDTO = SignUpReplyDTO;
//# sourceMappingURL=dto.js.map