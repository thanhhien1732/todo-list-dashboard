import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    // Tự động kết nối database khi ứng dụng khởi động
    async onModuleInit() {
        await this.$connect();
    }

    // Tự động ngắt kết nối khi ứng dụng tắt
    async onModuleDestroy() {
        await this.$disconnect();
    }
}