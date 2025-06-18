// backend/api-gateway/src/appointment/appointment.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import { lastValueFrom } from 'rxjs';
import { RequestWithUser } from 'src/dto/request.dto';
import {
  Appointment,
  AppointmentServiceGrpc,
  AppointmentStatus,
  CreateAppointmentRequest,
} from './dto';

@ApiTags('appointments')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentController {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50053',
      package: 'appointment',
      protoPath: join(__dirname, '../../../../proto/appointment.proto'),
    },
  })
  private readonly appointmentClient: ClientGrpc;
  private appointmentServiceGrpc: AppointmentServiceGrpc;

  onModuleInit() {
    this.appointmentServiceGrpc =
      this.appointmentClient.getService<AppointmentServiceGrpc>(
        'AppointmentService',
      );

    console.log(
      '[Mapped GRPC] AppointmentService methods:',
      Object.keys(this.appointmentServiceGrpc),
    );
  }

  @Post()
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentRequest,
    @Req() req: RequestWithUser,
  ): Promise<Appointment> {
    const fromUserId = req.user.id;
    return lastValueFrom(
      this.appointmentServiceGrpc.createAppointment({
        ...createAppointmentDto,
        fromUserId,
      }),
    );
  }

  @Get()
  async getAppointments(
    @Req() req: RequestWithUser,
    @Query('type') filterType: string,
  ): Promise<Appointment[]> {
    const userId = req.user.id;
    return lastValueFrom(
      this.appointmentServiceGrpc.getAppointments({ userId, filterType }),
    ).then((res) => {
      return res.appointments || [];
    });
  }

  @Get(':id')
  async getAppointmentById(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Appointment> {
    const userId = req.user.id;
    return lastValueFrom(
      this.appointmentServiceGrpc.getAppointmentById({ id, userId }),
    );
  }

  @Put(':id/status')
  async updateAppointmentStatus(
    @Param('id') id: string,
    @Body('newStatus') newStatus: AppointmentStatus,
    @Req() req: RequestWithUser,
  ): Promise<Appointment> {
    const userId = req.user.id;
    return lastValueFrom(
      this.appointmentServiceGrpc.updateAppointmentStatus({
        id,
        userId,
        newStatus,
      }),
    );
  }
}
