import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  activity: string;

  @IsNotEmpty()
  @IsDateString()
  time: Date;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsUUID() // Đảm bảo toUserId là UUID
  toUserId: string; // Người nhận lời mời
}
