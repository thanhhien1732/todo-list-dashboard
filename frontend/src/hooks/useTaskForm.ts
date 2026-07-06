import { useState } from 'react';
import { taskService } from '../services/api';
import type { TaskStatus } from '../types';

interface UseTaskFormProps {
    onTaskAdded: () => void;
}

export function useTaskForm({ onTaskAdded }: UseTaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>('NEW');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Vui lòng nhập tiêu đề công việc!');
            return;
        }

        try {
            setIsSubmitting(true);
            await taskService.create({
                title,
                description,
                status,
            });

            setTitle('');
            setDescription('');
            setStatus('NEW');
            onTaskAdded();
        } catch (err) {
            setError('Có lỗi xảy ra khi lưu công việc. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        title,
        setTitle,
        description,
        setDescription,
        status,
        setStatus,
        isSubmitting,
        error,
        handleSubmit,
    };
}
