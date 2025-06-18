/* eslint-disable @typescript-eslint/await-thenable */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentEntity, AppointmentStatus } from 'src/entities';
import { AppointmentRepository } from 'src/repositories';
import { CreateAppointmentDto } from './dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly repo: AppointmentRepository) {}

  async createAppointment(
    fromUserId: string,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<AppointmentEntity> {
    const newAppointment = await this.repo.create({
      ...createAppointmentDto,
      fromUserId: fromUserId,
      status: AppointmentStatus.PENDING,
    });
    return await this.repo.save(newAppointment);
  }

  async getAppointmentsByUserId(
    userId: string,
    filterType: string,
  ): Promise<{
    appointments: AppointmentEntity[];
  }> {
    const query = await this.repo.createQueryBuilder('appointment');
    query.where(
      'appointment.fromUserId = :userId OR appointment.toUserId = :userId',
      { userId },
    );

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
          acceptedStatus: AppointmentStatus.ACCEPTED,
        });
        break;
      case 'history':
        query.andWhere('appointment.time < :now', { now });
        query.orWhere('appointment.status IN (:...statuses)', {
          statuses: [
            AppointmentStatus.DECLINED,
            AppointmentStatus.CANCELLED,
            AppointmentStatus.COMPLETED,
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

  async getAppointmentById(
    id: string,
    userId: string,
  ): Promise<AppointmentEntity> {
    const appointment = await this.repo.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found.`);
    }
    // Đảm bảo chỉ người tham gia cuộc hẹn mới có thể xem
    if (appointment.fromUserId !== userId && appointment.toUserId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to view this appointment.',
      );
    }
    return appointment;
  }

  async updateAppointmentStatus(
    id: string,
    userId: string,
    newStatus: AppointmentStatus,
  ): Promise<AppointmentEntity> {
    const appointment = await this.repo.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found.`);
    }

    // Logic kiểm tra quyền và chuyển trạng thái hợp lệ
    if (newStatus === AppointmentStatus.ACCEPTED) {
      if (appointment.toUserId !== userId) {
        throw new ForbiddenException(
          'Only the recipient can accept an appointment.',
        );
      }
      if (appointment.status !== AppointmentStatus.PENDING) {
        throw new ForbiddenException('Appointment is not in pending status.');
      }
    } else if (
      newStatus === AppointmentStatus.DECLINED ||
      newStatus === AppointmentStatus.CANCELLED
    ) {
      if (
        appointment.fromUserId !== userId &&
        appointment.toUserId !== userId
      ) {
        throw new ForbiddenException(
          'You are not authorized to cancel/decline this appointment.',
        );
      }
      if (appointment.status === AppointmentStatus.COMPLETED) {
        throw new ForbiddenException(
          'Cannot cancel/decline a completed appointment.',
        );
      }
    }

    appointment.status = newStatus;
    return this.repo.save(appointment);
  }
}
