import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFiledToUser1750600487348 implements MigrationInterface {
    name = 'AddFiledToUser1750600487348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "specificTimes" text`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "freeTimes" text`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "relationshipGoals" text`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "lifestyle" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "lifestyle"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "relationshipGoals"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "freeTimes"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "specificTimes"`);
    }

}
