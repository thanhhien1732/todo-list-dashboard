import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TaskStatus } from '@prisma/client';

export class GetTasksFilterDto {
    @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm trong tiêu đề hoặc mô tả', example: 'báo cáo' })
    @IsOptional()
    @IsString()
    search?: string; // Tìm kiếm theo từ khóa trong tiêu đề/mô tả

    @ApiPropertyOptional({ enum: TaskStatus, description: 'Lọc theo trạng thái công việc', example: TaskStatus.TODO })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus; // Lọc theo trạng thái công việc

    @ApiPropertyOptional({ description: 'Số trang hiện tại', example: 1, default: 1 })
    @IsOptional()
    @Type(() => Number) // Ép kiểu từ chuỗi sang số nguyên
    @IsInt()
    @Min(1)
    page?: number = 1; // Số trang hiện tại, mặc định là 1

    @ApiPropertyOptional({ description: 'Số bản ghi mỗi trang', example: 10, default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10; // Số bản ghi mỗi trang, mặc định là 10
}