import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntityCustom extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  createdBy: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  createdByName: string;

  @Column({ nullable: true })
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  updatedBy: string;

  @Column({ type: 'varchar', nullable: true })
  deleteBy: string;

  @Column({ name: 'isDeleted', default: false })
  isDeleted: boolean;
}
