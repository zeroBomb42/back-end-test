import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';
import { CustomHttpExceptionFilter } from '../common/filters/custom-http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiPrefix = process.env.PREFIX ?? 'defaultPrefix';
  const apiVersion = process.env.VERSION_PATH ?? 'v1';
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);
  const port = process.env.PORT ?? 3036;

  // ใช้ CustomHttpExceptionFilter สำหรับจัดการข้อผิดพลาดที่เกิดขึ้น
  app.useGlobalFilters(new CustomHttpExceptionFilter());

  await app.listen(port, () => {
    console.log(`########## Application is running on: http://localhost:${port} ##########`);
    // printRoutes(app);
  });

  // ฟังก์ชันสำหรับเชื่อมต่อกับฐานข้อมูล
  async function connectToDatabase() {
    const prisma = new PrismaClient();
    try {
      await prisma.$connect();
      console.log('########## Connected to the database successfully ##########');
    } catch (error) {
      console.error('########## Failed to connect to the database. Retrying in 30 minutes... ##########', error);
      setTimeout(connectToDatabase, 1800000); // ลูปเชื่อมต่อทุก 30 นาที
    }
  }

  await connectToDatabase();
}

// ฟังก์ชันสำหรับแสดงเส้นทางทั้งหมด
function printRoutes(app) {
  const server = app.getHttpServer();
  const router = server._events.request.router;
  const routes: any[] = [];

  router.stack.forEach((middleware) => {
    if (middleware.route) { // routes registered directly on the app
      routes.push(middleware.route);
    } else if (middleware.name === 'router') { // router middleware 
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route;
        route && routes.push(route);
      });
    }
  });

  console.log('########## Registered Routes ##########');
  routes.forEach((route) => {
    console.log(`${Object.keys(route.methods).join(', ').toUpperCase()} ${route.path}`);
  });
}

bootstrap();

