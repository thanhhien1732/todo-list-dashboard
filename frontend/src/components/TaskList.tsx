"use client";

import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import { Task, TaskStatus } from '../types';
import TaskForm from './TaskForm';
// Thư viện Component chuyên nghiệp cho Dropdown/Listbox
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
// Thư viện Icon Lucide
import { Pencil, Trash2, Sparkles, ClipboardList, Clock, Eye, PauseCircle, CheckCircle, Lock, XCircle, ChevronDown, Search, ListFilter, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskListProps {
    refreshTrigger: number;
    onRefresh: () => void;
}

const ITEMS_PER_PAGE = 5;

// Định nghĩa danh sách các trạng thái để dùng chung cho thư viện Component
const STATUS_LIST: { value: TaskStatus; label: string; icon: React.ReactNode; colorClass: string }[] = [
    { value: 'NEW', label: 'Mới tạo', icon: <Sparkles size={14} />, colorClass: 'bg-gray-200 text-gray-700 hover:bg-gray-300 ' },
    { value: 'TODO', label: 'Cần làm', icon: <ClipboardList size={14} />, colorClass: 'bg-purple-200 text-purple-800 hover:bg-purple-300' },
    { value: 'IN_PROGRESS', label: 'Đang xử lý', icon: <Clock size={14} />, colorClass: 'bg-blue-200 text-blue-800 hover:bg-blue-300' },
    { value: 'IN_REVIEW', label: 'Đang đánh giá', icon: <Eye size={14} />, colorClass: 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300' },
    { value: 'ON_HOLD', label: 'Tạm dừng', icon: <PauseCircle size={14} />, colorClass: 'bg-orange-200 text-orange-800 hover:bg-orange-300' },
    { value: 'COMPLETED', label: 'Hoàn thành', icon: <CheckCircle size={14} />, colorClass: 'bg-teal-100 text-teal-800 hover:bg-teal-200' },
    { value: 'CLOSED', label: 'Đã đóng', icon: <Lock size={14} />, colorClass: 'bg-slate-300 text-slate-800 hover:bg-slate-400' },
    { value: 'CANCELLED', label: 'Đã hủy', icon: <XCircle size={14} />, colorClass: 'bg-red-200 text-red-800 hover:bg-red-300' },
];

export default function TaskList({ refreshTrigger, onRefresh }: TaskListProps) {
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

    // State quản lý thông báo Toast
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

    // Hàm tự động ẩn Toast sau 3 giây
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 800);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filterStatus, sortBy, sortOrder]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await taskService.getAll(page, ITEMS_PER_PAGE, debouncedSearch, filterStatus, sortBy, sortOrder);
            setTasks(response.data);
            setTotalPages(response.meta.totalPages || 1);
            setTotalItems(response.meta.totalItems || 0);
        } catch (err) {
            setError('Không thể tải danh sách công việc.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [refreshTrigger, debouncedSearch, filterStatus, page, sortBy, sortOrder]);

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const renderSortIcon = (column: string) => {
        if (sortBy !== column) {
            return (
                <ArrowUp
                    size={14}
                    strokeWidth={3}
                    className="ml-1.5 text-gray-400 opacity-0 group-hover:opacity-50 transition-opacity"
                />
            );
        }
        return sortOrder === 'asc' ? (
            <ArrowUp size={14} strokeWidth={3} className="ml-1.5 text-indigo-600 transition-all" />
        ) : (
            <ArrowDown size={14} strokeWidth={3} className="ml-1.5 text-indigo-600 transition-all" />
        );
    };

    const handleDeleteClick = (id: number) => {
        setTaskToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (taskToDelete !== null) {
            await taskService.delete(taskToDelete);
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
            setToast({ message: "Đã đưa công việc vào thùng rác", type: "success" });
            onRefresh();
        }
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
        setToast({ message: "Đã chỉnh sửa công việc", type: "success" });
        onRefresh();
    };

    return (
        <div className="w-full relative min-h-screen md:min-h-0 pb-24 md:pb-0">
            {/* TOOLBAR (Header) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl md:rounded-t-2xl md:rounded-b-none border border-gray-200 md:border-b-0 bg-white/90 p-3 shadow-sm mb-4 md:mb-0">
                <div className="flex w-full flex-col sm:flex-row md:w-auto gap-3 flex-1">
                    {/* THANH TÌM KIẾM */}
                    <div className="relative w-full md:w-80 group">
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm công việc..." className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full hover:border-indigo-400 hover:shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-all bg-white" />
                        <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors pointer-events-none" />
                    </div>
                    {/* LỌC TRẠNG THÁI */}
                    <div className="w-full sm:w-56">
                        <Listbox value={filterStatus} onChange={setFilterStatus}>
                            {({ open }) => (
                                <div className="relative h-full">
                                    <ListboxButton className="h-full w-full text-left bg-white border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 cursor-pointer flex items-center justify-between outline-none hover:border-indigo-400 hover:shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all group">
                                        <span className="flex items-center gap-2"><ListFilter size={16} className="text-gray-400 group-hover:text-indigo-500" />{filterStatus ? STATUS_LIST.find(s => s.value === filterStatus)?.label : 'Tất cả trạng thái'}</span>
                                        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                                    </ListboxButton>
                                    <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                        <ListboxOptions anchor="bottom end" className="[--anchor-gap:4px] w-full sm:w-56 rounded-xl bg-white py-1 text-sm shadow-xl ring-1 ring-black/5 focus:outline-none z-50">
                                            <ListboxOption value="" className={({ active }) => `cursor-pointer select-none py-2 px-3 flex items-center gap-2 transition-colors ${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900'}`}><ListFilter size={14} className="text-gray-500" />Tất cả trạng thái</ListboxOption>
                                            {STATUS_LIST.map((status) => (
                                                <ListboxOption key={status.value} value={status.value} className={({ active }) => `cursor-pointer select-none py-2 px-3 flex items-center gap-2 transition-colors ${active ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-900'}`}><span className={filterStatus === status.value ? 'text-indigo-600' : 'text-gray-400'}>{status.icon}</span><span>{status.label}</span></ListboxOption>
                                            ))}
                                        </ListboxOptions>
                                    </Transition>
                                </div>
                            )}
                        </Listbox>
                    </div>
                </div>

                {/* NÚT THÊM CÔNG VIỆC (CHỈ HIỆN TRÊN DESKTOP) */}
                <button onClick={() => setIsAddModalOpen(true)} className="hidden md:flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-xl">
                    <span className="text-base">+</span> Thêm công việc
                </button>
            </div>

            {/* =========================================
                1. GIAO DIỆN DESKTOP (BẢNG DỮ LIỆU) 
            ============================================= */}
            <div className="hidden md:block overflow-x-auto rounded-b-2xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-sm text-left text-gray-600 table-fixed min-w-225">
                    <thead className="text-sm text-gray-700 bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th onClick={() => handleSort('title')} className="w-[20%] px-5 py-4 cursor-pointer hover:bg-gray-200 select-none group"><div className="flex items-center">Công việc {renderSortIcon('title')}</div></th>
                            <th onClick={() => handleSort('description')} className="w-[36%] px-5 py-4 cursor-pointer hover:bg-gray-200 select-none group"><div className="flex items-center">Nội dung {renderSortIcon('description')}</div></th>
                            <th onClick={() => handleSort('status')} className="w-[20%] px-5 py-4 cursor-pointer hover:bg-gray-200 select-none group"><div className="flex items-center">Trạng thái {renderSortIcon('status')}</div></th>
                            <th onClick={() => handleSort('createdAt')} className="w-[12%] px-5 py-4 cursor-pointer hover:bg-gray-200 select-none group"><div className="flex items-center">Ngày tạo {renderSortIcon('createdAt')}</div></th>
                            <th className="w-[12%] px-5 py-4 text-center"></th>
                        </tr>
                    </thead>
                    <tbody className={loading && tasks.length > 0 ? "opacity-60 transition-opacity pointer-events-none" : "transition-opacity duration-300"}>
                        {loading && tasks.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-10 animate-pulse">Đang tải dữ liệu...</td></tr>
                        ) : tasks.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-10 text-gray-500">Không có dữ liệu</td></tr>
                        ) : (
                            tasks.map((task) => {
                                const currentStatusOpt = STATUS_LIST.find(s => s.value === task.status) || STATUS_LIST[0];
                                const titleClass = task.status === 'CLOSED' ? 'text-slate-500 opacity-70' : task.status === 'CANCELLED' ? 'text-gray-500 line-through decoration-gray-400 opacity-70' : 'text-gray-800';
                                const descriptionClass = task.status === 'CLOSED' ? 'text-slate-400 opacity-70' : task.status === 'CANCELLED' ? 'text-gray-500 line-through decoration-gray-400 opacity-70' : 'text-gray-600';
                                const dateClass = task.status === 'CLOSED' ? 'text-slate-400 opacity-70' : task.status === 'CANCELLED' ? 'text-gray-400 line-through decoration-gray-400 opacity-70' : 'text-gray-500';

                                return (
                                    <tr key={task.id} className="border-b border-gray-100 transition-colors hover:bg-gray-100">
                                        <td className={`px-5 py-4 font-medium wrap-break-word whitespace-normal ${titleClass}`}>{task.title}</td>
                                        <td className={`px-5 py-4 wrap-break-word whitespace-normal ${descriptionClass}`}>{task.description || '-'}</td>
                                        <td className="px-5 py-4">
                                            <div className="w-44">
                                                <Listbox value={task.status} onChange={(value) => handleStatusChange(task.id, value)}>
                                                    {({ open }) => (
                                                        <>
                                                            <ListboxButton className={`w-full text-left px-3 py-1.5 rounded-full text-sm font-medium outline-none cursor-pointer flex items-center justify-between transition-colors ${currentStatusOpt.colorClass}`}>
                                                                <span className="flex items-center gap-2">{currentStatusOpt.icon}{currentStatusOpt.label}</span>
                                                                <ChevronDown size={14} className={`opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                                                            </ListboxButton>
                                                            <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                                <ListboxOptions anchor="bottom start" className="[--anchor-gap:4px] w-(--button-width) rounded-xl bg-white py-1 text-sm shadow-2xl ring-1 ring-black/5 focus:outline-none z-50">
                                                                    {STATUS_LIST.map((status) => (
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
                                                <button onClick={() => handleEditClick(task)} className="cursor-pointer text-blue-500 hover:text-blue-700 p-1.5 rounded-md hover:bg-blue-100 transition-colors" title="Chỉnh sửa"><Pencil size={18} /></button>
                                                <button onClick={() => handleDeleteClick(task.id)} className="cursor-pointer text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-100 transition-colors" title="Xóa"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* =========================================
                2. GIAO DIỆN MOBILE (DẠNG CARD) 
            ============================================= */}
            <div className={`md:hidden flex flex-col gap-4 ${loading && tasks.length > 0 ? "opacity-60 pointer-events-none" : "transition-opacity duration-300"}`}>
                {loading && tasks.length === 0 ? (
                    <div className="text-center py-10 animate-pulse text-gray-500">Đang tải dữ liệu...</div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">Không có dữ liệu</div>
                ) : (
                    tasks.map((task) => {
                        const currentStatusOpt = STATUS_LIST.find(s => s.value === task.status) || STATUS_LIST[0];
                        const titleClass = task.status === 'CLOSED' ? 'text-slate-500 opacity-70' : task.status === 'CANCELLED' ? 'text-gray-500 line-through decoration-gray-400 opacity-70' : 'text-gray-900';
                        const descriptionClass = task.status === 'CLOSED' || task.status === 'CANCELLED' ? 'text-gray-400 line-through opacity-70' : 'text-gray-500';

                        return (
                            <div key={task.id} className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 relative flex flex-col">
                                {/* Header: Tiêu đề & Trạng thái */}
                                <div className="flex justify-between items-start gap-3 mb-2">
                                    <h3 className={`font-semibold text-[15px] leading-snug flex-1 ${titleClass}`}>
                                        {task.title}
                                    </h3>

                                    {/* Nhúng ListBox Dropdown vào thẳng Card */}
                                    <div className="shrink-0 z-10">
                                        <Listbox value={task.status} onChange={(value) => handleStatusChange(task.id, value)}>
                                            {({ open }) => (
                                                <>
                                                    <ListboxButton className={`text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold outline-none cursor-pointer flex items-center gap-1.5 transition-colors ${currentStatusOpt.colorClass}`}>
                                                        {currentStatusOpt.icon} {currentStatusOpt.label}
                                                    </ListboxButton>
                                                    <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                        <ListboxOptions anchor="bottom end" className="[--anchor-gap:4px] w-48 rounded-xl bg-white py-1 text-sm shadow-2xl ring-1 ring-black/5 focus:outline-none z-50">
                                                            {STATUS_LIST.map((status) => (
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

                                {/* Nội dung mô tả */}
                                <p className={`text-sm line-clamp-2 mb-4 ${descriptionClass}`}>
                                    {task.description || 'Không có mô tả chi tiết'}
                                </p>

                                {/* Đường kẻ chia cách */}
                                <div className="h-px w-full bg-gray-100 mb-3" />

                                {/* Footer: Ngày tháng & Action Button */}
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-xs font-medium text-gray-400">
                                        Đã tạo: {new Date(task.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                    <div className="flex gap-2">
                                        {/* Nút Sửa */}
                                        <button onClick={() => handleEditClick(task)} className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-colors">
                                            <Pencil size={16} strokeWidth={2.5} />
                                        </button>

                                        {/* Nút Xóa */}
                                        <button onClick={() => handleDeleteClick(task.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors">
                                            <Trash2 size={16} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* NÚT "THÊM CÔNG VIỆC" NỔI (FAB) CHO MOBILE */}
            <div className="md:hidden fixed bottom-20 left-0 right-0 flex justify-center z-40 pointer-events-none">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="pointer-events-auto flex items-center justify-center gap-2 rounded-[20px] bg-indigo-600 px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_rgb(79,70,229,0.4)] transition-transform active:scale-95"
                >
                    <span className="text-lg leading-none">+</span> Thêm công việc mới
                </button>
            </div>

            {/* PHÂN TRANG */}
            <div className="mt-6 flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex justify-center sm:block">
                    <div className="rounded-full border border-gray-200 bg-white px-4 py-1.5 shadow-sm inline-block font-medium">
                        Trang {page} / {totalPages}
                    </div>
                </div>
                <div className="flex justify-center gap-2">
                    <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 transition-colors hover:bg-gray-200 disabled:opacity-50">
                        <ChevronLeft size={14} /> Trước
                    </button>
                    <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 transition-colors hover:bg-gray-200 disabled:opacity-50">
                        Sau <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* MODAL & TOAST (Giữ nguyên) */}
            <Transition show={isAddModalOpen} as={React.Fragment}>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <Transition.Child as={React.Fragment} enter="transition-opacity ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} /></Transition.Child>
                    <Transition.Child as={React.Fragment} enter="transition-all transform ease-out duration-300" enterFrom="opacity-0 scale-95 translate-y-4" enterTo="opacity-100 scale-100 translate-y-0" leave="transition-all transform ease-in duration-200" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-4">
                        <div className="relative w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_25px_80px_-20px_rgba(15,23,42,0.45)]">
                            <button onClick={() => setIsAddModalOpen(false)} className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800">✕</button>
                            <TaskForm onTaskAdded={() => { onRefresh(); setIsAddModalOpen(false); setToast({ message: "Đã thêm công việc thành công", type: "success" }); }} />
                        </div>
                    </Transition.Child>
                </div>
            </Transition>

            <Transition show={isEditModalOpen} as={React.Fragment}>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <Transition.Child as={React.Fragment} enter="transition-opacity ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} /></Transition.Child>
                    <Transition.Child as={React.Fragment} enter="transition-all transform ease-out duration-300" enterFrom="opacity-0 scale-95 translate-y-4" enterTo="opacity-100 scale-100 translate-y-0" leave="transition-all transform ease-in duration-200" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-4">
                        <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-[0_25px_80px_-20px_rgba(15,23,42,0.45)]">
                            <button onClick={() => setIsEditModalOpen(false)} className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800">✕</button>
                            <div className="bg-linear-to-br from-indigo-50 via-white to-slate-50 p-4 sm:p-6">
                                <div className="mb-5"><h2 className="text-xl font-semibold text-slate-800">Cập nhật thông tin công việc</h2><p className="mt-1 text-sm text-slate-500">Điều chỉnh tiêu đề và mô tả cho phù hợp hơn.</p></div>
                                <form onSubmit={handleEditSubmit} className="space-y-4">
                                    <div className="space-y-2"><label className="block text-sm font-medium text-slate-700">Tiêu đề</label><input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" /></div>
                                    <div className="space-y-2"><label className="block text-sm font-medium text-slate-700">Mô tả</label><textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" rows={4} /></div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="cursor-pointer rounded-2xl bg-gray-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-200">Hủy</button>
                                        <button type="submit" disabled={isUpdating} className="cursor-pointer rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50">{isUpdating ? 'Lưu...' : 'Lưu thay đổi'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Transition>

            <Transition show={isDeleteModalOpen} as={React.Fragment}>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <Transition.Child as={React.Fragment} enter="transition-opacity ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} /></Transition.Child>
                    <Transition.Child as={React.Fragment} enter="transition-all transform ease-out duration-300" enterFrom="opacity-0 scale-95 translate-y-4" enterTo="opacity-100 scale-100 translate-y-0" leave="transition-all transform ease-in duration-200" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-4">
                        <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-red-100 bg-white shadow-[0_25px_80px_-20px_rgba(15,23,42,0.45)]">
                            <div className="bg-linear-to-br from-red-50 via-white to-slate-50 p-6">
                                <div className="flex flex-col items-center text-center mb-8 mt-2"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4 shadow-sm"><Trash2 size={24} strokeWidth={2.5} /></div><h3 className="text-xl font-bold text-gray-900 mb-4">Xác nhận xóa</h3><p className="text-slate-600 text-sm whitespace-normal leading-relaxed px-2">Công việc sẽ được giữ trong thùng rác và tự động xóa vĩnh viễn sau <span className="font-semibold text-gray-700">30 ngày</span>. Bạn có chắc chắn muốn tiếp tục?</p></div>
                                <div className="flex gap-4 w-full flex-col sm:flex-row"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 cursor-pointer rounded-xl bg-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-300">Hủy bỏ</button><button onClick={confirmDelete} className="flex-1 cursor-pointer rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-700">Đồng ý xóa</button></div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Transition>

            <Transition show={toast !== null} as={React.Fragment} enter="transform transition-all ease-out duration-300" enterFrom="translate-x-full opacity-0" enterTo="translate-x-0 opacity-100" leave="transform transition-all ease-in duration-200" leaveFrom="translate-x-0 opacity-100" leaveTo="translate-x-full opacity-0">
                <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-gray-800"><div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold shrink-0">✓</div><p className="text-sm font-medium pr-2 whitespace-nowrap">{toast?.message}</p><button onClick={() => setToast(null)} className="text-gray-400 hover:text-white text-xs ml-auto cursor-pointer">✕</button></div>
            </Transition>
        </div>
    );
}