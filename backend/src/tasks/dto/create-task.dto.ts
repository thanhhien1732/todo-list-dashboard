import { IsNotEmpty, IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
    @ApiProperty({ example: 'Hoàn thành báo cáo', description: 'Tiêu đề công việc' })
    @IsNotEmpty({ message: 'Tiêu đề công việc không được để trống' })
    @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
    @MaxLength(255, { message: 'Tiêu đề không được vượt quá 255 ký tự' })
    title!: string;

    @ApiPropertyOptional({ example: 'Chuẩn bị nội dung và gửi cho khách hàng', description: 'Mô tả chi tiết công việc' })
    @IsOptional()
    @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
    description?: string;

    @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.TODO, description: 'Trạng thái công việc' })
    @IsOptional()
    @IsEnum(TaskStatus, { message: 'Trạng thái công việc không hợp lệ' })
    status?: TaskStatus;
}