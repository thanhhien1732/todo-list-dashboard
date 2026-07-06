"use client";

import React, { useEffect, useState } from 'react';
import { taskService } from '@/services/api';
import { Task } from '@/types';
import { Transition } from '@headlessui/react';
import { RotateCcw, Trash2, ArrowUp, ArrowDown, AlertTriangle, Search } from 'lucide-react';

export default function TrashPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    // State quản lý Modal Xóa vĩnh viễn
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sortBy, setSortBy] = useState<keyof Task>('updatedAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

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
        const fetchTrash = async () => {
            try {
                setLoading(true);
                const data = await taskService.getTrash();
                setTasks((data as any).data || data || []);
            } catch (error) {
                console.error("Không thể tải thùng rác", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrash();
    }, []);

    const handleRestore = async (id: number) => {
        try {
            await taskService.restore(id);
            setTasks(tasks.filter(t => t.id !== id));
            setToast({ message: "Đã khôi phục công việc", type: "success" });
        } catch (error) {
            setToast({ message: "Lỗi khi khôi phục công việc", type: "info" });
        }
    };

    // Mở Popup khi bấm nút Xóa vĩnh viễn
    const handleDeleteClick = (id: number) => {
        setTaskToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Xử lý logic xóa khi người dùng bấm "Đồng ý" trong Popup
    const confirmDelete = async () => {
        if (taskToDelete === null) return;
        try {
            await taskService.permanentDelete(taskToDelete);
            setTasks(tasks.filter(t => t.id !== taskToDelete));
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
            setToast({ message: "Đã xóa vĩnh viễn công việc", type: "success" });
        } catch (error) {
            setToast({ message: "Lỗi khi xóa vĩnh viễn", type: "info" });
        }
    };

    const handleSort = (column: keyof Task) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const renderSortIcon = (column: string) => {
        if (sortBy !== column) {
            return <ArrowUp size={14} strokeWidth={2.5} className="ml-1.5 text-gray-400 opacity-0 group-hover:opacity-50 transition-opacity" />;
        }
        return sortOrder === 'asc'
            ? <ArrowUp size={14} strokeWidth={3} className="ml-1.5 text-indigo-600 transition-all" />
            : <ArrowDown size={14} strokeWidth={3} className="ml-1.5 text-indigo-600 transition-all" />;
    };

    const filteredTasks = [...tasks].filter((task) => {
        const keyword = debouncedSearch.toLowerCase();
        return (
            task.title?.toLowerCase().includes(keyword) ||
            task.description?.toLowerCase().includes(keyword)
        );
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        const valA = a[sortBy] || '';
        const valB = b[sortBy] || '';
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="w-full px-4 pt-8 pb-24 md:p-10 mx-auto min-h-screen md:min-h-0">
            <div className="mb-6 px-1 md:px-0">
                <h1 className="text-2xl font-bold text-gray-800">Thùng rác</h1>
                <p className="text-gray-500 text-sm mt-1">Các công việc đã xóa sẽ tự động biến mất sau 30 ngày.</p>
            </div>

            <div className="overflow-hidden rounded-2xl border-none md:border-solid md:border-gray-200 md:bg-white md:shadow-sm">

                {/* TOOLBAR TÌM KIẾM */}
                <div className="flex flex-col items-center justify-between gap-3 md:border-b md:border-gray-200 bg-transparent md:bg-white/90 p-0 mb-4 md:mb-0 md:p-3 shadow-none md:shadow-sm md:flex-row">
                    <div className="relative w-full md:w-80 group">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm kiếm trong thùng rác..."
                            className="w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-10 text-sm outline-none transition-all hover:border-indigo-400 hover:shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                        <Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-indigo-500" />
                    </div>
                </div>

                {/* 1. GIAO DIỆN DESKTOP (BẢNG DỮ LIỆU) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600 table-fixed min-w-175">
                        <thead className="border-b border-gray-200 bg-gray-100 text-sm text-gray-700">
                            <tr>
                                <th onClick={() => handleSort('title')} className="w-[25%] cursor-pointer px-5 py-4 select-none transition-colors hover:bg-gray-200 group"><div className="flex items-center">Công việc {renderSortIcon('title')}</div></th>
                                <th onClick={() => handleSort('description')} className="w-[40%] cursor-pointer px-5 py-4 select-none transition-colors hover:bg-gray-200 group"><div className="flex items-center">Nội dung {renderSortIcon('description')}</div></th>
                                <th onClick={() => handleSort('updatedAt')} className="w-[20%] cursor-pointer px-5 py-4 select-none transition-colors hover:bg-gray-200 group"><div className="flex items-center">Ngày xóa {renderSortIcon('updatedAt')}</div></th>
                                <th className="w-[15%] px-5 py-4 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className={loading && tasks.length > 0 ? "opacity-60 pointer-events-none" : "transition-opacity duration-300"}>
                            {loading && tasks.length === 0 ? (
                                <tr><td colSpan={4} className="animate-pulse py-10 text-center">Đang tải dữ liệu...</td></tr>
                            ) : sortedTasks.length === 0 ? (
                                <tr><td colSpan={4} className="py-16 text-center text-gray-500"><div className="mb-1 text-lg font-medium">Thùng rác trống</div><div className="text-sm">Không có công việc nào bị xóa.</div></td></tr>
                            ) : (
                                sortedTasks.map(task => (
                                    <tr key={task.id} className="border-b border-gray-100 transition-colors hover:bg-gray-100">
                                        <td className="whitespace-normal px-5 py-4 font-medium text-gray-800">{task.title}</td>
                                        <td className="whitespace-normal px-5 py-4 text-gray-600">{task.description || '-'}</td>
                                        <td className="px-5 py-4 text-gray-500">{new Date(task.updatedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                        <td className="whitespace-nowrap px-5 py-4 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <button onClick={() => handleRestore(task.id)} className="cursor-pointer rounded-md p-1.5 text-green-600 transition-colors hover:bg-green-100 hover:text-green-700" title="Khôi phục"><RotateCcw size={18} /></button>
                                                <button onClick={() => handleDeleteClick(task.id)} className="cursor-pointer rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-100 hover:text-red-700" title="Xóa vĩnh viễn"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 2. GIAO DIỆN MOBILE (DẠNG CARD) */}
                <div className={`md:hidden flex flex-col gap-4 ${loading && tasks.length > 0 ? "opacity-60 pointer-events-none" : "transition-opacity duration-300"}`}>
                    {loading && tasks.length === 0 ? (
                        <div className="text-center py-10 animate-pulse text-gray-500">Đang tải dữ liệu...</div>
                    ) : sortedTasks.length === 0 ? (
                        <div className="text-center py-10 text-gray-500"><div className="mb-1 text-lg font-medium">Thùng rác trống</div></div>
                    ) : (
                        sortedTasks.map((task) => (
                            <div key={task.id} className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 relative flex flex-col opacity-70">
                                <div className="flex justify-between items-start gap-3 mb-2">
                                    <h3 className="font-semibold text-[15px] text-gray-800 leading-snug">{task.title}</h3>
                                    {/* Nhãn "Đã xóa" ghim góc trên */}
                                    <span className="shrink-0 bg-red-50 text-red-600 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                                        <Trash2 size={12} /> Đã xóa
                                    </span>
                                </div>
                                <p className="text-sm line-clamp-2 mb-4 text-gray-500">{task.description || 'Không có mô tả chi tiết'}</p>
                                <div className="h-px w-full bg-gray-100 mb-3" />
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-xs font-medium text-gray-400">Ngày xóa: {new Date(task.updatedAt).toLocaleDateString('vi-VN')}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleRestore(task.id)} className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors" title="Khôi phục"><RotateCcw size={16} strokeWidth={2.5} /></button>
                                        <button onClick={() => handleDeleteClick(task.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors" title="Xóa vĩnh viễn"><Trash2 size={16} strokeWidth={2.5} /></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>

            {/* MODAL XÁC NHẬN & TOAST (Giữ nguyên) */}
            <Transition show={isDeleteModalOpen} as={React.Fragment}>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <Transition.Child as={React.Fragment} enter="transition-opacity ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} /></Transition.Child>
                    <Transition.Child as={React.Fragment} enter="transition-all transform ease-out duration-300" enterFrom="opacity-0 scale-95 translate-y-4" enterTo="opacity-100 scale-100 translate-y-0" leave="transition-all transform ease-in duration-200" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-4">
                        <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-red-100 bg-white shadow-[0_25px_80px_-20px_rgba(15,23,42,0.45)]">
                            <div className="bg-linear-to-br from-red-50 via-white to-slate-50 p-6">
                                <div className="flex flex-col items-center text-center mb-8 mt-2"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4 shadow-sm"><AlertTriangle size={24} strokeWidth={2.5} /></div><h3 className="text-xl font-bold text-gray-900 mb-4">Xóa vĩnh viễn?</h3><p className="text-slate-600 text-sm whitespace-normal leading-relaxed px-2">Hành động này <span className="font-semibold text-gray-700">không thể hoàn tác</span>. Bạn có chắc chắn muốn xóa vĩnh viễn công việc này không?</p></div>
                                <div className="flex gap-4 w-full flex-col sm:flex-row"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 cursor-pointer rounded-xl bg-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-300">Hủy bỏ</button><button onClick={confirmDelete} className="flex-1 cursor-pointer rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-700">Xóa vĩnh viễn</button></div>
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
