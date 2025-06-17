import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const type = host.getType();

    const status = exception?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception?.message || 'Internal server error';
    const name = exception?.name || 'Error';

    if (type === 'rpc') {
      if (exception instanceof RpcException) {
        return throwError(() => exception);
      }

      return throwError(
        () =>
          new RpcException({
            code: status === 404 ? 5 : 13, // gRPC error codes
            message,
            name,
          }),
      );
    }
  }
}
