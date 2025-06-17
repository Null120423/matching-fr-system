import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/entities';
import { UserRepository } from 'src/repositories';
import { FindOptionsWhere, ILike, In, LessThanOrEqual, Not } from 'typeorm';
import { GetUsersDiscoverDto } from './dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserProfileService {
  constructor(private readonly repo: UserRepository) {}

  async updateUserProfile(
    userId: string,
    updateData: UpdateUserProfileDto,
  ): Promise<UserEntity> {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    Object.assign(user, {
      ...updateData,
      ...(updateData.dateOfBirth
        ? { dateOfBirth: new Date(updateData.dateOfBirth) }
        : {}),
    });

    return this.repo.save(user);
  }

  async getUserById(userId: string): Promise<UserEntity> {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    return user;
  }

  async discoverUsers(
    payload: GetUsersDiscoverDto & { currentUserId: string },
  ): Promise<{
    users: UserEntity[];
  }> {
    const whereCon: FindOptionsWhere<UserEntity> = {
      isDeleted: false,
      isEmailVerified: true,
    };
    if (payload.currentUserId) {
      whereCon.id = Not(In([payload.currentUserId]));
    }
    if (payload.activity) {
      whereCon.activities = ILike(`%${payload.activity}%`);
    }
    if (payload.minAge) {
      const today = new Date();
      const minBirthDate = new Date(
        today.getFullYear() - payload.minAge,
        today.getMonth(),
        today.getDate(),
      );
      whereCon.dateOfBirth = LessThanOrEqual(minBirthDate);
    }
    if (payload.maxAge) {
      const today = new Date();
      const maxBirthDate = new Date(
        today.getFullYear() - payload.maxAge,
        today.getMonth(),
        today.getDate(),
      );
      whereCon.dateOfBirth = LessThanOrEqual(maxBirthDate);
    }
    if (payload.gender) {
      whereCon.gender = payload.gender;
    }
    if (payload.query) {
      whereCon.firstName = ILike(`%${payload.query}%`);
    }
    const res = await this.repo.find({
      where: whereCon,
    });

    return {
      users: res,
    };
  }
}
