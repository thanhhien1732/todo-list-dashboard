import { useEffect, useMemo, useState } from 'react';
import { taskService } from '../services/api';
import type { Task } from '../types';

interface ToastState {
    message: string;
    type: 'success' | 'info';
}

export function useTrashPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sortBy, setSortBy] = useState<keyof Task>('updatedAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
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
        let isMounted = true;

        const fetchTrash = async () => {
            try {
                setLoading(true);
                const data = await taskService.getTrash();
                if (isMounted) {
                    setTasks(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Không thể tải thùng rác', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchTrash();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredTasks = useMemo(() => {
        const keyword = debouncedSearch.toLowerCase();
        return tasks.filter((task) => {
            return (
                task.title?.toLowerCase().includes(keyword) ||
                task.description?.toLowerCase().includes(keyword)
            );
        });
    }, [tasks, debouncedSearch]);

    const sortedTasks = useMemo(() => {
        return [...filteredTasks].sort((a, b) => {
            const valA = a[sortBy] || '';
            const valB = b[sortBy] || '';
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredTasks, sortBy, sortOrder]);

    const handleRestore = async (id: number) => {
        try {
            await taskService.restore(id);
            setTasks((current) => current.filter((task) => task.id !== id));
            setToast({ message: 'Đã khôi phục công việc', type: 'success' });
        } catch (error) {
            setToast({ message: 'Lỗi khi khôi phục công việc', type: 'info' });
        }
    };

    const handleDeleteClick = (id: number) => {
        setTaskToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
    };

    const confirmDelete = async () => {
        if (taskToDelete === null) return;

        try {
            await taskService.permanentDelete(taskToDelete);
            setTasks((current) => current.filter((task) => task.id !== taskToDelete));
            closeDeleteModal();
            setToast({ message: 'Đã xóa vĩnh viễn công việc', type: 'success' });
        } catch (error) {
            setToast({ message: 'Lỗi khi xóa vĩnh viễn', type: 'info' });
        }
    };

    const handleSort = (column: keyof Task) => {
        if (sortBy === column) {
            setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const dismissToast = () => setToast(null);

    return {
        tasks,
        loading,
        search,
        setSearch,
        sortBy,
        sortOrder,
        sortedTasks,
        isDeleteModalOpen,
        taskToDelete,
        toast,
        handleRestore,
        handleDeleteClick,
        confirmDelete,
        closeDeleteModal,
        handleSort,
        dismissToast,
    };
}
