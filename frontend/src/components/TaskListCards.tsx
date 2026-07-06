import React from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { Pencil, Trash2, ChevronDown } from 'lucide-react';
import type { Task, TaskStatus } from '../types';
import { STATUS_LIST, type StatusOption, getStatusOption } from '../constants/taskStatus';

interface TaskListCardsProps {
    tasks: Task[];
    loading: boolean;
    onStatusChange: (id: number, value: TaskStatus) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
    statusOptions?: StatusOption[];
}

export function TaskListCards({
    tasks,
    loading,
    onStatusChange,
    onEdit,
    onDelete,
    statusOptions = STATUS_LIST,
}: TaskListCardsProps) {
    return (
        <div className={`md:hidden flex flex-col gap-4 ${loading && tasks.length > 0 ? 'opacity-60 pointer-events-none' : 'transition-opacity duration-300'}`}>
            {loading && tasks.length === 0 ? (
                <div className="text-center py-10 animate-pulse text-gray-500">Đang tải dữ liệu...</div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-10 text-gray-500">Không có dữ liệu</div>
            ) : (
                tasks.map((task) => {
                    const currentStatusOpt = getStatusOption(task.status);
                    const titleClass = task.status === 'CLOSED' ? 'text-slate-500 opacity-70' : task.status === 'CANCELLED' ? 'text-gray-500 line-through decoration-gray-400 opacity-70' : 'text-gray-900';
                    const descriptionClass = task.status === 'CLOSED' || task.status === 'CANCELLED' ? 'text-gray-400 line-through opacity-70' : 'text-gray-500';

                    return (
                        <div key={task.id} className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 relative flex flex-col">
                            <div className="flex justify-between items-start gap-3 mb-2">
                                <h3 className={`font-semibold text-[15px] leading-snug flex-1 ${titleClass}`}>{task.title}</h3>
                                <div className="shrink-0 z-10">
                                    <Listbox value={task.status} onChange={(value) => onStatusChange(task.id, value)}>
                                        {({ open }) => (
                                            <>
                                                <ListboxButton className={`text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold outline-none cursor-pointer flex items-center gap-1.5 transition-colors ${currentStatusOpt.colorClass}`}>
                                                    {currentStatusOpt.icon} {currentStatusOpt.label}
                                                </ListboxButton>
                                                <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                    <ListboxOptions anchor="bottom end" className="[--anchor-gap:4px] w-48 rounded-xl bg-white py-1 text-sm shadow-2xl ring-1 ring-black/5 focus:outline-none z-50">
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
                            </div>

                            <p className={`text-sm line-clamp-2 mb-4 ${descriptionClass}`}>{task.description || 'Không có mô tả chi tiết'}</p>
                            <div className="h-px w-full bg-gray-100 mb-3" />
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-xs font-medium text-gray-400">Đã tạo: {new Date(task.createdAt).toLocaleDateString('vi-VN')}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => onEdit(task)} className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-colors">
                                        <Pencil size={16} strokeWidth={2.5} />
                                    </button>
                                    <button onClick={() => onDelete(task.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors">
                                        <Trash2 size={16} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
