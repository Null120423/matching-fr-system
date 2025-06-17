import { AppointmentEntity, AppointmentStatus } from 'src/entities';
import { AppointmentRepository } from 'src/repositories';
import { CreateAppointmentDto } from './dto';
export declare class AppointmentsService {
    private readonly repo;
    constructor(repo: AppointmentRepository);
    createAppointment(fromUserId: string, createAppointmentDto: CreateAppointmentDto): Promise<AppointmentEntity>;
    getAppointmentsByUserId(userId: string, filterType: string): Promise<AppointmentEntity[]>;
    getAppointmentById(id: string, userId: string): Promise<AppointmentEntity>;
    updateAppointmentStatus(id: string, userId: string, newStatus: AppointmentStatus): Promise<AppointmentEntity>;
}
