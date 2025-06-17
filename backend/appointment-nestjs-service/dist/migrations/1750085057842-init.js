"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Init1750085057842 = void 0;
class Init1750085057842 {
    name = 'Init1750085057842';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."appointment_status_enum" AS ENUM('pending', 'accepted', 'declined', 'cancelled', 'completed')`);
        await queryRunner.query(`CREATE TABLE "appointment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "activity" character varying NOT NULL, "time" TIMESTAMP WITH TIME ZONE NOT NULL, "location" character varying NOT NULL, "fromUserId" character varying NOT NULL, "toUserId" character varying NOT NULL, "status" "public"."appointment_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "appointment"`);
        await queryRunner.query(`DROP TYPE "public"."appointment_status_enum"`);
    }
}
exports.Init1750085057842 = Init1750085057842;
//# sourceMappingURL=1750085057842-init.js.map