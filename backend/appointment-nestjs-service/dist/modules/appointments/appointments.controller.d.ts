import { UserDto } from 'src/dto';
import { AppointmentEntity } from 'src/entities';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, GetDashboardMetricsRequest, GetDashboardMetricsResponse } from './dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    createAppointment(payload: CreateAppointmentDto & {
        fromUserId: string;
    }): Promise<AppointmentEntity>;
    getAppointments(payload: {
        filterType: string;
        userId: string;
    }): Promise<{
        appointments: AppointmentEntity & {
            toUser: UserDto;
            fromUser: UserDto;
            friend: UserDto;
        }[];
    }>;
    getAppointmentById(payload: {
        id: string;
        userId: string;
    }): Promise<any>;
    updateAppointmentStatus(payload: UpdateAppointmentStatusDto & {
        id: string;
        userId: string;
    }): Promise<AppointmentEntity>;
    getDashboardMetrics(payload: GetDashboardMetricsRequest): Promise<GetDashboardMetricsResponse>;
}
