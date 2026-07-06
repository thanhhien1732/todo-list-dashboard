import React from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { Search, ListFilter, ChevronDown } from 'lucide-react';
import { STATUS_LIST, type StatusOption } from '../../constants/taskStatus';

interface TaskListToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    filterStatus: string;
    onFilterStatusChange: (value: string) => void;
    onAddClick: () => void;
    statusOptions?: StatusOption[];
}

export function TaskListToolbar({
    search,
    onSearchChange,
    filterStatus,
    onFilterStatusChange,
    onAddClick,
    statusOptions = STATUS_LIST,
}: TaskListToolbarProps) {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl md:rounded-t-2xl md:rounded-b-none border border-gray-200 md:border-b-0 bg-white/90 p-3 shadow-sm mb-4 md:mb-0">
            <div className="flex w-full flex-col sm:flex-row md:w-auto gap-3 flex-1">
                <div className="relative w-full md:w-80 group">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Tìm kiếm công việc..."
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full hover:border-indigo-400 hover:shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-all bg-white"
                    />
                    <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors pointer-events-none" />
                </div>

                <div className="w-full sm:w-56">
                    <Listbox value={filterStatus} onChange={onFilterStatusChange}>
                        {({ open }) => (
                            <div className="relative h-full">
                                <ListboxButton className="h-full w-full text-left bg-white border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 cursor-pointer flex items-center justify-between outline-none hover:border-indigo-400 hover:shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all group">
                                    <span className="flex items-center gap-2">
                                        <ListFilter size={16} className="text-gray-400 group-hover:text-indigo-500" />
                                        {filterStatus ? statusOptions.find((s) => s.value === filterStatus)?.label : 'Tất cả trạng thái'}
                                    </span>
                                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                                </ListboxButton>
                                <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                    <ListboxOptions anchor="bottom end" className="[--anchor-gap:4px] w-full sm:w-56 rounded-xl bg-white py-1 text-sm shadow-xl ring-1 ring-black/5 focus:outline-none z-50">
                                        <ListboxOption value="" className={({ active }) => `cursor-pointer select-none py-2 px-3 flex items-center gap-2 transition-colors ${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900'}`}>
                                            <ListFilter size={14} className="text-gray-500" />Tất cả trạng thái
                                        </ListboxOption>
                                        {statusOptions.map((status) => (
                                            <ListboxOption key={status.value} value={status.value} className={({ active }) => `cursor-pointer select-none py-2 px-3 flex items-center gap-2 transition-colors ${active ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-900'}`}>
                                                <span className={filterStatus === status.value ? 'text-indigo-600' : 'text-gray-400'}>{status.icon}</span>
                                                <span>{status.label}</span>
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </Transition>
                            </div>
                        )}
                    </Listbox>
                </div>
            </div>

            <button onClick={onAddClick} className="hidden md:flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-xl">
                <span className="text-base">+</span> Thêm công việc
            </button>
        </div>
    );
}
