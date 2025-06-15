"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_repository_1 = require("../repositories/user.repository");
const config_1 = require("@nestjs/config");
const entities_1 = require("../entities");
let AuthService = class AuthService {
    repo;
    jwtService;
    configService;
    constructor(repo, jwtService, configService) {
        this.repo = repo;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    JWT_SECRET = 'JWT_SECRET';
    async signIn(signInDto) {
        const user = await this.repo.findOne({
            where: [{ username: signInDto.username, isDeleted: false }],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found!');
        }
        const isMatch = await user.comparePassword(signInDto.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Password incorrect!');
        }
        const generateTokens = this.generateTokens(user);
        return {
            ...generateTokens,
            user: { ...user },
        };
    }
    async signUp(signUpDTO) {
        if (await this.repo.findOneBy({ username: signUpDTO.username })) {
            throw new common_1.UnauthorizedException('User already exists!');
        }
        if (signUpDTO.password !== signUpDTO.confirmPassword) {
            throw new common_1.UnauthorizedException('Password not match!');
        }
        const newUser = new entities_1.UserEntity();
        newUser.username = signUpDTO.username;
        newUser.password = signUpDTO.password;
        await this.repo.insert(newUser);
        return {
            message: 'User registered successfully!',
        };
    }
    async checkUserExist(username) {
        const user = await this.repo.findOneBy({ username });
        return !!user;
    }
    async refreshToken(data) {
        if (!this.JWT_SECRET) {
            throw new common_1.UnauthorizedException('JWT_SECRET not found!');
        }
        const { id } = this.jwtService.verify(data.refreshToken, {
            secret: this.JWT_SECRET,
        });
        const user = await this.repo.findOne({
            where: { id },
        });
        if (!user)
            throw new common_1.UnauthorizedException('User not found!');
        const generateTokens = this.generateTokens(user);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found!');
        }
        return {
            ...generateTokens,
            user: { ...user },
        };
    }
    async getUserById(id) {
        const user = await this.repo.findOneBy({ id });
        if (!user)
            throw new common_1.NotFoundException('User not found!');
        return user;
    }
    generateTokens(user) {
        const payload = { user };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map