import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly prisma = new PrismaClient();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userName: string, password: string) {
    const user = await this.userService.findOne(userName);
    if (!user) {
      return { message: 'User not found' };
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return { message: 'Invalid password' };
    }

    const payload = { userName: user.userName, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '24h' });

    // เก็บ token ลงในฐานข้อมูล
    await this.prisma.authToken.create({
      data: {
        userId: user.id,
        token: accessToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 ชั่วโมง
      },
    });

    return {
      message: 'Login successful',
      access_token: accessToken,
    };
  }

  async register(user: any) {
    // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
    const existingUser = await this.userService.findOne(user.userName);
    if (existingUser) {
      return null; // ส่งกลับ null ถ้าผู้ใช้มีอยู่แล้ว
    }

    // ทำการเข้ารหัสรหัสผ่าน
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;

    return this.userService.create(user);
  }

  async logout(userName: string, token: string) {
    const user = await this.userService.findOne(userName);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    // ลบ token ที่หมดอายุแล้วและลบ token ที่ส่งเข้ามาของผู้ใช้งานออกจากฐานข้อมูลทั้งหมด
    await this.prisma.authToken.deleteMany({
      where: {
        userId: user.id,
        OR: [
          { expiresAt: { lte: new Date() } },
          { token: token },
        ],
      },
    });
  
    return { message: 'Logout successful' };
  }
}