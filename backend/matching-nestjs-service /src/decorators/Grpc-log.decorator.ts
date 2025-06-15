import { GrpcMethod as NestGrpcMethod } from '@nestjs/microservices';

export function GrpcMethod(service: string, method: string): MethodDecorator {
  console.log(`[Mapped GRPC] ${service}.${method}`);
  return NestGrpcMethod(service, method);
}
