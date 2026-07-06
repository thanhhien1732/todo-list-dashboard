import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo List Dashboard",
  description: "Hệ thống quản lý danh sách công việc và tiến độ hàng ngày",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 flex`} suppressHydrationWarning>

        {/* Thanh bên trái */}
        <Sidebar />

        {/* Nội dung chính bên phải */}
        {/* Thêm pt-16 (khoảng cách trên) và pb-16 (khoảng cách dưới) riêng cho Mobile, reset về 0 trên Desktop */}
        <main className="flex-1 overflow-auto pt-16 pb-16 md:pt-0 md:pb-0">
          {children}
        </main>

      </body>
    </html>
  );
}