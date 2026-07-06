import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule'; // <-- Thêm dòng này

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.TaskCreateInput) {
    return this.prisma.task.create({ data });
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
    status?: string,
    sortBy?: string,
    sortOrder?: string,
  ) {
    const skip = (page - 1) * limit;

    // Chỉ lấy các công việc CHƯA BỊ XÓA
    const where: Prisma.TaskWhereInput = {
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (status) {
      where.status = status as any;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy && (sortOrder === 'asc' || sortOrder === 'desc')) {
      orderBy = { [sortBy]: sortOrder };
    }

    const [tasks, totalItems] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: tasks,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.task.findFirst({
      where: { id, isDeleted: false },
    });
  }

  async update(id: number, data: Prisma.TaskUpdateInput) {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  // HÀM XÓA MỀM: Không delete trong database mà chỉ gán cờ
  async remove(id: number) {
    return this.prisma.task.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(), // Lưu lại thời điểm xóa
      },
    });
  }

  // LẤY DANH SÁCH THÙNG RÁC
  async getTrash() {
    return this.prisma.task.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' }, // Sắp xếp cái nào mới xóa lên đầu
    });
  }

  // KHÔI PHỤC CÔNG VIỆC
  async restore(id: number) {
    return this.prisma.task.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null, // Reset lại thời gian xóa
      },
    });
  }

  // XÓA VĨNH VIỄN BẰNG TAY (Dành cho nút bấm xóa hoàn toàn)
  async permanentDelete(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  // CRON JOB: TỰ ĐỘNG CHẠY VÀO 00:00 MỖI ĐÊM ĐỂ QUÉT RÁC QUÁ 30 NGÀY
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleAutomaticTrashCleanup() {
    this.logger.log('Bắt đầu tiến trình tự động dọn dẹp thùng rác định kỳ...');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // Tính mốc thời gian 30 ngày trước

    // Xóa hoàn toàn các bản ghi có isDeleted = true và thời gian xóa lâu hơn 30 ngày trước
    const deleteResult = await this.prisma.task.deleteMany({
      where: {
        isDeleted: true,
        deletedAt: {
          lt: thirtyDaysAgo, // Viết tắt của "less than" (Nhỏ hơn / Lâu hơn mốc 30 ngày)
        },
      },
    });

    if (deleteResult.count > 0) {
      this.logger.log(`Hệ thống đã tự động xóa vĩnh viễn thành công ${deleteResult.count} công việc quá hạn 30 ngày.`);
    } else {
      this.logger.log('Không có công việc nào trong thùng rác quá hạn 30 ngày.');
    }
  }
}