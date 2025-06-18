// backend/api-gateway/src/appointment/appointment.controller.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Observable } from 'rxjs';

// Định nghĩa các interface cho gRPC messages
export enum AppointmentStatus {
  PENDING = 0,
  ACCEPTED = 1,
  DECLINED = 2,
  CANCELLED = 3,
  COMPLETED = 4,
}

// Add ApiProperty to your DTO classes (which will act as DTOs for Swagger)
export class Appointment {
  @ApiProperty({
    description: 'Unique identifier of the appointment',
    example: 'uuid-123-abc',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Description of the activity',
    example: 'Meeting with client',
  })
  activity: string;

  @ApiProperty({
    description: 'Scheduled time of the appointment (ISO 8601 string)',
    example: '2025-07-20T10:00:00Z',
  })
  time: string;

  @ApiProperty({
    description: 'Location of the appointment',
    example: 'Client Office A',
  })
  location: string;

  @ApiProperty({
    description: 'ID of the user who initiated the appointment',
    example: 'user-id-1',
  })
  fromUserId: string;

  @ApiProperty({
    description: 'ID of the user who is the recipient of the appointment',
    example: 'user-id-2',
  })
  toUserId: string;

  @ApiProperty({
    description: 'Current status of the appointment',
    enum: AppointmentStatus,
    example: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @ApiProperty({
    description: 'Timestamp when the appointment was created (ISO 8601 string)',
    example: '2025-07-19T14:30:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description:
      'Timestamp when the appointment was last updated (ISO 8601 string)',
    example: '2025-07-19T15:00:00Z',
  })
  updatedAt: string;
}

export class GetAppointmentsRequest {
  @ApiProperty({
    description: 'ID of the user to retrieve appointments for',
    example: 'user-id-1',
  })
  userId: string;

  @ApiProperty({
    description:
      'Filter type for appointments (e.g., "incoming", "outgoing", "all")',
    example: 'incoming',
  })
  filterType: string;
}

export class GetAppointmentsResponse {
  @ApiProperty({ type: [Appointment], description: 'List of appointments' })
  appointments: Appointment[];
}

export class CreateAppointmentRequest {
  @ApiProperty({
    description: 'ID of the user requesting the appointment details',
    example: 'user-id-1',
  })
  userId: string;

  @ApiProperty({
    description: 'ID of the user who initiated the appointment',
    example: 'user-id-1',
  })
  @IsOptional()
  @IsString()
  fromUserId?: string;
}

export class UpdateAppointmentStatusRequest {
  @ApiProperty({
    description: 'ID of the appointment to update',
    example: 'uuid-123-abc',
  })
  id: string;
  @ApiProperty({
    description: 'ID of the user performing the update',
    example: 'user-id-1',
  })
  userId: string;
  @ApiProperty({
    description: 'The new status for the appointment',
    enum: AppointmentStatus,
    example: AppointmentStatus.ACCEPTED,
  })
  newStatus: AppointmentStatus;
}
export class GetAppointmentByIdRequest {
  @ApiProperty({
    description: 'ID of the appointment to retrieve',
    example: 'uuid-123-abc',
  })
  id: string;
  @ApiProperty({
    description: 'ID of the user requesting the appointment details',
    example: 'user-id-1',
  })
  userId: string;
}

export interface AppointmentServiceGrpc {
  createAppointment(data: CreateAppointmentRequest): Observable<Appointment>;
  getAppointments(
    data: GetAppointmentsRequest,
  ): Observable<GetAppointmentsResponse>;
  getAppointmentById(data: GetAppointmentByIdRequest): Observable<Appointment>;
  updateAppointmentStatus(
    data: UpdateAppointmentStatusRequest,
  ): Observable<Appointment>;
}
