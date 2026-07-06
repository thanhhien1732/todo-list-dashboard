"use client";

import { useTrashPage } from '@/hooks/useTrashPage';
import { TrashPageHeader } from '@/components/Trash/TrashPageHeader';
import { TrashPageToolbar } from '@/components/Trash/TrashPageToolbar';
import { TrashPageTable } from '@/components/Trash/TrashPageTable';
import { TrashPageCards } from '@/components/Trash/TrashPageCards';
import { TrashPageConfirmModal } from '@/components/Trash/TrashPageConfirmModal';
import { TrashPageToast } from '@/components/Trash/TrashPageToast';

export default function TrashPage() {
    const {
        loading,
        search,
        setSearch,
        sortBy,
        sortOrder,
        sortedTasks,
        isDeleteModalOpen,
        toast,
        handleRestore,
        handleDeleteClick,
        confirmDelete,
        closeDeleteModal,
        handleSort,
        dismissToast,
    } = useTrashPage();

    return (
        <div className="mx-auto min-h-screen w-full px-4 pb-24 pt-8 md:min-h-0 md:p-10">
            <TrashPageHeader />

            <div className="overflow-hidden rounded-2xl border-none md:border-solid md:border-gray-200 md:bg-white md:shadow-sm">
                <TrashPageToolbar search={search} onSearchChange={setSearch} />
                <TrashPageTable
                    tasks={sortedTasks}
                    loading={loading}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    onRestore={handleRestore}
                    onDelete={handleDeleteClick}
                />
                <TrashPageCards
                    tasks={sortedTasks}
                    loading={loading}
                    onRestore={handleRestore}
                    onDelete={handleDeleteClick}
                />
            </div>

            <TrashPageConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
            />
            <TrashPageToast message={toast?.message ?? null} onDismiss={dismissToast} />
        </div>
    );
}
