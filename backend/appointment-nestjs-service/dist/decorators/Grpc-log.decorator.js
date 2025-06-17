"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcLogInterceptor = void 0;
exports.GrpcMethod = GrpcMethod;
exports.GrpcLog = GrpcLog;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
function GrpcMethod(service, method) {
    console.log(`[Mapped GRPC] ${service}.${method}`);
    return (0, microservices_1.GrpcMethod)(service, method);
}
let GrpcLogInterceptor = class GrpcLogInterceptor {
    intercept(context, next) {
        const handler = context.getHandler().name;
        const className = context.getClass().name;
        const data = context.getArgs();
        console.log(`📡 [gRPC] ${className}.${handler} called with data:`, JSON.stringify(data));
        const now = Date.now();
        return next
            .handle()
            .pipe((0, rxjs_1.tap)(() => console.log(`✅ [gRPC] ${className}.${handler} completed in ${Date.now() - now}ms`)));
    }
};
exports.GrpcLogInterceptor = GrpcLogInterceptor;
exports.GrpcLogInterceptor = GrpcLogInterceptor = __decorate([
    (0, common_1.Injectable)()
], GrpcLogInterceptor);
function GrpcLog() {
    return (0, common_1.UseInterceptors)(GrpcLogInterceptor);
}
//# sourceMappingURL=Grpc-log.decorator.js.map