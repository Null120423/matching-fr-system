"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifyTime1750685247165 = void 0;
class ModifyTime1750685247165 {
    name = 'ModifyTime1750685247165';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "appointment" ADD "datetime" TIMESTAMP WITH TIME ZONE `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "datetime"`);
    }
}
exports.ModifyTime1750685247165 = ModifyTime1750685247165;
//# sourceMappingURL=1750685247165-modify_time.js.map