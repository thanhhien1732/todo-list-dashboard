import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Logger } from '@nestjs/common/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // Thêm tiền tố "api" cho tất cả các route

  // Bật CORS để FE chạy ở port khác có thể gọi API vào đây
  app.enableCors();

  // Kích hoạt bộ kiểm tra dữ liệu lỗi Validation Pipe toàn hệ thống
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường không được định nghĩa trong DTO
      transform: true, // Tự động chuyển đổi kiểu dữ liệu tương ứng trong DTO
    }),
  );

  // Đọc biến PORT từ file .env, nếu không có thì mặc định lấy 3000
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  // Đợi ứng dụng khởi chạy xong
  await app.listen(port);

  // In ra log bằng Logger của NestJS
  logger.log(`Server is running on: http://localhost:${port}`);
}
bootstrap();
