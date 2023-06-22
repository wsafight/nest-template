import { FastifyReply, FastifyRequest } from 'fastify';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BusinessException } from './business.exception';

// 仅捕获 HTTP 相关的异常
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();

    // 处理业务异常
    if (exception instanceof BusinessException) {
      const err: Record<string, any> = exception.getResponse() as object;
      response.status(HttpStatus.OK).send({
        code: err['code'],
        message: err['message'],
      });
      return;
    }

    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.getResponse(),
    });
  }
}
