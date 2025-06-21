import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1750407973200 implements MigrationInterface {
  name = 'Init1750407973200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."swipe_action_enum" AS ENUM('LIKE', 'PASS')`,
    );
    await queryRunner.query(
      `CREATE TABLE "swipe" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "swiperId" character varying NOT NULL, "swipedId" character varying NOT NULL, "action" "public"."swipe_action_enum" NOT NULL, CONSTRAINT "PK_cb1669106ad4579aa39400adb94" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."friend_request_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "friend_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "senderId" character varying NOT NULL, "receiverId" character varying NOT NULL, "status" "public"."friend_request_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_4c9d23ff394888750cf66cac17c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "friend_request"`);
    await queryRunner.query(`DROP TYPE "public"."friend_request_status_enum"`);
    await queryRunner.query(`DROP TABLE "swipe"`);
    await queryRunner.query(`DROP TYPE "public"."swipe_action_enum"`);
  }
}
