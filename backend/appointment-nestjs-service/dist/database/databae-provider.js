"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProvider = void 0;
const server_1 = require("../constants/server");
const typeorm_config_1 = require("../typeorm/typeorm.config");
exports.databaseProvider = {
    provide: server_1.DATA_SOURCE,
    useFactory: async () => {
        if (!typeorm_config_1.dataSource.isInitialized) {
            await typeorm_config_1.dataSource.initialize();
            if (process.env.NODE_ENV === 'development') {
                try {
                    await typeorm_config_1.dataSource.runMigrations();
                }
                catch (error) {
                    console.log(`Migrations Error: ${error}`);
                }
            }
            return typeorm_config_1.dataSource;
        }
    },
};
//# sourceMappingURL=databae-provider.js.map