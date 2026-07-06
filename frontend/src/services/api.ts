import axios from 'axios';
import type { PaginatedResponse, Task } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3069/api';

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

interface TaskListParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

interface CreateTaskPayload {
    title: string;
    description?: string;
    status?: Task['status'];
}

interface UpdateTaskPayload {
    title?: string;
    description?: string;
    status?: Task['status'];
}

class TaskApiService {
    async getAll(params: TaskListParams = {}): Promise<PaginatedResponse<Task>> {
        const response = await apiClient.get<PaginatedResponse<Task>>('/tasks', { params });
        return response.data;
    }

    async create(data: CreateTaskPayload): Promise<Task> {
        const response = await apiClient.post<Task>('/tasks', data);
        return response.data;
    }

    async update(id: number, data: UpdateTaskPayload): Promise<Task> {
        const response = await apiClient.patch<Task>(`/tasks/${id}`, data);
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/tasks/${id}`);
    }

    async getTrash(): Promise<Task[]> {
        const response = await apiClient.get<Task[]>('/tasks/trash');
        return response.data;
    }

    async restore(id: number): Promise<Task> {
        const response = await apiClient.patch<Task>(`/tasks/${id}/restore`);
        return response.data;
    }

    async permanentDelete(id: number): Promise<void> {
        await apiClient.delete(`/tasks/${id}/permanent`);
    }
}

export const taskService = new TaskApiService();