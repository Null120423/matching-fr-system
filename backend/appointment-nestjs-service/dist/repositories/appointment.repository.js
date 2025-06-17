"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRepository = void 0;
const entities_1 = require("../entities");
const typeorm_decorater_1 = require("../typeorm/typeorm-decorater");
const typeorm_1 = require("typeorm");
let AppointmentRepository = class AppointmentRepository extends typeorm_1.Repository {
};
exports.AppointmentRepository = AppointmentRepository;
exports.AppointmentRepository = AppointmentRepository = __decorate([
    (0, typeorm_decorater_1.CustomRepository)(entities_1.AppointmentEntity)
], AppointmentRepository);
//# sourceMappingURL=appointment.repository.js.map