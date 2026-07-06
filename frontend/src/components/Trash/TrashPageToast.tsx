import { Transition } from '@headlessui/react';
import React from 'react';

interface TrashPageToastProps {
    message: string | null;
    onDismiss: () => void;
}

export function TrashPageToast({ message, onDismiss }: TrashPageToastProps) {
    return (
        <Transition show={message !== null} as={React.Fragment} enter="transform transition-all ease-out duration-300" enterFrom="translate-x-full opacity-0" enterTo="translate-x-0 opacity-100" leave="transform transition-all ease-in duration-200" leaveFrom="translate-x-0 opacity-100" leaveTo="translate-x-full opacity-0">
            <div className="fixed right-5 top-5 z-50 flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-white shadow-2xl">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">✓</div>
                <p className="whitespace-nowrap pr-2 text-sm font-medium">{message}</p>
                <button onClick={onDismiss} className="ml-auto cursor-pointer text-xs text-gray-400 hover:text-white">
                    ✕
                </button>
            </div>
        </Transition>
    );
}
