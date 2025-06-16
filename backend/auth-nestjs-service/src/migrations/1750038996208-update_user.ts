import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUser1750038996208 implements MigrationInterface {
  name = 'UpdateUser1750038996208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "avatar"`);
    await queryRunner.query(
      `ALTER TABLE "Users" DROP COLUMN "favoriteActivities"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" DROP COLUMN "availableTimeSlots"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "email" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "emailVerificationCode" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "isEmailVerified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "resetPasswordCode" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "firstName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "lastName" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "Users" ADD "dateOfBirth" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "gender" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "Users" ADD "bio" text`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "avatarUrl" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "Users" ADD "interests" text`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "minAgePreference" integer DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "maxAgePreference" integer DEFAULT '100'`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "preferredGender" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "Users" ADD "activities" text`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "username" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username")`,
    );
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "password" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "location"`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "location" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "location"`);
    await queryRunner.query(`ALTER TABLE "Users" ADD "location" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "password" character varying(500) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" DROP CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d"`,
    );
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "username" character varying(500) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "activities"`);
    await queryRunner.query(
      `ALTER TABLE "Users" DROP COLUMN "preferredGender"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" DROP COLUMN "maxAgePreference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" DROP COLUMN "minAgePreference"`,
    );
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "interests"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "avatarUrl"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "bio"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "dateOfBirth"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "firstName"`);
    await queryRunner.query(
      `ALTER TABLE "Users" DROP COLUMN "resetPasswordCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" DROP COLUMN "isEmailVerified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" DROP COLUMN "emailVerificationCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" DROP CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945"`,
    );
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "availableTimeSlots" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "favoriteActivities" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "avatar" character varying(500)`,
    );
  }
}
