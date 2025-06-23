import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  minAgePreference?: number;

  @IsOptional()
  maxAgePreference?: number;

  @IsOptional()
  preferredGender?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specificTimes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  freeTimes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relationshipGoals?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  lifestyle?: string[];
}
