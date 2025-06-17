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
exports.UpdateAppointmentStatusDto = void 0;
const class_validator_1 = require("class-validator");
const entities_1 = require("../../entities");
class UpdateAppointmentStatusDto {
    newStatus;
}
exports.UpdateAppointmentStatusDto = UpdateAppointmentStatusDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)([
        entities_1.AppointmentStatus.ACCEPTED,
        entities_1.AppointmentStatus.DECLINED,
        entities_1.AppointmentStatus.CANCELLED,
        entities_1.AppointmentStatus.COMPLETED,
    ]),
    __metadata("design:type", String)
], UpdateAppointmentStatusDto.prototype, "newStatus", void 0);
//# sourceMappingURL=update-appointment-status.dto.js.map