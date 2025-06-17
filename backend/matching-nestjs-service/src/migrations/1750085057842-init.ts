import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1750085057842 implements MigrationInterface {
  name = 'Init1750085057842';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."appointment_status_enum" AS ENUM('pending', 'accepted', 'declined', 'cancelled', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "appointment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "activity" character varying NOT NULL, "time" TIMESTAMP WITH TIME ZONE NOT NULL, "location" character varying NOT NULL, "fromUserId" character varying NOT NULL, "toUserId" character varying NOT NULL, "status" "public"."appointment_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "appointment"`);
    await queryRunner.query(`DROP TYPE "public"."appointment_status_enum"`);
  }
}
