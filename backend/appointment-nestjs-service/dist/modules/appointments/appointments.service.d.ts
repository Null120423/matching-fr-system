import { UserDto } from 'src/dto';
import { AppointmentEntity, AppointmentStatus } from 'src/entities';
import { AppointmentRepository } from 'src/repositories';
import { CreateAppointmentDto, GetDashboardMetricsRequest } from './dto';
export declare class AppointmentsService {
    private readonly repo;
    private readonly client;
    private userService;
    constructor(repo: AppointmentRepository);
    onModuleInit(): void;
    createAppointment(fromUserId: string, createAppointmentDto: CreateAppointmentDto): Promise<AppointmentEntity>;
    getAppointmentsByUserId(userId: string, filterType: string): Promise<{
        appointments: AppointmentEntity & {
            toUser: UserDto;
            fromUser: UserDto;
            friend: UserDto;
        }[];
    }>;
    getAppointmentById(id: string, userId: string): Promise<AppointmentEntity>;
    updateAppointmentStatus(id: string, userId: string, newStatus: AppointmentStatus): Promise<AppointmentEntity>;
    getAppointmentsInNext15Minutes(): Promise<Array<Omit<AppointmentEntity, 'date'> & {
        date: Date;
        minutesLeft: number;
    }>>;
    getAppointmentsDueSoon(): Promise<AppointmentEntity[]>;
    getDashboardData(payload: GetDashboardMetricsRequest): Promise<{
        totalAppointments: number;
        totalAppointmentToday: number;
    }>;
}
