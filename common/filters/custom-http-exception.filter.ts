import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx       = host.switchToHttp();
    const response  = ctx.getResponse<Response>();
    const request   = ctx.getRequest<Request>();
    const status    = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    let errorResponse: any;

    if (typeof exceptionResponse === 'string') {
      errorResponse = { message: exceptionResponse };
    } else if (typeof exceptionResponse === 'object') {
      // ลบ statusCode ออกจาก response
      const { statusCode, ...rest } = exceptionResponse as { statusCode?: number; [key: string]: any };
      errorResponse = { ...rest };
    }

    response.status(status).json({
      ...errorResponse,
      // สามารถเพิ่มข้อมูลอื่น ๆ ได้ เช่น timestamp หรือ path
      //timestamp: new Date().toISOString(),
      //path: request.url,
    });
  }
}