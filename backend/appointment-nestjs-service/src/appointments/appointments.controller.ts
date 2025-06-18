import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AppointmentEntity,
  AppointmentStatus,
  MapNumberStatusToNumber,
} from 'src/entities';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @GrpcMethod('AppointmentService', 'CreateAppointment')
  async createAppointment(
    payload: CreateAppointmentDto & {
      fromUserId: string;
    },
  ): Promise<AppointmentEntity> {
    const { fromUserId, ...createAppointmentDto } = payload;
    return this.appointmentsService.createAppointment(
      fromUserId,
      createAppointmentDto,
    );
  }

  @GrpcMethod('AppointmentService', 'GetAppointments')
  async getAppointments(payload: {
    filterType: string;
    userId: string;
  }): Promise<{
    appointments: AppointmentEntity[];
  }> {
    const { filterType, userId } = payload;
    return this.appointmentsService.getAppointmentsByUserId(userId, filterType);
  }

  @GrpcMethod('AppointmentService', 'GetAppointmentById')
  async getAppointmentById(payload: {
    id: string;
    userId: string;
  }): Promise<AppointmentEntity> {
    const { id, userId } = payload;
    return this.appointmentsService.getAppointmentById(id, userId);
  }

  @GrpcMethod('AppointmentService', 'UpdateAppointmentStatus')
  async updateAppointmentStatus(
    payload: UpdateAppointmentStatusDto & {
      id: string;
      userId: string;
    },
  ): Promise<AppointmentEntity> {
    const { id, userId, ...rest } = payload;
    const status: string = MapNumberStatusToNumber[rest.newStatus];
    if (!status) {
      throw new Error(`Invalid status code: ${rest.newStatus}`);
    }
    return this.appointmentsService.updateAppointmentStatus(
      id,
      userId,
      status as AppointmentStatus,
    );
  }
}
