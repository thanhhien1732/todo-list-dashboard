"use client";

import React, { useState } from 'react';
import { CheckCircle2, LoaderCircle, PlusCircle } from 'lucide-react';
import { taskService } from '../services/api';
import { TaskStatus } from '../types';

interface TaskFormProps {
    onTaskAdded: () => void; // Hàm callback để báo cho component cha biết đã thêm xong
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>('NEW');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Ngăn trình duyệt tự động reload trang khi submit form
        setError('');

        if (!title.trim()) {
            setError('Vui lòng nhập tiêu đề công việc!');
            return;
        }

        try {
            setIsSubmitting(true);
            // Gọi API thêm mới
            await taskService.create({
                title,
                description,
                status
            });

            // Reset form về trạng thái ban đầu
            setTitle('');
            setDescription('');
            setStatus('NEW');

            // Báo cho component cha biết để cập nhật lại danh sách
            onTaskAdded();
        } catch (err) {
            setError('Có lỗi xảy ra khi lưu công việc. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-linear-to-br from-indigo-50 via-white to-slate-50 p-4 shadow-[0_20px_60px_-20px_rgba(79,70,229,0.35)] sm:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_45%)]" />
            <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                        <h2 className="mt-3 text-xl font-semibold text-slate-800">Thêm công việc mới</h2>
                        <p className="mt-1 text-sm text-slate-500">Ghi lại ý tưởng, việc cần làm hoặc mục tiêu của bạn một cách rõ ràng.</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                            placeholder="Ví dụ: Phân tích tài liệu hệ thống..."
                            maxLength={255}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Mô tả chi tiết</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-40 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                            placeholder="Nhập thêm thông tin ghi chú (nếu có)"
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all sm:w-auto ${isSubmitting
                                ? 'cursor-not-allowed bg-indigo-400'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl active:scale-[0.98]'
                                }`}
                        >
                            {isSubmitting ? <LoaderCircle size={16} className="animate-spin" /> : <PlusCircle size={16} />}
                            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}