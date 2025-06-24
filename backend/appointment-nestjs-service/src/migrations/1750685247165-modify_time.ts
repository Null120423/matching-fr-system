import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyTime1750685247165 implements MigrationInterface {
  name = 'ModifyTime1750685247165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "datetime" TIMESTAMP WITH TIME ZONE `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "datetime"`);
  }
}
