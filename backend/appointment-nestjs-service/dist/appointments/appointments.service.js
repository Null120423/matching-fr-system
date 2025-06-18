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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../entities");
const repositories_1 = require("../repositories");
let AppointmentsService = class AppointmentsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async createAppointment(fromUserId, createAppointmentDto) {
        const newAppointment = await this.repo.create({
            ...createAppointmentDto,
            fromUserId: fromUserId,
            status: entities_1.AppointmentStatus.PENDING,
        });
        return await this.repo.save(newAppointment);
    }
    async getAppointmentsByUserId(userId, filterType) {
        const query = await this.repo.createQueryBuilder('appointment');
        query.where('appointment.fromUserId = :userId OR appointment.toUserId = :userId', { userId });
        const now = new Date();
        switch (filterType) {
            case 'received':
                query.andWhere('appointment.toUserId = :userId', { userId });
                break;
            case 'sent':
                query.andWhere('appointment.fromUserId = :userId', { userId });
                break;
            case 'upcoming':
                query.andWhere('appointment.time > :now', { now });
                query.andWhere('appointment.status = :acceptedStatus', {
                    acceptedStatus: entities_1.AppointmentStatus.ACCEPTED,
                });
                break;
            case 'history':
                query.andWhere('appointment.time < :now', { now });
                query.orWhere('appointment.status IN (:...statuses)', {
                    statuses: [
                        entities_1.AppointmentStatus.DECLINED,
                        entities_1.AppointmentStatus.CANCELLED,
                        entities_1.AppointmentStatus.COMPLETED,
                    ],
                });
                break;
            case 'all':
            default:
                break;
        }
        query.orderBy('appointment.createdAt', 'DESC');
        const res = await query.getMany();
        return {
            appointments: res,
        };
    }
    async getAppointmentById(id, userId) {
        const appointment = await this.repo.findOne({
            where: { id },
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID ${id} not found.`);
        }
        if (appointment.fromUserId !== userId && appointment.toUserId !== userId) {
            throw new common_1.ForbiddenException('You are not authorized to view this appointment.');
        }
        return appointment;
    }
    async updateAppointmentStatus(id, userId, newStatus) {
        const appointment = await this.repo.findOne({
            where: { id },
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID ${id} not found.`);
        }
        if (newStatus === entities_1.AppointmentStatus.ACCEPTED) {
            if (appointment.toUserId !== userId) {
                throw new common_1.ForbiddenException('Only the recipient can accept an appointment.');
            }
            if (appointment.status !== entities_1.AppointmentStatus.PENDING) {
                throw new common_1.ForbiddenException('Appointment is not in pending status.');
            }
        }
        else if (newStatus === entities_1.AppointmentStatus.DECLINED ||
            newStatus === entities_1.AppointmentStatus.CANCELLED) {
            if (appointment.fromUserId !== userId &&
                appointment.toUserId !== userId) {
                throw new common_1.ForbiddenException('You are not authorized to cancel/decline this appointment.');
            }
            if (appointment.status === entities_1.AppointmentStatus.COMPLETED) {
                throw new common_1.ForbiddenException('Cannot cancel/decline a completed appointment.');
            }
        }
        appointment.status = newStatus;
        return this.repo.save(appointment);
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repositories_1.AppointmentRepository])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map