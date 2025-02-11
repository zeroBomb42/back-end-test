import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable()
export class DebugInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    //console.log(`[DEBUG] ${timestamp} - Incoming request: ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const executionTime = Date.now() - now;
        console.log(`[DEBUG] ${timestamp} - ${method} ${url} Execution time: ${executionTime}ms`);
      }),
      catchError((error) => {
        const executionTime = Date.now() - now;
        console.error(`[ERROR] ${timestamp} - Error on request: ${method} ${url} Execution time: ${executionTime}ms`);
        console.error(`[ERROR] ${timestamp} - Error details:`, error.message || error);

        // Return the error as a HttpException or throw the original error
        return throwError(() => new HttpException(error.message, error.status || 500)); 
      })
    );
  }
}

