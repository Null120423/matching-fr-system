import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { lastValueFrom } from 'rxjs';
import { UserDto } from 'src/dto';
import { AppointmentEntity, AppointmentStatus } from 'src/entities';
import { AppointmentRepository } from 'src/repositories';
import { Between } from 'typeorm';
import { UserProfileServiceGrpc } from '../schedule/dto/notificationGRPC';
import { CreateAppointmentDto, GetDashboardMetricsRequest } from './dto';

@Injectable()
export class AppointmentsService {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50052',
      package: 'auth',
      protoPath: join(__dirname, '../../../../proto/auth.proto'),
    },
  })
  private readonly client: ClientGrpc;
  private userService: UserProfileServiceGrpc;
  constructor(private readonly repo: AppointmentRepository) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserProfileServiceGrpc>('UserProfileService');
    console.log(
      '[Mapped GRPC] userService methods:',
      Object.keys(this.userService),
    );
  }
  async createAppointment(
    fromUserId: string,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<AppointmentEntity> {
    const dateOnly = new Date(createAppointmentDto.date);
    const [hours, minutes] = createAppointmentDto.time.split(':').map(Number);

    // Tạo datetime mới với giờ & phút từ `time`
    const datetime = new Date(dateOnly);
    datetime.setUTCHours(hours);
    datetime.setUTCMinutes(minutes);
    datetime.setUTCSeconds(0);
    datetime.setUTCMilliseconds(0);

    const newAppointment = new AppointmentEntity();
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
    newAppointment.status = AppointmentStatus.PENDING;
    return await this.repo.save(newAppointment);
  }

  async getAppointmentsByUserId(
    userId: string,
    filterType: string,
  ): Promise<{
    appointments: AppointmentEntity &
      {
        toUser: UserDto;
        fromUser: UserDto;
        friend: UserDto;
      }[];
  }> {
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
        query.where(
          'appointment.fromUserId = :userId OR appointment.toUserId = :userId',
          { userId },
        );
        break;
    }

    query.orderBy('appointment.createdAt', 'DESC');

    const res: any = await query.getMany();

    const userIds = new Set<string>();
    for (const appointment of res) {
      const friendId =
        appointment.toUserId === userId
          ? appointment.fromUserId
          : appointment.toUserId;
      userIds.add(appointment.fromUserId);
      userIds.add(appointment.toUserId);
      if (appointment.friendId) {
        userIds.add(appointment.friendId);
      }
      appointment.friendId = friendId;
    }
    const users = await lastValueFrom(
      this.userService.getListUsersByIds({
        userIds: Array.from(userIds),
      }),
    );
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

  /** get all appointmenst còn 15p nửa tới hẹn  */
  /**
   * Lấy tất cả các cuộc hẹn còn 15 phút nữa tới hẹn cho user,
   * trả về các trường: id, activity, activityType, date, time, location, duration, notes, status, fromUserId, toUserId, createdAt, updatedAt,
   * và thêm trường cònBaoNhieuPhutNua (minutesLeft) = số phút còn lại tới giờ hẹn.
   */
  async getAppointmentsInNext15Minutes(): Promise<
    Array<
      Omit<AppointmentEntity, 'date'> & {
        date: Date;
        minutesLeft: number;
      }
    >
  > {
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
      .addSelect(
        `FLOOR((EXTRACT(EPOCH FROM (appointment.datetime - NOW())) / 60))`,
        'minutesLeft',
      )
      .where('appointment.status = :status', {
        status: AppointmentStatus.ACCEPTED,
      })
      .andWhere('appointment.datetime >= :now', { now })
      .andWhere('appointment.datetime < :fifteenMinutesLater', {
        fifteenMinutesLater,
      })
      .orderBy('appointment.datetime', 'ASC')
      .getRawMany();

    return appointments.map((a: any) => ({
      ...a,
      minutesLeft: Number(a.minutesLeft),
      date: a.datetime,
    }));
  }

  /** lấy các appoint đến hạn  */
  /** Lấy các appointment đến hạn trong vòng 1 phút vừa qua */
  async getAppointmentsDueSoon(): Promise<AppointmentEntity[]> {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000); // 1 phút trước

    const appointments = await this.repo
      .createQueryBuilder('appointment')
      .where('appointment.status = :status', {
        status: AppointmentStatus.ACCEPTED,
      })
      .andWhere('appointment.datetime >= :oneMinuteAgo', { oneMinuteAgo })
      .andWhere('appointment.datetime <= :now', { now })
      .orderBy('appointment.datetime', 'ASC')
      .getMany();

    console.log('⏰ Due appointments:', appointments);
    return appointments;
  }

  /** get total appoint and total appoint to day  */
  async getDashboardData(payload: GetDashboardMetricsRequest) {
    const { requestUserId } = payload;

    // Lấy tổng số cuộc hẹn
    const totalAppointments = await this.repo.count({
      where: {
        fromUserId: requestUserId,
      },
    });

    // Lấy tổng số cuộc hẹn trong ngày hôm nay
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setUTCHours(23, 59, 59, 999);

    const totalAppointmentToday = await this.repo.count({
      where: {
        fromUserId: requestUserId,
        datetime: Between(todayStart, todayEnd),
      },
    });

    return {
      totalAppointments,
      totalAppointmentToday,
    };
  }
}
