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
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const schedule_1 = require("@nestjs/schedule");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const appointments_service_1 = require("../appointments/appointments.service");
let ScheduleService = class ScheduleService {
    appointmentsService;
    client;
    clientNotification;
    notificationService;
    userService;
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    onModuleInit() {
        this.notificationService =
            this.clientNotification.getService('NotificationService');
        this.userService =
            this.client.getService('UserProfileService');
        console.log('[Mapped GRPC] userService methods:', Object.keys(this.userService));
        console.log('[Mapped GRPC] notificationService methods:', Object.keys(this.notificationService));
        this.scanAppointments();
    }
    async scanAppointments() {
        try {
            console.log('⏰ Scanning appointments at:', new Date().toISOString());
            const [appointmentsInNext15Minus, appointmentsDue] = await Promise.all([
                this.appointmentsService.getAppointmentsInNext15Minutes(),
                this.appointmentsService.getAppointmentsDueSoon(),
            ]);
            const userIds = new Set();
            for (const appointment of appointmentsDue) {
                userIds.add(appointment.fromUserId);
                userIds.add(appointment.toUserId);
            }
            for (const appointment of appointmentsInNext15Minus) {
                userIds.add(appointment.fromUserId);
                userIds.add(appointment.toUserId);
            }
            const userIdsArray = Array.from(userIds);
            if (userIdsArray.length === 0) {
                console.log('No users to notify');
                return;
            }
            const users = await (0, rxjs_1.lastValueFrom)(this.userService.getListUsersByIds({ userIds: userIdsArray }));
            const dictUserById = users.users?.reduce((acc, user) => {
                acc[user.id] = user;
                return acc;
            }, {});
            for (const appointment of appointmentsInNext15Minus) {
                const user = dictUserById[appointment.fromUserId];
                const toUser = dictUserById[appointment.toUserId];
                if (!user || !toUser) {
                    console.warn(`User not found for appointment ${appointment.id}: fromUserId=${appointment.fromUserId}, toUserId=${appointment.toUserId}`);
                    continue;
                }
                const notification = {
                    type: 'APPOINTMENT_REMINDER',
                    content: `Your appointment with ${toUser.username} is in 15 minutes.`,
                    title: 'Appointment Reminder',
                    userId: appointment.fromUserId,
                    expoToken: user.expoToken,
                };
                const toNotification = {
                    type: 'APPOINTMENT_REMINDER',
                    content: `You have an appointment with ${user.username} in 15 minutes.`,
                    title: 'Appointment Reminder',
                    userId: appointment.toUserId,
                    expoToken: toUser.expoToken,
                };
                await Promise.all([
                    (0, rxjs_1.lastValueFrom)(this.notificationService.createNotification(notification)),
                    (0, rxjs_1.lastValueFrom)(this.notificationService.createNotification(toNotification)),
                ]);
            }
            for (const appointment of appointmentsDue) {
                const user = dictUserById[appointment.fromUserId];
                const toUser = dictUserById[appointment.toUserId];
                if (!user || !toUser) {
                    console.warn(`User not found for appointment ${appointment.id}: fromUserId=${appointment.fromUserId}, toUserId=${appointment.toUserId}`);
                    continue;
                }
                const notification = {
                    type: 'APPOINTMENT_DUE',
                    content: `Your appointment with ${toUser.username} is due now.`,
                    title: 'Appointment Due',
                    userId: appointment.fromUserId,
                    expoToken: user.expoToken,
                };
                const toNotification = {
                    type: 'APPOINTMENT_DUE',
                    content: `You have an appointment with ${user.username} due now.`,
                    title: 'Appointment Due',
                    userId: appointment.toUserId,
                    expoToken: toUser.expoToken,
                };
                await Promise.all([
                    (0, rxjs_1.lastValueFrom)(this.notificationService.createNotification(notification)),
                    (0, rxjs_1.lastValueFrom)(this.notificationService.createNotification(toNotification)),
                ]);
            }
        }
        catch (error) {
            console.error('Error scanning appointments:', error);
        }
    }
};
exports.ScheduleService = ScheduleService;
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
], ScheduleService.prototype, "client", void 0);
__decorate([
    (0, microservices_1.Client)({
        transport: microservices_1.Transport.GRPC,
        options: {
            url: '0.0.0.0:50051',
            package: 'notification',
            protoPath: (0, path_1.join)(__dirname, '../../../../proto/notification.proto'),
        },
    }),
    __metadata("design:type", Object)
], ScheduleService.prototype, "clientNotification", void 0);
__decorate([
    (0, schedule_1.Interval)(60 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScheduleService.prototype, "scanAppointments", null);
exports.ScheduleService = ScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], ScheduleService);
//# sourceMappingURL=schedule.service.js.map