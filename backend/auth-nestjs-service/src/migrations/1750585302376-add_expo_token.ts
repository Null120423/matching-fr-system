import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExpoToken1750585302376 implements MigrationInterface {
  name = 'AddExpoToken1750585302376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "expoToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "expoToken"`);
  }
}
