import { OnModuleInit } from '@nestjs/common';
import { AppointmentsService } from '../appointments/appointments.service';
export declare class ScheduleService implements OnModuleInit {
    private readonly appointmentsService;
    private readonly client;
    private readonly clientNotification;
    private notificationService;
    private userService;
    constructor(appointmentsService: AppointmentsService);
    onModuleInit(): void;
    scanAppointments(): Promise<void>;
}
