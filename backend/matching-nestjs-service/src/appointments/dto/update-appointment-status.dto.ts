import { IsIn, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from 'src/entities';

export class UpdateAppointmentStatusDto {
  @IsNotEmpty()
  @IsIn([
    AppointmentStatus.ACCEPTED,
    AppointmentStatus.DECLINED,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.COMPLETED,
  ])
  newStatus: AppointmentStatus;
}
