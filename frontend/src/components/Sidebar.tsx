"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { name: 'Công việc', path: '/', icon: <CheckSquare size={20} /> },
        { name: 'Thùng rác', path: '/trash', icon: <Trash2 size={20} /> },
    ];

    return (
        <aside
            className={`bg-white border-r border-gray-200 min-h-screen hidden md:flex flex-col sticky top-0 h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-55'
                }`}
        >
            {/* --- LOGO & TIÊU ĐỀ --- */}
            <div className={`flex items-center p-6 border-b border-gray-100 overflow-hidden ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
                <div className="p-2 bg-indigo-600 rounded-lg text-white shrink-0">
                    <LayoutDashboard size={24} />
                </div>
                {!isCollapsed && (
                    <h2 className="font-bold text-xl text-gray-800 tracking-tight whitespace-nowrap">
                        Todo List
                    </h2>
                )}
            </div>

            {/* --- MENU ĐIỀU HƯỚNG --- */}
            <nav className="flex-1 px-3 py-6 space-y-2 overflow-hidden">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            title={isCollapsed ? item.name : undefined}
                            className={`flex items-center rounded-xl transition-all duration-200 ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-3'
                                } ${isActive
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                                    : 'text-gray-600 hover:text-gray-950 hover:bg-indigo-50'
                                }`}
                        >
                            <div className={`shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                                {item.icon}
                            </div>
                            {!isCollapsed && (
                                <span className="whitespace-nowrap">{item.name}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* --- FOOTER: NÚT TOGGLE CHỈ CÓ MŨI TÊN CĂN GIỮA --- */}
            <div className="border-t border-gray-200">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex items-center justify-center cursor-pointer bg-gray-50 text-gray-500 hover:bg-gray-200 hover:text-gray-800 p-4  transition-colors w-full"
                    title={isCollapsed ? "Mở rộng Sidebar" : "Thu gọn Sidebar"}
                >
                    {isCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
                </button>
            </div>
        </aside>
    );
}