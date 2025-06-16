import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error(exception?.stack);

    const type = host.getType();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'INTERNAL_SERVER_ERROR';
    let name = 'InternalServerError';
    const messages: string[] = [];

    const detailMessages = exception?.response?.message || [];
    for (const text of detailMessages) {
      const arrText = text.split('.');
      if (arrText.length === 3 && arrText[0] === 'items') {
        messages.push(`Dòng ${+arrText[1] + 3} - ${arrText[2]}`);
      } else {
        messages.push(text);
      }
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      name = exception.name;

      if (message === 'INTERNAL_SERVER_ERROR' && exception.message) {
        message = exception.message;
      } else if (message?.message) {
        message = message.message;
      }

      if (
        status === HttpStatus.UNAUTHORIZED &&
        message === 'Unauthorized' &&
        typeof exception.getResponse === 'function' &&
        (exception.getResponse() as any)?.req?.authInfo?.name ===
          'TokenExpiredError'
      ) {
        message = 'Hết phiên đăng nhập, vui lòng đăng nhập lại để tiếp tục.';
      }

      if (
        status === HttpStatus.BAD_REQUEST &&
        name === 'BadRequestException' &&
        message === 'Bad Request Exception'
      ) {
        const detailMessage = messages.join('<br>+ ') || '';
        message = `Dữ liệu không hợp lệ, chi tiết:<br>+ ${detailMessage}`;
      }
    } else {
      status = exception?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      name =
        exception?.name || exception?.statusText || 'INTERNAL_SERVER_ERROR';
      message =
        exception?.message ||
        exception?.data?.message ||
        'INTERNAL_SERVER_ERROR';

      if (message?.message) {
        message = message.message;
      }
    }

    if (type === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();

      response?.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request?.url,
        message: message,
        name: name,
      });
    }

    // ✅ FIX: return throwError instead of throwing RpcException
    else if (type === 'rpc') {
      return throwError(
        () =>
          new RpcException({
            statusCode: status,
            message,
            name,
          }),
      );
    } else {
      console.warn(`Unhandled exception context: ${type}`);
    }
  }
}
