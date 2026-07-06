import { Search } from 'lucide-react';

interface TrashPageToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
}

export function TrashPageToolbar({ search, onSearchChange }: TrashPageToolbarProps) {
    return (
        <div className="mb-4 flex flex-col items-center justify-between gap-3 bg-transparent p-0 shadow-none md:mb-0 md:flex-row md:border-b md:border-gray-200 md:bg-white/90 md:p-3 md:shadow-sm">
            <div className="group relative w-full md:w-80">
                <input
                    type="text"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Tìm kiếm trong thùng rác..."
                    className="w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-10 text-sm outline-none transition-all hover:border-indigo-400 hover:shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-indigo-500" />
            </div>
        </div>
    );
}
