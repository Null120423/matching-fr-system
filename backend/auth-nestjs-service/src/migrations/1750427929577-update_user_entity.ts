import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserEntity1750427929577 implements MigrationInterface {
  name = 'UpdateUserEntity1750427929577';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "availableTimeSlots" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Users" DROP COLUMN "availableTimeSlots"`,
    );
  }
}
