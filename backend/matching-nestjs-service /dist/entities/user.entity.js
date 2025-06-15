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
exports.UserEntity = void 0;
const bcrypt_1 = require("bcrypt");
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
let UserEntity = class UserEntity extends base_entity_1.BaseEntityCustom {
    username;
    password;
    avatar;
    favoriteActivities;
    availableTimeSlots;
    location;
    async hashPassword() {
        if (this.password && !this.password.startsWith('$2b$')) {
            const hashedPassword = await (0, bcrypt_1.hash)(this.password, 10);
            this.password = hashedPassword;
        }
    }
    comparePassword(candidate) {
        return (0, bcrypt_1.compare)(candidate, this.password);
    }
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], UserEntity.prototype, "favoriteActivities", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], UserEntity.prototype, "availableTimeSlots", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], UserEntity.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserEntity.prototype, "hashPassword", null);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)(`Users`)
], UserEntity);
//# sourceMappingURL=user.entity.js.map