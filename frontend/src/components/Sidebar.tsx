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
        <>
            {/* MOBILE TOP HEADER: Thanh Logo cố định trên cùng */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 z-40 flex items-center px-5 gap-3">
                <div className="p-1.5 bg-indigo-600 rounded-lg text-white shrink-0">
                    <LayoutDashboard size={20} />
                </div>
                <h2 className="font-bold text-xl text-gray-800 tracking-tight whitespace-nowrap">
                    Todo List
                </h2>
            </div>

            <aside
                className={`bg-white border-gray-200 transition-all duration-300 ease-in-out z-50
                /* [RESPONSIVE MOBILE]: Neo chặt dưới đáy màn hình, xếp ngang */
                fixed bottom-0 left-0 w-full border-t flex flex-row h-16
                /* [RESPONSIVE DESKTOP]: Neo bên trái, xếp dọc, tự động điều chỉnh chiều rộng */
                md:sticky md:top-0 md:h-screen md:border-r md:border-t-0 md:flex-col ${isCollapsed ? 'md:w-20' : 'md:w-56'
                    }`}
            >
                {/* --- LOGO & TIÊU ĐỀ --- */}
                <div className={`hidden md:flex items-center p-6 border-b border-gray-100 overflow-hidden ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
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
                <nav className="flex flex-row justify-around items-center w-full px-2 md:flex-col md:justify-start md:w-auto md:flex-1 md:px-3 md:py-6 md:space-y-2 overflow-hidden">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                title={isCollapsed ? item.name : undefined}
                                className={`flex flex-col items-center rounded-xl transition-all duration-200
                                /* [MOBILE]: Dàn đều không gian (flex-1), icon nằm trên chữ nằm dưới */
                                flex-1 py-1 gap-1
                                /* [DESKTOP]: Căn lề trái, icon bên cạnh chữ */
                                md:flex-row md:flex-none md:w-full md:py-3 ${isCollapsed ? 'md:justify-center md:p-3' : 'md:gap-3 md:px-3'
                                    } ${isActive
                                        ? 'bg-indigo-50 text-indigo-700 font-semibold md:shadow-sm'
                                        : 'text-gray-500 hover:text-gray-950 hover:bg-indigo-50'
                                    }`}
                            >
                                <div className={`shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                                    {item.icon}
                                </div>
                                <span className={`text-[11px] md:text-base whitespace-nowrap ${isCollapsed ? 'md:hidden' : 'block'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* --- FOOTER: NÚT TOGGLE --- */}
                <div className="hidden md:block border-t border-gray-200">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="flex items-center justify-center cursor-pointer bg-gray-50 text-gray-500 hover:bg-gray-200 hover:text-gray-800 p-4 transition-colors w-full"
                        title={isCollapsed ? "Mở rộng Sidebar" : "Thu gọn Sidebar"}
                    >
                        {isCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
                    </button>
                </div>
            </aside>
        </>
    );
}