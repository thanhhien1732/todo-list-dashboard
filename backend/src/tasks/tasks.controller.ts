import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { Prisma } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  @ApiOperation({ summary: 'Tạo công việc mới' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Tạo công việc thành công' })
  create(@Body() createTaskDto: Prisma.TaskCreateInput) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách công việc' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Danh sách công việc' })
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

  @Get('trash')
  @ApiOperation({ summary: 'Lấy danh sách công việc trong thùng rác' })
  @ApiResponse({ status: 200, description: 'Danh sách công việc đã xóa' })
  getTrash() {
    return this.tasksService.getTrash();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết công việc theo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Chi tiết công việc' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật công việc' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Cập nhật công việc thành công' })
  update(@Param('id') id: string, @Body() updateTaskDto: Prisma.TaskUpdateInput) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Khôi phục công việc từ thùng rác' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Khôi phục công việc thành công' })
  restore(@Param('id') id: string) {
    return this.tasksService.restore(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa mềm công việc' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Xóa mềm công việc thành công' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }

  @Delete(':id/permanent')
  @ApiOperation({ summary: 'Xóa vĩnh viễn công việc' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Xóa vĩnh viễn công việc thành công' })
  permanentDelete(@Param('id') id: string) {
    return this.tasksService.permanentDelete(+id);
  }
}