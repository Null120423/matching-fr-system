import { Controller } from '@nestjs/common';
import { GrpcLog, GrpcMethod } from 'src/decorators';
import { UserEntity } from 'src/entities';
import { UserDTO } from '../auth/dto';
import {
  GetDashboardMetricsRequest,
  GetDashboardMetricsResponse,
  GetUsersByIdsDto,
  GetUsersByIdsResponseDto,
  GetUsersDiscoverDto,
  UpdateUserProfileDto,
} from './dto';
import { UserProfileService } from './user-profile.service';

GrpcLog();
@Controller('users')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @GrpcMethod('UserProfileService', 'GetMyProfile')
  async getMyProfile(payload: { userId: string }): Promise<UserDTO> {
    return await this.userProfileService.getUserById({
      userId: payload.userId,
    });
  }

  @GrpcMethod('UserProfileService', 'UpdateUserProfile')
  async updateProfile(
    payload: UpdateUserProfileDto & {
      userId: string;
    },
  ): Promise<UserEntity> {
    const { userId } = payload;
    return this.userProfileService.updateUserProfile(userId, payload);
  }

  @GrpcMethod('UserProfileService', 'DiscoverUsers')
  async discoverUsers(
    payload: GetUsersDiscoverDto & { currentUserId: string },
  ): Promise<{
    users: UserEntity[];
  }> {
    const res = await this.userProfileService.discoverUsers(payload);
    return res;
  }

  @GrpcMethod('UserProfileService', 'GetUserById')
  async getUserById(payload: {
    userId: string;
    friendId: string;
  }): Promise<UserDTO> {
    return this.userProfileService.getUserById(payload);
  }

  @GrpcMethod('UserProfileService', 'GetListUsersByIds')
  async getUsersByIds(
    payload: GetUsersByIdsDto,
  ): Promise<GetUsersByIdsResponseDto> {
    const res = await this.userProfileService.getUsersByIds(payload);
    return res;
  }

  @GrpcMethod('UserProfileService', 'GetDashboardMetrics')
  async getDashboardMetrics(
    payload: GetDashboardMetricsRequest,
  ): Promise<GetDashboardMetricsResponse> {
    return this.userProfileService.getDashboardMetrics(payload);
  }
}
