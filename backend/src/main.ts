import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Logger } from '@nestjs/common/services/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // Thêm tiền tố "api" cho tất cả các route

  // Cấu hình CORS để cho phép truy cập từ các nguồn khác nhau
  app.enableCors({
    origin: ['http://localhost:3000', 'https://todo-list-dashboard-lilac.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Kích hoạt bộ kiểm tra dữ liệu lỗi Validation Pipe toàn hệ thống
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường không được định nghĩa trong DTO
      transform: true, // Tự động chuyển đổi kiểu dữ liệu tương ứng trong DTO
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Todo App API')
    .setDescription('Tài liệu API cho hệ thống quản lý công việc')
    .setVersion('1.0')
    .addTag('tasks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Đọc biến PORT từ file .env, nếu không có thì mặc định lấy 3000
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3001;

  // Đợi ứng dụng khởi chạy xong
  await app.listen(port);

  // In ra log bằng Logger của NestJS
  logger.log(`Server is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation: http://localhost:${port}/docs`);
}
bootstrap();
