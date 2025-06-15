"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const typeorm_1 = require("typeorm");
(0, dotenv_1.config)();
exports.dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: process.env.DB_LOGGING === 'true',
    entities: [(0, path_1.resolve)(__dirname, '../entities/*.entity{.ts,.js}')],
    migrations: [(0, path_1.resolve)(__dirname, '../migrations/*{.ts,.js}')],
});
//# sourceMappingURL=typeorm.config.js.map