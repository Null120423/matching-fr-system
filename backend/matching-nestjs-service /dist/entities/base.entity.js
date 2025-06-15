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
exports.BaseEntityCustom = void 0;
const typeorm_1 = require("typeorm");
class BaseEntityCustom extends typeorm_1.BaseEntity {
    id;
    createdAt;
    createdBy;
    createdByName;
    updatedAt;
    updatedBy;
    deleteBy;
    isDeleted;
}
exports.BaseEntityCustom = BaseEntityCustom;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BaseEntityCustom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BaseEntityCustom.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", String)
], BaseEntityCustom.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], BaseEntityCustom.prototype, "createdByName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BaseEntityCustom.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], BaseEntityCustom.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], BaseEntityCustom.prototype, "deleteBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isDeleted', default: false }),
    __metadata("design:type", Boolean)
], BaseEntityCustom.prototype, "isDeleted", void 0);
//# sourceMappingURL=base.entity.js.map