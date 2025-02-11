import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { glob } from 'glob';
import { resolve } from 'path';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { DebugInterceptor } from '../common/interceptors/debug.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module'; // นำเข้า AuthModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule, // เพิ่ม AuthModule
    ...AppModule.loadModules(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DebugInterceptor, // ใช้ DebugInterceptor กับทุก API
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // ใช้ AuthGuard กับทุก API
    },
  ],
})
export class AppModule {
  static loadModules(): DynamicModule[] {
    const modules: DynamicModule[] = [];

    // Resolve the path to make sure it's correct
    const moduleFiles = glob.sync(
      resolve(__dirname, './**/*.module.ts').replace(/\\/g, '/')
    );

    for (const file of moduleFiles) {
      const module = require(file);
      const moduleName = Object.keys(module)[0];
      modules.push(module[moduleName]);
    }

    return modules;
  }
}