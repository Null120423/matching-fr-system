import {
  Body,
  Controller,
  Get,
  OnModuleInit,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { RequestWithUser } from 'src/dto/request.dto';
import {
  Notification,
  NotificationCreate,
  NotificationServiceGrpc,
} from './notification.dto';

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
    return notifications || [];
  }
  @Get('unread-count')
  async getUnreadNotificationsCount(
    @Req() req: RequestWithUser,
  ): Promise<{ count: number }> {
    const userId = req.user.id;
    return firstValueFrom(this.notificationService.getUnreadCount({ userId }));
  }

  @Get(':id')
  async getNotificationById(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
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
    @Req() req: RequestWithUser,
  ): Promise<Notification> {
    const userId = req.user.id;
    return firstValueFrom(
      this.notificationService.markAsRead({ userId, notificationId: id }),
    );
  }

  @Post()
  async createNotification(
    @Body()
    notificationData: NotificationCreate,
  ): Promise<Notification> {
    return firstValueFrom(
      this.notificationService.createNotification({
        ...notificationData,
      }),
    );
  }
}
