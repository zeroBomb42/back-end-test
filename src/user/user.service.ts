import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly prisma = new PrismaClient();

  async findOne(username: string): Promise<any> {
    return this.prisma.user.findUnique({ where: { userName: username } });
  }

  async create(user: any): Promise<any> {
    return this.prisma.user.create({ data: user });
  }
}