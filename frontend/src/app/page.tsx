"use client";

import { useState } from "react";
import TaskList from "../components/TaskList";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen py-10 bg-gray-50">
      <div className="mx-auto px-5">
        {/* Đã sửa lại tiêu đề ở đây */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Hệ thống Quản lý Công việc</h1>
          <p className="text-gray-500 text-sm mt-1">Theo dõi tiến độ Todo List hàng ngày</p>
        </div>

        <TaskList refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />
      </div>
    </main>
  );
}