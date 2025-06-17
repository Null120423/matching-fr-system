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
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const appointments_service_1 = require("./appointments.service");
let AppointmentsController = class AppointmentsController {
    appointmentsService;
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    async createAppointment(payload) {
        const { userId: fromUserId, ...createAppointmentDto } = payload;
        return this.appointmentsService.createAppointment(fromUserId, createAppointmentDto);
    }
    async getAppointments(payload) {
        const { filterType, userId } = payload;
        return this.appointmentsService.getAppointmentsByUserId(userId, filterType);
    }
    async getAppointmentById(payload) {
        const { id, userId } = payload;
        return this.appointmentsService.getAppointmentById(id, userId);
    }
    async updateAppointmentStatus(payload) {
        const { id, userId, ...rest } = payload;
        return this.appointmentsService.updateAppointmentStatus(id, userId, rest.newStatus);
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, microservices_1.GrpcMethod)('AppointmentService', 'CreateAppointment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "createAppointment", null);
__decorate([
    (0, microservices_1.GrpcMethod)('AppointmentService', 'GetAppointments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointments", null);
__decorate([
    (0, microservices_1.GrpcMethod)('AppointmentService', 'GetAppointmentById'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointmentById", null);
__decorate([
    (0, microservices_1.GrpcMethod)('AppointmentService', 'UpdateAppointmentStatus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "updateAppointmentStatus", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, common_1.Controller)('appointments'),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map