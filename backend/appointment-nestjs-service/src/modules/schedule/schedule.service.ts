import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { Interval } from '@nestjs/schedule';
import { join } from 'path';
import { lastValueFrom } from 'rxjs';
import { AppointmentsService } from '../appointments/appointments.service';
import {
  NotificationServiceGrpc,
  UserProfileServiceGrpc,
} from './dto/notificationGRPC';

@Injectable()
export class ScheduleService implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50052',
      package: 'auth',
      protoPath: join(__dirname, '../../../../proto/auth.proto'),
    },
  })
  private readonly client: ClientGrpc;

  @Client({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50051',
      package: 'notification',
      protoPath: join(__dirname, '../../../../proto/notification.proto'),
    },
  })
  private readonly clientNotification: ClientGrpc;

  private notificationService: NotificationServiceGrpc;
  private userService: UserProfileServiceGrpc;
  constructor(private readonly appointmentsService: AppointmentsService) {}

  onModuleInit() {
    this.notificationService =
      this.clientNotification.getService<NotificationServiceGrpc>(
        'NotificationService',
      );

    this.userService =
      this.client.getService<UserProfileServiceGrpc>('UserProfileService');
    console.log(
      '[Mapped GRPC] userService methods:',
      Object.keys(this.userService),
    );
    console.log(
      '[Mapped GRPC] notificationService methods:',
      Object.keys(this.notificationService),
    );

    this.scanAppointments();
  }

  // scan moi phut
  @Interval(60 * 1000)
  async scanAppointments() {
    try {
      console.log('⏰ Scanning appointments at:', new Date().toISOString());
      const [appointmentsInNext15Minus, appointmentsDue] = await Promise.all([
        this.appointmentsService.getAppointmentsInNext15Minutes(),
        this.appointmentsService.getAppointmentsDueSoon(),
      ]);

      const userIds = new Set<string>();
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
      const users = await lastValueFrom(
        this.userService.getListUsersByIds({ userIds: userIdsArray }),
      );

      const dictUserById = users.users?.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});
      /// notification for appointments in next 15 minutes
      for (const appointment of appointmentsInNext15Minus) {
        const user = dictUserById[appointment.fromUserId];
        const toUser = dictUserById[appointment.toUserId];
        if (!user || !toUser) {
          console.warn(
            `User not found for appointment ${appointment.id}: fromUserId=${appointment.fromUserId}, toUserId=${appointment.toUserId}`,
          );
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
          lastValueFrom(
            this.notificationService.createNotification(notification),
          ),
          lastValueFrom(
            this.notificationService.createNotification(toNotification),
          ),
        ]);
      }

      for (const appointment of appointmentsDue) {
        const user = dictUserById[appointment.fromUserId];
        const toUser = dictUserById[appointment.toUserId];
        if (!user || !toUser) {
          console.warn(
            `User not found for appointment ${appointment.id}: fromUserId=${appointment.fromUserId}, toUserId=${appointment.toUserId}`,
          );
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
          lastValueFrom(
            this.notificationService.createNotification(notification),
          ),
          lastValueFrom(
            this.notificationService.createNotification(toNotification),
          ),
        ]);
      }
    } catch (error) {
      console.error('Error scanning appointments:', error);
    }
  }
}
