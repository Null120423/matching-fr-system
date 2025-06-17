"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = void 0;
const base_dto_1 = require("./base.dto");
class UserDto extends base_dto_1.BaseDto {
    username;
    email;
    password;
    emailVerificationCode;
    isEmailVerified;
    resetPasswordCode;
    firstName;
    lastName;
    dateOfBirth;
    gender;
    location;
    bio;
    avatarUrl;
    interests;
    minAgePreference;
    maxAgePreference;
    preferredGender;
    activities;
}
exports.UserDto = UserDto;
//# sourceMappingURL=user.dto.js.map