import React from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { Pencil, Trash2, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { Task, TaskStatus } from '../types';
import { STATUS_LIST, type StatusOption, getStatusOption } from '../constants/taskStatus';

interface TaskListTableProps {
    tasks: Task[];
    loading: boolean;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSort: (column: string) => void;
    onStatusChange: (id: number, value: TaskStatus) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
    statusOptions?: StatusOption[];
}

export function TaskListTable({
    tasks,
    loading,
    sortBy,
    sortOrder,
    onSort,
    onStatusChange,
    onEdit,
    onDelete,
    statusOptions = STATUS_LIST,
}: TaskListTableProps) {
    const renderSortIcon = (column: string) => {
        if (sortBy !== column) {
            return <ArrowUp size={14} strokeWidth={3} className="ml-1.5 text-gray-400 opacity-0 group-hover:opacity-50 transition-opacity" />;
        }

        return sortOrder === 'asc' ? (
            <ArrowUp size={14} strokeWidth={3} className="ml-1.5 text-indigo-600 transition-all" />
        ) : (
            <ArrowDown size={14} strokeWidth={3} className="ml-1.5 text-indigo-600 transition-all" />
        );
    };

    return (
        <div className="hidden md:block overflow-x-auto rounded-b-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm text-left text-gray-600 table-fixed min-w-225">
                <thead className="text-sm text-gray-700 bg-gray-100 border-b border-gray-200">
                    <tr>
                        <th onClick={() => onSort('title')} className="w-[20%] px-5 py-4 cursor-pointer hover:bg-gray-200 select-none group"><div className="flex items-center">Công việc {renderSortIcon('title')}</div></th>
                        <th onClick={() => onSort('description')} className="w-[36%] px-5 py-4 cursor-pointer hover:bg-gray-200 select-none group"><div className="flex items-center">Nội dung {renderSortIcon('description')}</div></th>
                        <th onClick={() => onSort('status')} className="w-[20%] px-5 py-4 cursor-pointer hover:bg-gray-200 select-none group"><div className="flex items-center">Trạng thái {renderSortIcon('status')}</div></th>
                        <th onClick={() => onSort('createdAt')} className="w-[12%] px-5 py-4 cursor-pointer hover:bg-gray-200 select-none group"><div className="flex items-center">Ngày tạo {renderSortIcon('createdAt')}</div></th>
                        <th className="w-[12%] px-5 py-4 text-center"></th>
                    </tr>
                </thead>
                <tbody className={loading && tasks.length > 0 ? 'opacity-60 transition-opacity pointer-events-none' : 'transition-opacity duration-300'}>
                    {loading && tasks.length === 0 ? (
                        <tr><td colSpan={5} className="text-center py-10 animate-pulse">Đang tải dữ liệu...</td></tr>
                    ) : tasks.length === 0 ? (
                        <tr><td colSpan={5} className="text-center py-10 text-gray-500">Không có dữ liệu</td></tr>
                    ) : (
                        tasks.map((task) => {
                            const currentStatusOpt = getStatusOption(task.status);
                            const titleClass = task.status === 'CLOSED' ? 'text-slate-500 opacity-70' : task.status === 'CANCELLED' ? 'text-gray-500 line-through decoration-gray-400 opacity-70' : 'text-gray-800';
                            const descriptionClass = task.status === 'CLOSED' ? 'text-slate-400 opacity-70' : task.status === 'CANCELLED' ? 'text-gray-500 line-through decoration-gray-400 opacity-70' : 'text-gray-600';
                            const dateClass = task.status === 'CLOSED' ? 'text-slate-400 opacity-70' : task.status === 'CANCELLED' ? 'text-gray-400 line-through decoration-gray-400 opacity-70' : 'text-gray-500';

                            return (
                                <tr key={task.id} className="border-b border-gray-100 transition-colors hover:bg-gray-100">
                                    <td className={`px-5 py-4 font-medium wrap-break-word whitespace-normal ${titleClass}`}>{task.title}</td>
                                    <td className={`px-5 py-4 wrap-break-word whitespace-normal ${descriptionClass}`}>{task.description || '-'}</td>
                                    <td className="px-5 py-4">
                                        <div className="w-44">
                                            <Listbox value={task.status} onChange={(value) => onStatusChange(task.id, value)}>
                                                {({ open }) => (
                                                    <>
                                                        <ListboxButton className={`w-full text-left px-3 py-1.5 rounded-full text-sm font-medium outline-none cursor-pointer flex items-center justify-between transition-colors ${currentStatusOpt.colorClass}`}>
                                                            <span className="flex items-center gap-2">{currentStatusOpt.icon}{currentStatusOpt.label}</span>
                                                            <ChevronDown size={14} className={`opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                                                        </ListboxButton>
                                                        <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                            <ListboxOptions anchor="bottom start" className="[--anchor-gap:4px] w-(--button-width) rounded-xl bg-white py-1 text-sm shadow-2xl ring-1 ring-black/5 focus:outline-none z-50">
                                                                {statusOptions.map((status) => (
                                                                    <ListboxOption key={status.value} value={status.value} className={({ active }) => `cursor-pointer select-none py-2 px-3 flex items-center gap-2 transition-colors ${active ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-900'}`}>
                                                                        <span className={task.status === status.value ? 'text-indigo-600' : 'text-gray-400'}>{status.icon}</span><span>{status.label}</span>
                                                                    </ListboxOption>
                                                                ))}
                                                            </ListboxOptions>
                                                        </Transition>
                                                    </>
                                                )}
                                            </Listbox>
                                        </div>
                                    </td>
                                    <td className={`px-5 py-4 whitespace-nowrap ${dateClass}`}>{new Date(task.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                    <td className="px-5 py-4 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-3">
                                            <button onClick={() => onEdit(task)} className="cursor-pointer text-blue-500 hover:text-blue-700 p-1.5 rounded-md hover:bg-blue-100 transition-colors" title="Chỉnh sửa"><Pencil size={18} /></button>
                                            <button onClick={() => onDelete(task.id)} className="cursor-pointer text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-100 transition-colors" title="Xóa"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
