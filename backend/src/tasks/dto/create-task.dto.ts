import { IsNotEmpty, IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
    @IsNotEmpty({ message: 'Tiêu đề công việc không được để trống' })
    @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
    @MaxLength(255, { message: 'Tiêu đề không được vượt quá 255 ký tự' })
    title!: string;

    @IsOptional()
    @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus, { message: 'Trạng thái công việc không hợp lệ' })
    status?: TaskStatus;
}