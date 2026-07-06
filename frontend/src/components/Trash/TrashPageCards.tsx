import { RotateCcw, Trash2 } from 'lucide-react';
import type { Task } from '@/types';

interface TrashPageCardsProps {
    tasks: Task[];
    loading: boolean;
    onRestore: (id: number) => void;
    onDelete: (id: number) => void;
}

export function TrashPageCards({ tasks, loading, onRestore, onDelete }: TrashPageCardsProps) {
    return (
        <div className={`flex flex-col gap-4 md:hidden ${loading && tasks.length > 0 ? 'pointer-events-none opacity-60' : 'transition-opacity duration-300'}`}>
            {loading && tasks.length === 0 ? (
                <div className="animate-pulse py-10 text-center text-gray-500">Đang tải dữ liệu...</div>
            ) : tasks.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                    <div className="mb-1 text-lg font-medium">Thùng rác trống</div>
                </div>
            ) : (
                tasks.map((task) => (
                    <div key={task.id} className="relative flex flex-col rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm opacity-70">
                        <div className="mb-2 flex items-start justify-between gap-3">
                            <h3 className="text-[15px] font-semibold leading-snug text-gray-800">{task.title}</h3>
                            <span className="flex shrink-0 items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                                <Trash2 size={12} /> Đã xóa
                            </span>
                        </div>
                        <p className="mb-4 line-clamp-2 text-sm text-gray-500">{task.description || 'Không có mô tả chi tiết'}</p>
                        <div className="mb-3 h-px w-full bg-gray-100" />
                        <div className="mt-auto flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-400">Ngày xóa: {new Date(task.updatedAt).toLocaleDateString('vi-VN')}</span>
                            <div className="flex gap-2">
                                <button onClick={() => onRestore(task.id)} className="rounded-xl bg-green-50 p-2 text-green-600 transition-colors hover:bg-green-100" title="Khôi phục">
                                    <RotateCcw size={16} strokeWidth={2.5} />
                                </button>
                                <button onClick={() => onDelete(task.id)} className="rounded-xl bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100" title="Xóa vĩnh viễn">
                                    <Trash2 size={16} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
