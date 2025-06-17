import { Controller, Get, OnModuleInit, Param, Put, Req } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Notification, NotificationServiceGrpc } from './notification.dto';

@Controller('notifications')
export class NotificationController implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50051',
      package: 'notification',
      protoPath: join(__dirname, '../../../../proto/notification.proto'),
    },
  })
  private readonly client: ClientGrpc;

  private notificationService: NotificationServiceGrpc;

  onModuleInit() {
    this.notificationService = this.client.getService<NotificationServiceGrpc>(
      'NotificationService',
    );

    console.log(
      '[Mapped GRPC] NotificationService methods:',
      Object.keys(this.notificationService),
    );
  }

  @Get()
  async getNotifications(@Req() req: any): Promise<Notification[]> {
    const userId = req.user.id;
    const { notifications } = await lastValueFrom(
      this.notificationService.getNotifications({ userId }),
    );
    return notifications;
  }

  @Get(':id')
  async getNotificationById(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<Notification> {
    const userId = req.user.id;
    return firstValueFrom(
      this.notificationService.getNotificationById({
        userId,
        notificationId: id,
      }),
    );
  }

  @Put(':id/read')
  async markNotificationAsRead(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<Notification> {
    const userId = req.user.id;
    return firstValueFrom(
      this.notificationService.markAsRead({ userId, notificationId: id }),
    );
  }

  @Get('unread-count')
  async getUnreadNotificationsCount(
    @Req() req: any,
  ): Promise<{ count: number }> {
    const userId = req.user.id;
    return firstValueFrom(this.notificationService.getUnreadCount({ userId }));
  }
}
