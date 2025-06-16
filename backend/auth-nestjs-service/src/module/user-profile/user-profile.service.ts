import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/entities';
import { UserRepository } from 'src/repositories';
import { GetUsersDiscoverDto } from './dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateUserProfile(
    userId: string,
    updateData: UpdateUserProfileDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    Object.assign(user, updateData); // Cập nhật các trường từ DTO
    return this.userRepository.save(user);
  }

  async getUserById(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    return user;
  }

  async discoverUsers(
    filters: GetUsersDiscoverDto,
    currentUserId: string,
  ): Promise<UserEntity[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Loại trừ người dùng hiện tại
    queryBuilder.where('user.id != :currentUserId', { currentUserId });

    // Áp dụng các bộ lọc từ GetUsersDiscoverDto
    if (filters.query) {
      queryBuilder.andWhere(
        '(user.firstName ILike :query OR user.lastName ILike :query OR user.bio ILike :query)',
        { query: `%${filters.query}%` },
      );
    }
    if (filters.activity) {
      queryBuilder.andWhere('user.activities LIKE :activity', {
        activity: `%${filters.activity}%`,
      });
    }
    if (filters.location) {
      queryBuilder.andWhere('user.location ILike :location', {
        location: `%${filters.location}%`,
      });
    }
    if (filters.minAge) {
      // Logic tính toán tuổi dựa trên dateOfBirth
      // (Current Year - YearOfBirth) >= minAge
      // Cần một cách phức tạp hơn để tính toán tuổi chính xác trong SQL
      // Ví dụ đơn giản: queryBuilder.andWhere('EXTRACT(YEAR FROM AGE(user.dateOfBirth)) >= :minAge', { minAge: filters.minAge });
      // Hoặc bạn có thể thêm một cột 'age' được tính toán hoặc cập nhật định kỳ.
    }
    if (filters.maxAge) {
      // Tương tự cho maxAge
    }
    if (filters.gender && filters.gender !== 'any') {
      queryBuilder.andWhere('user.gender = :gender', {
        gender: filters.gender,
      });
    }

    // Bạn có thể thêm logic phức tạp hơn ở đây để phù hợp với sở thích của người dùng hiện tại
    // Ví dụ: Lấy sở thích của currentUser và tìm những người dùng có sở thích chung,
    // hoặc lọc theo minAgePreference, maxAgePreference, preferredGender của currentUser.

    return queryBuilder.getMany();
  }
}
