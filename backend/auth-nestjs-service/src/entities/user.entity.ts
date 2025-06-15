import { compare, hash } from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';

@Entity(`Users`)
export class UserEntity extends BaseEntityCustom {
  @Column({ length: 500 })
  username: string;

  @Column({ length: 500 })
  password: string;

  @Column({ length: 500, nullable: true })
  avatar: string;

  @Column('simple-array', { nullable: true })
  favoriteActivities: string[];

  @Column('simple-array', { nullable: true })
  availableTimeSlots: string[];

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  location: Date;

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
