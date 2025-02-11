import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ObjectSchema } from 'joi';

// ✅ ใช้ Factory Function แทน
export function createValidationMiddleware(schema: ObjectSchema, property: string) {
  @Injectable()
  class ValidationMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
      const data = req[property];
      const { error } = schema.validate(data, { abortEarly: false });

      if (error) {
        return res.status(400).json({
          data: null,
          error: error.details.map((d) => d.message),
        });
      }
      next();
    }
  }
  return ValidationMiddleware;
}
