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
  UseGuards,
} from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { lastValueFrom, Observable } from 'rxjs';
import { RequestWithUser } from 'src/dto/request.dto';
import { JwtAuthGuard } from '../../auth/jwt.auth.guard';

// Định nghĩa các interface cho gRPC messages
enum AppointmentStatus {
  PENDING = 0,
  ACCEPTED = 1,
  DECLINED = 2,
  CANCELLED = 3,
  COMPLETED = 4,
}

interface Appointment {
  id: string;
  activity: string;
  time: string;
  location: string;
  fromUserId: string;
  toUserId: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

interface CreateAppointmentRequest {
  activity: string;
  time: string;
  location: string;
  toUserId: string;
  fromUserId: string;
}

interface GetAppointmentsRequest {
  userId: string;
  filterType: string;
}

interface GetAppointmentsResponse {
  appointments: Appointment[];
}

interface GetAppointmentByIdRequest {
  id: string;
  userId: string;
}

interface UpdateAppointmentStatusRequest {
  id: string;
  userId: string;
  newStatus: AppointmentStatus;
}

interface AppointmentServiceGrpc {
  createAppointment(data: CreateAppointmentRequest): Observable<Appointment>;
  getAppointments(
    data: GetAppointmentsRequest,
  ): Observable<GetAppointmentsResponse>;
  getAppointmentById(data: GetAppointmentByIdRequest): Observable<Appointment>;
  updateAppointmentStatus(
    data: UpdateAppointmentStatusRequest,
  ): Observable<Appointment>;
}

@Controller('appointments')
@UseGuards(JwtAuthGuard)
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
    ).then((res) => res.appointments);
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
