import { Controller } from '@nestjs/common';
import { GrpcLog, GrpcMethod } from 'src/decorators';
import { UserEntity } from 'src/entities';
import { GetUsersDiscoverDto, UpdateUserProfileDto } from './dto';
import { UserProfileService } from './user-profile.service';

GrpcLog();
@Controller('users')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @GrpcMethod('UserProfileService', 'GetMyProfile')
  async getMyProfile(payload: { currentUserId: string }): Promise<UserEntity> {
    return await this.userProfileService.getUserById(payload.currentUserId);
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
  async getUserById(payload: { userId: string }): Promise<UserEntity> {
    return this.userProfileService.getUserById(payload.userId);
  }
}
