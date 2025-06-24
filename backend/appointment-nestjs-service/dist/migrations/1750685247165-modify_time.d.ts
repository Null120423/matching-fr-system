import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class ModifyTime1750685247165 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
