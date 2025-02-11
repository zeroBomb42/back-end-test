import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { failed } from '../config/response';

// ✅ ใช้ Factory Function แทน
export function createValidationMiddleware(schema: ObjectSchema, property: string) {
  @Injectable()
  class ValidationMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
      const data = req[property];
      const { error } = schema.validate(data, { abortEarly: false });

      if (error) {
        const errorMessage = error.details.map((d) => d.message.replace(/\"/g, '')).join(', ');
        return failed(req, res, `Validation failed: ${errorMessage}`, error);
      }
      next();
    }
  }
  return ValidationMiddleware;
}
