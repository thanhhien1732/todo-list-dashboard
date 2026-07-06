import { useEffect, useState } from 'react';
import { taskService } from '../services/api';
import type { Task, TaskStatus } from '../types';

const ITEMS_PER_PAGE = 5;

interface UseTaskListProps {
    refreshTrigger: number;
    onRefresh: () => void;
}

interface ToastState {
    message: string;
    type: 'success' | 'info';
}

export function useTaskList({ refreshTrigger, onRefresh }: UseTaskListProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
    const [toast, setToast] = useState<ToastState | null>(null);

    useEffect(() => {
        if (toast) {
            const timer = window.setTimeout(() => setToast(null), 3000);
            return () => window.clearTimeout(timer);
        }
    }, [toast]);

    useEffect(() => {
        const handler = window.setTimeout(() => setDebouncedSearch(search), 800);
        return () => window.clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filterStatus, sortBy, sortOrder]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const response = await taskService.getAll({
                    page,
                    limit: ITEMS_PER_PAGE,
                    search: debouncedSearch,
                    status: filterStatus,
                    sortBy,
                    sortOrder,
                });
                setTasks(response.data);
                setTotalPages(response.meta.totalPages || 1);
                setTotalItems(response.meta.totalItems || 0);
            } catch {
                setError('Không thể tải danh sách công việc.');
            } finally {
                setLoading(false);
            }
        };

        void fetchTasks();
    }, [refreshTrigger, debouncedSearch, filterStatus, page, sortBy, sortOrder]);

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const handleDeleteClick = (id: number) => {
        setTaskToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (taskToDelete === null) return;

        await taskService.delete(taskToDelete);
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
        setToast({ message: 'Đã đưa công việc vào thùng rác', type: 'success' });
        onRefresh();
    };

    const handleStatusChange = async (id: number, newStatus: TaskStatus) => {
        await taskService.update(id, { status: newStatus });
        onRefresh();
    };

    const handleEditClick = (task: Task) => {
        setEditingTask(task);
        setEditTitle(task.title);
        setEditDescription(task.description || '');
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTask || !editTitle.trim()) return;

        setIsUpdating(true);
        await taskService.update(editingTask.id, { title: editTitle, description: editDescription });
        setIsUpdating(false);
        setIsEditModalOpen(false);
        setToast({ message: 'Đã chỉnh sửa công việc', type: 'success' });
        onRefresh();
    };

    const handleAddTaskSuccess = () => {
        onRefresh();
        setIsAddModalOpen(false);
        setToast({ message: 'Đã thêm công việc thành công', type: 'success' });
    };

    return {
        tasks,
        loading,
        error,
        search,
        setSearch,
        filterStatus,
        setFilterStatus,
        sortBy,
        sortOrder,
        page,
        totalPages,
        totalItems,
        setPage,
        isAddModalOpen,
        setIsAddModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        editingTask,
        editTitle,
        setEditTitle,
        editDescription,
        setEditDescription,
        isUpdating,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        taskToDelete,
        toast,
        setToast,
        handleSort,
        handleDeleteClick,
        confirmDelete,
        handleStatusChange,
        handleEditClick,
        handleEditSubmit,
        handleAddTaskSuccess,
    };
}
