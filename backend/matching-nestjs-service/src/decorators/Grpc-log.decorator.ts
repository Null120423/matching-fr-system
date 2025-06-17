import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { GrpcMethod as NestGrpcMethod } from '@nestjs/microservices';
import { Observable, tap } from 'rxjs';
export function GrpcMethod(service: string, method: string): MethodDecorator {
  console.log(`[Mapped GRPC] ${service}.${method}`);
  return NestGrpcMethod(service, method);
}

@Injectable()
export class GrpcLogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler().name;
    const className = context.getClass().name;
    const data = context.getArgs();

    console.log(
      `📡 [gRPC] ${className}.${handler} called with data:`,
      JSON.stringify(data),
    );

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `✅ [gRPC] ${className}.${handler} completed in ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}

export function GrpcLog(): MethodDecorator {
  return UseInterceptors(GrpcLogInterceptor);
}
