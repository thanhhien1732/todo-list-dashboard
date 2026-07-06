import { Transition } from '@headlessui/react';
import { AlertTriangle } from 'lucide-react';
import React from 'react';

interface TrashPageConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function TrashPageConfirmModal({ isOpen, onClose, onConfirm }: TrashPageConfirmModalProps) {
    return (
        <Transition show={isOpen} as={React.Fragment}>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <Transition.Child as={React.Fragment} enter="transition-opacity ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
                </Transition.Child>
                <Transition.Child as={React.Fragment} enter="transition-all transform ease-out duration-300" enterFrom="opacity-0 scale-95 translate-y-4" enterTo="opacity-100 scale-100 translate-y-0" leave="transition-all transform ease-in duration-200" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-4">
                    <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-red-100 bg-white shadow-[0_25px_80px_-20px_rgba(15,23,42,0.45)]">
                        <div className="bg-linear-to-br from-red-50 via-white to-slate-50 p-6">
                            <div className="mb-8 mt-2 flex flex-col items-center text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-sm">
                                    <AlertTriangle size={24} strokeWidth={2.5} />
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-gray-900">Xóa vĩnh viễn?</h3>
                                <p className="whitespace-normal px-2 text-sm leading-relaxed text-slate-600">
                                    Hành động này <span className="font-semibold text-gray-700">không thể hoàn tác</span>. Bạn có chắc chắn muốn xóa vĩnh viễn công việc này không?
                                </p>
                            </div>
                            <div className="flex w-full flex-col gap-4 sm:flex-row">
                                <button onClick={onClose} className="flex-1 cursor-pointer rounded-xl bg-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-300">
                                    Hủy bỏ
                                </button>
                                <button onClick={onConfirm} className="flex-1 cursor-pointer rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-700">
                                    Xóa vĩnh viễn
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition.Child>
            </div>
        </Transition>
    );
}
