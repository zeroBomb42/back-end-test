import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { success, failed } from '../../common/config/response';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()  // ยกเว้น global guard สำหรับเส้นทางนี้
  //@UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const { userName, password } = req.body;
      const result = await this.authService.login(userName, password);
      //ถ้าไม่พบผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง ให้ส่งข้อความว่าตามเหตุการณ์
      if (result.message === 'User not found' || result.message === 'Invalid password') {
        return failed(req, res, result.message, null);
      }
      return success(res, 'Login successful', result);
    } catch (error) {
      return failed(req, res, 'Login failed', error);
    }
  }

  @Public()  // ยกเว้น global guard สำหรับเส้นทางนี้
  @Post('register')
  async register(@Req() req: Request, @Res() res: Response) {
    try {
      const { userName, password, email } = req.body;

      const createUserDto = {
        userName,
        password,
        email,
        createdBy: userName,
        updatedBy: userName,
      };

      const result = await this.authService.register(createUserDto);

      if (!result) {
        return failed(req, res, 'User already exists', null);
      }

      return success(res, 'Register success');
    } catch (error) {
      console.log('error >>', error);
      return failed(req, res, 'Register failed', error);
    }
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return failed(req, res, 'Authorization token is missing', null);
      }
      // ดึง userName จาก req.user ที่แนบมาจาก AuthGuard
      const { userName } = req['user'] as { userName: string };
      const result = await this.authService.logout(userName, token);
      if (!result) {
        return failed(req, res, 'Logout failed', null);
      }

      return success(res, 'Logged out successfully');
    } catch (error) {
      return failed(req, res, 'Logout failed', error);
    }
  }
}