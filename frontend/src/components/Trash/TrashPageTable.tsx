import { ArrowDown, ArrowUp, RotateCcw, Trash2 } from 'lucide-react';
import type { Task } from '@/types';

interface TrashPageTableProps {
    tasks: Task[];
    loading: boolean;
    sortBy: keyof Task;
    sortOrder: 'asc' | 'desc';
    onSort: (column: keyof Task) => void;
    onRestore: (id: number) => void;
    onDelete: (id: number) => void;
}

export function TrashPageTable({
    tasks,
    loading,
    sortBy,
    sortOrder,
    onSort,
    onRestore,
    onDelete,
}: TrashPageTableProps) {
    const renderSortIcon = (column: string) => {
        if (sortBy !== column) {
            return <ArrowUp size={14} strokeWidth={2.5} className="ml-1.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-50" />;
        }

        return sortOrder === 'asc' ? (
            <ArrowUp size={14} strokeWidth={3} className="ml-1.5 text-indigo-600 transition-all" />
        ) : (
            <ArrowDown size={14} strokeWidth={3} className="ml-1.5 text-indigo-600 transition-all" />
        );
    };

    return (
        <div className="hidden overflow-x-auto md:block">
            <table className="min-w-175 w-full table-fixed text-left text-sm text-gray-600">
                <thead className="border-b border-gray-200 bg-gray-100 text-sm text-gray-700">
                    <tr>
                        <th onClick={() => onSort('title')} className="group w-[25%] cursor-pointer px-5 py-4 select-none transition-colors hover:bg-gray-200">
                            <div className="flex items-center">Công việc {renderSortIcon('title')}</div>
                        </th>
                        <th onClick={() => onSort('description')} className="group w-[40%] cursor-pointer px-5 py-4 select-none transition-colors hover:bg-gray-200">
                            <div className="flex items-center">Nội dung {renderSortIcon('description')}</div>
                        </th>
                        <th onClick={() => onSort('updatedAt')} className="group w-[20%] cursor-pointer px-5 py-4 select-none transition-colors hover:bg-gray-200">
                            <div className="flex items-center">Ngày xóa {renderSortIcon('updatedAt')}</div>
                        </th>
                        <th className="w-[15%] px-5 py-4 text-center"></th>
                    </tr>
                </thead>
                <tbody className={loading && tasks.length > 0 ? 'pointer-events-none opacity-60' : 'transition-opacity duration-300'}>
                    {loading && tasks.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="animate-pulse py-10 text-center">
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    ) : tasks.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="py-16 text-center text-gray-500">
                                <div className="mb-1 text-lg font-medium">Thùng rác trống</div>
                                <div className="text-sm">Không có công việc nào bị xóa.</div>
                            </td>
                        </tr>
                    ) : (
                        tasks.map((task) => (
                            <tr key={task.id} className="border-b border-gray-100 transition-colors hover:bg-gray-100">
                                <td className="whitespace-normal px-5 py-4 font-medium text-gray-800">{task.title}</td>
                                <td className="whitespace-normal px-5 py-4 text-gray-600">{task.description || '-'}</td>
                                <td className="px-5 py-4 text-gray-500">{new Date(task.updatedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                <td className="whitespace-nowrap px-5 py-4 text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <button onClick={() => onRestore(task.id)} className="cursor-pointer rounded-md p-1.5 text-green-600 transition-colors hover:bg-green-100 hover:text-green-700" title="Khôi phục">
                                            <RotateCcw size={18} />
                                        </button>
                                        <button onClick={() => onDelete(task.id)} className="cursor-pointer rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-100 hover:text-red-700" title="Xóa vĩnh viễn">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
