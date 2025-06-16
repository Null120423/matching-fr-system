/* eslint-disable @typescript-eslint/require-await */
import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { CurrentUser, GrpcLog, GrpcMethod } from 'src/decorators';
import { UserEntity } from 'src/entities';
import { GetUsersDiscoverDto, UpdateUserProfileDto } from './dto';
import { UserProfileService } from './user-profile.service';

GrpcLog();
@Controller('users')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('me')
  async getMyProfile(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return user; // Đối tượng User đã được đính kèm vào request bởi JwtStrategy
  }

  @Put(':userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<UserEntity> {
    // Đảm bảo chỉ người dùng đang đăng nhập mới có thể cập nhật hồ sơ của họ
    if (userId !== currentUser.id) {
      // Xử lý lỗi Unauthorized hoặc Forbidden
      throw new Error('Unauthorized to update this profile.');
    }
    return this.userProfileService.updateUserProfile(
      userId,
      updateUserProfileDto,
    );
  }

  @Get('discover')
  async discoverUsers(
    @Query() filters: GetUsersDiscoverDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<UserEntity[]> {
    // Bạn có thể truyền ID người dùng hiện tại để loại trừ họ khỏi danh sách hoặc tùy chỉnh logic discover
    return this.userProfileService.discoverUsers(filters, currentUser.id);
  }

  @GrpcMethod('UserProfileService', 'GetUserById')
  async getUserById(payload: { userId: string }): Promise<UserEntity> {
    return this.userProfileService.getUserById(payload.userId);
  }
}
