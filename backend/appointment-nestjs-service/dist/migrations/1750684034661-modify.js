"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modify1750684034661 = void 0;
class Modify1750684034661 {
    name = 'Modify1750684034661';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "appointment" ADD "activityType" character varying`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "date" TIMESTAMP WITH TIME ZONE `);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "duration" integer `);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "friendId" uuid `);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "notes" character varying`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "time" character varying `);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "location" jsonb `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "location" character varying `);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "time" TIMESTAMP WITH TIME ZONE `);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "friendId"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "activityType"`);
    }
}
exports.Modify1750684034661 = Modify1750684034661;
//# sourceMappingURL=1750684034661-modify.js.map