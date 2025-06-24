import { MigrationInterface, QueryRunner } from 'typeorm';

export class Modify1750684034661 implements MigrationInterface {
  name = 'Modify1750684034661';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "activityType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "date" TIMESTAMP WITH TIME ZONE `,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "duration" integer `,
    );
    await queryRunner.query(`ALTER TABLE "appointment" ADD "friendId" uuid `);
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "notes" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "time"`);
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "time" character varying `,
    );
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "location"`);
    await queryRunner.query(`ALTER TABLE "appointment" ADD "location" jsonb `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "location"`);
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "location" character varying `,
    );
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "time"`);
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "time" TIMESTAMP WITH TIME ZONE `,
    );
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "notes"`);
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "friendId"`);
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "duration"`);
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "date"`);
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "activityType"`,
    );
  }
}
