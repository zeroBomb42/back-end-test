import { Module, MiddlewareConsumer, RequestMethod, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { createValidationMiddleware } from '../../common/middleware/validation.middleware';
import { loginSchema, registerSchema } from './auth.validation';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'your_jwt_secret_key', // ควรเก็บ secret key ใน environment variable
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, AuthGuard],
  controllers: [AuthController],
  exports: [JwtModule], // เพิ่มการส่งออก JwtModule
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(createValidationMiddleware(loginSchema, 'body'))
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });

    consumer
      .apply(createValidationMiddleware(registerSchema, 'body'))
      .forRoutes({ path: 'auth/register', method: RequestMethod.POST });
  }
}