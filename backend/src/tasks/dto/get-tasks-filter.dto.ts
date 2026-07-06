import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '@prisma/client';

export class GetTasksFilterDto {
    @IsOptional()
    @IsString()
    search?: string; // Tìm kiếm theo từ khóa trong tiêu đề/mô tả

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus; // Lọc theo trạng thái công việc

    @IsOptional()
    @Type(() => Number) // Ép kiểu từ chuỗi sang số nguyên
    @IsInt()
    @Min(1)
    page?: number = 1; // Số trang hiện tại, mặc định là 1

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10; // Số bản ghi mỗi trang, mặc định là 10
}