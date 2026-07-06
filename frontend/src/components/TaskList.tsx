"use client";

import React from 'react';
import { Transition } from '@headlessui/react';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import TaskForm from './TaskForm';
import { TaskListToolbar } from './TaskListToolbar';
import { TaskListTable } from './TaskListTable';
import { TaskListCards } from './TaskListCards';
import { useTaskList } from '../hooks/useTaskList';

interface TaskListProps {
    refreshTrigger: number;
    onRefresh: () => void;
}

export default function TaskList({ refreshTrigger, onRefresh }: TaskListProps) {
    const {
        tasks,
        loading,
        search,
        setSearch,
        filterStatus,
        setFilterStatus,
        sortBy,
        sortOrder,
        page,
        totalPages,
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
        toast,
        setToast,
        handleSort,
        handleDeleteClick,
        confirmDelete,
        handleStatusChange,
        handleEditClick,
        handleEditSubmit,
        handleAddTaskSuccess,
    } = useTaskList({ refreshTrigger, onRefresh });

    return (
        <div className="w-full relative min-h-screen md:min-h-0 pb-24 md:pb-0">
            <TaskListToolbar
                search={search}
                onSearchChange={setSearch}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
                onAddClick={() => setIsAddModalOpen(true)}
            />

            <TaskListTable
                tasks={tasks}
                loading={loading}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                onStatusChange={handleStatusChange}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            <TaskListCards
                tasks={tasks}
                loading={loading}
                onStatusChange={handleStatusChange}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            <div className="md:hidden fixed bottom-20 left-0 right-0 flex justify-center z-40 pointer-events-none">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="pointer-events-auto flex items-center justify-center gap-2 rounded-[20px] bg-indigo-600 px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_rgb(79,70,229,0.4)] transition-transform active:scale-95"
                >
                    <span className="text-lg leading-none">+</span> Thêm công việc mới
                </button>
            </div>

            <div className="mt-6 flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex justify-center sm:block">
                    <div className="rounded-full border border-gray-200 bg-white px-4 py-1.5 shadow-sm inline-block font-medium">
                        Trang {page} / {totalPages}
                    </div>
                </div>
                <div className="flex justify-center gap-2">
                    <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 transition-colors hover:bg-gray-200 disabled:opacity-50">
                        <ChevronLeft size={14} /> Trước
                    </button>
                    <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 transition-colors hover:bg-gray-200 disabled:opacity-50">
                        Sau <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            <Transition show={isAddModalOpen} as={React.Fragment}>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <Transition.Child as={React.Fragment} enter="transition-opacity ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} /></Transition.Child>
                    <Transition.Child as={React.Fragment} enter="transition-all transform ease-out duration-300" enterFrom="opacity-0 scale-95 translate-y-4" enterTo="opacity-100 scale-100 translate-y-0" leave="transition-all transform ease-in duration-200" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-4">
                        <div className="relative w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_25px_80px_-20px_rgba(15,23,42,0.45)]">
                            <button onClick={() => setIsAddModalOpen(false)} className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800">✕</button>
                            <TaskForm onTaskAdded={handleAddTaskSuccess} />
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