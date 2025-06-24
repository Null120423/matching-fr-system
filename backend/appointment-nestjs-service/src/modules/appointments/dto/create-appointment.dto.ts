import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class CoordinatesDto {
  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  lng: number;
}

class LocationDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;
}

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  activity: string;

  @IsNotEmpty()
  @IsString()
  activityType: string;

  @IsNotEmpty()
  @IsDateString()
  date: string; // ISO 8601 date string like "2025-06-24T12:54:19.774Z"

  @IsNotEmpty()
  @IsString()
  time: string; // "13:00"

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  duration: number; // in minutes

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsString()
  notes: string;

  @IsNotEmpty()
  @IsUUID()
  toUserId: string;
}
