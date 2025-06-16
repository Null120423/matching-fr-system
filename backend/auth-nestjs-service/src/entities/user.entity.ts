import { compare, hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
@Entity(`Users`)
export class UserEntity extends BaseEntityCustom {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  emailVerificationCode: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  resetPasswordCode: string;

  // --- Bổ sung các trường cho hồ sơ người dùng ---
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  dateOfBirth: Date; // Hoặc kiểu string nếu bạn muốn lưu theo định dạng cụ thể

  @Column({ nullable: true })
  gender: string; // Ví dụ: 'male', 'female', 'other'

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'simple-array', nullable: true }) // Mảng các sở thích
  interests: string[];

  // Các trường khác tùy theo nhu cầu như minAge, maxAge, activity cho phần discover
  @Column({ nullable: true, default: 0 })
  minAgePreference: number;

  @Column({ nullable: true, default: 100 })
  maxAgePreference: number;

  @Column({ nullable: true })
  preferredGender: string; // 'male', 'female', 'any'

  @Column({ type: 'simple-array', nullable: true })
  activities: string[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      const hashedPassword = await hash(this.password, 10);
      this.password = hashedPassword;
    }
  }

  comparePassword(candidate: string) {
    return compare(candidate, this.password);
  }
}
