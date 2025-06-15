"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcMethod = GrpcMethod;
const microservices_1 = require("@nestjs/microservices");
function GrpcMethod(service, method) {
    console.log(`[Mapped GRPC] ${service}.${method}`);
    return (0, microservices_1.GrpcMethod)(service, method);
}
//# sourceMappingURL=Grpc-log.decorator.js.map