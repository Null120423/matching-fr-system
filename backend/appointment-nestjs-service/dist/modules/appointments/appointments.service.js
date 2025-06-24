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
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const entities_1 = require("../../entities");
const repositories_1 = require("../../repositories");
const typeorm_1 = require("typeorm");
let AppointmentsService = class AppointmentsService {
    repo;
    client;
    userService;
    constructor(repo) {
        this.repo = repo;
    }
    onModuleInit() {
        this.userService =
            this.client.getService('UserProfileService');
        console.log('[Mapped GRPC] userService methods:', Object.keys(this.userService));
    }
    async createAppointment(fromUserId, createAppointmentDto) {
        const dateOnly = new Date(createAppointmentDto.date);
        const [hours, minutes] = createAppointmentDto.time.split(':').map(Number);
        const datetime = new Date(dateOnly);
        datetime.setUTCHours(hours);
        datetime.setUTCMinutes(minutes);
        datetime.setUTCSeconds(0);
        datetime.setUTCMilliseconds(0);
        const newAppointment = new entities_1.AppointmentEntity();
        newAppointment.fromUserId = fromUserId;
        newAppointment.toUserId = createAppointmentDto.toUserId;
        newAppointment.activity = createAppointmentDto.activity;
        newAppointment.activityType = createAppointmentDto.activityType;
        newAppointment.date = new Date(createAppointmentDto.date);
        newAppointment.time = createAppointmentDto.time;
        newAppointment.datetime = datetime;
        newAppointment.duration = createAppointmentDto.duration;
        newAppointment.location = createAppointmentDto.location;
        newAppointment.notes = createAppointmentDto.notes;
        newAppointment.status = entities_1.AppointmentStatus.PENDING;
        return await this.repo.save(newAppointment);
    }
    async getAppointmentsByUserId(userId, filterType) {
        const query = this.repo.createQueryBuilder('appointment');
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
                query.where('appointment.fromUserId = :userId OR appointment.toUserId = :userId', { userId });
                break;
        }
        query.orderBy('appointment.createdAt', 'DESC');
        const res = await query.getMany();
        const userIds = new Set();
        for (const appointment of res) {
            const friendId = appointment.toUserId === userId
                ? appointment.fromUserId
                : appointment.toUserId;
            userIds.add(appointment.fromUserId);
            userIds.add(appointment.toUserId);
            if (appointment.friendId) {
                userIds.add(appointment.friendId);
            }
            appointment.friendId = friendId;
        }
        const users = await (0, rxjs_1.lastValueFrom)(this.userService.getListUsersByIds({
            userIds: Array.from(userIds),
        }));
        const dictUserById = users.users?.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});
        for (const appointment of res) {
            appointment.fromUser = dictUserById[appointment.fromUserId];
            appointment.toUser = dictUserById[appointment.toUserId];
            if (appointment.friendId) {
                appointment.friend = dictUserById[appointment.friendId];
            }
        }
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
    async getAppointmentsInNext15Minutes() {
        const now = new Date();
        const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000);
        const appointments = await this.repo
            .createQueryBuilder('appointment')
            .select([
            'appointment.id AS id',
            'appointment.activity AS activity',
            'appointment.activityType AS activityType',
            'appointment.datetime AS datetime',
            'appointment.location AS location',
            'appointment.duration AS duration',
            'appointment.notes AS notes',
            'appointment.status AS status',
            'appointment.fromUserId AS fromUserId',
            'appointment.toUserId AS toUserId',
            'appointment.createdAt AS createdAt',
            'appointment.updatedAt AS updatedAt',
        ])
            .addSelect(`FLOOR((EXTRACT(EPOCH FROM (appointment.datetime - NOW())) / 60))`, 'minutesLeft')
            .where('appointment.status = :status', {
            status: entities_1.AppointmentStatus.ACCEPTED,
        })
            .andWhere('appointment.datetime >= :now', { now })
            .andWhere('appointment.datetime < :fifteenMinutesLater', {
            fifteenMinutesLater,
        })
            .orderBy('appointment.datetime', 'ASC')
            .getRawMany();
        return appointments.map((a) => ({
            ...a,
            minutesLeft: Number(a.minutesLeft),
            date: a.datetime,
        }));
    }
    async getAppointmentsDueSoon() {
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
        const appointments = await this.repo
            .createQueryBuilder('appointment')
            .where('appointment.status = :status', {
            status: entities_1.AppointmentStatus.ACCEPTED,
        })
            .andWhere('appointment.datetime >= :oneMinuteAgo', { oneMinuteAgo })
            .andWhere('appointment.datetime <= :now', { now })
            .orderBy('appointment.datetime', 'ASC')
            .getMany();
        console.log('⏰ Due appointments:', appointments);
        return appointments;
    }
    async getDashboardData(payload) {
        const { requestUserId } = payload;
        const totalAppointments = await this.repo.count({
            where: {
                fromUserId: requestUserId,
            },
        });
        const todayStart = new Date();
        todayStart.setUTCHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setUTCHours(23, 59, 59, 999);
        const totalAppointmentToday = await this.repo.count({
            where: {
                fromUserId: requestUserId,
                datetime: (0, typeorm_1.Between)(todayStart, todayEnd),
            },
        });
        return {
            totalAppointments,
            totalAppointmentToday,
        };
    }
};
exports.AppointmentsService = AppointmentsService;
__decorate([
    (0, microservices_1.Client)({
        transport: microservices_1.Transport.GRPC,
        options: {
            url: '0.0.0.0:50052',
            package: 'auth',
            protoPath: (0, path_1.join)(__dirname, '../../../../proto/auth.proto'),
        },
    }),
    __metadata("design:type", Object)
], AppointmentsService.prototype, "client", void 0);
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repositories_1.AppointmentRepository])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map