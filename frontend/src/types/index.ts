export type TaskStatus = 'NEW' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'ON_HOLD' | 'COMPLETED' | 'CLOSED' | 'CANCELLED';

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
}

// Interface chuẩn hóa cấu trúc dữ liệu phân trang từ Backend trả về
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        totalItems: number;
        currentPage: number;
        itemsPerPage: number;
        totalPages: number;
    };
}