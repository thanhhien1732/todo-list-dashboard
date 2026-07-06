import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Prisma } from '@prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  create(@Body() createTaskDto: Prisma.TaskCreateInput) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    return this.tasksService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
      search,
      status,
      sortBy,
      sortOrder,
    );
  }

  // 1. Endpoint lấy danh sách các công việc nằm trong thùng rác
  @Get('trash')
  getTrash() {
    return this.tasksService.getTrash();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: Prisma.TaskUpdateInput) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  // 2. Endpoint khôi phục công việc
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.tasksService.restore(+id);
  }

  // 3. Endpoint xóa mềm (Chuyển vào thùng rác)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }

  // 4. Endpoint xóa vĩnh viễn bằng tay ngay lập tức
  @Delete(':id/permanent')
  permanentDelete(@Param('id') id: string) {
    return this.tasksService.permanentDelete(+id);
  }
}