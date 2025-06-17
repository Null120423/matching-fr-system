import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare function GrpcMethod(service: string, method: string): MethodDecorator;
export declare class GrpcLogInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
export declare function GrpcLog(): MethodDecorator;
