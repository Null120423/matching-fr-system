"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Init1749694126000 = void 0;
class Init1749694126000 {
    name = 'Init1749694126000';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "username" character varying(500) NOT NULL, "password" character varying(500) NOT NULL, "avatar" character varying(500), "favoriteActivities" text, "availableTimeSlots" text, "location" TIMESTAMP, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "Users"`);
    }
}
exports.Init1749694126000 = Init1749694126000;
//# sourceMappingURL=1749694126000-init.js.map