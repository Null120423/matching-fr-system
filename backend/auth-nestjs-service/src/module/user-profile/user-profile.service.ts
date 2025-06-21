import { faker } from '@faker-js/faker';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/entities';
import { UserRepository } from 'src/repositories';
import { FindOptionsWhere, ILike, In, LessThanOrEqual, Not } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
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

  async insertUser(): Promise<string> {
    const NUM_USERS = 100; // Số lượng người dùng muốn tạo

    const AVATAR_URLS = [
      'https://cdn.kienthuc.net.vn/images/cf739f51f3276a5be16e9cbb75eb67056ecb9f1505774a3218c0cba5d75f88bc0801c710191e0c245028f2cb2a5728ed7ca52941d015e1e939f6fc761249f8b7d4082cd7dcaf8d47b6425bcfd176aede6caaf45458d56407db078b3ac478055623a6bf54429bbb1d080ce151fa37fac7/danh-tinh-hai-co-gai-xinh-dep-giau-co-ai-cung-nguong-mo.png',
      'https://i.pinimg.com/736x/18/49/58/184958c60b28dd91292ffb4eb5897c97.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw5jkKhJQEAFL_mwfZCDHiX--uVaIYFcsuqngbiv0YArEYnjTFVMdR5kXyrz4g2oYss_Q&usqp=CAU',
      'https://cdn.kienthuc.net.vn/images/cf739f51f3276a5be16e9cbb75eb6705e4436f5065c0e40fec88cd9642b284acd23ae24359070106743a4fa052de4cef88f2275c1ff7b1e7b5d0b6c488c711c3c3c20b56650d8e9a64e84198551727626485ffa17ef7a220987eaba86dbad1fce85d093d111bf81055c9e7351709f8cc/dang-anh-di-bau-cu-gai-xinh-bat-ngo-noi-nhu-con-tren-mxh-Hinh-3.jpeg',
      'https://kenh14cdn.com/2019/2/24/243274223900552214242885258065423810691072n-15510057259421664638280.jpg',
      'https://kenh14cdn.com/2019/2/24/2206970820181436218028212786496389901713408n-1551005725936566212207.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbSEl3XtDo0Lkk_7ZqlSpbfWewoTUUgiaNMm5A8B-_j0ER3M85tKd22bppxiRwx-gmd54&usqp=CAU',
      'https://kynguyenlamdep.com/wp-content/uploads/2022/06/anh-hot-girl.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw5gbNCnvt6XY2iTrNmhXYrIUnehZYVl8rFborDtl68uctGOiIm6PosnKhRNSUt7T09nc&usqp=CAU',
      'https://wellavn.com/wp-content/uploads/2024/11/gai-xinh-cute-anh-dai-dien-dep-cho-nu-6.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUU-ARFwYXo78eWXcjJ-ZJdt47Iu9zI-fdakinyYiz52mjxNXF1R1mGn2gQvyH6m4w48g&usqp=CAU',
      'https://i.pinimg.com/736x/e4/8b/48/e48b4839c832ab9c3aca7c01c0fe2b07.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_yZMltgT00jA24yl54A4s6vCRq5Rl369Sa0Itca2l1HMHdhh3Fi9u8iq1jMDvDj4hIro&usqp=CAU',
      'https://i.9mobi.vn/cf/images/2015/04/nkk/hinh-anh-gai-dep-3.jpg',
      'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474090Sjt/anh-girl-kute_025101890.jpg',
    ];

    const INTERESTS = [
      'Reading',
      'Gaming',
      'Hiking',
      'Cooking',
      'Photography',
      'Traveling',
      'Sports',
      'Music',
      'Movies',
      'Art',
      'Coding',
      'Dancing',
      'Singing',
      'Gardening',
      'Volunteering',
      'Writing',
      'Learning New Languages',
    ];

    const ACTIVITIES = [
      'Coffee meetings',
      'Board games',
      'Running',
      'Concerts',
      'Museum visits',
      'Book clubs',
      'Cooking classes',
      'Photography walks',
      'Weekend trips',
      'Gym sessions',
      'Coding meetups',
      'Dance lessons',
    ];

    function getRandomFromArray<T>(arr: T[], min = 1, max = 3): T[] {
      const count = Math.floor(Math.random() * (max - min + 1)) + min;
      const shuffled = [...arr].sort(() => 0.5 - Math.random()); // Shuffle array
      return shuffled.slice(0, count); // Take a random number of elements
    }

    const usersToInsert: UserEntity[] = [];

    for (let i = 0; i < NUM_USERS; i++) {
      const user = new UserEntity(); // Tạo một instance mới của UserEntity

      user.id = uuidv4();
      user.username = faker.internet.userName();
      user.email = faker.internet.email();
      user.password = 'Password123'; // Hash mật khẩu
      user.isEmailVerified = true; // Giả định là đã xác minh
      user.firstName = faker.person.firstName();
      user.lastName = faker.person.lastName();

      const today = new Date();
      const from = new Date();
      from.setFullYear(today.getFullYear() - 60);
      const to = new Date();
      to.setFullYear(today.getFullYear() - 18);
      user.dateOfBirth = faker.date.between({ from, to }); // Date object

      user.gender = faker.helpers.arrayElement(['male', 'female', 'other']);
      user.location = `${faker.location.city()}, ${faker.location.country()}`;
      user.bio = faker.lorem.sentences(3);
      user.avatarUrl = faker.helpers.arrayElement(AVATAR_URLS);
      user.interests = getRandomFromArray(INTERESTS); // Lưu mảng
      user.activities = getRandomFromArray(ACTIVITIES); // Lưu mảng

      user.minAgePreference = Math.floor(Math.random() * (25 - 18 + 1)) + 18;
      user.maxAgePreference =
        Math.floor(Math.random() * (60 - (user.minAgePreference + 5) + 1)) +
        (user.minAgePreference + 5);
      user.preferredGender = faker.helpers.arrayElement([
        'male',
        'female',
        'any',
      ]);

      // Các trường mặc định khác nếu có trong UserEntity (createdAt, updatedAt, isDeleted...)
      // TypeORM sẽ tự động xử lý createdAt, updatedAt nếu entity của bạn có @CreateDateColumn, @UpdateDateColumn
      // và isDeleted nếu bạn định nghĩa nó với giá trị mặc định.

      usersToInsert.push(user);
    }

    try {
      await this.repo.save(usersToInsert); // Thực hiện lưu tất cả người dùng vào DB
      console.log(`Successfully inserted ${NUM_USERS} users.`);
      return `Successfully inserted ${NUM_USERS} users.`;
    } catch (error) {
      console.error('Error inserting users:', error);
      throw new Error(`Failed to insert users: ${error.message}`);
    }
  }
}
