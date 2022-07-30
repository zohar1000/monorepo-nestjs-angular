import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter implements ExceptionFilter {
  constructor(private httpAdapter: any) {
    super();
  }

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = { statusCode: httpStatus, timestamp: (new Date()).toISOString(), path: this.httpAdapter.getRequestUrl(ctx.getRequest()) };
    // code to report error here ...
    this.httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
