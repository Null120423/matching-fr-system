"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const filters_1 = require("./filters");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'appointment',
            protoPath: (0, path_1.join)(__dirname, '../../proto/appointment.proto'),
            url: '0.0.0.0:50053',
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.useGlobalFilters(new filters_1.AllExceptionsFilter());
    await app.listen();
    console.log('✅ gRPC Microservice is running on port 50053');
}
bootstrap();
//# sourceMappingURL=main.js.map