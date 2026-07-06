import axios from 'axios';
import { Task } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3069/api';

export const taskService = {
    getAll: async (page = 1, limit = 10, search = '', status = '', sortBy = 'createdAt', sortOrder = 'desc') => {
        const response = await axios.get(`${API_URL}/tasks`, {
            params: { page, limit, search, status, sortBy, sortOrder }
        });
        return response.data;
    },

    create: async (data: Partial<Task>) => {
        const response = await axios.post(`${API_URL}/tasks`, data);
        return response.data;
    },

    update: async (id: number, data: Partial<Task>) => {
        const response = await axios.patch(`${API_URL}/tasks/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await axios.delete(`${API_URL}/tasks/${id}`);
        return response.data;
    }, // <--- Chính là dấu phẩy này bị thiếu ở code của bạn!

    // --- CÁC HÀM XỬ LÝ THÙNG RÁC ---
    getTrash: async () => {
        const response = await axios.get(`${API_URL}/tasks/trash`);
        return response.data;
    },

    restore: async (id: number) => {
        const response = await axios.patch(`${API_URL}/tasks/${id}/restore`);
        return response.data;
    },

    permanentDelete: async (id: number) => {
        const response = await axios.delete(`${API_URL}/tasks/${id}/permanent`);
        return response.data;
    }
};