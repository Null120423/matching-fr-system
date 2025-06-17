import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetUsersDiscoverDto {
  @IsOptional()
  @IsString()
  query?: string; // Tên, bio...

  @IsOptional()
  @IsString()
  activity?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minAge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(150)
  maxAge?: number;

  @IsOptional()
  @IsString()
  gender?: 'male' | 'female' | 'other' | 'any';
}
