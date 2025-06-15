"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmExModule = void 0;
const server_1 = require("../constants/server");
const database_module_1 = require("../database/database-module");
class TypeOrmExModule {
    static forCustomRepository(repositories) {
        const providers = [];
        for (const repository of repositories) {
            const entity = Reflect.getMetadata(server_1.TYPEORM_EX_CUSTOM_REPOSITORY, repository);
            if (!entity)
                continue;
            providers.push({
                inject: [server_1.DATA_SOURCE],
                provide: repository,
                useFactory: (dataSource) => {
                    const baseRepository = dataSource.getRepository(entity);
                    return new repository(baseRepository.target, baseRepository.manager, baseRepository.queryRunner);
                },
            });
        }
        return {
            imports: [database_module_1.DatabaseModule],
            exports: providers,
            module: TypeOrmExModule,
            providers,
        };
    }
}
exports.TypeOrmExModule = TypeOrmExModule;
//# sourceMappingURL=typeorm-ex.module.js.map