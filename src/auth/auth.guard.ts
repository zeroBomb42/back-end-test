import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { CustomRequest } from '../custom-request.interface.ts';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly prisma = new PrismaClient();

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ตรวจสอบว่า endpoint นั้นมีการระบุ @Public หรือไม่
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<CustomRequest>(); // ใช้ CustomRequest
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No auth token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid auth token');
    }

    try {
      const payload = this.jwtService.verify(token);
      const authToken = await this.prisma.authToken.findUnique({
        where: { token },
      });

      if (!authToken) {
        throw new UnauthorizedException('Invalid auth token');
      }

      if (new Date() > authToken.expiresAt) {
        throw new UnauthorizedException('Auth token has expired');
      }

      request.user = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid auth token');
    }
  }
}
